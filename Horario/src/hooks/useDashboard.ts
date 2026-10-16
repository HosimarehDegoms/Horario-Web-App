import { useEffect, useMemo, useState } from 'react'
import { useTasks } from './useTasks'
import { useSchedules } from './useSchedules'
import * as focusService from '../services/focus/focusService'
import { getDayOfWeek, getWeekRange } from '../utils/date'
import { getOverdueTasks, getUpcomingDeadlines } from '../utils/deadlines'
import { calculateCompletionRate, getTasksForDay, getTasksForWeek } from '../utils/progress'
import { sumFocusMinutesForDay } from '../utils/focus'
import type { CreateTaskInput } from '../types/task'

export function useDashboard() {
  const today = useMemo(() => new Date(), [])
  const tasksState = useTasks()
  const scheduleState = useSchedules()
  const [focusMinutesToday, setFocusMinutesToday] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function loadFocusMinutes() {
      const sessions = await focusService.getSessions()
      if (!cancelled) setFocusMinutesToday(sumFocusMinutesForDay(sessions, today))
    }
    void loadFocusMinutes()
    return () => {
      cancelled = true
    }
  }, [today])

  const todaySchedule = useMemo(
    () => scheduleState.entries.filter((entry) => entry.dayOfWeek === getDayOfWeek(today)),
    [scheduleState.entries, today],
  )

  const todayTasks = useMemo(() => getTasksForDay(tasksState.tasks, today), [tasksState.tasks, today])
  const dailyProgress = useMemo(() => calculateCompletionRate(todayTasks), [todayTasks])

  const weekRange = useMemo(() => getWeekRange(today), [today])
  const weekTasks = useMemo(
    () => getTasksForWeek(tasksState.tasks, weekRange.start, weekRange.end),
    [tasksState.tasks, weekRange],
  )
  const weeklyProgress = useMemo(() => calculateCompletionRate(weekTasks), [weekTasks])

  const overdueTasks = useMemo(() => getOverdueTasks(tasksState.tasks, today), [tasksState.tasks, today])
  const upcomingDeadlines = useMemo(
    () => getUpcomingDeadlines(tasksState.tasks, today),
    [tasksState.tasks, today],
  )

  const loading = tasksState.loading || scheduleState.loading
  const error = tasksState.error ?? scheduleState.error

  const retry = () => {
    tasksState.refetch()
    scheduleState.refetch()
  }

  const addTask = async (title: string) => {
    const input: CreateTaskInput = {
      title,
      deadline: today.toISOString(),
      priority: 'medium',
    }
    await tasksState.addTask(input)
  }

  return {
    today,
    loading,
    error,
    retry,
    todaySchedule,
    todayTasks,
    dailyProgress,
    weeklyProgress,
    overdueTasks,
    upcomingDeadlines,
    focusMinutesToday,
    addTask,
    toggleTaskComplete: tasksState.toggleTaskComplete,
  }
}
