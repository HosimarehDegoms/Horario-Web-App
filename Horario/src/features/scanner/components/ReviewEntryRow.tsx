import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import { Badge } from '../../../components/ui/Badge'
import { ConfidenceBadge } from './ConfidenceBadge'
import { DAY_OF_WEEK_LABELS, DAY_OF_WEEK_ORDER } from '../../../constants/schedule'
import { isScannedEntryComplete } from '../../../utils/scanValidation'
import type { ScannedScheduleEntry } from '../../../types/scan'
import type { DayOfWeek, ScheduleEntry } from '../../../types/schedule'

interface ReviewEntryRowProps {
  entry: ScannedScheduleEntry
  conflicts: ScheduleEntry[]
  onChange: (patch: Partial<ScannedScheduleEntry>) => void
  onRemove: () => void
}

export function ReviewEntryRow({ entry, conflicts, onChange, onRemove }: ReviewEntryRowProps) {
  const isComplete = isScannedEntryComplete(entry)

  return (
    <li className="rounded-clay-sm border border-white/60 bg-white p-4 shadow-clay">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ConfidenceBadge confidence={entry.confidence} />
        <button type="button" onClick={onRemove} className="text-xs font-medium text-red-500 hover:underline">
          Remove
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Title / Subject" value={entry.title} onChange={(event) => onChange({ title: event.target.value })} />
        <Select
          label="Day"
          value={entry.dayOfWeek ?? ''}
          onChange={(event) => onChange({ dayOfWeek: (event.target.value || null) as DayOfWeek | null })}
        >
          <option value="">Select a day…</option>
          {DAY_OF_WEEK_ORDER.map((day) => (
            <option key={day} value={day}>
              {DAY_OF_WEEK_LABELS[day]}
            </option>
          ))}
        </Select>
        <Input
          label="Start Time"
          type="time"
          value={entry.startTime ?? ''}
          onChange={(event) => onChange({ startTime: event.target.value || null })}
        />
        <Input
          label="End Time"
          type="time"
          value={entry.endTime ?? ''}
          onChange={(event) => onChange({ endTime: event.target.value || null })}
        />
        <Input
          label="Location / Room"
          value={entry.location ?? ''}
          onChange={(event) => onChange({ location: event.target.value })}
        />
      </div>

      <div className="mt-3">
        <Textarea
          label="Notes"
          value={entry.notes ?? ''}
          onChange={(event) => onChange({ notes: event.target.value })}
          rows={2}
        />
      </div>

      {!isComplete && (
        <p className="mt-2 text-sm text-red-600">Title, day, start time, and end time are required before saving.</p>
      )}

      {conflicts.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {conflicts.map((conflict) => (
            <Badge key={conflict.id} variant="danger">
              Conflicts with {conflict.title}
            </Badge>
          ))}
        </div>
      )}
    </li>
  )
}
