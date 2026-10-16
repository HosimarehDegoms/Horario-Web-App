import type { TaskPriority, TaskRecurrence, TaskStatus } from '../types/task'
import type { DeadlineClassification } from '../types/dashboard'
import type { BadgeVariant } from '../components/ui/Badge'

export const TASK_PRIORITY_ORDER: TaskPriority[] = ['low', 'medium', 'high']

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const TASK_PRIORITY_BADGE_VARIANT: Record<TaskPriority, BadgeVariant> = {
  low: 'neutral',
  medium: 'warning',
  high: 'danger',
}

export const TASK_STATUS_ORDER: TaskStatus[] = ['not_started', 'in_progress', 'completed']

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export const TASK_CATEGORY_SUGGESTIONS = ['School', 'Work', 'Personal', 'Study']

export const TASK_RECURRENCE_ORDER: TaskRecurrence[] = ['daily', 'weekly']

export const TASK_RECURRENCE_LABELS: Record<TaskRecurrence, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
}

export const DEADLINE_LABELS: Record<DeadlineClassification, string> = {
  overdue: 'Overdue',
  due_today: 'Due Today',
  due_tomorrow: 'Due Tomorrow',
  upcoming: 'Upcoming',
  completed: 'Completed',
}

export const DEADLINE_BADGE_VARIANT: Record<DeadlineClassification, BadgeVariant> = {
  overdue: 'danger',
  due_today: 'warning',
  due_tomorrow: 'warning',
  upcoming: 'neutral',
  completed: 'success',
}
