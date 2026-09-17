import type { DayOfWeek } from '../types/schedule'

export const DAY_OF_WEEK_ORDER: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

export const DAY_OF_WEEK_SHORT_LABELS: Record<DayOfWeek, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
}

// A softer, more pastel pass on the original palette — same hues, lighter/gentler tones.
export const SCHEDULE_COLOR_PALETTE = [
  '#818cf8',
  '#7dd3fc',
  '#4ade80',
  '#fcd34d',
  '#f87171',
  '#c084fc',
  '#2dd4bf',
  '#94a3b8',
]

export const SCHEDULE_CATEGORY_SUGGESTIONS = ['Class', 'Work', 'Personal', 'Study']
