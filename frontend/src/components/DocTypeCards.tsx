// export default function DocTypeCards({
//     docOptions,
//     docType,
//     setDocType,
//   }: {
//     docOptions: string[];
//     docType: string;
//     setDocType: (v: string) => void;
//   }) {
//     return (
//       <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
//         {docOptions.map((d) => {
//           const active = d === docType;
//           return (
//             <button
//               key={d}
//               onClick={() => setDocType(d)}
//               className={`border p-4 text-left transition ${
//                 active
//                   ? "border-slate-900 bg-slate-900 shadow-sm"
//                   : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
//               }`}
//             >
//               <div className={`text-xs font-medium uppercase tracking-wide ${active ? "text-slate-400" : "text-slate-500"}`}>
//                 Document
//               </div>
//               <div className={`mt-2 text-2xl font-semibold ${active ? "text-white" : "text-slate-900"}`}>{d}</div>
//             </button>
//           );
//         })}
//       </div>
//     );
//   }


export default function DocTypeCards({
  docOptions,
  docType,
  setDocType,
}: {
  docOptions: string[];
  docType: string;
  setDocType: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {docOptions.map((d) => {
        const active = d === docType;
        return (
          <button
            key={d}
            onClick={() => setDocType(d)}
            className={`group relative overflow-hidden rounded-lg border-2 p-5 text-left transition-all ${
              active
                ? "border-slate-900 bg-slate-900 shadow-lg scale-105"
                : "border-slate-200 bg-white shadow-sm hover:border-slate-400 hover:shadow-md hover:scale-102"
            }`}
          >
            <div className={`text-xs font-bold uppercase tracking-wider ${active ? "text-slate-400" : "text-slate-500"}`}>
              Document
            </div>
            <div className={`mt-2.5 text-3xl font-bold tracking-tight ${active ? "text-white" : "text-slate-900"}`}>
              {d}
            </div>
            {active && (
              <div className="absolute right-3 top-3">
                <div className="rounded-full bg-white p-1">
                  <svg className="h-3 w-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
  