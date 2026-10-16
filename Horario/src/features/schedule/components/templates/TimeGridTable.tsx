import { useMemo } from 'react'
import { DAY_OF_WEEK_LABELS, DAY_OF_WEEK_ORDER, DAY_OF_WEEK_SHORT_LABELS } from '../../../../constants/schedule'
import { formatTime12h } from '../../../../utils/date'
import { computeTimeGridBounds, getHourMarks, timeToMinutes } from '../../timeGrid'
import type { DayOfWeek, ScheduleEntry } from '../../../../types/schedule'

const PIXELS_PER_MINUTE = 1.5
const MIN_BLOCK_HEIGHT = 20
/** Below this block height, only the title fits — time/location lines are dropped. */
const DETAIL_HEIGHT_THRESHOLD = 44

interface TimeGridTableProps {
  entries: ScheduleEntry[]
  onEdit: (entry: ScheduleEntry) => void
  onDelete: (entry: ScheduleEntry) => void
  vivid?: boolean
}

function hourLabel(minute: number): string {
  return formatTime12h(`${String(Math.floor(minute / 60)).padStart(2, '0')}:00`)
}

export function TimeGridTable({ entries, onEdit, onDelete, vivid = false }: TimeGridTableProps) {
  const bounds = useMemo(() => computeTimeGridBounds(entries), [entries])
  const hourMarks = useMemo(() => getHourMarks(bounds), [bounds])
  const totalHeight = (bounds.endMinutes - bounds.startMinutes) * PIXELS_PER_MINUTE

  const entriesByDay = useMemo(() => {
    const grouped = new Map<DayOfWeek, ScheduleEntry[]>()
    for (const day of DAY_OF_WEEK_ORDER) grouped.set(day, [])
    for (const entry of entries) grouped.get(entry.dayOfWeek)?.push(entry)
    return grouped
  }, [entries])

  return (
    <div className="overflow-x-auto rounded-clay-sm border border-white/60 bg-white shadow-clay">
      <div className="flex min-w-[720px]">
        <div className="w-14 shrink-0 border-r border-slate-100">
          <div className="h-9 border-b border-slate-100" />
          <div className="relative" style={{ height: totalHeight }}>
            {hourMarks.map((minute) => (
              <span
                key={minute}
                className="absolute right-2 -translate-y-1/2 text-[11px] text-slate-400"
                style={{ top: (minute - bounds.startMinutes) * PIXELS_PER_MINUTE }}
              >
                {hourLabel(minute)}
              </span>
            ))}
          </div>
        </div>

        {DAY_OF_WEEK_ORDER.map((day) => (
          <div key={day} className="flex-1 border-r border-slate-100 last:border-r-0">
            <div className="flex h-9 items-center justify-center border-b border-slate-100 text-xs font-semibold text-slate-600">
              <span className="sm:hidden">{DAY_OF_WEEK_SHORT_LABELS[day]}</span>
              <span className="hidden sm:inline">{DAY_OF_WEEK_LABELS[day]}</span>
            </div>
            <div className="relative" style={{ height: totalHeight }}>
              {hourMarks.map((minute) => (
                <div
                  key={minute}
                  className="absolute inset-x-0 border-t border-slate-100"
                  style={{ top: (minute - bounds.startMinutes) * PIXELS_PER_MINUTE }}
                  aria-hidden="true"
                />
              ))}

              {(entriesByDay.get(day) ?? []).map((entry) => {
                const startMinutes = timeToMinutes(entry.startTime)
                const endMinutes = timeToMinutes(entry.endTime)
                const top = (startMinutes - bounds.startMinutes) * PIXELS_PER_MINUTE
                const height = Math.max(MIN_BLOCK_HEIGHT, (endMinutes - startMinutes) * PIXELS_PER_MINUTE)
                const showDetail = height >= DETAIL_HEIGHT_THRESHOLD
                const color = entry.color ?? '#818cf8'
                const accessibleLabel = `${entry.title}, ${formatTime12h(entry.startTime)} to ${formatTime12h(entry.endTime)}${entry.location ? `, ${entry.location}` : ''}`

                return (
                  <div
                    key={entry.id}
                    className="group absolute inset-x-0.5 overflow-hidden rounded-md shadow-sm transition-[transform,box-shadow] duration-150 ease-clay hover:z-10 hover:-translate-y-0.5 hover:shadow-clay-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    style={{ top, height, backgroundColor: vivid ? color : `${color}26`, borderLeft: `3px solid ${color}` }}
                  >
                    <button
                      type="button"
                      onClick={() => onEdit(entry)}
                      aria-label={accessibleLabel}
                      className="block h-full w-full px-1.5 py-1 text-left"
                    >
                      {showDetail && (
                        <p className={`truncate text-[10px] font-bold ${vivid ? 'text-white' : 'text-slate-900'}`}>
                          {formatTime12h(entry.startTime)}–{formatTime12h(entry.endTime)}
                        </p>
                      )}
                      <p className={`truncate text-[11px] font-medium ${vivid ? 'text-white/90' : 'text-slate-700'}`}>
                        {entry.title}
                      </p>
                      {showDetail && entry.location && (
                        <p className={`truncate text-[10px] ${vivid ? 'text-white/75' : 'text-slate-500'}`}>
                          {entry.location}
                        </p>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(entry)}
                      aria-label={`Delete ${entry.title}`}
                      className={`absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] leading-none opacity-70 transition-opacity duration-150 hover:opacity-100 ${vivid ? 'bg-black/25 text-white' : 'bg-slate-900/15 text-slate-700'}`}
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
