import { useMemo } from 'react'
import { DAY_OF_WEEK_LABELS, DAY_OF_WEEK_ORDER, DAY_OF_WEEK_SHORT_LABELS } from '../../../../constants/schedule'
import { formatTime12h } from '../../../../utils/date'
import { buildSpreadsheetGrid, computeTimeGridBounds, minutesToTime } from '../../timeGrid'
import type { DayOfWeek, ScheduleEntry } from '../../../../types/schedule'

const ROW_MINUTES = 30

const DAY_HEADER_COLORS: Record<DayOfWeek, string> = {
  sunday: '#cbd5e1',
  monday: '#fca5a5',
  tuesday: '#fde68a',
  wednesday: '#86efac',
  thursday: '#7dd3fc',
  friday: '#d8b4fe',
  saturday: '#cbd5e1',
}

interface SpreadsheetTableProps {
  entries: ScheduleEntry[]
  onEdit: (entry: ScheduleEntry) => void
  onDelete: (entry: ScheduleEntry) => void
}

export function SpreadsheetTable({ entries, onEdit, onDelete }: SpreadsheetTableProps) {
  const bounds = useMemo(() => computeTimeGridBounds(entries), [entries])
  const grid = useMemo(() => buildSpreadsheetGrid(entries, bounds, ROW_MINUTES), [entries, bounds])
  const rowCount = Math.max(1, Math.round((bounds.endMinutes - bounds.startMinutes) / ROW_MINUTES))
  const rowStarts = useMemo(
    () => Array.from({ length: rowCount }, (_, index) => bounds.startMinutes + index * ROW_MINUTES),
    [rowCount, bounds.startMinutes],
  )

  return (
    <div className="overflow-x-auto rounded-clay-sm border border-white/60 bg-white shadow-clay">
      <table className="w-full min-w-[720px] border-collapse text-xs">
        <thead>
          <tr>
            <th className="w-24 border border-slate-200 bg-slate-50 px-2 py-2 text-left font-semibold text-slate-500">
              Time
            </th>
            {DAY_OF_WEEK_ORDER.map((day) => (
              <th
                key={day}
                className="border border-slate-200 px-2 py-2 text-center font-semibold text-slate-900"
                style={{ backgroundColor: DAY_HEADER_COLORS[day] }}
              >
                <span className="sm:hidden">{DAY_OF_WEEK_SHORT_LABELS[day]}</span>
                <span className="hidden sm:inline">{DAY_OF_WEEK_LABELS[day]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowStarts.map((rowStart, rowIndex) => (
            <tr key={rowStart}>
              <td className="whitespace-nowrap border border-slate-200 px-2 py-1.5 text-slate-500">
                {formatTime12h(minutesToTime(rowStart))}–{formatTime12h(minutesToTime(rowStart + ROW_MINUTES))}
              </td>
              {DAY_OF_WEEK_ORDER.map((day) => {
                const cell = grid.get(day)?.[rowIndex]
                if (!cell || cell.skip) return null

                if (!cell.entry) {
                  return <td key={day} className="border border-slate-200" />
                }

                const entry = cell.entry
                const color = entry.color ?? '#818cf8'
                return (
                  <td key={day} rowSpan={cell.rowSpan} className="border border-slate-200 p-0 align-top">
                    <div className="group relative h-full min-h-[2.25rem]">
                      <button
                        type="button"
                        onClick={() => onEdit(entry)}
                        className="block h-full w-full px-2 py-1.5 text-left"
                        style={{ backgroundColor: `${color}26` }}
                      >
                        <p className="truncate font-semibold text-slate-900">{entry.title}</p>
                        <p className="truncate text-[10px] text-slate-500">
                          {entry.startTime}–{entry.endTime}
                          {entry.location ? ` · ${entry.location}` : ''}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(entry)}
                        aria-label={`Delete ${entry.title}`}
                        className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900/15 text-[9px] leading-none text-slate-700 opacity-70 transition-opacity duration-150 hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
