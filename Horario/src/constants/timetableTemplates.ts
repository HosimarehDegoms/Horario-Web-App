import type { TimetableTemplate } from '../types/timetablePreferences'

export const TIMETABLE_TEMPLATE_ORDER: TimetableTemplate[] = [
  'minimal',
  'colorful',
  'weekly_grid',
  'student_planner',
  'compact',
]

export const TIMETABLE_TEMPLATE_LABELS: Record<TimetableTemplate, string> = {
  minimal: 'Minimal',
  colorful: 'Colorful',
  weekly_grid: 'Weekly Grid',
  student_planner: 'Student Planner',
  compact: 'Compact',
}

export const TIMETABLE_TEMPLATE_DESCRIPTIONS: Record<TimetableTemplate, string> = {
  minimal: 'A clean, spacious list table — day, time, subject, room.',
  colorful: 'A classic bordered grid with a bright color per day.',
  weekly_grid: "Horario's default time-grid table, soft clay colors.",
  student_planner: 'One small table per day, blue journal styling.',
  compact: 'A dense list table — see the whole week at a glance.',
}

/** Which structural table layout a template's Week view renders as. */
export type TimetableTableFormat = 'time_grid' | 'spreadsheet' | 'flat_table' | 'day_tables'

export interface TimetableTemplateStyle {
  // Day view (ScheduleCard) styling.
  cardClassName: string
  /** Tint each card's background using the entry's own color, instead of a plain surface. */
  tinted: boolean
  /** Show the small category-color dot next to the title. */
  showColorDot: boolean
  density: 'cozy' | 'compact'

  // Week view table styling.
  tableFormat: TimetableTableFormat
  /** time_grid only: solid filled category colors instead of a soft tint. */
  vivid: boolean
}

export const DEFAULT_TIMETABLE_TEMPLATE_STYLE: TimetableTemplateStyle = {
  cardClassName: 'border border-slate-200 bg-white shadow-clay hover:shadow-clay-hover',
  tinted: false,
  showColorDot: true,
  density: 'cozy',
  tableFormat: 'time_grid',
  vivid: false,
}

export const TIMETABLE_TEMPLATE_STYLES: Record<TimetableTemplate, TimetableTemplateStyle> = {
  minimal: {
    cardClassName: 'border border-slate-200 bg-white shadow-none hover:shadow-sm',
    tinted: false,
    showColorDot: false,
    density: 'cozy',
    tableFormat: 'flat_table',
    vivid: false,
  },
  colorful: {
    cardClassName: 'border border-transparent shadow-clay hover:shadow-clay-hover',
    tinted: true,
    showColorDot: true,
    density: 'cozy',
    tableFormat: 'spreadsheet',
    vivid: false,
  },
  weekly_grid: DEFAULT_TIMETABLE_TEMPLATE_STYLE,
  student_planner: {
    cardClassName: 'border-l-4 border-sky-300 bg-sky-50/70 shadow-clay-inset',
    tinted: false,
    showColorDot: true,
    density: 'cozy',
    tableFormat: 'day_tables',
    vivid: false,
  },
  compact: {
    cardClassName: 'border border-slate-200 bg-white shadow-clay hover:shadow-clay-hover',
    tinted: false,
    showColorDot: true,
    density: 'compact',
    tableFormat: 'flat_table',
    vivid: false,
  },
}
