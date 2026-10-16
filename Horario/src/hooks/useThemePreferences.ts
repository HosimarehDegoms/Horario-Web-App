import { useCallback, useEffect, useState } from 'react'
import * as themePreferencesService from '../services/theme/themePreferencesService'
import { applyThemeToRoot } from '../utils/applyTheme'
import { findThemePreset } from '../constants/themeColors'
import type { ThemePreset } from '../constants/themeColors'
import type { SaveThemePreferencesInput, ThemePreferences } from '../types/themePreferences'

interface UseThemePreferencesResult {
  preferences: ThemePreferences | null
  /** The named preset matching the current color+finish, if any — null for a custom manual mix. */
  activePreset: ThemePreset | null
  loading: boolean
  error: string | null
  refetch: () => void
  savePreferences: (input: SaveThemePreferencesInput) => Promise<void>
}

/**
 * Loads the user's saved theme and applies it to the whole app (document.documentElement)
 * as soon as it's known — mount this once near the app root so the saved theme shows up on
 * every page, not just Settings. Falls back to the default theme if nothing's been saved yet.
 */
export function useThemePreferences(): UseThemePreferencesResult {
  const [preferences, setPreferences] = useState<ThemePreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const result = await themePreferencesService.getPreferences()
        if (cancelled) return
        setPreferences(result)
        const { colorFamily, finish } = result ?? themePreferencesService.DEFAULT_THEME_PREFERENCES
        applyThemeToRoot(colorFamily, finish)
      } catch {
        if (!cancelled) setError('Something went wrong while loading your theme. Please try again.')
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

  const savePreferences = useCallback(async (input: SaveThemePreferencesInput) => {
    const saved = await themePreferencesService.savePreferences(input)
    setPreferences(saved)
    applyThemeToRoot(saved.colorFamily, saved.finish)
  }, [])

  const { colorFamily, finish } = preferences ?? themePreferencesService.DEFAULT_THEME_PREFERENCES
  const activePreset = findThemePreset(colorFamily, finish) ?? null

  return { preferences, activePreset, loading, error, refetch, savePreferences }
}
