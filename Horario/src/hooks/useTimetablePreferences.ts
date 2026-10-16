import { useCallback, useEffect, useState } from 'react'
import * as timetablePreferencesService from '../services/timetable/timetablePreferencesService'
import type { SaveTimetablePreferencesInput, TimetablePreferences } from '../types/timetablePreferences'

interface UseTimetablePreferencesResult {
  preferences: TimetablePreferences | null
  loading: boolean
  error: string | null
  refetch: () => void
  savePreferences: (input: SaveTimetablePreferencesInput) => Promise<void>
  uploadBackgroundImage: (file: File) => Promise<string>
}

export function useTimetablePreferences(): UseTimetablePreferencesResult {
  const [preferences, setPreferences] = useState<TimetablePreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const result = await timetablePreferencesService.getPreferences()
        if (!cancelled) setPreferences(result)
      } catch {
        if (!cancelled) setError('Something went wrong while loading your schedule design. Please try again.')
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

  const savePreferences = useCallback(async (input: SaveTimetablePreferencesInput) => {
    const saved = await timetablePreferencesService.savePreferences(input)
    setPreferences(saved)
  }, [])

  const uploadBackgroundImage = useCallback(
    (file: File) => timetablePreferencesService.uploadBackgroundImage(file),
    [],
  )

  return { preferences, loading, error, refetch, savePreferences, uploadBackgroundImage }
}
