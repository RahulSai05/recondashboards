export default function Footer() {
    return (
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div>© {new Date().getFullYear()} ReconDashboards. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Upload</span>
              <span className="text-slate-400">→</span>
              <span>Compare</span>
              <span className="text-slate-400">→</span>
              <span>Review</span>
              <span className="text-slate-400">→</span>
              <span>Download</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  