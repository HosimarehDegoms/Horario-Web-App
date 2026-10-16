import { useState } from 'react'
import type { FormEvent } from 'react'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import { Button } from '../../../components/ui/Button'
import {
  TASK_CATEGORY_SUGGESTIONS,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_ORDER,
  TASK_RECURRENCE_LABELS,
  TASK_RECURRENCE_ORDER,
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
} from '../../../constants/tasks'
import { parseDateInputValue, toDateInputValue } from '../../../utils/date'
import type { CreateTaskInput, Task, TaskPriority, TaskRecurrence, TaskStatus } from '../../../types/task'

interface TaskFormProps {
  initialTask?: Task
  onSubmit: (input: CreateTaskInput) => Promise<void>
  onCancel: () => void
}

interface FormErrors {
  title?: string
  deadline?: string
}

const CATEGORY_SUGGESTIONS_ID = 'task-category-suggestions'

export function TaskForm({ initialTask, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? '')
  const [description, setDescription] = useState(initialTask?.description ?? '')
  const [deadline, setDeadline] = useState(
    toDateInputValue(initialTask ? new Date(initialTask.deadline) : new Date()),
  )
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? 'not_started')
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority ?? 'medium')
  const [category, setCategory] = useState(initialTask?.category ?? '')
  const [estimatedDuration, setEstimatedDuration] = useState(
    initialTask?.estimatedDurationMinutes != null ? String(initialTask.estimatedDurationMinutes) : '',
  )
  const [recurrence, setRecurrence] = useState<TaskRecurrence | ''>(initialTask?.recurrence ?? '')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): FormErrors {
    const nextErrors: FormErrors = {}
    if (!title.trim()) nextErrors.title = 'Title is required.'
    if (!deadline) nextErrors.deadline = 'Deadline is required.'
    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: parseDateInputValue(deadline).toISOString(),
        status,
        priority,
        category: category.trim() || undefined,
        estimatedDurationMinutes: estimatedDuration.trim() ? Number(estimatedDuration) : undefined,
        recurrence: recurrence || undefined,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Finish lab report"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <Textarea
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Optional details"
        rows={3}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Input label="Deadline" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
          {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
        </div>
        <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
          {TASK_STATUS_ORDER.map((option) => (
            <option key={option} value={option}>
              {TASK_STATUS_LABELS[option]}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Priority" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
          {TASK_PRIORITY_ORDER.map((option) => (
            <option key={option} value={option}>
              {TASK_PRIORITY_LABELS[option]}
            </option>
          ))}
        </Select>
        <Input
          label="Estimated Duration (minutes)"
          type="number"
          min={0}
          step={5}
          value={estimatedDuration}
          onChange={(event) => setEstimatedDuration(event.target.value)}
          placeholder="e.g. 60"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Input
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="e.g. School"
            list={CATEGORY_SUGGESTIONS_ID}
          />
          <datalist id={CATEGORY_SUGGESTIONS_ID}>
            {TASK_CATEGORY_SUGGESTIONS.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>
        <Select
          label="Repeat"
          value={recurrence}
          onChange={(event) => setRecurrence(event.target.value as TaskRecurrence | '')}
        >
          <option value="">Does not repeat</option>
          {TASK_RECURRENCE_ORDER.map((option) => (
            <option key={option} value={option}>
              {TASK_RECURRENCE_LABELS[option]}
            </option>
          ))}
        </Select>
      </div>
      {recurrence && (
        <p className="-mt-2 text-xs text-slate-500">
          Marking this task complete will automatically create the next {TASK_RECURRENCE_LABELS[recurrence].toLowerCase()} occurrence.
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : initialTask ? 'Save Changes' : 'Add Task'}
        </Button>
      </div>
    </form>
  )
}
