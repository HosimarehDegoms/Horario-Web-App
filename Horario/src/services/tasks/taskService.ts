import { supabase } from '../../lib/supabase'
import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskRecurrence,
  TaskScheduleBlock,
  TaskStatus,
  UpdateTaskInput,
} from '../../types/task'

/**
 * Real Supabase-backed task data layer. Row Level Security on the `tasks`
 * table (see supabase/migrations) is what actually enforces per-user access
 * for every one of these queries — there is no client-side `.eq('user_id',
 * ...)` filter here because none is needed. `completed_at` is maintained by
 * a DB trigger on update (see migration 0005), not by this file.
 */

interface TaskRow {
  id: string
  user_id: string
  title: string
  description: string | null
  deadline: string
  status: TaskStatus
  priority: TaskPriority
  category: string | null
  estimated_duration_minutes: number | null
  recurrence: TaskRecurrence | null
  created_at: string
  updated_at: string
  completed_at: string | null
  scheduled_date: string | null
  scheduled_start_time: string | null
  scheduled_end_time: string | null
}

const SELECT_COLUMNS =
  'id, user_id, title, description, deadline, status, priority, category, estimated_duration_minutes, recurrence, created_at, updated_at, completed_at, scheduled_date, scheduled_start_time, scheduled_end_time'

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description ?? undefined,
    deadline: row.deadline,
    status: row.status,
    priority: row.priority,
    category: row.category ?? undefined,
    estimatedDurationMinutes: row.estimated_duration_minutes ?? undefined,
    recurrence: row.recurrence ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at ?? undefined,
    scheduledDate: row.scheduled_date ?? undefined,
    // Postgres `time` columns come back as "HH:mm:ss"; the app uses "HH:mm" throughout.
    scheduledStartTime: row.scheduled_start_time?.slice(0, 5) ?? undefined,
    scheduledEndTime: row.scheduled_end_time?.slice(0, 5) ?? undefined,
  }
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(SELECT_COLUMNS)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Something went wrong while loading your tasks. Please try again.')
  }

  return (data as TaskRow[]).map(toTask)
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const status = input.status ?? 'not_started'

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: input.title,
      description: input.description,
      deadline: input.deadline,
      status,
      priority: input.priority ?? 'medium',
      category: input.category,
      estimated_duration_minutes: input.estimatedDurationMinutes,
      recurrence: input.recurrence,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .select(SELECT_COLUMNS)
    .single()

  if (error) {
    throw new Error('Something went wrong while creating this task. Please try again.')
  }

  return toTask(data as TaskRow)
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.deadline !== undefined && { deadline: input.deadline }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.priority !== undefined && { priority: input.priority }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.estimatedDurationMinutes !== undefined && {
        estimated_duration_minutes: input.estimatedDurationMinutes,
      }),
      ...(input.recurrence !== undefined && { recurrence: input.recurrence }),
    })
    .eq('id', taskId)
    .select(SELECT_COLUMNS)
    .single()

  if (error) {
    throw new Error('Something went wrong while updating this task. Please try again.')
  }

  return toTask(data as TaskRow)
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
  return updateTask(taskId, { status })
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)

  if (error) {
    throw new Error('Something went wrong while deleting this task. Please try again.')
  }
}

/**
 * Writes a confirmed smart-scheduling block onto a task. Deliberately
 * separate from `updateTask` — this never touches status/completedAt, and
 * keeping it a dedicated function makes it easy to audit that scheduling
 * only ever writes these three fields on the task itself, never a schedule
 * entry.
 */
export async function scheduleTask(taskId: string, block: TaskScheduleBlock): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      scheduled_date: block.scheduledDate,
      scheduled_start_time: block.scheduledStartTime,
      scheduled_end_time: block.scheduledEndTime,
    })
    .eq('id', taskId)
    .select(SELECT_COLUMNS)
    .single()

  if (error) {
    throw new Error('Something went wrong while scheduling this task. Please try again.')
  }

  return toTask(data as TaskRow)
}

export async function clearTaskSchedule(taskId: string): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ scheduled_date: null, scheduled_start_time: null, scheduled_end_time: null })
    .eq('id', taskId)
    .select(SELECT_COLUMNS)
    .single()

  if (error) {
    throw new Error("Something went wrong while clearing this task's schedule. Please try again.")
  }

  return toTask(data as TaskRow)
}
