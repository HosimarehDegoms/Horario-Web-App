import { createContext } from 'react'
import { DEFAULT_TIMETABLE_TEMPLATE_STYLE } from '../../constants/timetableTemplates'
import type { TimetableTemplateStyle } from '../../constants/timetableTemplates'

/**
 * Lets ScheduleCard pick up the current page's chosen template without prop
 * drilling through DayView/WeekView. Defaults to the plain weekly-grid look
 * so ScheduleCard renders unchanged anywhere it's used without a provider
 * (e.g. Dashboard's TodayScheduleSection) — only the Schedule page itself
 * wraps its content in a provider with the user's actual chosen template.
 */
export const TimetableTemplateStyleContext = createContext<TimetableTemplateStyle>(DEFAULT_TIMETABLE_TEMPLATE_STYLE)
