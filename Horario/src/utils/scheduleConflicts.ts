import type { DayOfWeek, ScheduleEntry } from '../types/schedule'

interface ScheduleCandidate {
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
}

/** "HH:mm" strings compare correctly as plain strings since they're fixed-width and zero-padded. */
export function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd
}

export function findConflicts(
  candidate: ScheduleCandidate,
  existingEntries: ScheduleEntry[],
  excludeId?: string,
): ScheduleEntry[] {
  return existingEntries.filter(
    (entry) =>
      entry.id !== excludeId &&
      entry.dayOfWeek === candidate.dayOfWeek &&
      timesOverlap(candidate.startTime, candidate.endTime, entry.startTime, entry.endTime),
  )
}

export function getOverlapRange(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): { start: string; end: string } {
  return {
    start: aStart > bStart ? aStart : bStart,
    end: aEnd < bEnd ? aEnd : bEnd,
  }
}
