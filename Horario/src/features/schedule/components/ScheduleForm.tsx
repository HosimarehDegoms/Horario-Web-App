import { useState } from 'react'
import type { FormEvent } from 'react'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import { Button } from '../../../components/ui/Button'
import { ColorSwatchPicker } from '../../../components/schedule/ColorSwatchPicker'
import {
  DAY_OF_WEEK_LABELS,
  DAY_OF_WEEK_ORDER,
  SCHEDULE_CATEGORY_SUGGESTIONS,
  SCHEDULE_COLOR_PALETTE,
} from '../../../constants/schedule'
import { findConflicts, getOverlapRange } from '../../../utils/scheduleConflicts'
import type { CreateScheduleInput, DayOfWeek, ScheduleEntry } from '../../../types/schedule'

interface ScheduleFormProps {
  initialEntry?: ScheduleEntry
  existingEntries: ScheduleEntry[]
  onSubmit: (input: CreateScheduleInput) => Promise<void>
  onCancel: () => void
}

interface FormErrors {
  title?: string
  startTime?: string
  endTime?: string
}

const CATEGORY_SUGGESTIONS_ID = 'schedule-category-suggestions'

export function ScheduleForm({ initialEntry, existingEntries, onSubmit, onCancel }: ScheduleFormProps) {
  const [title, setTitle] = useState(initialEntry?.title ?? '')
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(initialEntry?.dayOfWeek ?? 'monday')
  const [startTime, setStartTime] = useState(initialEntry?.startTime ?? '09:00')
  const [endTime, setEndTime] = useState(initialEntry?.endTime ?? '10:00')
  const [location, setLocation] = useState(initialEntry?.location ?? '')
  const [notes, setNotes] = useState(initialEntry?.description ?? '')
  const [category, setCategory] = useState(initialEntry?.category ?? '')
  const [color, setColor] = useState(initialEntry?.color ?? SCHEDULE_COLOR_PALETTE[0])
  const [errors, setErrors] = useState<FormErrors>({})
  const [conflicts, setConflicts] = useState<ScheduleEntry[]>([])
  const [submitting, setSubmitting] = useState(false)

  function clearConflicts() {
    if (conflicts.length > 0) setConflicts([])
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {}
    if (!title.trim()) nextErrors.title = 'Title is required.'
    if (!startTime) nextErrors.startTime = 'Start time is required.'
    if (!endTime) nextErrors.endTime = 'End time is required.'
    if (startTime && endTime && startTime >= endTime) {
      nextErrors.endTime = 'End time must be after start time.'
    }
    return nextErrors
  }

  async function attemptSubmit(acknowledgeConflict: boolean) {
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (!acknowledgeConflict) {
      const found = findConflicts({ dayOfWeek, startTime, endTime }, existingEntries, initialEntry?.id)
      if (found.length > 0) {
        setConflicts(found)
        return
      }
    }

    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        dayOfWeek,
        startTime,
        endTime,
        location: location.trim() || undefined,
        description: notes.trim() || undefined,
        category: category.trim() || undefined,
        color,
      })
    } finally {
      setSubmitting(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void attemptSubmit(false)
  }

  function handleSaveAnyway() {
    void attemptSubmit(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Title / Subject"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            clearConflicts()
          }}
          placeholder="e.g. Database Management"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <Select
        label="Day"
        value={dayOfWeek}
        onChange={(event) => {
          setDayOfWeek(event.target.value as DayOfWeek)
          clearConflicts()
        }}
      >
        {DAY_OF_WEEK_ORDER.map((day) => (
          <option key={day} value={day}>
            {DAY_OF_WEEK_LABELS[day]}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(event) => {
              setStartTime(event.target.value)
              clearConflicts()
            }}
          />
          {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
        </div>
        <div>
          <Input
            label="End Time"
            type="time"
            value={endTime}
            onChange={(event) => {
              setEndTime(event.target.value)
              clearConflicts()
            }}
          />
          {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
        </div>
      </div>

      <Input
        label="Location / Room"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        placeholder="e.g. Room 302"
      />

      <div>
        <Input
          label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="e.g. Class"
          list={CATEGORY_SUGGESTIONS_ID}
        />
        <datalist id={CATEGORY_SUGGESTIONS_ID}>
          {SCHEDULE_CATEGORY_SUGGESTIONS.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      </div>

      <ColorSwatchPicker value={color} onChange={setColor} />

      <Textarea
        label="Notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Optional notes"
        rows={3}
      />

      {conflicts.length > 0 && (
        <div className="rounded-clay-sm border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 ">
          <p className="font-medium">Schedule conflict detected</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {conflicts.map((conflict) => {
              const overlap = getOverlapRange(startTime, endTime, conflict.startTime, conflict.endTime)
              return (
                <li key={conflict.id}>
                  {title.trim() || 'This entry'} overlaps with {conflict.title} from {overlap.start}–{overlap.end}.
                </li>
              )
            })}
          </ul>
          <p className="mt-2">You can save anyway, or adjust the time.</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        {conflicts.length > 0 ? (
          <Button type="button" variant="danger" onClick={handleSaveAnyway} disabled={submitting}>
            Save Anyway
          </Button>
        ) : (
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : initialEntry ? 'Save Changes' : 'Add Schedule'}
          </Button>
        )}
      </div>
    </form>
  )
}
