import { DAY_OF_WEEK_ORDER } from '../constants/schedule'
import type { DayOfWeek } from '../types/schedule'
import type { ScannedScheduleEntry } from '../types/scan'

const VALID_DAYS = new Set<string>(DAY_OF_WEEK_ORDER)
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

/**
 * Turns arbitrary, untrusted AI/OCR output into safe ScannedScheduleEntry
 * objects. Never assume the AI returned well-formed JSON: anything that
 * doesn't match the expected shape is coerced to null (forcing the user to
 * fill it in during review) rather than trusted as-is. Entries without a
 * title are dropped since there's nothing meaningful to review or save.
 */
export function parseScannedEntries(raw: unknown): ScannedScheduleEntry[] {
  if (!Array.isArray(raw)) return []

  const results: ScannedScheduleEntry[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const candidate = item as Record<string, unknown>

    const title = typeof candidate.title === 'string' ? candidate.title.trim() : ''
    if (!title) continue

    const dayOfWeek =
      typeof candidate.dayOfWeek === 'string' && VALID_DAYS.has(candidate.dayOfWeek)
        ? (candidate.dayOfWeek as DayOfWeek)
        : null
    const startTime =
      typeof candidate.startTime === 'string' && TIME_PATTERN.test(candidate.startTime) ? candidate.startTime : null
    const endTime =
      typeof candidate.endTime === 'string' && TIME_PATTERN.test(candidate.endTime) ? candidate.endTime : null
    const location =
      typeof candidate.location === 'string' && candidate.location.trim() ? candidate.location.trim() : undefined
    const notes = typeof candidate.notes === 'string' && candidate.notes.trim() ? candidate.notes.trim() : undefined
    const confidence =
      typeof candidate.confidence === 'number' && candidate.confidence >= 0 && candidate.confidence <= 1
        ? candidate.confidence
        : 0

    results.push({
      id: crypto.randomUUID(),
      title,
      dayOfWeek,
      startTime,
      endTime,
      location,
      notes,
      confidence,
    })
  }
  return results
}

export function isScannedEntryComplete(
  entry: ScannedScheduleEntry,
): entry is ScannedScheduleEntry & { dayOfWeek: DayOfWeek; startTime: string; endTime: string } {
  return Boolean(entry.title.trim() && entry.dayOfWeek && entry.startTime && entry.endTime)
}
