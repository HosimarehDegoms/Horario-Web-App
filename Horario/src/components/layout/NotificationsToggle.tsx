import { useState } from 'react'
import { BellIcon, BellOffIcon } from './icons'

interface NotificationsToggleProps {
  /** Icon-only, for tight spaces like the mobile top bar. */
  compact?: boolean
}

type PermissionState = NotificationPermission | 'unsupported'

function getInitialPermission(): PermissionState {
  return typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
}

export function NotificationsToggle({ compact = false }: NotificationsToggleProps) {
  const [permission, setPermission] = useState<PermissionState>(getInitialPermission)

  if (permission === 'unsupported') return null

  async function handleClick() {
    if (permission !== 'default') return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  if (permission === 'granted') {
    return (
      <span
        title="Reminders for upcoming tasks and schedule entries are on"
        className="flex items-center gap-2 rounded-clay-sm px-3 py-2.5 text-xs font-medium text-emerald-600"
      >
        <BellIcon className="h-4 w-4 shrink-0" />
        {!compact && 'Reminders On'}
      </span>
    )
  }

  if (permission === 'denied') {
    return (
      <span
        title="Notifications are blocked in your browser settings"
        className="flex items-center gap-2 rounded-clay-sm px-3 py-2.5 text-xs font-medium text-slate-400"
      >
        <BellOffIcon className="h-4 w-4 shrink-0" />
        {!compact && 'Reminders Blocked'}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      aria-label="Enable reminders for upcoming tasks and schedule entries"
      title="Enable reminders"
      className="flex items-center gap-2 rounded-clay-sm px-3 py-2.5 text-xs font-medium text-slate-500 transition-colors duration-150 hover:bg-white/60 hover:text-slate-800"
    >
      <BellIcon className="h-4 w-4 shrink-0" />
      {!compact && 'Enable Reminders'}
    </button>
  )
}
