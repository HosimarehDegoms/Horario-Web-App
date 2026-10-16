import { getDayOfWeek, isSameDay, startOfDay } from './date'
import type { ScheduleEntry } from '../types/schedule'
import type { Task } from '../types/task'

export interface ReminderCandidate {
  /** Stable, date-scoped dedupe key — each distinct reminder fires at most once per day. */
  key: string
  title: string
  body: string
}

const SCHEDULE_LOOKAHEAD_MINUTES = 15

/** Tasks that are overdue or due today, and schedule entries starting within the next 15 minutes. */
export function computeReminders(tasks: Task[], entries: ScheduleEntry[], now: Date): ReminderCandidate[] {
  const todayKey = now.toISOString().slice(0, 10)
  const reminders: ReminderCandidate[] = []

  for (const task of tasks) {
    if (task.status === 'completed') continue
    const deadline = new Date(task.deadline)
    if (deadline.getTime() < startOfDay(now).getTime()) {
      reminders.push({ key: `task-overdue-${task.id}-${todayKey}`, title: 'Task overdue', body: task.title })
    } else if (isSameDay(deadline, now)) {
      reminders.push({ key: `task-due-${task.id}-${todayKey}`, title: 'Task due today', body: task.title })
    }
  }

  const today = getDayOfWeek(now)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  for (const entry of entries) {
    if (entry.dayOfWeek !== today) continue
    const [hours, minutes] = entry.startTime.split(':').map(Number)
    const minutesUntilStart = hours * 60 + minutes - nowMinutes
    if (minutesUntilStart >= 0 && minutesUntilStart <= SCHEDULE_LOOKAHEAD_MINUTES) {
      reminders.push({
        key: `schedule-${entry.id}-${todayKey}`,
        title: 'Starting soon',
        body: `${entry.title} at ${entry.startTime}`,
      })
    }
  }

  return reminders
}
