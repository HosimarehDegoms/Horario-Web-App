import { useMemo } from 'react'
import { DAY_OF_WEEK_LABELS, DAY_OF_WEEK_ORDER } from '../../../../constants/schedule'
import { formatTime12h } from '../../../../utils/date'
import type { DayOfWeek, ScheduleEntry } from '../../../../types/schedule'

interface DayPlannerTablesProps {
  entries: ScheduleEntry[]
  onEdit: (entry: ScheduleEntry) => void
  onDelete: (entry: ScheduleEntry) => void
}

export function DayPlannerTables({ entries, onEdit, onDelete }: DayPlannerTablesProps) {
  const entriesByDay = useMemo(() => {
    const grouped = new Map<DayOfWeek, ScheduleEntry[]>()
    for (const day of DAY_OF_WEEK_ORDER) grouped.set(day, [])
    for (const entry of entries) grouped.get(entry.dayOfWeek)?.push(entry)
    for (const list of grouped.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime))
    }
    return grouped
  }, [entries])

  return (
    <div className="rounded-clay border-2 border-sky-200 bg-sky-50/50 p-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DAY_OF_WEEK_ORDER.map((day) => {
          const dayEntries = entriesByDay.get(day) ?? []
          return (
            <div
              key={day}
              className="overflow-hidden rounded-clay-sm border-l-4 border-sky-300 bg-white shadow-clay-inset"
            >
              <div className="border-b border-sky-200/60 bg-sky-100/60 px-3 py-2 text-sm font-semibold text-sky-900">
                {DAY_OF_WEEK_LABELS[day]}
              </div>
              {dayEntries.length === 0 ? (
                <p className="px-3 py-3 text-xs text-sky-700/60">No classes</p>
              ) : (
                <table className="w-full text-xs">
                  <tbody>
                    {dayEntries.map((entry) => (
                      <tr key={entry.id} className="border-b border-sky-100 last:border-b-0">
                        <td className="w-20 px-3 py-2 align-top text-sky-700">{formatTime12h(entry.startTime)}</td>
                        <td className="px-1 py-2 align-top">
                          <p className="font-medium text-sky-950">{entry.title}</p>
                          {entry.location && <p className="text-sky-700/80">{entry.location}</p>}
                        </td>
                        <td className="px-2 py-2 text-right align-top">
                          <button
                            type="button"
                            onClick={() => onEdit(entry)}
                            aria-label={`Edit ${entry.title}`}
                            className="px-1 text-sky-700 transition-colors duration-150 hover:text-sky-900"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(entry)}
                            aria-label={`Delete ${entry.title}`}
                            className="px-1 text-red-500 transition-colors duration-150 hover:text-red-700"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
