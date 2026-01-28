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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {docOptions.map((d) => {
          const active = d === docType;
          return (
            <button
              key={d}
              onClick={() => setDocType(d)}
              className={`border p-4 text-left transition ${
                active
                  ? "border-slate-900 bg-slate-900 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className={`text-xs font-medium uppercase tracking-wide ${active ? "text-slate-400" : "text-slate-500"}`}>
                Document
              </div>
              <div className={`mt-2 text-2xl font-semibold ${active ? "text-white" : "text-slate-900"}`}>{d}</div>
            </button>
          );
        })}
      </div>
    );
  }
  