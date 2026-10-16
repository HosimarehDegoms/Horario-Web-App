import { useEffect, useRef } from 'react'
import * as taskService from '../services/tasks/taskService'
import * as scheduleService from '../services/schedule/scheduleService'
import { computeReminders } from '../utils/reminders'

const CHECK_INTERVAL_MS = 60_000
const NOTIFIED_KEY = 'horario:notified-reminders'
const MAX_STORED_KEYS = 500

function loadNotifiedKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function saveNotifiedKeys(keys: Set<string>): void {
  try {
    // Capped so this can't grow unbounded across long-running sessions.
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(Array.from(keys).slice(-MAX_STORED_KEYS)))
  } catch {
    // Storage unavailable — reminders may repeat across reloads, which is harmless.
  }
}

/**
 * Polls tasks/schedule while the app is open and fires a browser Notification for anything newly
 * due. This is foreground-only (no service worker / push backend) — reminders only fire while a
 * Horario tab is open, which is the deliberate scope for this app.
 */
export function useReminderNotifications(): void {
  const notifiedRef = useRef<Set<string> | null>(null)

  useEffect(() => {
    if (typeof Notification === 'undefined') return
    if (notifiedRef.current === null) notifiedRef.current = loadNotifiedKeys()

    async function check() {
      if (Notification.permission !== 'granted') return
      const notified = notifiedRef.current
      if (!notified) return

      const [tasks, entries] = await Promise.all([taskService.getTasks(), scheduleService.getScheduleEntries()])
      const reminders = computeReminders(tasks, entries, new Date())

      let changed = false
      for (const reminder of reminders) {
        if (notified.has(reminder.key)) continue
        new Notification(reminder.title, { body: reminder.body })
        notified.add(reminder.key)
        changed = true
      }
      if (changed) saveNotifiedKeys(notified)
    }

    void check()
    const interval = setInterval(() => void check(), CHECK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])
}
