import type { ScheduleEntry } from '../../types/schedule'

interface ScheduleCardProps {
  entry: ScheduleEntry
  onEdit?: () => void
  onDelete?: () => void
}

export function ScheduleCard({ entry, onEdit, onDelete }: ScheduleCardProps) {
  return (
    <li className="rounded-clay-sm border border-white/60 bg-white p-3 shadow-clay transition-[transform,box-shadow] duration-200 ease-clay hover:-translate-y-0.5 hover:shadow-clay-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="flex items-start gap-2">
        <span
          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full shadow-sm"
          style={{ backgroundColor: entry.color ?? '#818cf8' }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900">{entry.title}</p>
          <p className="text-xs text-slate-500">
            {entry.startTime}–{entry.endTime}
            {entry.location ? ` · ${entry.location}` : ''}
          </p>
          {entry.description && <p className="mt-1 text-xs text-slate-400">{entry.description}</p>}
        </div>
      </div>
      {(onEdit || onDelete) && (
        <div className="mt-2 flex flex-wrap justify-end gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-red-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-700"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </li>
  )
}
