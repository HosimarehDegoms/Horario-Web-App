import { addDays } from './date'
import type { TaskRecurrence } from '../types/task'

const RECURRENCE_STEP_DAYS: Record<TaskRecurrence, number> = {
  daily: 1,
  weekly: 7,
}

/** The next deadline for a recurring task, counted from its just-completed deadline. */
export function advanceRecurringDeadline(deadlineIso: string, recurrence: TaskRecurrence): string {
  return addDays(new Date(deadlineIso), RECURRENCE_STEP_DAYS[recurrence]).toISOString()
}
