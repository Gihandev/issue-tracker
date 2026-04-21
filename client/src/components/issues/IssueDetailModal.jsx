import { useState } from "react";
import { Modal } from "../ui/Modal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { StatusBadge, PriorityBadge, SeverityBadge } from "../ui/Badge";
import { useIssueStore } from "../../store/useIssueStore";
import { format } from "date-fns";
import {
  User,
  Calendar,
  Tag,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// issues details model function
export function IssueDetailModal({ issue, onClose, onEdit }) {
  const [confirmAction, setConfirmAction] = useState(null);
  const { deleteIssue, updateIssue } = useIssueStore();

  if (!issue) return null; // Don't render if no issue is provided

  // delete issue handler
  const handleDelete = () => {
    deleteIssue(issue.id);
    toast.success("Issue deleted");
    onClose();
  };

  // update issue status to resolved or closed
  const handleStatusChange = (status) => {
    updateIssue(issue.id, { status });
    toast.success(`Issue marked as ${status}`);
    setConfirmAction(null);
  };

  // reusable row component for issue metadata
  const Row = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <div className="text-sm text-slate-200">{children}</div>
      </div>
    </div>
  );

  return (
    <>
      <Modal isOpen={!!issue} onClose={onClose} size="lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <StatusBadge status={issue.status} />
                <PriorityBadge priority={issue.priority} />
                <span className="text-xs text-slate-600 font-mono">
                  #{issue.id}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white leading-snug">
                {issue.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {issue.status !== "resolved" && (
                <button
                  onClick={() => setConfirmAction("resolve")}
                  className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
                  title="Resolve"
                >
                  <CheckCircle size={16} />
                </button>
              )}
              {issue.status !== "closed" && (
                <button
                  onClick={() => setConfirmAction("close")}
                  className="p-2 rounded-lg bg-slate-500/10 border border-slate-500/20 text-slate-400 hover:bg-slate-500/20 transition-colors"
                  title="Close"
                >
                  <XCircle size={16} />
                </button>
              )}
              <button
                onClick={() => onEdit(issue)}
                className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => setConfirmAction("delete")}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Description */}
            <div className="col-span-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Description
              </h3>
              <div className="bg-void/60 rounded-xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap border border-border/50">
                {issue.description || (
                  <span className="text-slate-600 italic">
                    No description provided.
                  </span>
                )}
              </div>
              {issue.tags?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {issue.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg bg-accent/10 text-accent/80 border border-accent/20 text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Details
              </h3>
              <Row icon={User} label="Assignee">
                {issue.assignee || (
                  <span className="text-slate-600 italic">Unassigned</span>
                )}
              </Row>
              <Row icon={Tag} label="Severity">
                <SeverityBadge severity={issue.severity} />
              </Row>
              <Row icon={Calendar} label="Created">
                {format(new Date(issue.createdAt), "MMM d, yyyy · h:mm a")}
              </Row>
              <Row icon={Calendar} label="Updated">
                {format(new Date(issue.updatedAt), "MMM d, yyyy · h:mm a")}
              </Row>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmAction === "delete"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleDelete}
        title="Delete Issue"
        message={`Permanently delete "${issue.title}"?`}
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
        message={`Close "${issue.title}"?`}
        confirmLabel="Close"
      />
    </>
  );
}
