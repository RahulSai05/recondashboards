import os
import uuid

# Base directory for temp job files
BASE_DIR = os.getenv("COMPARE_DIR", "/tmp/compare")
os.makedirs(BASE_DIR, exist_ok=True)


def make_job_dir() -> tuple[str, str]:
    job_id = str(uuid.uuid4())
    job_dir = os.path.join(BASE_DIR, job_id)

    os.makedirs(job_dir, exist_ok=True)

    return job_id, job_dir


def save_bytes(job_dir: str, filename: str, content: bytes) -> str:
    path = os.path.join(job_dir, filename)

    with open(path, "wb") as f:
        f.write(content)

    return path

def result_file_path(job_dir: str) -> str:
    return os.path.join(job_dir, "result.csv")