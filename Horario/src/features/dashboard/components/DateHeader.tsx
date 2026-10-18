import { Mascot } from '../../../components/illustrations/Mascot'
import { formatDisplayDate } from '../../../utils/date'

interface DateHeaderProps {
  date: Date
  username: string
}

export function DateHeader({ date, username }: DateHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-slate-200 pt-2 pb-6">
      <div className="relative z-10 max-w-[70%]">
        <p className="text-sm font-medium text-slate-500">Welcome back, {username}</p>
        <h1 className="mt-1 text-3xl leading-tight font-semibold text-slate-900 sm:text-4xl">{formatDisplayDate(date)}</h1>
      </div>
      <Mascot
        variant="welcome"
        className="pointer-events-none absolute right-0 -bottom-2 h-24 w-24 sm:h-28 sm:w-28"
      />
    </div>
  )
}
