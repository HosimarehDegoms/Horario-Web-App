import { useState } from 'react'
import type { FormEvent } from 'react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import {
  FOCUS_MINUTES_MAX,
  FOCUS_MINUTES_MIN,
  FOCUS_SESSIONS_BEFORE_LONG_BREAK_MAX,
  FOCUS_SESSIONS_BEFORE_LONG_BREAK_MIN,
} from '../../../constants/focus'
import type { FocusSettings } from '../../../types/focus'

interface FocusSettingsFormProps {
  settings: FocusSettings
  onSave: (settings: FocusSettings) => void
  onCancel: () => void
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min
  return Math.min(max, Math.max(min, value))
}

export function FocusSettingsForm({ settings, onSave, onCancel }: FocusSettingsFormProps) {
  const [focusMinutes, setFocusMinutes] = useState(String(settings.focusMinutes))
  const [shortBreakMinutes, setShortBreakMinutes] = useState(String(settings.shortBreakMinutes))
  const [longBreakMinutes, setLongBreakMinutes] = useState(String(settings.longBreakMinutes))
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(String(settings.sessionsBeforeLongBreak))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({
      focusMinutes: clamp(Number(focusMinutes), FOCUS_MINUTES_MIN, FOCUS_MINUTES_MAX),
      shortBreakMinutes: clamp(Number(shortBreakMinutes), FOCUS_MINUTES_MIN, FOCUS_MINUTES_MAX),
      longBreakMinutes: clamp(Number(longBreakMinutes), FOCUS_MINUTES_MIN, FOCUS_MINUTES_MAX),
      sessionsBeforeLongBreak: clamp(
        Number(sessionsBeforeLongBreak),
        FOCUS_SESSIONS_BEFORE_LONG_BREAK_MIN,
        FOCUS_SESSIONS_BEFORE_LONG_BREAK_MAX,
      ),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Focus (minutes)"
          type="number"
          min={FOCUS_MINUTES_MIN}
          max={FOCUS_MINUTES_MAX}
          value={focusMinutes}
          onChange={(event) => setFocusMinutes(event.target.value)}
        />
        <Input
          label="Short break (minutes)"
          type="number"
          min={FOCUS_MINUTES_MIN}
          max={FOCUS_MINUTES_MAX}
          value={shortBreakMinutes}
          onChange={(event) => setShortBreakMinutes(event.target.value)}
        />
        <Input
          label="Long break (minutes)"
          type="number"
          min={FOCUS_MINUTES_MIN}
          max={FOCUS_MINUTES_MAX}
          value={longBreakMinutes}
          onChange={(event) => setLongBreakMinutes(event.target.value)}
        />
        <Input
          label="Focus sessions before a long break"
          type="number"
          min={FOCUS_SESSIONS_BEFORE_LONG_BREAK_MIN}
          max={FOCUS_SESSIONS_BEFORE_LONG_BREAK_MAX}
          value={sessionsBeforeLongBreak}
          onChange={(event) => setSessionsBeforeLongBreak(event.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Intervals</Button>
      </div>
    </form>
  )
}
