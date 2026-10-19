import { Card } from '../../../components/ui/Card'
import { DeadlineList } from '../../../components/dashboard/DeadlineList'
import type { Task } from '../../../types/task'

interface DeadlinesSectionProps {
  overdueTasks: Task[]
  upcomingDeadlines: Task[]
  referenceDate: Date
}

/** Overdue first (most urgent), then upcoming — one compact card instead of two full-width ones,
 * so deadlines read as secondary context rather than competing with today's schedule/tasks. */
export function DeadlinesSection({ overdueTasks, upcomingDeadlines, referenceDate }: DeadlinesSectionProps) {
  const combined = [...overdueTasks, ...upcomingDeadlines]

  return (
    <Card title="Deadlines">
      <DeadlineList
        tasks={combined}
        referenceDate={referenceDate}
        emptyTitle="Nothing due"
        emptyDescription="You're on top of your deadlines."
      />
    </Card>
  )
}
