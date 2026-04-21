export const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/15 border border-red-500/30', dot: 'bg-red-400', glow: 'shadow-glow-red' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/15 border border-orange-500/30', dot: 'bg-orange-400', glow: '' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/15 border border-amber-500/30', dot: 'bg-amber-400', glow: '' },
  low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-500/15 border border-slate-500/30', dot: 'bg-slate-400', glow: '' },
}

export const STATUS_CONFIG = {
  open: { label: 'Open', color: 'text-blue-400', bg: 'bg-blue-500/15 border border-blue-500/30', dot: 'bg-blue-400' },
  'in-progress': { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/15 border border-amber-500/30', dot: 'bg-amber-400' },
  resolved: { label: 'Resolved', color: 'text-green-400', bg: 'bg-green-500/15 border border-green-500/30', dot: 'bg-green-400' },
  closed: { label: 'Closed', color: 'text-slate-400', bg: 'bg-slate-500/15 border border-slate-500/30', dot: 'bg-slate-400' },
}

export const SEVERITY_CONFIG = {
  high: { label: 'High', color: 'text-red-400' },
  medium: { label: 'Medium', color: 'text-amber-400' },
  low: { label: 'Low', color: 'text-slate-400' },
}
