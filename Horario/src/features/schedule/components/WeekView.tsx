import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { TimeGridTable } from './templates/TimeGridTable'
import { SpreadsheetTable } from './templates/SpreadsheetTable'
import { FlatScheduleTable } from './templates/FlatScheduleTable'
import { DayPlannerTables } from './templates/DayPlannerTables'
import { useTimetableTemplateStyle } from '../useTimetableTemplateStyle'
import type { ScheduleEntry } from '../../../types/schedule'

interface WeekViewProps {
  entries: ScheduleEntry[]
  onEdit: (entry: ScheduleEntry) => void
  onDelete: (entry: ScheduleEntry) => void
}

export function WeekView({ entries, onEdit, onDelete }: WeekViewProps) {
  const style = useTimetableTemplateStyle()

  if (entries.length === 0) {
    return (
      <Card title="This Week">
        <EmptyState
          title="No schedule yet"
          description="Add your first schedule entry to get started."
          illustration="schedule"
        />
      </Card>
    )
  }

  if (style.tableFormat === 'flat_table') {
    return <FlatScheduleTable entries={entries} onEdit={onEdit} onDelete={onDelete} density={style.density} />
  }

  if (style.tableFormat === 'day_tables') {
    return <DayPlannerTables entries={entries} onEdit={onEdit} onDelete={onDelete} />
  }

  if (style.tableFormat === 'spreadsheet') {
    return <SpreadsheetTable entries={entries} onEdit={onEdit} onDelete={onDelete} />
  }

  return <TimeGridTable entries={entries} onEdit={onEdit} onDelete={onDelete} vivid={style.vivid} />
}
