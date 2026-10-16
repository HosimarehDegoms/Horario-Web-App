import { DEFAULT_FOCUS_SETTINGS } from '../../constants/focus'
import type { FocusSession, FocusSettings } from '../../types/focus'

/**
 * localStorage-backed, not a Supabase table — focus session history is
 * per-device scratch data, not something that needs RLS/sync. Same
 * async-Promise contract as the other services, so this can still be swapped
 * for a real backend later without touching the hook or UI.
 */

const SETTINGS_KEY = 'horario:focus-settings'
const SESSIONS_KEY = 'horario:focus-sessions'
const MAX_HISTORY = 200
const SIMULATED_LATENCY_MS = 60

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS))
}

export async function getSettings(): Promise<FocusSettings> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return delay(DEFAULT_FOCUS_SETTINGS)
    return delay({ ...DEFAULT_FOCUS_SETTINGS, ...(JSON.parse(raw) as Partial<FocusSettings>) })
  } catch {
    return delay(DEFAULT_FOCUS_SETTINGS)
  }
}

export async function saveSettings(settings: FocusSettings): Promise<FocusSettings> {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // Storage unavailable (private mode, quota, etc.) — settings just won't persist across reloads.
  }
  return delay(settings)
}

export async function getSessions(): Promise<FocusSession[]> {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    if (!raw) return delay([])
    return delay(JSON.parse(raw) as FocusSession[])
  } catch {
    return delay([])
  }
}

export async function logSession(session: FocusSession): Promise<FocusSession> {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    const existing = raw ? (JSON.parse(raw) as FocusSession[]) : []
    const next = [session, ...existing].slice(0, MAX_HISTORY)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(next))
  } catch {
    // Storage unavailable — session just won't be recorded in history.
  }
  return delay(session)
}

export async function clearSessions(): Promise<void> {
  try {
    localStorage.removeItem(SESSIONS_KEY)
  } catch {
    // Nothing to do if storage is unavailable.
  }
  return delay(undefined)
}
