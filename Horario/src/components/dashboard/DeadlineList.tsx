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
            className="flex items-center justify-between gap-3 rounded-clay-sm border border-white/60 bg-white p-3 shadow-clay transition-[transform,box-shadow] duration-200 ease-clay hover:-translate-y-0.5 hover:shadow-clay-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <span className="min-w-0 truncate text-sm font-medium text-slate-900">{task.title}</span>
            <Badge variant={DEADLINE_BADGE_VARIANT[classification]}>{DEADLINE_LABELS[classification]}</Badge>
          </li>
        )
      })}
    </ul>
  )
}
