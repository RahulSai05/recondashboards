// export default function Footer() {
//     return (
//       <footer className="mt-auto border-t border-slate-200 bg-white">
//         <div className="mx-auto max-w-7xl px-6 py-4">
//           <div className="flex items-center justify-between text-xs text-slate-600">
//             <div>© {new Date().getFullYear()} ReconDashboards. All rights reserved.</div>
//             <div className="flex items-center gap-4">
//               <span>Upload</span>
//               <span className="text-slate-400">→</span>
//               <span>Compare</span>
//               <span className="text-slate-400">→</span>
//               <span>Review</span>
//               <span className="text-slate-400">→</span>
//               <span>Download</span>
//             </div>
//           </div>
//         </div>
//       </footer>
//     );
//   }
  

export default function Footer() {
    return (
      <footer className="mt-auto border-t border-slate-200 bg-white shadow-inner">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
            <div className="text-slate-600">
              © {new Date().getFullYear()} <span className="font-semibold text-slate-900">ReconDashboards</span>. All rights reserved.
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <span className="font-medium text-slate-700">Upload</span>
              <span className="text-slate-400">→</span>
              <span className="font-medium text-slate-700">Compare</span>
              <span className="text-slate-400">→</span>
              <span className="font-medium text-slate-700">Review</span>
              <span className="text-slate-400">→</span>
              <span className="font-medium text-slate-700">Download</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }