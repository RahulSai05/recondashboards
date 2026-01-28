import StatusPill from "./StatusPill";
import { FileSpreadsheet } from "lucide-react";

export default function Header({
  section,
  setSection,
  status,
}: {
  section: "inbound" | "outbound";
  setSection: (v: "inbound" | "outbound") => void;
  status: string;
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-900">
              <FileSpreadsheet className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">ReconDashboards</div>
              <div className="text-xs text-slate-600">Reconciliation & Data Comparison</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex border border-slate-200 bg-slate-50">
              <button
                onClick={() => setSection("inbound")}
                className={`px-5 py-2 text-sm font-medium transition ${
                  section === "inbound"
                    ? "bg-slate-900 text-white"
                    : "bg-transparent text-slate-700 hover:bg-slate-100"
                }`}
              >
                Inbound
              </button>
              <button
                onClick={() => setSection("outbound")}
                className={`px-5 py-2 text-sm font-medium transition ${
                  section === "outbound"
                    ? "bg-slate-900 text-white"
                    : "bg-transparent text-slate-700 hover:bg-slate-100"
                }`}
              >
                Outbound
              </button>
            </div>

            <StatusPill status={status} />
          </div>
        </div>
      </div>
    </header>
  );
}
