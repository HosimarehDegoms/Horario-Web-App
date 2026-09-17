import type { CreateTaskInput, Task, TaskScheduleBlock, TaskStatus, UpdateTaskInput } from '../../types/task'
import { addDays } from '../../utils/date'

/**
 * Temporary in-memory data layer for tasks, standing in until the Supabase
 * backend is connected. Every function returns a Promise and takes the same
 * shape of input/output a real Supabase-backed implementation would, so
 * `useTasks` and everything built on it can stay unchanged when this file
 * is replaced.
 */

const SIMULATED_LATENCY_MS = 250
const CURRENT_USER_ID = 'local-user'

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS))
}

function createSeedTasks(): Task[] {
  const now = new Date()
  const iso = (date: Date) => date.toISOString()

  return [
    {
      id: 'task-1',
      userId: CURRENT_USER_ID,
      title: 'Submit lab report',
      deadline: iso(addDays(now, -2)),
      status: 'in_progress',
      priority: 'high',
      category: 'School',
      createdAt: iso(addDays(now, -6)),
      updatedAt: iso(addDays(now, -2)),
    },
    {
      id: 'task-2',
      userId: CURRENT_USER_ID,
      title: 'Prepare team standup notes',
      deadline: iso(now),
      status: 'not_started',
      priority: 'medium',
      category: 'Work',
      createdAt: iso(addDays(now, -1)),
      updatedAt: iso(addDays(now, -1)),
    },
    {
      id: 'task-3',
      userId: CURRENT_USER_ID,
      title: 'Database project proposal',
      deadline: iso(addDays(now, 1)),
      status: 'not_started',
      priority: 'high',
      category: 'School',
      createdAt: iso(addDays(now, -3)),
      updatedAt: iso(addDays(now, -3)),
    },
    {
      id: 'task-4',
      userId: CURRENT_USER_ID,
      title: 'Read chapter 5',
      deadline: iso(addDays(now, 5)),
      status: 'not_started',
      priority: 'low',
      category: 'School',
      createdAt: iso(addDays(now, -1)),
      updatedAt: iso(addDays(now, -1)),
    },
    {
      id: 'task-5',
      userId: CURRENT_USER_ID,
      title: 'Submit assignment 1',
      deadline: iso(addDays(now, -5)),
      status: 'completed',
      priority: 'medium',
      category: 'School',
      createdAt: iso(addDays(now, -10)),
      updatedAt: iso(addDays(now, -6)),
      completedAt: iso(addDays(now, -6)),
    },
    {
      id: 'task-6',
      userId: CURRENT_USER_ID,
      title: 'Buy groceries',
      deadline: iso(now),
      status: 'completed',
      priority: 'low',
      category: 'Personal',
      createdAt: iso(addDays(now, -1)),
      updatedAt: iso(now),
      completedAt: iso(now),
    },
  ]
}

let tasks: Task[] = createSeedTasks()

export async function getTasks(): Promise<Task[]> {
  return delay([...tasks])
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const now = new Date().toISOString()
  const status = input.status ?? 'not_started'
  const task: Task = {
    id: crypto.randomUUID(),
    userId: CURRENT_USER_ID,
    createdAt: now,
    updatedAt: now,
    ...input,
    status,
    priority: input.priority ?? 'medium',
    completedAt: status === 'completed' ? now : undefined,
  }
  tasks = [task, ...tasks]
  return delay(task)
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  const now = new Date().toISOString()
  let updated: Task | undefined

  tasks = tasks.map((task) => {
    if (task.id !== taskId) return task
    const nextStatus = input.status ?? task.status
    updated = {
      ...task,
      ...input,
      status: nextStatus,
      updatedAt: now,
      completedAt: nextStatus === 'completed' ? (task.status === 'completed' ? task.completedAt : now) : undefined,
    }
    return updated
  })

  if (!updated) {
    throw new Error(`Task ${taskId} not found`)
  }

  return delay(updated)
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
  return updateTask(taskId, { status })
}

export async function deleteTask(taskId: string): Promise<void> {
  tasks = tasks.filter((task) => task.id !== taskId)
  return delay(undefined)
}

/**
 * Writes a confirmed smart-scheduling block onto a task. Deliberately
 * separate from `updateTask` — this never touches status/completedAt, and
 * keeping it a dedicated function makes it easy to audit that scheduling
 * only ever writes these three fields on the task itself, never a schedule
 * entry.
 */
export async function scheduleTask(taskId: string, block: TaskScheduleBlock): Promise<Task> {
  const now = new Date().toISOString()
  let updated: Task | undefined

  tasks = tasks.map((task) => {
    if (task.id !== taskId) return task
    updated = { ...task, ...block, updatedAt: now }
    return updated
  })

  if (!updated) {
    throw new Error(`Task ${taskId} not found`)
  }

  return delay(updated)
}

export async function clearTaskSchedule(taskId: string): Promise<Task> {
  const now = new Date().toISOString()
  let updated: Task | undefined

  tasks = tasks.map((task) => {
    if (task.id !== taskId) return task
    updated = {
      ...task,
      scheduledDate: undefined,
      scheduledStartTime: undefined,
      scheduledEndTime: undefined,
      updatedAt: now,
    }
    return updated
  })

  if (!updated) {
    throw new Error(`Task ${taskId} not found`)
  }

  return delay(updated)
}
