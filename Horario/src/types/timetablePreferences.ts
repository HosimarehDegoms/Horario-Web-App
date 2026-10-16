export type TimetableTemplate = 'minimal' | 'colorful' | 'weekly_grid' | 'student_planner' | 'compact'

export interface TimetablePreferences {
  id: string
  userId: string
  template: TimetableTemplate
  backgroundImageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface SaveTimetablePreferencesInput {
  template: TimetableTemplate
  backgroundImageUrl?: string | null
}
