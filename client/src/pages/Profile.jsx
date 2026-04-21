import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useIssueStore } from "../store/useIssueStore";
import { User, Mail, Shield, Activity } from "lucide-react";
import toast from "react-hot-toast";

export function Profile() {
  const { user, updateUser } = useAuthStore();
  const { issues } = useIssueStore();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);

  // filtering issues
  const myIssues = issues.filter((i) => i.assignee === user?.name);

  // update handlr
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(form);
      toast.success("Profile updated");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  

  const statItems = [
    { label: "Assigned", value: myIssues.length },
    {
      label: "Open",
      value: myIssues.filter((i) => i.status === "open").length,
    },
    {
      label: "Resolved",
      value: myIssues.filter((i) => i.status === "resolved").length,
    },
  ];

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage your account settings
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          {/* Avatar + Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1"
          >
            <div className="card p-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-neon-cyan flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-glow-blue">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <h3 className="font-bold text-white">{user?.name}</h3>
              <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
              <div className="mt-4 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-medium inline-flex items-center gap-1.5">
                <Shield size={12} />
                {user?.role || "Developer"}
              </div>
            </div>

            <div className="card p-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-accent" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Activity
                </span>
              </div>
              {statItems.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Edit form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="col-span-2"
          >
            <div className="card p-6">
              <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                <User size={16} className="text-accent" /> Account Details
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      className="input-field pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
