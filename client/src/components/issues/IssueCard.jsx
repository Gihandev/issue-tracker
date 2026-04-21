import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Calendar,
  User,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useIssueStore } from "../../store/useIssueStore";
import toast from "react-hot-toast";

// function to display individual issue cards
export function IssueCard({ issue, onEdit, onView, index }) {
  const [confirmAction, setConfirmAction] = useState(null);
  const { deleteIssue, updateIssue } = useIssueStore();

  // delete issues
  const handleDelete = () => {
    deleteIssue(issue.id);
    toast.success("Issue deleted");
    setConfirmAction(null); // reset confirmation state after action
  };

  // update issue status to resolved or closed
  const handleStatusChange = (status) => {
    updateIssue(issue.id, { status });
    toast.success(`Issue marked as ${status}`);
    setConfirmAction(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, delay: index * 0.04 }}
        whileHover={{ y: -2 }}
        className="card p-5 cursor-pointer group"
        onClick={() => onView(issue)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusBadge status={issue.status} />
              <PriorityBadge priority={issue.priority} />
              {issue.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent/80 border border-accent/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <h3 className="font-semibold text-white group-hover:text-accent transition-colors duration-200 line-clamp-1 text-sm">
              {issue.title}
            </h3>
            <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Actions */}
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {issue.status !== "resolved" && (
              <button
                onClick={() => setConfirmAction("resolve")}
                className="p-1.5 rounded-lg hover:bg-green-500/15 text-slate-500 hover:text-green-400 transition-colors"
                title="Mark Resolved"
              >
                <CheckCircle size={15} />
              </button>
            )}
            {issue.status !== "closed" && (
              <button
                onClick={() => setConfirmAction("close")}
                className="p-1.5 rounded-lg hover:bg-slate-500/15 text-slate-500 hover:text-slate-300 transition-colors"
                title="Close Issue"
              >
                <XCircle size={15} />
              </button>
            )}
            <button
              onClick={() => onEdit(issue)}
              className="p-1.5 rounded-lg hover:bg-accent/15 text-slate-500 hover:text-accent transition-colors"
              title="Edit"
            >
              <Edit2 size={15} />
            </button>
            <button
              onClick={() => setConfirmAction("delete")}
              className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/60">
          {issue.assignee && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <User size={12} />
              <span>{issue.assignee}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar size={12} />
            <span>
              {formatDistanceToNow(new Date(issue.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {issue.comments > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-auto">
              <MessageSquare size={12} />
              <span>{issue.comments}</span>
            </div>
          )}
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={confirmAction === "delete"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleDelete}
        title="Delete Issue"
        message={`Are you sure you want to delete "${issue.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
      <ConfirmDialog
        isOpen={confirmAction === "resolve"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => handleStatusChange("resolved")}
        title="Mark as Resolved"
        message={`Mark "${issue.title}" as resolved?`}
        confirmLabel="Resolve"
      />
      <ConfirmDialog
        isOpen={confirmAction === "close"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => handleStatusChange("closed")}
        title="Close Issue"
        message={`Close "${issue.title}"? This indicates the issue is no longer active.`}
        confirmLabel="Close Issue"
      />
    </>
  );
}
