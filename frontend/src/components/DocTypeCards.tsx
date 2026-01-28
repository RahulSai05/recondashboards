// export default function DocTypeCards({
//   docOptions,
//   docType,
//   setDocType,
// }: {
//   docOptions: string[];
//   docType: string;
//   setDocType: (v: string) => void;
// }) {
//   return (
//     <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
//       {docOptions.map((d) => {
//         const active = d === docType;
//         return (
//           <button
//             key={d}
//             onClick={() => setDocType(d)}
//             className={`group relative overflow-hidden rounded-lg border-2 p-5 text-left transition-all ${
//               active
//                 ? "border-slate-900 bg-slate-900 shadow-lg scale-105"
//                 : "border-slate-200 bg-white shadow-sm hover:border-slate-400 hover:shadow-md hover:scale-102"
//             }`}
//           >
//             <div className={`text-xs font-bold uppercase tracking-wider ${active ? "text-slate-400" : "text-slate-500"}`}>
//               Document
//             </div>
//             <div className={`mt-2.5 text-3xl font-bold tracking-tight ${active ? "text-white" : "text-slate-900"}`}>
//               {d}
//             </div>
//             {active && (
//               <div className="absolute right-3 top-3">
//                 <div className="rounded-full bg-white p-1">
//                   <svg className="h-3 w-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               </div>
//             )}
//           </button>
//         );
//       })}
//     </div>
//   );
// }
  
// ---above one unblock blocked doc types----


export default function DocTypeCards({
    docOptions,
    docType,
    setDocType,
  }: {
    docOptions: string[];
    docType: string;
    setDocType: (v: string) => void;
  }) {
    const ENABLED_DOC = "945";
  
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {docOptions.map((d) => {
          const isEnabled = d === ENABLED_DOC;
          const active = isEnabled && d === docType;
  
          // ✅ For disabled cards: NO hover classes + cursor forced
          const base =
            "relative overflow-hidden rounded-lg border-2 p-5 text-left select-none";
          const enabledClasses =
            "transition-all cursor-pointer shadow-sm hover:border-slate-400 hover:shadow-md hover:scale-102 focus:outline-none focus:ring-2 focus:ring-slate-300";
          const disabledClasses =
            "opacity-40 cursor-not-allowed shadow-none hover:border-slate-200 hover:shadow-none hover:scale-100 focus:outline-none";
  
          const activeClasses = "border-slate-900 bg-slate-900 shadow-lg scale-105";
          const inactiveClasses = "border-slate-200 bg-white";
  
          return (
            <button
              key={d}
              type="button"
              disabled={!isEnabled}
              tabIndex={isEnabled ? 0 : -1} // ✅ no keyboard focus for disabled
              aria-disabled={!isEnabled}
              onClick={() => {
                if (isEnabled) setDocType(d);
              }}
              className={[
                base,
                isEnabled ? enabledClasses : disabledClasses,
                active ? activeClasses : inactiveClasses,
              ].join(" ")}
            >
              <div
                className={`text-xs font-bold uppercase tracking-wider ${
                  active ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Document
              </div>
  
              <div
                className={`mt-2.5 text-3xl font-bold tracking-tight ${
                  active ? "text-white" : "text-slate-900"
                }`}
              >
                {d}
              </div>
  
              {active && (
                <div className="absolute right-3 top-3">
                  <div className="rounded-full bg-white p-1">
                    <svg
                      className="h-3 w-3 text-slate-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
  
              {!isEnabled && (
                <div className="mt-3 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                  Disabled
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }
  