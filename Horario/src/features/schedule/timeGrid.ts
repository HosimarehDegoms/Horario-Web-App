import { DAY_OF_WEEK_ORDER } from '../../constants/schedule'
import type { DayOfWeek, ScheduleEntry } from '../../types/schedule'

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export interface TimeGridBounds {
  startMinutes: number
  endMinutes: number
}

const DEFAULT_START_MINUTES = 8 * 60
const DEFAULT_END_MINUTES = 17 * 60
const MIN_SPAN_MINUTES = 60

/**
 * The grid only spans the hours that actually have entries (rounded out to
 * the nearest hour), not a fixed 24h range — otherwise most of the table
 * would be empty space for a typical schedule.
 */
export function computeTimeGridBounds(entries: ScheduleEntry[]): TimeGridBounds {
  if (entries.length === 0) {
    return { startMinutes: DEFAULT_START_MINUTES, endMinutes: DEFAULT_END_MINUTES }
  }

  let earliest = Infinity
  let latest = -Infinity
  for (const entry of entries) {
    earliest = Math.min(earliest, timeToMinutes(entry.startTime))
    latest = Math.max(latest, timeToMinutes(entry.endTime))
  }

  const startMinutes = Math.max(0, Math.floor(earliest / 60) * 60)
  const endMinutes = Math.min(24 * 60, Math.max(Math.ceil(latest / 60) * 60, startMinutes + MIN_SPAN_MINUTES))

  return { startMinutes, endMinutes }
}

export function getHourMarks(bounds: TimeGridBounds): number[] {
  const marks: number[] = []
  for (let minute = Math.ceil(bounds.startMinutes / 60) * 60; minute <= bounds.endMinutes; minute += 60) {
    marks.push(minute)
  }
  return marks
}

export interface SpreadsheetCell {
  entry: ScheduleEntry | null
  rowSpan: number
  /** Covered by an earlier row's rowSpan — render nothing for this cell. */
  skip: boolean
}

/**
 * Builds a classic bordered-table grid: fixed-size rows, entries placed in
 * their starting row with a rowSpan covering however many rows they occupy.
 * Subsequent covered rows are marked `skip` so the renderer omits a <td>
 * for them entirely — the standard technique for rowSpan-merged table grids.
 */
export function buildSpreadsheetGrid(
  entries: ScheduleEntry[],
  bounds: TimeGridBounds,
  rowMinutes: number,
): Map<DayOfWeek, SpreadsheetCell[]> {
  const rowCount = Math.max(1, Math.round((bounds.endMinutes - bounds.startMinutes) / rowMinutes))
  const grid = new Map<DayOfWeek, SpreadsheetCell[]>()

  for (const day of DAY_OF_WEEK_ORDER) {
    const cells: SpreadsheetCell[] = Array.from({ length: rowCount }, () => ({
      entry: null,
      rowSpan: 1,
      skip: false,
    }))
    const dayEntries = entries
      .filter((entry) => entry.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    for (const entry of dayEntries) {
      const startRow = Math.round((timeToMinutes(entry.startTime) - bounds.startMinutes) / rowMinutes)
      const endRow = Math.round((timeToMinutes(entry.endTime) - bounds.startMinutes) / rowMinutes)
      if (startRow < 0 || startRow >= rowCount) continue

      const span = Math.max(1, Math.min(endRow, rowCount) - startRow)
      cells[startRow] = { entry, rowSpan: span, skip: false }
      for (let row = startRow + 1; row < Math.min(startRow + span, rowCount); row++) {
        cells[row] = { entry: null, rowSpan: 1, skip: true }
      }
    }

    grid.set(day, cells)
  }

  return grid
}
