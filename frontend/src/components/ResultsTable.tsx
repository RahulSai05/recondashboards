import { Search, Download, Copy, Check } from "lucide-react";
import { BarChart3 } from "lucide-react";

function safeCell(v: any) {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function AxStatusPill({ value }: { value: string }) {
  const v = (value || "").toLowerCase();
  const cls =
    v.includes("failure")
      ? "bg-red-100 text-red-800 border-red-300"
      : v.includes("loaded")
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-slate-100 text-slate-700 border-slate-300";

  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {value}
    </span>
  );
}

export default function ResultsTable({
  rows,
  columns,
  query,
  setQuery,
  downloadHref,
  onCopy,
  copySuccess,
  total,
}: {
  rows: any[];
  columns: string[];
  query: string;
  setQuery: (v: string) => void;
  downloadHref?: string;
  onCopy: () => void;
  copySuccess: boolean;
  total: number;
}) {
  const hasRows = rows.length > 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">Reconciliation Results</div>
            <div className="mt-1 flex items-center gap-3 text-sm text-slate-600">
              <span>
                {hasRows ? `Preview of output rows` : "No results to display"}
              </span>
              {total > 0 && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-red-600">
                    Total Number of Failed Documents: {total}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            {hasRows && (
              <button
                onClick={onCopy}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 hover:shadow-md"
              >
                {copySuccess ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Results
                  </>
                )}
              </button>
            )}

            {downloadHref && (
              <a
                href={downloadHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 hover:shadow-md"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </a>
            )}

            {hasRows && (
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search results..."
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {!hasRows ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <BarChart3 className="h-8 w-8 text-slate-400" />
            </div>
            <div className="mt-4 text-base font-medium text-slate-900">No Results Yet</div>
            <div className="mt-2 text-sm text-slate-600">
              Upload your files and click <span className="font-semibold text-slate-900">Reconcile Files</span> to begin comparison
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((k) => (
                    <th
                      key={k}
                      className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((r, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-slate-50">
                    {columns.map((k) => {
                      const v = r?.[k];
                      if (k.toLowerCase() === "ax status") {
                        return (
                          <td key={k} className="whitespace-nowrap px-5 py-4 text-sm text-slate-900">
                            <AxStatusPill value={safeCell(v)} />
                          </td>
                        );
                      }
                      return (
                        <td key={k} className="whitespace-nowrap px-5 py-4 text-sm text-slate-900">
                          {safeCell(v)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
