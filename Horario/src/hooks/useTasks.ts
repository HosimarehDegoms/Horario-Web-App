import { useCallback, useEffect, useState } from 'react'
import type { CreateTaskInput, Task, TaskScheduleBlock, TaskStatus, UpdateTaskInput } from '../types/task'
import * as taskService from '../services/tasks/taskService'

interface UseTasksResult {
  tasks: Task[]
  loading: boolean
  error: string | null
  refetch: () => void
  addTask: (input: CreateTaskInput) => Promise<void>
  updateTask: (taskId: string, input: UpdateTaskInput) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  toggleTaskComplete: (taskId: string) => Promise<void>
  scheduleTask: (taskId: string, block: TaskScheduleBlock) => Promise<void>
  clearTaskSchedule: (taskId: string) => Promise<void>
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const result = await taskService.getTasks()
        if (!cancelled) setTasks(result)
      } catch {
        if (!cancelled) setError('Something went wrong while loading your tasks. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const refetch = useCallback(() => setReloadToken((token) => token + 1), [])

  const addTask = useCallback(async (input: CreateTaskInput) => {
    const task = await taskService.createTask(input)
    setTasks((current) => [task, ...current])
  }, [])

  const updateTask = useCallback(async (taskId: string, input: UpdateTaskInput) => {
    const updated = await taskService.updateTask(taskId, input)
    setTasks((current) => current.map((task) => (task.id === taskId ? updated : task)))
  }, [])

  const deleteTask = useCallback(async (taskId: string) => {
    await taskService.deleteTask(taskId)
    setTasks((current) => current.filter((task) => task.id !== taskId))
  }, [])

  const toggleTaskComplete = useCallback(
    async (taskId: string) => {
      const target = tasks.find((task) => task.id === taskId)
      if (!target) return

      const nextStatus: TaskStatus = target.status === 'completed' ? 'not_started' : 'completed'
      const updated = await taskService.updateTaskStatus(taskId, nextStatus)
      setTasks((current) => current.map((task) => (task.id === taskId ? updated : task)))
    },
    [tasks],
  )

  const scheduleTask = useCallback(async (taskId: string, block: TaskScheduleBlock) => {
    const updated = await taskService.scheduleTask(taskId, block)
    setTasks((current) => current.map((task) => (task.id === taskId ? updated : task)))
  }, [])

  const clearTaskSchedule = useCallback(async (taskId: string) => {
    const updated = await taskService.clearTaskSchedule(taskId)
    setTasks((current) => current.map((task) => (task.id === taskId ? updated : task)))
  }, [])

  return {
    tasks,
    loading,
    error,
    refetch,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    scheduleTask,
    clearTaskSchedule,
  }
}
