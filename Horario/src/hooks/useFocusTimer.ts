import { useCallback, useEffect, useRef, useState } from 'react'
import * as focusService from '../services/focus/focusService'
import { DEFAULT_FOCUS_SETTINGS } from '../constants/focus'
import type { FocusPhase, FocusSession, FocusSettings } from '../types/focus'

type TimerStatus = 'idle' | 'running' | 'paused'

function phaseDurationMinutes(phase: FocusPhase, settings: FocusSettings): number {
  if (phase === 'focus') return settings.focusMinutes
  if (phase === 'short_break') return settings.shortBreakMinutes
  return settings.longBreakMinutes
}

/** The phase after `completedFocusSessions` focus sessions have finished (long break every Nth). */
function resolveNextPhase(from: FocusPhase, completedFocusSessions: number, settings: FocusSettings): FocusPhase {
  if (from !== 'focus') return 'focus'
  return completedFocusSessions % settings.sessionsBeforeLongBreak === 0 ? 'long_break' : 'short_break'
}

export function useFocusTimer() {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<FocusSettings>(DEFAULT_FOCUS_SETTINGS)
  const [history, setHistory] = useState<FocusSession[]>([])
  const [phase, setPhase] = useState<FocusPhase>('focus')
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_FOCUS_SETTINGS.focusMinutes * 60)

  // Wall-clock end time while running — immune to interval drift and background-tab throttling,
  // unlike decrementing a counter once per tick.
  const endAtRef = useRef<number | null>(null)
  const startedAtRef = useRef<string | null>(null)

  useEffect(() => {
    async function load() {
      const [loadedSettings, loadedHistory] = await Promise.all([
        focusService.getSettings(),
        focusService.getSessions(),
      ])
      setSettings(loadedSettings)
      setHistory(loadedHistory)
      setRemainingSeconds(loadedSettings.focusMinutes * 60)
      setLoading(false)
    }
    void load()
  }, [])

  const recordSession = useCallback(
    (recordedPhase: FocusPhase, completed: boolean) => {
      const session: FocusSession = {
        id: crypto.randomUUID(),
        phase: recordedPhase,
        durationMinutes: phaseDurationMinutes(recordedPhase, settings),
        startedAt: startedAtRef.current ?? new Date().toISOString(),
        endedAt: new Date().toISOString(),
        completed,
      }
      setHistory((current) => [session, ...current].slice(0, 200))
      void focusService.logSession(session)
    },
    [settings],
  )

  const advanceTo = useCallback(
    (fromPhase: FocusPhase) => {
      const nextCompletedCount = fromPhase === 'focus' ? completedFocusSessions + 1 : completedFocusSessions
      if (fromPhase === 'focus') setCompletedFocusSessions(nextCompletedCount)

      const next = resolveNextPhase(fromPhase, nextCompletedCount, settings)
      setPhase(next)
      setRemainingSeconds(phaseDurationMinutes(next, settings) * 60)
      setStatus('idle')
      endAtRef.current = null
      startedAtRef.current = null
    },
    [completedFocusSessions, settings],
  )

  const completeCurrentPhase = useCallback(() => {
    recordSession(phase, true)
    advanceTo(phase)
  }, [phase, recordSession, advanceTo])

  // Ticking: recompute from the wall-clock end time rather than decrementing, so a throttled
  // background tab catches up correctly instead of drifting.
  useEffect(() => {
    if (status !== 'running') return

    function tick() {
      if (endAtRef.current === null) return
      const remainingMs = endAtRef.current - Date.now()
      if (remainingMs <= 0) {
        setRemainingSeconds(0)
        completeCurrentPhase()
      } else {
        setRemainingSeconds(Math.ceil(remainingMs / 1000))
      }
    }

    tick()
    const interval = setInterval(tick, 250)
    return () => clearInterval(interval)
  }, [status, completeCurrentPhase])

  const start = useCallback(() => {
    if (status === 'running') return
    if (status === 'idle') startedAtRef.current = new Date().toISOString()
    endAtRef.current = Date.now() + remainingSeconds * 1000
    setStatus('running')
  }, [status, remainingSeconds])

  const pause = useCallback(() => {
    if (status !== 'running') return
    if (endAtRef.current !== null) {
      setRemainingSeconds(Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000)))
    }
    endAtRef.current = null
    setStatus('paused')
  }, [status])

  /** Abandons progress in the current phase (logged as incomplete) and restarts its countdown. */
  const reset = useCallback(() => {
    if (status !== 'idle') recordSession(phase, false)
    endAtRef.current = null
    startedAtRef.current = null
    setStatus('idle')
    setRemainingSeconds(phaseDurationMinutes(phase, settings) * 60)
  }, [status, phase, settings, recordSession])

  /** Abandons the current phase (logged as incomplete) and moves straight to the next one. */
  const skip = useCallback(() => {
    if (status !== 'idle') recordSession(phase, false)
    advanceTo(phase)
  }, [status, phase, recordSession, advanceTo])

  const updateSettings = useCallback(
    async (next: FocusSettings) => {
      setSettings(next)
      await focusService.saveSettings(next)
      if (status === 'idle') setRemainingSeconds(phaseDurationMinutes(phase, next) * 60)
    },
    [status, phase],
  )

  const clearHistory = useCallback(async () => {
    setHistory([])
    await focusService.clearSessions()
  }, [])

  return {
    loading,
    settings,
    history,
    phase,
    status,
    remainingSeconds,
    totalSeconds: phaseDurationMinutes(phase, settings) * 60,
    completedFocusSessions,
    start,
    pause,
    reset,
    skip,
    updateSettings,
    clearHistory,
  }
}
