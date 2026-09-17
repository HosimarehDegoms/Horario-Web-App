import { Card } from '../../../components/ui/Card'
import { DeadlineList } from '../../../components/dashboard/DeadlineList'
import type { Task } from '../../../types/task'

interface DeadlinesSectionProps {
  overdueTasks: Task[]
  upcomingDeadlines: Task[]
  referenceDate: Date
}

export function DeadlinesSection({ overdueTasks, upcomingDeadlines, referenceDate }: DeadlinesSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Overdue Tasks">
        <DeadlineList
          tasks={overdueTasks}
          referenceDate={referenceDate}
          emptyTitle="Nothing overdue"
          emptyDescription="You're on top of your deadlines."
        />
      </Card>
      <Card title="Upcoming Deadlines">
        <DeadlineList
          tasks={upcomingDeadlines}
          referenceDate={referenceDate}
          emptyTitle="No upcoming deadlines"
          emptyDescription="Tasks with a due date will show up here."
        />
      </Card>
    </div>
  )
}
