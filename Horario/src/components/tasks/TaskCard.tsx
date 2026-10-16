import type { Task, TaskStatus } from '../../types/task'
import { classifyDeadline } from '../../utils/deadlines'
import { formatRelativeDayLabel, formatTime12h } from '../../utils/date'
import {
  DEADLINE_BADGE_VARIANT,
  DEADLINE_LABELS,
  TASK_PRIORITY_BADGE_VARIANT,
  TASK_PRIORITY_LABELS,
  TASK_RECURRENCE_LABELS,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from '../../constants/tasks'
import { Badge } from '../ui/Badge'
import { Select } from '../ui/Select'

interface TaskCardProps {
  task: Task
  referenceDate: Date
  onToggleComplete?: (taskId: string) => void
  onStatusChange?: (status: TaskStatus) => void
  onEdit?: () => void
  onDelete?: () => void
  onSuggestTime?: () => void
  onClearSchedule?: () => void
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  if (hours === 0) return `${remainder}m`
  if (remainder === 0) return `${hours}h`
  return `${hours}h ${remainder}m`
}

export function TaskCard({
  task,
  referenceDate,
  onToggleComplete,
  onStatusChange,
  onEdit,
  onDelete,
  onSuggestTime,
  onClearSchedule,
}: TaskCardProps) {
  const isCompleted = task.status === 'completed'
  const classification = classifyDeadline(task, referenceDate)
  const isScheduled = Boolean(task.scheduledDate && task.scheduledStartTime && task.scheduledEndTime)

  return (
    <li className="rounded-clay-sm border border-white/60 bg-white p-3 shadow-clay transition-[transform,box-shadow] duration-200 ease-clay hover:-translate-y-0.5 hover:shadow-clay-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="flex items-start gap-2">
        {onStatusChange ? (
          <div className="w-32 shrink-0">
            <Select
              label="Status"
              hideLabel
              value={task.status}
              onChange={(event) => onStatusChange(event.target.value as TaskStatus)}
            >
              {TASK_STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {TASK_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </div>
        ) : onToggleComplete ? (
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleComplete(task.id)}
            aria-label={isCompleted ? `Mark "${task.title}" as not started` : `Mark "${task.title}" as completed`}
            className="mt-1 h-5 w-5 shrink-0 rounded-md border-slate-300 text-primary-600 shadow-clay-inset transition-transform duration-150 checked:scale-105 focus:ring-2 focus:ring-primary-200 motion-reduce:transition-none"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium transition-colors duration-200 ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}
          >
            {task.title}
          </p>
          {task.description && <p className="mt-0.5 text-xs text-slate-500">{task.description}</p>}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge variant={DEADLINE_BADGE_VARIANT[classification]}>{DEADLINE_LABELS[classification]}</Badge>
        <Badge variant={TASK_PRIORITY_BADGE_VARIANT[task.priority]}>
          {TASK_PRIORITY_LABELS[task.priority]} priority
        </Badge>
        {task.category && <Badge>{task.category}</Badge>}
        {typeof task.estimatedDurationMinutes === 'number' && (
          <Badge>{formatMinutes(task.estimatedDurationMinutes)}</Badge>
        )}
        {task.recurrence && <Badge>↻ {TASK_RECURRENCE_LABELS[task.recurrence]}</Badge>}
      </div>

      {isScheduled && (
        <p className="mt-2 text-xs font-medium text-primary-600">
          Scheduled: {formatRelativeDayLabel(new Date(task.scheduledDate as string), referenceDate)},{' '}
          {formatTime12h(task.scheduledStartTime as string)} – {formatTime12h(task.scheduledEndTime as string)}
        </p>
      )}

      {(onEdit || onDelete || onSuggestTime) && (
        <div className="mt-2 flex flex-wrap justify-end gap-1">
          {onSuggestTime && (
            <button
              type="button"
              onClick={onSuggestTime}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-primary-600 transition-colors duration-150 hover:bg-primary-50"
            >
              {isScheduled ? 'Reschedule' : 'Suggest Time'}
            </button>
          )}
          {isScheduled && onClearSchedule && (
            <button
              type="button"
              onClick={onClearSchedule}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700"
            >
              Clear Schedule
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-red-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-700"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </li>
  )
}
