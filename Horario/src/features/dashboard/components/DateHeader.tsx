import { formatDisplayDate } from '../../../utils/date'

interface DateHeaderProps {
  date: Date
  username: string
}

export function DateHeader({ date, username }: DateHeaderProps) {
  return (
    <div>
      <p className="text-sm font-medium text-indigo-600">Welcome back, {username}! 👋</p>
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{formatDisplayDate(date)}</h1>
    </div>
  )
}
