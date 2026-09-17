export type DeadlineClassification =
  | 'overdue'
  | 'due_today'
  | 'due_tomorrow'
  | 'upcoming'
  | 'completed'

export interface ProgressSummary {
  completed: number
  total: number
  completionRate: number
}
