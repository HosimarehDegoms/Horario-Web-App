import type { FocusSettings } from '../types/focus'

export const DEFAULT_FOCUS_SETTINGS: FocusSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
}

export const FOCUS_MINUTES_MIN = 1
export const FOCUS_MINUTES_MAX = 180
export const FOCUS_SESSIONS_BEFORE_LONG_BREAK_MIN = 2
export const FOCUS_SESSIONS_BEFORE_LONG_BREAK_MAX = 12

export const FOCUS_PHASE_LABELS = {
  focus: 'Focus',
  short_break: 'Short Break',
  long_break: 'Long Break',
} as const
