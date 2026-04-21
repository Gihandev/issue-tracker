import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIssueStore } from "../store/useIssueStore";
import { IssueCard } from "../components/issues/IssueCard";
import { IssueFilters } from "../components/issues/IssueFilters";
import { IssueFormModal } from "../components/issues/IssueFormModal";
import { IssueDetailModal } from "../components/issues/IssueDetailModal";
import { Pagination } from "../components/issues/Pagination";
import { Download, ArrowUpDown, FileSearch, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function Issues() {
  const {
    getPaginatedIssues,
    fetchIssues,
    exportIssues,
    loading,
    sortBy,
    sortOrder,
    setSortBy,
    searchQuery,
    filters,
    currentPage,
  } = useIssueStore();

  const [editIssue, setEditIssue] = useState(null);
  const [viewIssue, setViewIssue] = useState(null);
  const [showExport, setShowExport] = useState(false);

  // Re-fetch whenever search, filters, sort, or page changes
  useEffect(() => {
    fetchIssues();
  }, [searchQuery, filters, sortBy, sortOrder, currentPage]);

  const { issues, total } = getPaginatedIssues();

  //sort handler
  const handleSort = (field) => {
    if (sortBy === field)
      setSortBy(field, sortOrder === "asc" ? "desc" : "asc");
    else setSortBy(field, "desc");
  };

  //export handler
  const handleExport = (format) => {
    exportIssues(format);
    toast.success(`Exported as ${format.toUpperCase()}`);
    setShowExport(false);
  };

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Issues</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {loading
                ? "Loading..."
                : `${total} issue${total !== 1 ? "s" : ""} total`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="flex items-center gap-1 glass rounded-xl p-1">
              {["createdAt", "priority", "status"].map((field) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    sortBy === field
                      ? "bg-accent/20 text-accent"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  {sortBy === field && (
                    <ArrowUpDown
                      size={11}
                      className={sortOrder === "asc" ? "rotate-180" : ""}
                    />
                  )}
                  {field === "createdAt"
                    ? "Date"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </button>
              ))}
            </div>

            {/* Export */}
            <div className="relative">
              <button
                onClick={() => setShowExport(!showExport)}
                className="btn-ghost flex items-center gap-2 text-sm"
              >
                <Download size={15} />
                Export
              </button>
              <AnimatePresence>
                {showExport && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-36 bg-panel border border-border rounded-xl shadow-2xl overflow-hidden z-10"
                  >
                    {["csv", "json"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => handleExport(fmt)}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors font-mono"
                      >
                        .{fmt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <IssueFilters />
        </motion.div>

        {/* Issue List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-24"
            >
              <Loader2 size={28} className="text-accent animate-spin" />
            </motion.div>
          ) : issues.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileSearch size={28} className="text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-400 mb-1">
                No issues found
              </h3>
              <p className="text-slate-600 text-sm">
                Try adjusting your search or filters
              </p>
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-3">
              {issues.map((issue, i) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  index={i}
                  onEdit={(iss) => {
                    setEditIssue(iss);
                    setViewIssue(null);
                  }}
                  onView={setViewIssue}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Pagination total={total} />
      </div>

      <IssueFormModal
        isOpen={!!editIssue}
        onClose={() => setEditIssue(null)}
        editIssue={editIssue}
      />
      <IssueDetailModal
        issue={viewIssue}
        onClose={() => setViewIssue(null)}
        onEdit={(iss) => {
          setEditIssue(iss);
          setViewIssue(null);
        }}
      />
    </div>
  );
}
