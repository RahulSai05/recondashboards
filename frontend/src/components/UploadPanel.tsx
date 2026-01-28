import { Upload } from "lucide-react";

const ACCEPT = ".csv,.xlsx,.xls,.xlsm,.xlsb";

export default function UploadPanel({
  section,
  docType,
  source,
  setSource,
  dest,
  setDest,
  error,
}: {
  section: "inbound" | "outbound";
  docType: string;
  source: File | null;
  setSource: (f: File | null) => void;
  dest: File | null;
  setDest: (f: File | null) => void;
  error: string;
}) {
  return (
    <div className="border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-base font-semibold text-slate-900">Upload Files</div>
          <div className="mt-1 text-sm text-slate-600">Source: 3PL • Destination: AX</div>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div className="font-medium text-slate-900">{section.toUpperCase()}</div>
          <div>Doc Type: {docType}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-slate-600" />
            <div className="text-sm font-medium text-slate-900">Source File</div>
          </div>
          <div className="mt-1 text-xs text-slate-600">3PL CSV/XLSX document</div>
          <input
            className="mt-3 w-full text-sm text-slate-700"
            type="file"
            accept={ACCEPT}
            onChange={(e) => setSource(e.target.files?.[0] ?? null)}
          />
          {source && <div className="mt-2 text-xs font-medium text-slate-900">{source.name}</div>}
        </div>

        <div className="border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-slate-600" />
            <div className="text-sm font-medium text-slate-900">Destination File</div>
          </div>
          <div className="mt-1 text-xs text-slate-600">AX CSV/XLSX document</div>
          <input
            className="mt-3 w-full text-sm text-slate-700"
            type="file"
            accept={ACCEPT}
            onChange={(e) => setDest(e.target.files?.[0] ?? null)}
          />
          {dest && <div className="mt-2 text-xs font-medium text-slate-900">{dest.name}</div>}
        </div>
      </div>

      {error && (
        <div className="mt-4 whitespace-pre-wrap border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}
