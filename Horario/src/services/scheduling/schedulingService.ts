import { getFreeIntervalsForDate, getMinutesBetween, addMinutesToTime, WORKING_HOURS } from '../../utils/freeTime'
import { classifyDeadline } from '../../utils/deadlines'
import {
  addDays,
  formatDisplayDate,
  formatRelativeDayLabel,
  getCurrentTimeString,
  roundTimeUpToNearest,
  startOfDay,
} from '../../utils/date'
import type { ScheduleEntry } from '../../types/schedule'
import type { Task } from '../../types/task'
import type { SuggestedSlot } from '../../types/scheduling'

/**
 * Suggests time slots for a task from existing schedule entries and other
 * tasks' confirmed blocks. This is a local, deterministic rules engine today
 * (earliest free gaps that fit the task's duration, without passing the
 * deadline) — not a call to an AI provider. It's isolated behind this one
 * function specifically so it can be swapped for a real AI call later (e.g.
 * sending the same task/schedule/task-list inputs to an LLM and parsing its
 * suggested slots) without touching useSmartScheduling or any UI component.
 *
 * Per Architecture.md section 11 ("the AI recommends; the user decides"),
 * this never writes to the task or schedule — it only returns candidates.
 */

const DEFAULT_DURATION_MINUTES = 60
const MAX_SUGGESTIONS = 3
const MAX_LOOKAHEAD_DAYS = 14
const ROUNDING_STEP_MINUTES = 15

export async function suggestTimeSlots(
  task: Task,
  scheduleEntries: ScheduleEntry[],
  allTasks: Task[],
): Promise<SuggestedSlot[]> {
  const durationMinutes =
    task.estimatedDurationMinutes && task.estimatedDurationMinutes > 0
      ? task.estimatedDurationMinutes
      : DEFAULT_DURATION_MINUTES

  const today = startOfDay(new Date())
  const deadline = startOfDay(new Date(task.deadline))
  // If already overdue, still search starting today rather than returning nothing.
  const lastSearchDay = deadline.getTime() < today.getTime() ? today : deadline
  const daysInRange =
    Math.round((lastSearchDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)) + 1
  const searchDays = Math.min(MAX_LOOKAHEAD_DAYS, Math.max(1, daysInRange))

  const suggestions: SuggestedSlot[] = []

  for (let dayOffset = 0; dayOffset < searchDays && suggestions.length < MAX_SUGGESTIONS; dayOffset++) {
    const date = addDays(today, dayOffset)
    const workingHours =
      dayOffset === 0
        ? { start: maxTime(WORKING_HOURS.start, roundTimeUpToNearest(getCurrentTimeString(new Date()), ROUNDING_STEP_MINUTES)), end: WORKING_HOURS.end }
        : WORKING_HOURS

    const freeIntervals = getFreeIntervalsForDate(date, scheduleEntries, allTasks, task.id, workingHours)

    for (const interval of freeIntervals) {
      if (suggestions.length >= MAX_SUGGESTIONS) break
      if (getMinutesBetween(interval.start, interval.end) < durationMinutes) continue

      const startTime = interval.start
      const endTime = addMinutesToTime(startTime, durationMinutes)
      suggestions.push({
        date: date.toISOString(),
        startTime,
        endTime,
        reason: buildReason(task, date, today, suggestions.length === 0),
      })
    }
  }

  return suggestions
}

function maxTime(a: string, b: string): string {
  return a > b ? a : b
}

function buildReason(task: Task, date: Date, today: Date, isTopSuggestion: boolean): string {
  const classification = classifyDeadline(task, today)
  const dayLabel = formatRelativeDayLabel(date, today)

  const urgency =
    classification === 'overdue'
      ? 'This task is already overdue'
      : classification === 'due_today'
        ? 'This task is due today'
        : classification === 'due_tomorrow'
          ? 'This task is due tomorrow'
          : `This task is due ${formatDisplayDate(new Date(task.deadline))}`

  const priorityNote = task.priority === 'high' ? ' and marked high priority' : ''
  const position = isTopSuggestion ? 'the next available time that fits' : 'another open slot before the deadline'

  return `${urgency}${priorityNote}. This is ${position}, ${dayLabel}.`
}
