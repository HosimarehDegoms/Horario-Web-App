import { useMemo } from 'react'
import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ScheduleCard } from '../../../components/schedule/ScheduleCard'
import { DAY_OF_WEEK_LABELS, DAY_OF_WEEK_ORDER } from '../../../constants/schedule'
import type { DayOfWeek, ScheduleEntry } from '../../../types/schedule'

interface WeekViewProps {
  entries: ScheduleEntry[]
  onEdit: (entry: ScheduleEntry) => void
  onDelete: (entry: ScheduleEntry) => void
}

export function WeekView({ entries, onEdit, onDelete }: WeekViewProps) {
  const entriesByDay = useMemo(() => {
    const grouped = new Map<DayOfWeek, ScheduleEntry[]>()
    for (const day of DAY_OF_WEEK_ORDER) grouped.set(day, [])
    for (const entry of entries) {
      grouped.get(entry.dayOfWeek)?.push(entry)
    }
    for (const list of grouped.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime))
    }
    return grouped
  }, [entries])

  if (entries.length === 0) {
    return (
      <Card title="This Week">
        <EmptyState title="No schedule yet" description="Add one manually or scan your printed schedule." />
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
      {DAY_OF_WEEK_ORDER.map((day) => {
        const dayEntries = entriesByDay.get(day) ?? []
        return (
          <Card key={day} title={DAY_OF_WEEK_LABELS[day]}>
            {dayEntries.length === 0 ? (
              <p className="text-sm text-slate-400">No classes</p>
            ) : (
              <ul className="space-y-2">
                {dayEntries.map((entry) => (
                  <ScheduleCard
                    key={entry.id}
                    entry={entry}
                    onEdit={() => onEdit(entry)}
                    onDelete={() => onDelete(entry)}
                  />
                ))}
              </ul>
            )}
          </Card>
        )
      })}
    </div>
  )
}
