import { Card } from '../../../components/ui/Card'
import { ProductivityCard } from '../../../components/dashboard/ProductivityCard'
import type { ProgressSummary } from '../../../types/dashboard'

interface ProgressSectionProps {
  daily: ProgressSummary
  weekly: ProgressSummary
  focusMinutesToday: number
}

export function ProgressSection({ daily, weekly, focusMinutesToday }: ProgressSectionProps) {
  return (
    <Card title="Progress">
      <div className="grid gap-4 sm:grid-cols-3">
        <ProductivityCard label="Today" summary={daily} />
        <ProductivityCard label="This Week" summary={weekly} />
        <div className="rounded-clay-sm bg-gradient-to-br from-brand-teal-400 to-brand-teal-600 p-4 text-white shadow-clay">
          <p className="text-sm font-medium text-teal-50">Focus Time</p>
          <p className="mt-2 text-2xl font-semibold">{focusMinutesToday}m</p>
          <p className="mt-1.5 text-xs text-teal-50/80">focused today</p>
        </div>
      </div>
    </Card>
  )
}
