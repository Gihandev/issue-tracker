import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { useIssueStore } from "../../store/useIssueStore";
import toast from "react-hot-toast";

// from issue detail modal
const defaultForm = {
  title: "",
  description: "",
  priority: "medium",
  severity: "medium",
  assignee: "",
  tags: "",
};

// form modal for creating and editing issues
export function IssueFormModal({ isOpen, onClose, editIssue = null }) {
  const [form, setForm] = useState(defaultForm);
  const { createIssue, updateIssue } = useIssueStore();

  // When editIssue changes, update form state
  useEffect(() => {
    if (editIssue) {
      setForm({
        title: editIssue.title || "",
        description: editIssue.description || "",
        priority: editIssue.priority || "medium",
        severity: editIssue.severity || "medium",
        assignee: editIssue.assignee || "",
        tags: editIssue.tags?.join(", ") || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [editIssue, isOpen]);

  // Handle form submission for both creating and updating issues
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Prepare data for API (convert tags string to array)
    const data = {
      ...form,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      assignee: form.assignee || null,
    };
    if (editIssue) {
      updateIssue(editIssue.id, data);
      toast.success("Issue updated successfully");
    } else {
      createIssue(data);
      toast.success("Issue created successfully");
    }
    onClose();
  };

  // Reusable field component for form inputs
  const field = (label, key, type = "text", props = {}) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          className="input-field resize-none"
          rows={4}
          {...props}
        />
      ) : type === "select" ? (
        <select
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          className="input-field"
          {...props}
        >
          {props.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          className="input-field"
          {...props}
        />
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editIssue ? "Edit Issue" : "Create New Issue"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {field("Title *", "title", "text", {
          placeholder: "Brief, descriptive title...",
        })}
        {field("Description", "description", "textarea", {
          placeholder: "Detailed description, steps to reproduce...",
        })}
        <div className="grid grid-cols-2 gap-4">
          {field("Priority", "priority", "select", {
            options: [
              { value: "critical", label: "Critical" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ],
          })}
          {field("Severity", "severity", "select", {
            options: [
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ],
          })}
        </div>
        {field("Assignee", "assignee", "text", {
          placeholder: "Assignee name (optional)",
        })}
        {field("Tags", "tags", "text", {
          placeholder: "auth, ui, api (comma separated)",
        })}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1">
            {editIssue ? "Save Changes" : "Create Issue"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
