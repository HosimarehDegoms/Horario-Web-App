import { getDayOfWeek, isSameDay } from './date'
import type { ScheduleEntry } from '../types/schedule'
import type { Task } from '../types/task'

export interface TimeInterval {
  start: string
  end: string
}

/** Default search window for suggestions — nobody wants a 2 AM recommendation. */
export const WORKING_HOURS: TimeInterval = { start: '07:00', end: '22:00' }

export function getMinutesBetween(start: string, end: string): number {
  const [startHours, startMinutes] = start.split(':').map(Number)
  const [endHours, endMinutes] = end.split(':').map(Number)
  return endHours * 60 + endMinutes - (startHours * 60 + startMinutes)
}

export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const [hours, minutes] = time.split(':').map(Number)
  const total = Math.max(0, Math.min(23 * 60 + 59, hours * 60 + minutes + minutesToAdd))
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
  if (intervals.length === 0) return []
  const sorted = [...intervals].sort((a, b) => a.start.localeCompare(b.start))
  const merged: TimeInterval[] = [{ ...sorted[0] }]

  for (const interval of sorted.slice(1)) {
    const last = merged[merged.length - 1]
    if (interval.start <= last.end) {
      if (interval.end > last.end) last.end = interval.end
    } else {
      merged.push({ ...interval })
    }
  }
  return merged
}

/**
 * Busy intervals on `date` from two sources: recurring weekly schedule
 * entries whose day-of-week matches, and other tasks that already have a
 * confirmed scheduled block on that exact date. `excludeTaskId` leaves out
 * the task currently being scheduled, so re-suggesting for it doesn't treat
 * its own (about-to-change) block as a conflict with itself.
 */
export function getBusyIntervalsForDate(
  date: Date,
  scheduleEntries: ScheduleEntry[],
  tasks: Task[],
  excludeTaskId?: string,
): TimeInterval[] {
  const dayOfWeek = getDayOfWeek(date)

  const fromSchedule: TimeInterval[] = scheduleEntries
    .filter((entry) => entry.dayOfWeek === dayOfWeek)
    .map((entry) => ({ start: entry.startTime, end: entry.endTime }))

  const fromTasks: TimeInterval[] = tasks
    .filter(
      (task): task is Task & { scheduledDate: string; scheduledStartTime: string; scheduledEndTime: string } =>
        task.id !== excludeTaskId &&
        Boolean(task.scheduledDate && task.scheduledStartTime && task.scheduledEndTime) &&
        isSameDay(new Date(task.scheduledDate as string), date),
    )
    .map((task) => ({ start: task.scheduledStartTime, end: task.scheduledEndTime }))

  return mergeIntervals([...fromSchedule, ...fromTasks])
}

/** Free gaps on `date` within `workingHours`, after subtracting all busy intervals. */
export function getFreeIntervalsForDate(
  date: Date,
  scheduleEntries: ScheduleEntry[],
  tasks: Task[],
  excludeTaskId?: string,
  workingHours: TimeInterval = WORKING_HOURS,
): TimeInterval[] {
  const busy = getBusyIntervalsForDate(date, scheduleEntries, tasks, excludeTaskId)
  const free: TimeInterval[] = []
  let cursor = workingHours.start

  for (const interval of busy) {
    if (interval.start > cursor) {
      free.push({ start: cursor, end: interval.start })
    }
    if (interval.end > cursor) {
      cursor = interval.end
    }
  }
  if (cursor < workingHours.end) {
    free.push({ start: cursor, end: workingHours.end })
  }
  return free
}
