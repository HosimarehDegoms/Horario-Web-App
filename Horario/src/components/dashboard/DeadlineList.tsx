import type { Task } from '../../types/task'
import { classifyDeadline } from '../../utils/deadlines'
import { DEADLINE_BADGE_VARIANT, DEADLINE_LABELS } from '../../constants/tasks'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'

interface DeadlineListProps {
  tasks: Task[]
  referenceDate: Date
  emptyTitle: string
  emptyDescription?: string
}

export function DeadlineList({ tasks, referenceDate, emptyTitle, emptyDescription }: DeadlineListProps) {
  if (tasks.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => {
        const classification = classifyDeadline(task, referenceDate)
        return (
          <li
            key={task.id}
            className="flex items-center justify-between gap-3 rounded-clay-sm border border-slate-200 bg-white/90 p-3 transition-colors duration-200 ease-clay hover:border-slate-300 motion-reduce:transition-none"
          >
            <span className="min-w-0 truncate text-sm font-medium text-slate-900">{task.title}</span>
            <Badge variant={DEADLINE_BADGE_VARIANT[classification]}>{DEADLINE_LABELS[classification]}</Badge>
          </li>
        )
      })}
    </ul>
  )
}
