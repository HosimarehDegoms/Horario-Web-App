import { useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { DAY_OF_WEEK_SHORT_LABELS } from '../../../constants/schedule'
import { addDays, getDayOfWeek, getWeekRange, isSameDay } from '../../../utils/date'
import type { ScheduleEntry } from '../../../types/schedule'
import type { Task } from '../../../types/task'

interface MonthViewProps {
  entries: ScheduleEntry[]
  tasks: Task[]
  referenceDate: Date
}

const MAX_CHIPS_PER_DAY = 3
const PRIORITY_DOT_CLASS = { low: 'bg-slate-400', medium: 'bg-amber-500', high: 'bg-red-500' } as const

function buildMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = new Date(year, month + 1, 0)
  const gridStart = getWeekRange(firstOfMonth).start
  const gridEnd = getWeekRange(lastOfMonth).end

  const days: Date[] = []
  for (let cursor = gridStart; cursor.getTime() <= gridEnd.getTime(); cursor = addDays(cursor, 1)) {
    days.push(cursor)
  }
  return days
}

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })

export function MonthView({ entries, tasks, referenceDate }: MonthViewProps) {
  const [cursor, setCursor] = useState(() => new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1))

  const days = useMemo(() => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])
  const today = useMemo(() => new Date(), [])

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
          className="rounded-md min-h-9 px-3 py-1 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Previous month"
        >
          ←
        </button>
        <h3 className="text-sm font-semibold text-slate-900">{MONTH_LABEL_FORMATTER.format(cursor)}</h3>
        <button
          type="button"
          onClick={() => setCursor((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
          className="rounded-md min-h-9 px-3 py-1 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400">
        {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
          <div key={day} className="py-1">
            {DAY_OF_WEEK_SHORT_LABELS[day]}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const isCurrentMonth = date.getMonth() === cursor.getMonth()
          const isToday = isSameDay(date, today)
          const dayEntries = entries.filter((entry) => entry.dayOfWeek === getDayOfWeek(date))
          const dayTasks = tasks.filter((task) => isSameDay(new Date(task.deadline), date))
          const overflow = dayEntries.length + dayTasks.length - MAX_CHIPS_PER_DAY

          return (
            <div
              key={date.toISOString()}
              className={`min-h-[5.5rem] rounded-clay-sm border p-1 text-left align-top ${
                isCurrentMonth ? 'border-slate-200 bg-white' : 'border-transparent bg-slate-50/60'
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium ${
                  isToday
                    ? 'bg-primary-600 text-white'
                    : isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-300'
                }`}
              >
                {date.getDate()}
              </span>

              <div className="mt-1 space-y-0.5">
                {dayEntries.slice(0, MAX_CHIPS_PER_DAY).map((entry) => (
                  <div key={entry.id} className="flex items-center gap-1 truncate text-[10px] text-slate-600">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: entry.color || '#818cf8' }}
                    />
                    <span className="truncate">{entry.title}</span>
                  </div>
                ))}
                {dayEntries.length < MAX_CHIPS_PER_DAY &&
                  dayTasks.slice(0, MAX_CHIPS_PER_DAY - dayEntries.length).map((task) => (
                    <div key={task.id} className="flex items-center gap-1 truncate text-[10px] text-slate-600">
                      <span className={`h-1.5 w-1.5 shrink-0 ${PRIORITY_DOT_CLASS[task.priority]}`} />
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                {overflow > 0 && <p className="text-[10px] text-slate-400">+{overflow} more</p>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" /> Schedule
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 bg-amber-500" /> Task deadline
        </span>
      </div>
    </Card>
  )
}
