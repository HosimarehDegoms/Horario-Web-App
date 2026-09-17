export type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'

export interface ScheduleEntry {
  id: string
  userId: string
  title: string
  description?: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  location?: string
  category?: string
  color?: string
}

export interface CreateScheduleInput {
  title: string
  description?: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  location?: string
  category?: string
  color?: string
}

export type UpdateScheduleInput = Partial<CreateScheduleInput>
