import { useMemo } from 'react'
import { DAY_OF_WEEK_ORDER, DAY_OF_WEEK_SHORT_LABELS } from '../../../../constants/schedule'
import { formatTime12h } from '../../../../utils/date'
import type { ScheduleEntry } from '../../../../types/schedule'

interface FlatScheduleTableProps {
  entries: ScheduleEntry[]
  onEdit: (entry: ScheduleEntry) => void
  onDelete: (entry: ScheduleEntry) => void
  density: 'cozy' | 'compact'
}

export function FlatScheduleTable({ entries, onEdit, onDelete, density }: FlatScheduleTableProps) {
  const isCompact = density === 'compact'
  const cellPadding = isCompact ? 'px-2 py-1.5' : 'px-3 py-2.5'

  const sortedEntries = useMemo(
    () =>
      [...entries].sort((a, b) => {
        const dayDiff = DAY_OF_WEEK_ORDER.indexOf(a.dayOfWeek) - DAY_OF_WEEK_ORDER.indexOf(b.dayOfWeek)
        return dayDiff !== 0 ? dayDiff : a.startTime.localeCompare(b.startTime)
      }),
    [entries],
  )

  return (
    <div className="overflow-x-auto rounded-clay-sm border border-slate-200 bg-white shadow-clay">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className={cellPadding}>Day</th>
            <th className={cellPadding}>Time</th>
            <th className={cellPadding}>Subject</th>
            <th className={cellPadding}>Room</th>
            <th className={cellPadding} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry) => (
            <tr key={entry.id} className="border-b border-slate-100 transition-colors duration-150 last:border-b-0 hover:bg-slate-50">
              <td className={`${cellPadding} whitespace-nowrap text-slate-500`}>{DAY_OF_WEEK_SHORT_LABELS[entry.dayOfWeek]}</td>
              <td className={`${cellPadding} whitespace-nowrap text-slate-700`}>
                {formatTime12h(entry.startTime)}–{formatTime12h(entry.endTime)}
              </td>
              <td className={cellPadding}>
                <p className="font-medium text-slate-900">{entry.title}</p>
                {!isCompact && entry.description && <p className="text-xs text-slate-400">{entry.description}</p>}
              </td>
              <td className={`${cellPadding} text-slate-500`}>{entry.location ?? '—'}</td>
              <td className={`${cellPadding} text-right`}>
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(entry)}
                    className="min-h-8 rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry)}
                    className="min-h-8 rounded-md px-2.5 py-1 text-xs font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
