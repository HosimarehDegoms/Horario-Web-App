import { isSameDay } from './date'
import type { FocusSession } from '../types/focus'

export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/** Total minutes spent in completed focus (not break) sessions on `date`. */
export function sumFocusMinutesForDay(sessions: FocusSession[], date: Date): number {
  return sessions
    .filter((session) => session.phase === 'focus' && session.completed && isSameDay(new Date(session.endedAt), date))
    .reduce((total, session) => total + session.durationMinutes, 0)
}
