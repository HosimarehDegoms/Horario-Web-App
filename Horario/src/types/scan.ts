import type { DayOfWeek } from './schedule'

export interface ScannedScheduleEntry {
  id: string
  title: string
  dayOfWeek: DayOfWeek | null
  startTime: string | null
  endTime: string | null
  location?: string
  notes?: string
  confidence: number
}
