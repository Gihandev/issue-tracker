import { motion } from "framer-motion";
import { useIssueStore } from "../store/useIssueStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Zap,
} from "lucide-react";
import { StatusBadge, PriorityBadge } from "../components/ui/Badge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
};

export function Dashboard() {
  const { getStatusCounts, issues } = useIssueStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const counts = getStatusCounts();
  const recent = [...issues]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const critical = issues.filter(
    (i) => i.priority === "critical" && i.status === "open"
  );

  // state cards
  const statCards = [
    {
      label: "Open",
      count: counts.open,
      icon: AlertCircle,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      glow: "shadow-glow-blue",
    },
    {
      label: "In Progress",
      count: counts["in-progress"],
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      glow: "",
    },
    {
      label: "Resolved",
      count: counts.resolved,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
      glow: "shadow-glow-green",
    },
    {
      label: "Closed",
      count: counts.closed,
      icon: XCircle,
      color: "text-slate-400",
      bg: "bg-slate-500/10 border-slate-500/20",
      glow: "",
    },
  ];

  const totalOpen = counts.open + counts["in-progress"];
  const totalResolved = counts.resolved + counts.closed;
  const totalAll = issues.length || 1;
  const resolvedPct = Math.round((totalResolved / totalAll) * 100);

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-slow" />
            <span className="text-xs font-medium text-slate-500 font-mono tracking-widest uppercase">
              Live Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 17
              ? "afternoon"
              : "evening"}
            ,
            <span className="text-gradient ml-2">
              {user?.name?.split(" ")[0] || "there"}
            </span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Here's what's happening across your issues today.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-4 gap-4 mb-8"
        >
          {statCards.map(({ label, count, icon: Icon, color, bg, glow }) => (
            <motion.div
              key={label}
              variants={item}
              className={`card p-5 border ${bg} ${glow} cursor-pointer`}
              onClick={() => navigate("/issues")}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}
                >
                  <Icon size={20} className={color} />
                </div>
                <span className={`text-3xl font-bold font-mono ${color}`}>
                  {count}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-medium">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          {/* Resolution Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1 card p-5"
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={16} className="text-accent" />
              <h2 className="font-semibold text-white text-sm">
                Resolution Rate
              </h2>
            </div>
            {/* Donut chart simulation */}
            <div className="flex items-center justify-center mb-5">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1E2A3A"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#4F8EF7"
                    strokeWidth="12"
                    strokeDasharray={`${resolvedPct * 2.51} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white font-mono">
                    {resolvedPct}%
                  </span>
                  <span className="text-xs text-slate-500">resolved</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {statCards.map(({ label, count, color, bg }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${bg
                        .replace("bg-", "bg-")
                        .replace("/10", "")}`}
                      style={{ backgroundColor: color.replace("text-", "") }}
                    />
                    <span className="text-slate-400">{label}</span>
                  </div>
                  <span className="font-mono text-slate-300">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="col-span-2 card p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-accent" />
                <h2 className="font-semibold text-white text-sm">
                  Recent Issues
                </h2>
              </div>
              <button
                onClick={() => navigate("/issues")}
                className="text-xs text-accent hover:text-blue-300 transition-colors"
              >
                View all →
              </button>
            </div>
            <div className="space-y-2">
              {recent.map((issue, i) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  onClick={() => navigate("/issues")}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <StatusBadge status={issue.status} />
                  <span className="flex-1 text-sm text-slate-300 truncate group-hover:text-white transition-colors">
                    {issue.title}
                  </span>
                  <PriorityBadge priority={issue.priority} />
                  <span className="text-xs text-slate-600 shrink-0 font-mono">
                    {formatDistanceToNow(new Date(issue.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Critical Issues Alert */}
        {critical.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-sm font-semibold text-red-400">
                {critical.length} Critical Issue{critical.length > 1 ? "s" : ""}{" "}
                Require Attention
              </span>
            </div>
            <div className="space-y-1.5">
              {critical.map((issue) => (
                <div key={issue.id} className="flex items-center gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-slow" />
                  <span className="text-slate-300">{issue.title}</span>
                  <span className="text-xs text-slate-500 ml-auto font-mono">
                    {formatDistanceToNow(new Date(issue.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
