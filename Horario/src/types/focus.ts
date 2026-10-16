export type FocusPhase = 'focus' | 'short_break' | 'long_break'

export interface FocusSettings {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  /** How many focus sessions happen before a long break is due instead of a short one. */
  sessionsBeforeLongBreak: number
}

export interface FocusSession {
  id: string
  phase: FocusPhase
  durationMinutes: number
  startedAt: string
  endedAt: string
  /** false when the user skipped/reset out of the session before it finished. */
  completed: boolean
}
