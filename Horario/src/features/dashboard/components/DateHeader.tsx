import { Link } from 'react-router-dom'
import { Mascot } from '../../../components/illustrations/Mascot'
import { formatDisplayDate } from '../../../utils/date'

interface DateHeaderProps {
  date: Date
  username: string
}

const QUICK_ACTION_CLASS =
  'flex min-h-11 items-center rounded-clay-sm border border-slate-200 bg-white/90 px-3.5 text-xs font-medium text-slate-700 transition-colors duration-150 hover:border-slate-300 hover:bg-white'

export function DateHeader({ date, username }: DateHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-slate-200 pt-2 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="relative z-10 max-w-[70%]">
          <p className="text-sm font-medium text-slate-500">Welcome back, {username}</p>
          <h1 className="mt-1 text-3xl leading-tight font-semibold text-slate-900 sm:text-4xl">{formatDisplayDate(date)}</h1>
        </div>
        <div className="relative z-10 flex shrink-0 gap-2">
          <Link to="/tasks" className={QUICK_ACTION_CLASS}>
            + Task
          </Link>
          <Link to="/schedule" className={QUICK_ACTION_CLASS}>
            + Schedule
          </Link>
        </div>
      </div>
      <Mascot
        variant="welcome"
        className="pointer-events-none absolute right-0 -bottom-2 h-24 w-24 sm:h-28 sm:w-28"
      />
    </div>
  )
}
