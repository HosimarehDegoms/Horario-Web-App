import { useCallback } from 'react'
import * as schedulingService from '../services/scheduling/schedulingService'
import { getBusyIntervalsForDate } from '../utils/freeTime'
import { timesOverlap } from '../utils/scheduleConflicts'
import { startOfDay } from '../utils/date'
import type { ScheduleEntry } from '../types/schedule'
import type { Task, TaskScheduleBlock } from '../types/task'
import type { SuggestedSlot } from '../types/scheduling'

interface UseSmartSchedulingArgs {
  tasks: Task[]
  scheduleEntries: ScheduleEntry[]
  scheduleTask: (taskId: string, block: TaskScheduleBlock) => Promise<void>
  clearTaskSchedule: (taskId: string) => Promise<void>
}

/**
 * Deliberately takes tasks/entries/mutators from the caller rather than
 * calling useTasks()/useSchedules() itself — a second independent instance
 * of those hooks here would hold its own stale copy of the data, separate
 * from whatever list the page is actually rendering.
 */
export function useSmartScheduling({ tasks, scheduleEntries, scheduleTask, clearTaskSchedule }: UseSmartSchedulingArgs) {
  const getSuggestions = useCallback(
    (task: Task): Promise<SuggestedSlot[]> => schedulingService.suggestTimeSlots(task, scheduleEntries, tasks),
    [scheduleEntries, tasks],
  )

  const confirmSlot = useCallback(
    async (task: Task, slot: SuggestedSlot) => {
      const date = startOfDay(new Date(slot.date))
      const busy = getBusyIntervalsForDate(date, scheduleEntries, tasks, task.id)
      const hasConflict = busy.some((interval) =>
        timesOverlap(slot.startTime, slot.endTime, interval.start, interval.end),
      )
      if (hasConflict) {
        throw new Error('This time is no longer available. Please choose another suggestion.')
      }

      await scheduleTask(task.id, {
        scheduledDate: date.toISOString(),
        scheduledStartTime: slot.startTime,
        scheduledEndTime: slot.endTime,
      })
    },
    [scheduleEntries, tasks, scheduleTask],
  )

  return { getSuggestions, confirmSlot, clearSchedule: clearTaskSchedule }
}
