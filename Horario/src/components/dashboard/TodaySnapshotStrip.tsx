import { Card } from '../ui/Card'
import { classifyDeadline } from '../../utils/deadlines'
import { DEADLINE_BADGE_VARIANT, DEADLINE_LABELS } from '../../constants/tasks'
import { Badge } from '../ui/Badge'
import type { ProgressSummary } from '../../types/dashboard'
import type { Task } from '../../types/task'

interface TodaySnapshotStripProps {
  dailyProgress: ProgressSummary
  focusMinutesToday: number
  /** Most urgent task to surface — pass the first overdue task, or the first upcoming one if none are overdue. */
  nextDeadline: Task | null
  referenceDate: Date
}

function Tile({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <div className="rounded-clay-sm border border-slate-200 bg-white/90 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      {caption && <p className="mt-1 text-xs text-slate-500">{caption}</p>}
    </div>
  )
}

export function TodaySnapshotStrip({ dailyProgress, focusMinutesToday, nextDeadline, referenceDate }: TodaySnapshotStripProps) {
  const classification = nextDeadline ? classifyDeadline(nextDeadline, referenceDate) : null

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Tile
        label="Tasks Completed Today"
        value={`${dailyProgress.completed}/${dailyProgress.total || 0}`}
        caption={dailyProgress.total === 0 ? 'Nothing due today' : `${dailyProgress.completionRate}% done`}
      />
      <Tile label="Focus Time Today" value={`${focusMinutesToday}m`} caption={focusMinutesToday === 0 ? 'No sessions yet' : 'keep it going'} />
      <Card className="!p-4">
        <p className="text-xs font-medium text-slate-500">Next Deadline</p>
        {nextDeadline ? (
          <>
            <p className="mt-1.5 truncate text-base font-semibold tracking-tight text-slate-900">{nextDeadline.title}</p>
            {classification && (
              <div className="mt-1.5">
                <Badge variant={DEADLINE_BADGE_VARIANT[classification]}>{DEADLINE_LABELS[classification]}</Badge>
              </div>
            )}
          </>
        ) : (
          <p className="mt-1.5 text-sm text-slate-500">Nothing on the horizon</p>
        )}
      </Card>
    </div>
  )
}
