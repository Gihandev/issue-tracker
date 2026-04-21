import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { registerUser } from "../services/authService";
import { Eye, EyeOff, Zap, AlertCircle, Check } from "lucide-react";
import toast from "react-hot-toast";


export function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();


  // validations constatnts
  const checks = [
    { label: "6+ characters", ok: form.password.length >= 6 },
    { label: "Has number", ok: /\d/.test(form.password) },
    { label: "Passwords match", ok: form.password && form.password === form.confirm },
  ];

  //form submition handler
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const { user, token } = await registerUser(form);

    login(user, token);
    toast.success("Account created!");
    navigate("/");
  } catch (err) {
    setError(err.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="min-h-screen bg-void grid-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 30 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-panel border border-border rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shadow-glow-blue">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-xl leading-none">Trackly</h1>
              <p className="text-xs text-slate-500">Create your account</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Get started</h2>
            <p className="text-slate-400 text-sm">Create your account to track issues</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4"
            >
              <AlertCircle size={15} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
              { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="input-field"
                  placeholder={placeholder}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className="input-field pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-3 mt-2">
                  {checks.map(({ label, ok }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-1 text-xs ${ok ? "text-green-400" : "text-slate-600"}`}
                    >
                      <Check size={11} className={ok ? "opacity-100" : "opacity-30"} />
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}