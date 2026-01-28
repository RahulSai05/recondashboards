export default function StatusPill({ status }: { status: string }) {
    const s = (status || "idle").toLowerCase();
  
    const map: Record<string, { bg: string; text: string; border: string; icon?: string }> = {
      idle: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
      queued: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
      started: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
      finished: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
      failed: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
    };
  
    const config = map[s] ?? map.idle;
  
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm ${config.bg} ${config.text} ${config.border}`}
      >
        {s === "started" && (
          <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {s === "finished" && (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {s === "failed" && (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
        {s}
      </span>
    );
  }