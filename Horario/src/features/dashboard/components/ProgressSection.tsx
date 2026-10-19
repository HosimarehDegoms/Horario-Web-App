import { Card } from '../../../components/ui/Card'
import { ProductivityCard } from '../../../components/dashboard/ProductivityCard'
import type { ProgressSummary } from '../../../types/dashboard'

interface ProgressSectionProps {
  weekly: ProgressSummary
  focusMinutesToday: number
}

/** Weekly progress + a focus-time reminder — today's own numbers already live in the top snapshot strip. */
export function ProgressSection({ weekly, focusMinutesToday }: ProgressSectionProps) {
  return (
    <Card title="This Week">
      <div className="grid gap-4 sm:grid-cols-2">
        <ProductivityCard label="Weekly Progress" summary={weekly} />
        <div className="rounded-clay-sm bg-gradient-to-br from-brand-teal-400 to-brand-teal-600 p-4 text-white">
          <p className="text-sm font-medium text-teal-50">Focus Time Today</p>
          <p className="mt-2 text-2xl font-semibold">{focusMinutesToday}m</p>
          <p className="mt-1.5 text-xs text-teal-50/80">head to Focus Mode to start a session</p>
        </div>
      </div>
    </Card>
  )
}
