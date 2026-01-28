import { useEffect, useMemo, useState } from "react";
import { startCompare, getJob, getResults, downloadUrl } from "./api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DocTypeCards from "./components/DocTypeCards";
import UploadPanel from "./components/UploadPanel";
import ResultsTable from "./components/ResultsTable";
import { BarChart3, CheckCircle2 } from "lucide-react";

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
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);

  useEffect(() => {
    setDocType(docOptions[0]);
  }, [docOptions]);

  function handleReset() {
    setError("");
    setRows([]);
    setColumns([]);
    setTotal(0);
    setQuery("");
    setJobId("");
    setStatus("idle");
    setCopySuccess(false);
    setHasRun(false);
    setSource(null);
    setDest(null);
  }

  async function onCompare() {
    setError("");
    setRows([]);
    setColumns([]);
    setTotal(0);
    setQuery("");
    setJobId("");
    setStatus("idle");
    setCopySuccess(false);
    setHasRun(true);

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

  async function handleCopyResults() {
    if (rows.length === 0) return;

    try {
      // Convert rows to CSV format
      const headers = columns.join(",");
      const csvRows = rows.map((row) =>
        columns.map((col) => {
          const val = row[col];
          const str = val === null || val === undefined ? "" : String(val);
          // Escape quotes and wrap in quotes if contains comma, newline, or quote
          return str.includes(",") || str.includes("\n") || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        }).join(",")
      );
      const csv = [headers, ...csvRows].join("\n");

      await navigator.clipboard.writeText(csv);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  const downloadHref = jobId && status === "finished" ? downloadUrl(jobId) : undefined;

  // Get dynamic labels based on section
  const sourceLabel = section === "inbound" ? "3PL (DHL/FSI/WSI)" : "AX";
  const destLabel = section === "inbound" ? "AX" : "3PL (DHL/FSI/WSI)";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Header section={section} setSection={setSection} status={status} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Document Reconciliation</h1>
            <p className="mt-2 text-sm text-slate-600">
              Select document type, upload files, and compare for discrepancies
            </p>
          </div>
          {jobId && (
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <div className="text-xs font-medium text-slate-500">Job ID</div>
              <div className="mt-0.5 font-mono text-sm text-slate-900">{jobId}</div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <DocTypeCards docOptions={docOptions} docType={docType} setDocType={setDocType} />
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <UploadPanel
            section={section}
            docType={docType}
            source={source}
            setSource={setSource}
            dest={dest}
            setDest={setDest}
            error={error}
            sourceLabel={sourceLabel}
            destLabel={destLabel}
          />

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-slate-900 p-2">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">Comparison Actions</div>
                <p className="text-sm text-slate-600">Execute comparison and review results</p>
              </div>
            </div>

            <button
              onClick={onCompare}
              disabled={!source || !dest || status === "started" || hasRun}
              className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm"
            >
              {status === "started" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Files...
                </span>
              ) : (
                "Reconcile Files"
              )}
            </button>

            {hasRun && (
              <button
                onClick={handleReset}
                className="mt-3 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 hover:shadow-md"
              >
                Reset & Start New
              </button>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Failed Documents
                </div>
                <div className="mt-2 text-4xl font-bold text-slate-900">{total}</div>
                <div className="mt-1 text-xs text-slate-600">Total discrepancies found</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Preview Rows
                </div>
                <div className="mt-2 text-4xl font-bold text-slate-900">{filteredRows.length}</div>
                <div className="mt-1 text-xs text-slate-600">
                  {query ? "Filtered results" : "Showing all results"}
                </div>
              </div>
            </div>

            {status === "finished" && total > 0 && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-green-900">Reconciliation Complete</div>
                    <div className="mt-1 text-xs text-green-700">
                      Found {total} failed document{total !== 1 ? "s" : ""}. Review the results below or download the report.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-xs leading-relaxed text-blue-900">
                  <span className="font-semibold">Tip:</span> Different doc types may output different columns and rows. The table adapts automatically to display all available data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ResultsTable
          rows={filteredRows}
          columns={columns}
          query={query}
          setQuery={setQuery}
          downloadHref={downloadHref}
          onCopy={handleCopyResults}
          copySuccess={copySuccess}
          total={total}
        />
      </main>

      <Footer />
    </div>
  );
}