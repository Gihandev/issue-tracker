import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  fetchIssuesApi,
  createIssueApi,
  updateIssueApi,
  deleteIssueApi,
} from "../api/issues";

export const useIssueStore = create(
  devtools(
    (set, get) => ({
      issues: [],
      loading: false,
      error: null,

      // Pagination & filtering state
      searchQuery: "",
      filters: { status: "", priority: "", severity: "" },
      currentPage: 1,
      pageSize: 5,
      sortBy: "createdAt",
      sortOrder: "desc",
      total: 0,

      selectedIssue: null,

      // ─── Setters ────────────────────────────────────────────────────────────
      setLoading: (loading) => set({ loading }),
      setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
      setFilters: (filters) => set({ filters, currentPage: 1 }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setSortBy: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
      setSelectedIssue: (issue) => set({ selectedIssue: issue }),

      // ─── Fetch all issues from API ───────────────────────────────────────
      fetchIssues: async () => {
        const { searchQuery, filters, currentPage, pageSize, sortBy, sortOrder } = get();
        set({ loading: true, error: null });
        try {
          const response = await fetchIssuesApi({
            page: currentPage,
            limit: pageSize,
            sortBy,
            sortOrder,
            search: searchQuery || undefined,
            status: filters.status || undefined,
            priority: filters.priority || undefined,
            severity: filters.severity || undefined,
          });
          const { issues, total } = response.data;
          // Normalize _id → id so all frontend components use issue.id
          const normalized = issues.map((i) => ({ ...i, id: i._id }));
          set({ issues: normalized, total, loading: false });
        } catch (err) {
          set({ error: err.response?.data?.message || "Failed to load issues", loading: false });
        }
      },

      // ─── Create issue ────────────────────────────────────────────────────
      createIssue: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await createIssueApi(data);
          const newIssue = { ...response.data, id: response.data._id };
          set((state) => ({
            issues: [newIssue, ...state.issues],
            total: state.total + 1,
            loading: false,
          }));
          return newIssue;
        } catch (err) {
          set({ error: err.response?.data?.message || "Failed to create issue", loading: false });
          throw err;
        }
      },

      // ─── Update issue ────────────────────────────────────────────────────
      updateIssue: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const response = await updateIssueApi(id, updates);
          const updated = { ...response.data, id: response.data._id };
          set((state) => ({
            issues: state.issues.map((i) => (i.id === id ? updated : i)),
            selectedIssue:
              state.selectedIssue?.id === id ? updated : state.selectedIssue,
            loading: false,
          }));
          return updated;
        } catch (err) {
          set({ error: err.response?.data?.message || "Failed to update issue", loading: false });
          throw err;
        }
      },

      // ─── Delete issue ────────────────────────────────────────────────────
      deleteIssue: async (id) => {
        set({ loading: true, error: null });
        try {
          await deleteIssueApi(id);
          set((state) => ({
            issues: state.issues.filter((i) => i.id !== id),
            total: state.total - 1,
            selectedIssue:
              state.selectedIssue?.id === id ? null : state.selectedIssue,
            loading: false,
          }));
        } catch (err) {
          set({ error: err.response?.data?.message || "Failed to delete issue", loading: false });
          throw err;
        }
      },

      // ─── Client-side helpers (filtering done server-side now, ─────────────
      //     these just read local state for UI components) ──────────────────

      getPaginatedIssues: () => {
        const { issues, total } = get();
        return { issues, total };
      },

      getStatusCounts: () => {
        const { issues } = get();
        return {
          open: issues.filter((i) => i.status === "open").length,
          "in-progress": issues.filter((i) => i.status === "in-progress").length,
          resolved: issues.filter((i) => i.status === "resolved").length,
          closed: issues.filter((i) => i.status === "closed").length,
        };
      },

      // ─── Export (client-side, uses loaded issues) ─────────────────────────
      exportIssues: (format) => {
        const { issues } = get();
        if (format === "csv") {
          const headers = ["ID", "Title", "Status", "Priority", "Severity", "Assignee", "Created At"];
          const rows = issues.map((i) => [
            i.id,
            `"${i.title}"`,
            i.status,
            i.priority,
            i.severity,
            i.assignee || "",
            i.createdAt,
          ]);
          const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "issues.csv";
          a.click();
        } else {
          const blob = new Blob([JSON.stringify(issues, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "issues.json";
          a.click();
        }
      },
    }),
    { name: "issue-store" }
  )
);