import { Badge } from '../../../components/ui/Badge'
import { EmptyState } from '../../../components/ui/EmptyState'
import { FOCUS_PHASE_LABELS } from '../../../constants/focus'
import type { FocusSession } from '../../../types/focus'

interface FocusSessionHistoryProps {
  sessions: FocusSession[]
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function FocusSessionHistory({ sessions }: FocusSessionHistoryProps) {
  if (sessions.length === 0) {
    return <EmptyState title="No sessions yet" description="Completed and skipped sessions will show up here." />
  }

  return (
    <ul className="stagger-list max-h-80 space-y-1.5 overflow-y-auto">
      {sessions.slice(0, 30).map((session) => (
        <li
          key={session.id}
          className="flex items-center justify-between gap-2 rounded-clay-sm border border-white/60 bg-white px-3 py-2 text-sm shadow-clay"
        >
          <div className="flex min-w-0 items-center gap-2">
            <Badge variant={session.phase === 'focus' ? 'success' : 'neutral'}>
              {FOCUS_PHASE_LABELS[session.phase]}
            </Badge>
            <span className="truncate text-slate-600">{formatTimestamp(session.endedAt)}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-slate-500">{session.durationMinutes}m</span>
            {!session.completed && <Badge variant="warning">Skipped</Badge>}
          </div>
        </li>
      ))}
    </ul>
  )
}
