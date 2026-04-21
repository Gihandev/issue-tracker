import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ListTodo,
  Plus,
  LogOut,
  User,
  Zap,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

// navigations
const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/issues", label: "Issues", icon: ListTodo },
];

// side bar function
export function Sidebar({ onNewIssue }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // logout handler
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
      className="w-64 h-screen bg-surface border-r border-border flex flex-col sticky top-0"
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-glow-blue">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none tracking-tight">
              Trackly
            </h1>
          </div>
        </div>
      </div>

      {/* New Issue Button */}
      <div className="px-4 pt-4">
        <button
          onClick={onNewIssue}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={16} />
          New Issue
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 pb-6 border-t border-border pt-4 space-y-1">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <User size={18} />
          Profile
        </NavLink>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-left hover:text-red-400"
        >
          <LogOut size={18} />
          Sign Out
        </button>

        <div className="flex items-center gap-3 mt-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-neon-cyan flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
