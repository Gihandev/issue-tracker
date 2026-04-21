import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

// confirmation model (alert)
export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative bg-panel border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                danger
                  ? "bg-red-500/15 text-red-400"
                  : "bg-amber-500/15 text-amber-400"
              }`}
            >
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {message}
            </p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="btn-ghost flex-1">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 font-semibold px-5 py-2.5 rounded-xl active:scale-95 transition-all duration-200 ${
                  danger ? "btn-danger" : "btn-primary"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
