import { useEffect, useMemo, useState } from "react";
import { startCompare, getJob, getResults, downloadUrl } from "./api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DocTypeCards from "./components/DocTypeCards";
import UploadPanel from "./components/UploadPanel";
import ResultsTable from "./components/ResultsTable";
import { BarChart3 } from "lucide-react";

const inboundDocs = ["945", "944", "214"];
const outboundDocs = ["940", "943"];

type Section = "inbound" | "outbound";

function tailLines(s: string, n = 10) {
  const lines = (s || "").split("\n");
  return lines.slice(Math.max(0, lines.length - n)).join("\n");
}

export default function App() {
  const [section, setSection] = useState<Section>("inbound");
  const docOptions = useMemo(() => (section === "inbound" ? inboundDocs : outboundDocs), [section]);

  const [docType, setDocType] = useState<string>(docOptions[0]);
  const [source, setSource] = useState<File | null>(null);
  const [dest, setDest] = useState<File | null>(null);

  const [jobId, setJobId] = useState<string>("");
  const [status, setStatus] = useState<string>("idle");
  const [error, setError] = useState<string>("");

  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    setDocType(docOptions[0]);
  }, [docOptions]);

  async function onCompare() {
    setError("");
    setRows([]);
    setColumns([]);
    setTotal(0);
    setQuery("");
    setJobId("");
    setStatus("idle");

    if (!source || !dest) {
      setError("Please upload both Source and Destination files (.csv or .xlsx).");
      return;
    }

    const form = new FormData();
    form.append("section", section);
    form.append("doc_type", docType);
    form.append("source", source);
    form.append("destination", dest);

    try {
      const r = await startCompare(form);
      setJobId(r.job_id);
      setStatus(r.status || "queued");
    } catch (e: any) {
      setError(String(e?.message ?? e));
      setStatus("failed");
    }
  }

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((r) => Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [rows, query]);

  useEffect(() => {
    if (!jobId) return;

    const timer = setInterval(async () => {
      try {
        const j = await getJob(jobId);
        const st = j.status || "";
        setStatus(st);

        if (st === "failed") {
          const msg = j.error ? tailLines(String(j.error), 12) : "Job failed.";
          setError(msg);
          clearInterval(timer);
          return;
        }

        if (st === "finished") {
          const res = await getResults(jobId, 1, 200);
          setRows(res.rows || []);
          setTotal(res.total || 0);

          const cols = res.columns && res.columns.length ? res.columns : (res.rows?.[0] ? Object.keys(res.rows[0]) : []);
          setColumns(cols);

          clearInterval(timer);
        }
      } catch (e: any) {
        setError(String(e?.message ?? e));
        setStatus("failed");
        clearInterval(timer);
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [jobId]);

  const downloadHref = jobId && status === "finished" ? downloadUrl(jobId) : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header section={section} setSection={setSection} status={status} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Document Comparison</h1>
            <p className="mt-1 text-sm text-slate-600">Select document type, upload files, and compare for discrepancies.</p>
          </div>
          {jobId && (
            <div className="text-xs text-slate-500">
              Job ID: <span className="font-mono text-slate-900">{jobId}</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <DocTypeCards docOptions={docOptions} docType={docType} setDocType={setDocType} />
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <UploadPanel
            section={section}
            docType={docType}
            source={source}
            setSource={setSource}
            dest={dest}
            setDest={setDest}
            error={error}
          />

          <div className="border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-700" />
              <div className="text-base font-semibold text-slate-900">Comparison Actions</div>
            </div>
            <p className="mt-2 text-sm text-slate-600">Execute comparison and review results.</p>

            <button
              onClick={onCompare}
              disabled={!source || !dest || status === "started"}
              className="mt-6 w-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "started" ? "Processing..." : "Reconcile Files"}
            </button>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-600">Total Rows</div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">{total}</div>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-600">Preview</div>
                <div className="mt-2 text-3xl font-semibold text-slate-900">{filteredRows.length}</div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-600">
                Tip: Different doc types may output different columns/rows — the table adapts automatically.
              </p>
            </div>
          </div>
        </div>

        <ResultsTable rows={filteredRows} columns={columns} query={query} setQuery={setQuery} downloadHref={downloadHref} />
      </main>

      <Footer />
    </div>
  );
}
