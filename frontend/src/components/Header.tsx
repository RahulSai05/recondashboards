
// import StatusPill from "./StatusPill";
// import { FileSpreadsheet } from "lucide-react";

// export default function Header({
//   section,
//   setSection,
//   status,
// }: {
//   section: "inbound" | "outbound";
//   setSection: (v: "inbound" | "outbound") => void;
//   status: string;
// }) {
//   return (
//     <header className="border-b border-slate-200 bg-white shadow-sm">
//       <div className="mx-auto max-w-7xl px-6 py-5">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 shadow-md">
//               <FileSpreadsheet className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <div className="text-xl font-bold text-slate-900">ReconDashboards</div>
//               <div className="text-xs font-medium text-slate-600">Reconciliation & Data Comparison</div>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-50 shadow-sm">
//               <button
//                 onClick={() => setSection("inbound")}
//                 className={`px-6 py-2.5 text-sm font-semibold transition-all ${
//                   section === "inbound"
//                     ? "bg-slate-900 text-white shadow-sm"
//                     : "bg-transparent text-slate-700 hover:bg-slate-100"
//                 }`}
//               >
//                 Inbound
//               </button>
//               <button
//                 onClick={() => setSection("outbound")}
//                 className={`px-6 py-2.5 text-sm font-semibold transition-all ${
//                   section === "outbound"
//                     ? "bg-slate-900 text-white shadow-sm"
//                     : "bg-transparent text-slate-700 hover:bg-slate-100"
//                 }`}
//               >
//                 Outbound
//               </button>
//             </div>

//             <StatusPill status={status} />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// ---above one unblock blocked doc types----


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
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 shadow-md">
              <FileSpreadsheet className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">
                ReconDashboards
              </div>
              <div className="text-xs font-medium text-slate-600">
                Reconciliation & Data Comparison
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-50 shadow-sm">
              <button
                onClick={() => setSection("inbound")}
                className={`px-6 py-2.5 text-sm font-semibold transition-all ${
                  section === "inbound"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-transparent text-slate-700 hover:bg-slate-100"
                }`}
              >
                Inbound
              </button>

              <button
                onClick={() => setSection("outbound")}
                className={`px-6 py-2.5 text-sm font-semibold transition-all ${
                  section === "outbound"
                    ? "bg-slate-900 text-white shadow-sm"
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
