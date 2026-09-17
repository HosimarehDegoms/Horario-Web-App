import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { ReviewEntryRow } from './ReviewEntryRow'
import { isScannedEntryComplete } from '../../../utils/scanValidation'
import type { ScannedScheduleEntry } from '../../../types/scan'
import type { ScheduleEntry } from '../../../types/schedule'

interface ReviewTableProps {
  entries: ScannedScheduleEntry[]
  getConflicts: (entry: ScannedScheduleEntry) => ScheduleEntry[]
  onChange: (id: string, patch: Partial<ScannedScheduleEntry>) => void
  onRemove: (id: string) => void
  onCancel: () => void
  onConfirm: () => void
}

export function ReviewTable({ entries, getConflicts, onChange, onRemove, onCancel, onConfirm }: ReviewTableProps) {
  const allComplete = entries.length > 0 && entries.every(isScannedEntryComplete)
  const conflictCount = entries.filter((entry) => getConflicts(entry).length > 0).length

  return (
    <Card title={`Review Detected Entries (${entries.length})`}>
      <p className="mb-4 text-sm text-slate-500">
        Check every detected entry before saving. AI results are never saved automatically.
      </p>

      {entries.length === 0 ? (
        <p className="text-sm text-slate-500">All entries removed. Nothing to save.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <ReviewEntryRow
              key={entry.id}
              entry={entry}
              conflicts={getConflicts(entry)}
              onChange={(patch) => onChange(entry.id, patch)}
              onRemove={() => onRemove(entry.id)}
            />
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">
          {allComplete ? `${entries.length} ready to save` : 'Fill in every required field to continue'}
          {conflictCount > 0 && ` · ${conflictCount} with conflicts`}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={!allComplete}>
            Confirm &amp; Save
          </Button>
        </div>
      </div>
    </Card>
  )
}
