import { Card } from '../../../components/ui/Card'
import { ProductivityCard } from '../../../components/dashboard/ProductivityCard'
import type { ProgressSummary } from '../../../types/dashboard'

interface ProgressSectionProps {
  daily: ProgressSummary
  weekly: ProgressSummary
}

export function ProgressSection({ daily, weekly }: ProgressSectionProps) {
  return (
    <Card title="Progress">
      <div className="grid gap-4 sm:grid-cols-2">
        <ProductivityCard label="Today" summary={daily} />
        <ProductivityCard label="This Week" summary={weekly} />
      </div>
    </Card>
  )
}
