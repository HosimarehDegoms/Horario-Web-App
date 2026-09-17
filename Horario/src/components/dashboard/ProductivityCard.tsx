import type { ProgressSummary } from '../../types/dashboard'
import { ProgressBar } from '../ui/ProgressBar'

interface ProductivityCardProps {
  label: string
  summary: ProgressSummary
}

export function ProductivityCard({ label, summary }: ProductivityCardProps) {
  return (
    <div className="rounded-clay-sm border border-white/60 bg-white p-4 shadow-clay">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{summary.completionRate}%</p>
      </div>
      <div className="mt-2">
        <ProgressBar value={summary.completionRate} label={`${label} progress`} />
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        {summary.completed} of {summary.total} task{summary.total === 1 ? '' : 's'} completed
      </p>
    </div>
  )
}
