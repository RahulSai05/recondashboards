import { Search, Download } from "lucide-react";

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
      ? "bg-red-50 text-red-800 border-red-200"
      : v.includes("loaded")
      ? "bg-green-50 text-green-800 border-green-200"
      : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center border px-2 py-1 text-xs font-medium ${cls}`}>
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
}: {
  rows: any[];
  columns: string[];
  query: string;
  setQuery: (v: string) => void;
  downloadHref?: string;
}) {
  const hasRows = rows.length > 0;

  return (
    <div className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">Results</div>
            <div className="mt-1 text-sm text-slate-600">Preview of output rows</div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            {downloadHref && (
              <a
                href={downloadHref}
                className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </a>
            )}

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search results..."
                className="w-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!hasRows ? (
          <div className="border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="text-sm text-slate-600">
              No results available. Upload files and click <span className="font-semibold">Reconcile Files</span> to begin.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  {columns.map((k) => (
                    <th
                      key={k}
                      className="bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700"
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {columns.map((k) => {
                      const v = r?.[k];
                      if (k.toLowerCase() === "ax status") {
                        return (
                          <td key={k} className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">
                            <AxStatusPill value={safeCell(v)} />
                          </td>
                        );
                      }
                      return (
                        <td key={k} className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">
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
