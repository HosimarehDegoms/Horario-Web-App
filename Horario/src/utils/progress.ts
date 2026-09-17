import type { Task } from '../types/task'
import type { ProgressSummary } from '../types/dashboard'
import { isSameDay, isWithinRange } from './date'

export function calculateCompletionRate(tasks: Task[]): ProgressSummary {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === 'completed').length
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { completed, total, completionRate }
}

/** Tasks whose deadline falls on `date`. Each task is counted at most once. */
export function getTasksForDay(tasks: Task[], date: Date): Task[] {
  return tasks.filter((task) => isSameDay(new Date(task.deadline), date))
}

/** Tasks whose deadline falls within [weekStart, weekEnd]. Each task is counted at most once. */
export function getTasksForWeek(tasks: Task[], weekStart: Date, weekEnd: Date): Task[] {
  return tasks.filter((task) => isWithinRange(new Date(task.deadline), weekStart, weekEnd))
}
