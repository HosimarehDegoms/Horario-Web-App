import { useMemo } from 'react'
import { DAY_OF_WEEK_LABELS, DAY_OF_WEEK_ORDER, DAY_OF_WEEK_SHORT_LABELS } from '../../../../constants/schedule'
import { formatTime12h, getDayOfWeek } from '../../../../utils/date'
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

  const today = getDayOfWeek(new Date())

  const entriesByDay = useMemo(() => {
    const grouped = new Map<DayOfWeek, ScheduleEntry[]>()
    for (const day of DAY_OF_WEEK_ORDER) grouped.set(day, [])
    for (const entry of entries) grouped.get(entry.dayOfWeek)?.push(entry)
    return grouped
  }, [entries])

  return (
    <div className="overflow-x-auto rounded-clay-sm border border-slate-200 bg-white shadow-clay">
      <div className="flex min-w-[720px]">
        <div className="w-14 shrink-0 border-r border-slate-200">
          <div className="h-10 border-b border-slate-200" />
          <div className="relative" style={{ height: totalHeight }}>
            {hourMarks.map((minute) => (
              <span
                key={minute}
                className="absolute right-2 -translate-y-1/2 text-xs text-slate-500 tabular-nums"
                style={{ top: (minute - bounds.startMinutes) * PIXELS_PER_MINUTE }}
              >
                {hourLabel(minute)}
              </span>
            ))}
          </div>
        </div>

        {DAY_OF_WEEK_ORDER.map((day) => (
          <div
            key={day}
            className={`flex-1 border-r border-slate-200 last:border-r-0 ${day === today ? 'bg-primary-50/50' : ''}`}
          >
            <div className="flex h-10 items-center justify-center gap-1.5 border-b border-slate-200 text-xs font-semibold tracking-wide text-slate-600">
              <span className="sm:hidden">{DAY_OF_WEEK_SHORT_LABELS[day]}</span>
              <span className="hidden sm:inline">{DAY_OF_WEEK_LABELS[day]}</span>
              {day === today && <span className="size-1.5 rounded-full bg-primary-600" aria-label="Today" />}
            </div>
            <div className="relative" style={{ height: totalHeight }}>
              {hourMarks.map((minute) => (
                <div
                  key={minute}
                  className="absolute inset-x-0 border-t border-slate-200/70"
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
                    className="group absolute inset-x-0.5 overflow-hidden rounded-md transition-shadow duration-150 ease-clay focus-within:z-10 hover:z-10 hover:shadow-clay-hover motion-reduce:transition-none"
                    style={{ top, height, backgroundColor: vivid ? color : `${color}26`, borderLeft: `3px solid ${color}` }}
                  >
                    <button
                      type="button"
                      onClick={() => onEdit(entry)}
                      aria-label={accessibleLabel}
                      className="block h-full w-full cursor-pointer px-1.5 py-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600"
                    >
                      {showDetail && (
                        <p className={`truncate text-[11px] font-semibold tabular-nums ${vivid ? 'text-white' : 'text-slate-900'}`}>
                          {formatTime12h(entry.startTime)}–{formatTime12h(entry.endTime)}
                        </p>
                      )}
                      <p className={`truncate text-xs font-medium ${vivid ? 'text-white' : 'text-slate-800'}`}>
                        {entry.title}
                      </p>
                      {showDetail && entry.location && (
                        <p className={`truncate text-[11px] ${vivid ? 'text-white/85' : 'text-slate-600'}`}>
                          {entry.location}
                        </p>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(entry)}
                      aria-label={`Delete ${entry.title}`}
                      className={`absolute top-0 right-0 flex size-6 cursor-pointer items-center justify-center rounded-md text-sm leading-none opacity-0 transition-opacity duration-150 group-hover:opacity-80 group-focus-within:opacity-80 hover:!opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 [@media(hover:none)]:opacity-70 ${vivid ? 'bg-black/25 text-white' : 'bg-slate-900/15 text-slate-700'}`}
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
