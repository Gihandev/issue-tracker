import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIssueStore } from "../../store/useIssueStore";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect } from "react";

// filtering and searching issues function
export function IssueFilters() {
  const { filters, setFilters, searchQuery, setSearchQuery } = useIssueStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(localSearch, 400);

  // Sync debounced search query with global store
  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  // Check if any filters are active to show the count badge and clear button
  const hasActiveFilters =
    filters.status || filters.priority || filters.severity;
  const clearFilters = () => {
    setFilters({ status: "", priority: "", severity: "" });
    setLocalSearch("");
  };

  // Reusable select component for filters
  const Select = ({ label, key, options }) => (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5 font-medium">
        {label}
      </label>
      <select
        value={filters[key]}
        onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
        className="input-field text-xs py-2"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search issues by title, description, tags..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="input-field pl-10 pr-4"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-ghost flex items-center gap-2 text-sm shrink-0 ${
            showFilters || hasActiveFilters
              ? "border-accent/40 text-accent"
              : ""
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">
              {
                [filters.status, filters.priority, filters.severity].filter(
                  Boolean
                ).length
              }
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4">
                <Select
                  label="Status"
                  key="status"
                  options={[
                    { value: "open", label: "Open" },
                    { value: "in-progress", label: "In Progress" },
                    { value: "resolved", label: "Resolved" },
                    { value: "closed", label: "Closed" },
                  ]}
                />
                <Select
                  label="Priority"
                  key="priority"
                  options={[
                    { value: "critical", label: "Critical" },
                    { value: "high", label: "High" },
                    { value: "medium", label: "Medium" },
                    { value: "low", label: "Low" },
                  ]}
                />
                <Select
                  label="Severity"
                  key="severity"
                  options={[
                    { value: "high", label: "High" },
                    { value: "medium", label: "Medium" },
                    { value: "low", label: "Low" },
                  ]}
                />
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-xs text-slate-500 hover:text-red-400 flex items-center gap-1.5 transition-colors"
                >
                  <X size={12} /> Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
