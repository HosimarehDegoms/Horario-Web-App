import { Mascot } from '../../../components/illustrations/Mascot'
import { formatDisplayDate } from '../../../utils/date'

interface DateHeaderProps {
  date: Date
  username: string
}

export function DateHeader({ date, username }: DateHeaderProps) {
  return (
    <div className="theme-surface relative overflow-hidden rounded-clay-lg px-5 py-6 sm:px-7 sm:py-7">
      <div className="relative z-10 max-w-[70%]">
        <p className="text-sm font-medium text-primary-100">Welcome back, {username}! 👋</p>
        <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{formatDisplayDate(date)}</h1>
      </div>
      <Mascot
        variant="welcome"
        className="pointer-events-none absolute -right-3 -bottom-5 h-28 w-28 opacity-90 sm:h-32 sm:w-32"
      />
    </div>
  )
}
