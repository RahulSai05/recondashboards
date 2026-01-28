import os
import logging

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from rq.job import Job

from app.io import read_table
from app.registry import REGISTRY, get_spec, get_comparator

from .queue import queue, redis_conn
from .storage import make_job_dir, save_bytes, result_file_path

# ----------------------------
# Logging + env config
# ----------------------------
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

APP_ENV = os.getenv("APP_ENV", "local").lower()

# Upload limits (MB)
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "50"))

# CORS
# - local: allow vite dev server
# - cloud: typically empty because nginx serves frontend and proxies /api (same-origin)
default_origins = "http://localhost:5173" if APP_ENV == "local" else ""
origins_raw = os.getenv("CORS_ORIGINS", default_origins)
origins = [o.strip() for o in origins_raw.split(",") if o.strip()]

app = FastAPI()

# Only enable CORS if we actually have origins
if origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# ----------------------------
# Doc type registry
# ----------------------------
INBOUND = {"945", "944", "214"}
OUTBOUND = {"940", "943"}


def _safe_ext(filename: str) -> str:
    """
    Extract a safe, normalized extension from an uploaded filename.
    Returns "" if the extension is missing or looks suspicious.
    """
    ext = os.path.splitext(filename or "")[1].lower().strip()
    if ext in {".csv", ".xlsx"}:
        return ext
    return ""

# ----------------------------
# Worker job function (must be importable by RQ)
# ----------------------------
def run_compare_job(job_dir: str, doc_type: str, source_path: str, dest_path: str) -> dict:
    """
    Runs inside the worker container/process.
    Writes results to a CSV in job_dir and returns metadata for API to serve.
    """
    try:
        comparator = get_comparator(doc_type)
        result = comparator.compare(source_path, dest_path)

        out = result_file_path(job_dir)  # should now point to result.csv (after storage.py change)
        result.missing.write_csv(out)

        return {"doc_type": doc_type, "summary": result.summary, "result_file": out}
    except Exception as e:
        # RQ will mark job failed; message appears in logs
        raise RuntimeError(f"Compare failed for doc_type={doc_type}: {e}") from e


# ----------------------------
# Basic endpoints
# ----------------------------
@app.get("/health")
def health():
    return {"status": "ok", "env": APP_ENV}


@app.get("/doc-types")
def doc_types():
    # Keep your existing shape, but add metadata so the UI can show accepted formats, etc.
    return {
        "inbound": sorted(INBOUND),
        "outbound": sorted(OUTBOUND),
        "meta": {
            k: {
                "accepted_extensions": sorted(v.accepted_extensions),
                "description": v.description,
            }
            for k, v in REGISTRY.items()
        },
    }


# ----------------------------
# Compare: upload files, enqueue job
# ----------------------------
@app.post("/compare")
async def compare(
    section: str = Form(...),  # inbound/outbound
    doc_type: str = Form(...),  # 945/944/...
    source: UploadFile = File(...),
    destination: UploadFile = File(...),
):
    section = section.strip().lower()
    doc_type = doc_type.strip()

    if section not in {"inbound", "outbound"}:
        raise HTTPException(400, "section must be inbound or outbound")

    if section == "inbound" and doc_type not in INBOUND:
        raise HTTPException(400, f"Invalid inbound doc_type: {doc_type}")

    if section == "outbound" and doc_type not in OUTBOUND:
        raise HTTPException(400, f"Invalid outbound doc_type: {doc_type}")

    # Validate file extensions for this comparator
    try:
        spec = get_spec(doc_type)
    except Exception:
        raise HTTPException(400, f"Unsupported doc_type: {doc_type}")

    src_ext = _safe_ext(source.filename)
    dst_ext = _safe_ext(destination.filename)

    if not src_ext:
        raise HTTPException(400, "Source file must be .xlsx or .csv")
    if not dst_ext:
        raise HTTPException(400, "Destination file must be .xlsx or .csv")

    if src_ext not in spec.accepted_extensions:
        raise HTTPException(
            400,
            f"{doc_type} source file must be one of: {sorted(spec.accepted_extensions)}",
        )
    if dst_ext not in spec.accepted_extensions:
        raise HTTPException(
            400,
            f"{doc_type} destination file must be one of: {sorted(spec.accepted_extensions)}",
        )

    _, job_dir = make_job_dir()

    # Read uploads (with size limits)
    src_bytes = await source.read()
    dst_bytes = await destination.read()

    max_bytes = MAX_UPLOAD_MB * 1024 * 1024
    if len(src_bytes) > max_bytes or len(dst_bytes) > max_bytes:
        raise HTTPException(413, f"File too large (max {MAX_UPLOAD_MB} MB)")

    src_path = save_bytes(job_dir, f"source{src_ext}", src_bytes)
    dst_path = save_bytes(job_dir, f"destination{dst_ext}", dst_bytes)


    job = queue.enqueue(
        run_compare_job,
        job_dir,
        doc_type,
        src_path,
        dst_path,
        job_timeout=1800,
    )

    logging.info(
        "Enqueued compare job_id=%s doc_type=%s section=%s job_dir=%s",
        job.id,
        doc_type,
        section,
        job_dir,
    )
    return {"job_id": job.id, "status": "queued"}


# ----------------------------
# Job status/results
# ----------------------------
@app.get("/jobs/{job_id}")
def job_status(job_id: str):
    job = Job.fetch(job_id, connection=redis_conn)
    return {
        "job_id": job.id,
        "status": job.get_status(),  # queued/started/finished/failed
        "result": job.result if job.is_finished else None,
        "error": job.exc_info if job.is_failed else None,
    }


@app.get("/jobs/{job_id}/results")
def get_results(job_id: str, page: int = 1, page_size: int = 50):
    job = Job.fetch(job_id, connection=redis_conn)

    if job.is_failed:
        raise HTTPException(422, f"Job failed: {job.exc_info}")
    if not job.is_finished or not job.result:
        raise HTTPException(400, "Job not finished yet")

    path = job.result["result_file"]
    if not os.path.exists(path):
        raise HTTPException(404, "Result file not found")

    df = read_table(path, normalize_headers=False)

    total = df.height

    if page < 1:
        page = 1
    if page_size < 1:
        page_size = 50

    start = (page - 1) * page_size
    rows = df.slice(start, page_size).to_dicts()

    return {"total": total, "page": page, "page_size": page_size, "rows": rows}


# ----------------------------
# Download results
# ----------------------------
@app.get("/jobs/{job_id}/download")
def download(job_id: str):
    job = Job.fetch(job_id, connection=redis_conn)
    if job.is_failed:
        raise HTTPException(422, f"Job failed: {job.exc_info}")
    if not job.is_finished or not job.result:
        raise HTTPException(400, "Job not finished yet")

    path = job.result["result_file"]
    if not os.path.exists(path):
        raise HTTPException(404, "Result file not found")

    return FileResponse(
        path=path,
        media_type="text/csv",
        filename=f"result_{job_id}.csv",
    )