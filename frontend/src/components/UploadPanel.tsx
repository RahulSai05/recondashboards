import { Upload, FileSpreadsheet } from "lucide-react";

const ACCEPT = ".csv,.xlsx,.xls,.xlsm,.xlsb";

export default function UploadPanel({
  section,
  docType,
  source,
  setSource,
  dest,
  setDest,
  error,
  sourceLabel,
  destLabel,
}: {
  section: "inbound" | "outbound";
  docType: string;
  source: File | null;
  setSource: (f: File | null) => void;
  dest: File | null;
  setDest: (f: File | null) => void;
  error: string;
  sourceLabel: string;
  destLabel: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-slate-900 p-2">
            <FileSpreadsheet className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">Upload Files</div>
            <div className="mt-0.5 text-sm text-slate-600">
              Source: <span className="font-medium text-slate-900">{sourceLabel}</span>
              {" • "}
              Destination: <span className="font-medium text-slate-900">{destLabel}</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right">
          <div className="text-xs font-semibold text-slate-500">Section</div>
          <div className="text-sm font-bold text-slate-900">{section.toUpperCase()}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="group rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-5 transition-colors hover:border-slate-400 hover:bg-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="rounded-md bg-blue-100 p-1.5">
              <Upload className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Source File</div>
              <div className="text-xs text-slate-600">{sourceLabel}</div>
            </div>
          </div>
          <input
            className="mt-4 w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white file:transition-colors hover:file:bg-slate-800"
            type="file"
            accept={ACCEPT}
            onChange={(e) => setSource(e.target.files?.[0] ?? null)}
          />
          {source && (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-white px-3 py-2 border border-slate-200">
              <FileSpreadsheet className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div className="text-xs font-medium text-slate-900 truncate">{source.name}</div>
            </div>
          )}
        </div>

        <div className="group rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-5 transition-colors hover:border-slate-400 hover:bg-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="rounded-md bg-green-100 p-1.5">
              <Upload className="h-4 w-4 text-green-700" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Destination File</div>
              <div className="text-xs text-slate-600">{destLabel}</div>
            </div>
          </div>
          <input
            className="mt-4 w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white file:transition-colors hover:file:bg-slate-800"
            type="file"
            accept={ACCEPT}
            onChange={(e) => setDest(e.target.files?.[0] ?? null)}
          />
          {dest && (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-white px-3 py-2 border border-slate-200">
              <FileSpreadsheet className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div className="text-xs font-medium text-slate-900 truncate">{dest.name}</div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3.5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-red-100 p-1">
              <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-red-900">Error</div>
              <div className="mt-1 whitespace-pre-wrap text-xs text-red-800">{error}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}