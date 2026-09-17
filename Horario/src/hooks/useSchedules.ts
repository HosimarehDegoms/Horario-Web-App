import { useCallback, useEffect, useState } from 'react'
import type { CreateScheduleInput, ScheduleEntry, UpdateScheduleInput } from '../types/schedule'
import * as scheduleService from '../services/schedule/scheduleService'

interface UseSchedulesResult {
  entries: ScheduleEntry[]
  loading: boolean
  error: string | null
  refetch: () => void
  createEntry: (input: CreateScheduleInput) => Promise<ScheduleEntry>
  updateEntry: (id: string, input: UpdateScheduleInput) => Promise<ScheduleEntry>
  deleteEntry: (id: string) => Promise<void>
}

export function useSchedules(): UseSchedulesResult {
  const [entries, setEntries] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const result = await scheduleService.getScheduleEntries()
        if (!cancelled) setEntries(result)
      } catch {
        if (!cancelled) setError('Something went wrong while loading your schedule. Please try again.')
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

  const createEntry = useCallback(async (input: CreateScheduleInput) => {
    const entry = await scheduleService.createScheduleEntry(input)
    setEntries((current) => [...current, entry])
    return entry
  }, [])

  const updateEntry = useCallback(async (id: string, input: UpdateScheduleInput) => {
    const updated = await scheduleService.updateScheduleEntry(id, input)
    setEntries((current) => current.map((entry) => (entry.id === id ? updated : entry)))
    return updated
  }, [])

  const deleteEntry = useCallback(async (id: string) => {
    await scheduleService.deleteScheduleEntry(id)
    setEntries((current) => current.filter((entry) => entry.id !== id))
  }, [])

  return { entries, loading, error, refetch, createEntry, updateEntry, deleteEntry }
}
