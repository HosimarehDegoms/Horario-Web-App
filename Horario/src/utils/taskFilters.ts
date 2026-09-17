import { classifyDeadline } from './deadlines'
import type { Task, TaskPriority, TaskStatus } from '../types/task'

export type TaskViewFilter = 'all' | 'overdue' | 'today' | 'upcoming' | 'completed'

export interface TaskFilters {
  view: TaskViewFilter
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  search: string
}

export const DEFAULT_TASK_FILTERS: TaskFilters = {
  view: 'all',
  status: 'all',
  priority: 'all',
  search: '',
}

function byDeadlineAscending(a: Task, b: Task): number {
  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
}

export function filterTasks(tasks: Task[], filters: TaskFilters, referenceDate: Date): Task[] {
  const search = filters.search.trim().toLowerCase()

  return tasks
    .filter((task) => {
      if (filters.view !== 'all') {
        const classification = classifyDeadline(task, referenceDate)
        const matchesView =
          (filters.view === 'today' && classification === 'due_today') ||
          (filters.view === 'upcoming' && (classification === 'due_tomorrow' || classification === 'upcoming')) ||
          (filters.view === 'overdue' && classification === 'overdue') ||
          (filters.view === 'completed' && classification === 'completed')
        if (!matchesView) return false
      }

      if (filters.status !== 'all' && task.status !== filters.status) return false
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false

      if (search) {
        const haystack = `${task.title} ${task.description ?? ''}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }

      return true
    })
    .sort(byDeadlineAscending)
}
