import { useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ScheduleCard } from '../../../components/schedule/ScheduleCard'
import { DAY_OF_WEEK_LABELS, DAY_OF_WEEK_ORDER, DAY_OF_WEEK_SHORT_LABELS } from '../../../constants/schedule'
import { getDayOfWeek } from '../../../utils/date'
import type { DayOfWeek, ScheduleEntry } from '../../../types/schedule'

interface DayViewProps {
  entries: ScheduleEntry[]
  onEdit: (entry: ScheduleEntry) => void
  onDelete: (entry: ScheduleEntry) => void
}

export function DayView({ entries, onEdit, onDelete }: DayViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => getDayOfWeek(new Date()))

  const dayEntries = useMemo(
    () =>
      entries
        .filter((entry) => entry.dayOfWeek === selectedDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [entries, selectedDay],
  )

  return (
    <Card title={DAY_OF_WEEK_LABELS[selectedDay]}>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {DAY_OF_WEEK_ORDER.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-[background-color,box-shadow,transform] duration-200 ease-clay motion-reduce:transition-none ${
              day === selectedDay
                ? 'bg-primary-600 text-white shadow-clay'
                : 'bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:bg-slate-200'
            }`}
          >
            {DAY_OF_WEEK_SHORT_LABELS[day]}
          </button>
        ))}
      </div>

      {dayEntries.length === 0 ? (
        <EmptyState title="No schedule yet" description="Add one manually or scan your printed schedule." />
      ) : (
        <ul className="space-y-2">
          {dayEntries.map((entry) => (
            <ScheduleCard key={entry.id} entry={entry} onEdit={() => onEdit(entry)} onDelete={() => onDelete(entry)} />
          ))}
        </ul>
      )}
    </Card>
  )
}
