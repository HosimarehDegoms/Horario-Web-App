import type { DayOfWeek } from '../types/schedule'

const DAYS_OF_WEEK: DayOfWeek[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export function getDayOfWeek(date: Date): DayOfWeek {
  return DAYS_OF_WEEK[date.getDay()]
}

export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/** Monday-start week range containing `date`, inclusive of both ends. */
export function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = startOfDay(date)
  const daysSinceMonday = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - daysSinceMonday)

  const end = addDays(start, 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
}

const DISPLAY_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export function formatDisplayDate(date: Date): string {
  return DISPLAY_DATE_FORMATTER.format(date)
}

/**
 * Converts to/from a native `<input type="date">` value ("YYYY-MM-DD") using
 * local date components. `new Date("YYYY-MM-DD")` parses as UTC midnight,
 * which can shift a day off in negative-UTC-offset timezones once compared
 * against a locally-computed "today" — these avoid that by construction.
 */
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateInputValue(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** "14:30" -> "2:30 PM". Used for smart-scheduling suggestions, which the PRD specifies in 12-hour form. */
export function formatTime12h(time: string): string {
  const [hoursStr, minutes] = time.split(':')
  const hours = Number(hoursStr)
  const period = hours >= 12 ? 'PM' : 'AM'
  const twelveHour = hours % 12 === 0 ? 12 : hours % 12
  return `${twelveHour}:${minutes} ${period}`
}

export function formatRelativeDayLabel(date: Date, referenceDate: Date): string {
  if (isSameDay(date, referenceDate)) return 'Today'
  if (isSameDay(date, addDays(referenceDate, 1))) return 'Tomorrow'
  return formatDisplayDate(date)
}

export function getCurrentTimeString(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** Rounds a "HH:mm" time up to the next `stepMinutes` boundary, clamped to the same day. */
export function roundTimeUpToNearest(time: string, stepMinutes: number): string {
  const [hours, minutes] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes
  const rounded = Math.min(Math.ceil(totalMinutes / stepMinutes) * stepMinutes, 23 * 60 + 59)
  return `${String(Math.floor(rounded / 60)).padStart(2, '0')}:${String(rounded % 60).padStart(2, '0')}`
}
