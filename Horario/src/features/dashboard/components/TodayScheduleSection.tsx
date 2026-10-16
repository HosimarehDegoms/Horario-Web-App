import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ScheduleCard } from '../../../components/schedule/ScheduleCard'
import type { ScheduleEntry } from '../../../types/schedule'

interface TodayScheduleSectionProps {
  entries: ScheduleEntry[]
}

export function TodayScheduleSection({ entries }: TodayScheduleSectionProps) {
  return (
    <Card title="Today's Schedule">
      {entries.length === 0 ? (
        <EmptyState
          title="No schedule yet"
          description="Add your first schedule entry to get started."
          illustration="schedule"
        />
      ) : (
        <ul className="stagger-list space-y-2">
          {entries.map((entry) => (
            <ScheduleCard key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </Card>
  )
}
