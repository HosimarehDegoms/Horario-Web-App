import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_ORDER,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from '../../../constants/tasks'
import type { TaskFilters, TaskViewFilter } from '../../../utils/taskFilters'

const VIEW_TABS: { value: TaskViewFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
]

interface TaskFilterBarProps {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
}

export function TaskFilterBar({ filters, onChange }: TaskFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {VIEW_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange({ ...filters, view: tab.value })}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-[background-color,box-shadow,transform] duration-200 ease-clay motion-reduce:transition-none ${
              filters.view === tab.value
                ? 'bg-primary-600 text-white shadow-clay'
                : 'bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          label="Search tasks"
          hideLabel
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
        <Select
          label="Status"
          hideLabel
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value as TaskFilters['status'] })}
        >
          <option value="all">All statuses</option>
          {TASK_STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
        <Select
          label="Priority"
          hideLabel
          value={filters.priority}
          onChange={(event) => onChange({ ...filters, priority: event.target.value as TaskFilters['priority'] })}
        >
          <option value="all">All priorities</option>
          {TASK_PRIORITY_ORDER.map((priority) => (
            <option key={priority} value={priority}>
              {TASK_PRIORITY_LABELS[priority]}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
