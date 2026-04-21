import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIssueStore } from "../../store/useIssueStore";

// pagination component for issue list
export function Pagination({ total }) {
  const { currentPage, pageSize, setCurrentPage } = useIssueStore();
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis for large page sets
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
      <p className="text-xs text-slate-500">
        Showing {Math.min((currentPage - 1) * pageSize + 1, total)}–
        {Math.min(currentPage * pageSize, total)} of {total} issues
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg glass glass-hover text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((page, i) => (
          <span key={page}>
            {i > 0 && pages[i - 1] !== page - 1 && (
              <span className="px-1 text-slate-600 text-sm">…</span>
            )}
            <button
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                page === currentPage
                  ? "bg-accent text-white shadow-glow-blue"
                  : "glass glass-hover text-slate-400 hover:text-white"
              }`}
            >
              {page}
            </button>
          </span>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg glass glass-hover text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
