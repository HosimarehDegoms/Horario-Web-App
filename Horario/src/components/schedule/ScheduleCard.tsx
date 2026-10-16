import { useTimetableTemplateStyle } from '../../features/schedule/useTimetableTemplateStyle'
import type { ScheduleEntry } from '../../types/schedule'

interface ScheduleCardProps {
  entry: ScheduleEntry
  onEdit?: () => void
  onDelete?: () => void
}

function withAlpha(hex: string, alpha: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alpha}` : hex
}

export function ScheduleCard({ entry, onEdit, onDelete }: ScheduleCardProps) {
  const style = useTimetableTemplateStyle()
  const color = entry.color ?? '#818cf8'
  const isCompact = style.density === 'compact'

  return (
    <li
      className={`rounded-clay-sm transition-[transform,box-shadow] duration-200 ease-clay hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${isCompact ? 'p-2' : 'p-3'} ${style.cardClassName}`}
      style={style.tinted ? { backgroundColor: withAlpha(color, '1f') } : undefined}
    >
      <div className="flex items-start gap-2">
        {style.showColorDot && (
          <span
            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full shadow-sm"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className={`font-medium text-slate-900 ${isCompact ? 'text-xs' : 'text-sm'}`}>{entry.title}</p>
          <p className={`text-slate-500 ${isCompact ? 'text-[11px]' : 'text-xs'}`}>
            {entry.startTime}–{entry.endTime}
            {entry.location ? ` · ${entry.location}` : ''}
          </p>
          {entry.description && !isCompact && <p className="mt-1 text-xs text-slate-400">{entry.description}</p>}
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
