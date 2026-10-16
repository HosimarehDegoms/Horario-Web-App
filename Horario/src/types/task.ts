export type TaskStatus = 'not_started' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskRecurrence = 'daily' | 'weekly'

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  deadline: string
  status: TaskStatus
  priority: TaskPriority
  category?: string
  estimatedDurationMinutes?: number
  /** When set, completing this task creates its next occurrence automatically. */
  recurrence?: TaskRecurrence
  createdAt: string
  updatedAt: string
  completedAt?: string
  /**
   * Set only when the user has confirmed a smart-scheduling suggestion (or
   * scheduled the task manually in the future). A one-off work session, not
   * a recurring schedules row — that's why this lives on the task itself
   * rather than becoming a fake weekly-recurring ScheduleEntry.
   */
  scheduledDate?: string
  scheduledStartTime?: string
  scheduledEndTime?: string
}

export interface TaskScheduleBlock {
  scheduledDate: string
  scheduledStartTime: string
  scheduledEndTime: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  deadline: string
  status?: TaskStatus
  priority?: TaskPriority
  category?: string
  estimatedDurationMinutes?: number
  recurrence?: TaskRecurrence
}

export type UpdateTaskInput = Partial<CreateTaskInput>
