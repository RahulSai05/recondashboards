export default function StatusPill({ status }: { status: string }) {
    const s = (status || "idle").toLowerCase();
  
    const map: Record<string, string> = {
      idle: "bg-slate-100 text-slate-700 border-slate-200",
      queued: "bg-amber-50 text-amber-800 border-amber-200",
      started: "bg-blue-50 text-blue-800 border-blue-200",
      finished: "bg-green-50 text-green-800 border-green-200",
      failed: "bg-red-50 text-red-800 border-red-200",
    };
  
    return (
      <span
        className={`inline-flex items-center border px-3 py-1 text-xs font-medium uppercase tracking-wide ${
          map[s] ?? map.idle
        }`}
      >
        {s}
      </span>
    );
  }
  