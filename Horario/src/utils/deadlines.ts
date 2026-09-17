import type { Task } from '../types/task'
import type { DeadlineClassification } from '../types/dashboard'
import { addDays, isSameDay, startOfDay } from './date'

/**
 * Completed tasks stay "completed" even after their deadline passes,
 * per Architecture.md section 10.
 */
export function classifyDeadline(task: Task, referenceDate: Date): DeadlineClassification {
  if (task.status === 'completed') {
    return 'completed'
  }

  const deadline = startOfDay(new Date(task.deadline))
  const today = startOfDay(referenceDate)

  if (deadline.getTime() < today.getTime()) {
    return 'overdue'
  }
  if (isSameDay(deadline, today)) {
    return 'due_today'
  }
  if (isSameDay(deadline, addDays(today, 1))) {
    return 'due_tomorrow'
  }
  return 'upcoming'
}

function byDeadlineAscending(a: Task, b: Task): number {
  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
}

export function getOverdueTasks(tasks: Task[], referenceDate: Date): Task[] {
  return tasks
    .filter((task) => classifyDeadline(task, referenceDate) === 'overdue')
    .sort(byDeadlineAscending)
}

export function getUpcomingDeadlines(tasks: Task[], referenceDate: Date, limit = 5): Task[] {
  return tasks
    .filter((task) => {
      const classification = classifyDeadline(task, referenceDate)
      return (
        classification === 'due_today' ||
        classification === 'due_tomorrow' ||
        classification === 'upcoming'
      )
    })
    .sort(byDeadlineAscending)
    .slice(0, limit)
}
