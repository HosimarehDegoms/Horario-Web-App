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
      <div role="group" aria-label="Day of week" className="mb-5 flex gap-1.5 overflow-x-auto pb-1">
        {DAY_OF_WEEK_ORDER.map((day) => (
          <button
            key={day}
            type="button"
            aria-pressed={day === selectedDay}
            onClick={() => setSelectedDay(day)}
            className={`min-h-10 min-w-12 shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
              day === selectedDay
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            {DAY_OF_WEEK_SHORT_LABELS[day]}
          </button>
        ))}
      </div>

      {dayEntries.length === 0 ? (
        <EmptyState
          title="No schedule yet"
          description="Add your first schedule entry to get started."
          illustration="schedule"
        />
      ) : (
        <ul className="stagger-list space-y-2">
          {dayEntries.map((entry) => (
            <ScheduleCard key={entry.id} entry={entry} onEdit={() => onEdit(entry)} onDelete={() => onDelete(entry)} />
          ))}
        </ul>
      )}
    </Card>
  )
}
