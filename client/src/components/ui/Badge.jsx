import { clsx } from "clsx";
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  SEVERITY_CONFIG,
} from "../../utils/constants";

// status
export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return (
    <span className={clsx("badge", cfg.bg, cfg.color)}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

//priority
export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  return <span className={clsx("badge", cfg.bg, cfg.color)}>{cfg.label}</span>;
}

//severity
export function SeverityBadge({ severity }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low;
  return (
    <span className={clsx("text-xs font-medium", cfg.color)}>{cfg.label}</span>
  );
}
