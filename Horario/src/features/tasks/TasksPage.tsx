import { useMemo, useState } from 'react'
import { useTasks } from '../../hooks/useTasks'
import { useSchedules } from '../../hooks/useSchedules'
import { useSmartScheduling } from '../../hooks/useSmartScheduling'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { TaskCard } from '../../components/tasks/TaskCard'
import { TaskFilterBar } from './components/TaskFilterBar'
import { TaskForm } from './components/TaskForm'
import { SmartScheduleModal } from './components/SmartScheduleModal'
import { DEFAULT_TASK_FILTERS, filterTasks } from '../../utils/taskFilters'
import type { CreateTaskInput, Task } from '../../types/task'
import type { TaskFilters } from '../../utils/taskFilters'

type FormState = { mode: 'create' } | { mode: 'edit'; task: Task } | null

export function TasksPage() {
  const { tasks, loading, error, refetch, addTask, updateTask, deleteTask, scheduleTask, clearTaskSchedule } =
    useTasks()
  const { entries: scheduleEntries } = useSchedules()
  const smartScheduling = useSmartScheduling({ tasks, scheduleEntries, scheduleTask, clearTaskSchedule })
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_TASK_FILTERS)
  const [formState, setFormState] = useState<FormState>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [schedulingTask, setSchedulingTask] = useState<Task | null>(null)

  const today = useMemo(() => new Date(), [])
  const filteredTasks = useMemo(() => filterTasks(tasks, filters, today), [tasks, filters, today])

  async function handleSubmit(input: CreateTaskInput) {
    if (formState?.mode === 'edit') {
      await updateTask(formState.task.id, input)
    } else {
      await addTask(input)
    }
    setFormState(null)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    await deleteTask(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Tasks</h1>
        <Button onClick={() => setFormState({ mode: 'create' })}>Add Task</Button>
      </div>

      <TaskFilterBar filters={filters} onChange={setFilters} />

      {loading ? (
        <LoadingState label="Loading your tasks…" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title={tasks.length === 0 ? "You're all caught up!" : 'No tasks match your filters'}
          description={
            tasks.length === 0
              ? 'Add a task when you have something to work on.'
              : 'Try a different view, status, priority, or search term.'
          }
        />
      ) : (
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              referenceDate={today}
              onStatusChange={(status) => void updateTask(task.id, { status })}
              onEdit={() => setFormState({ mode: 'edit', task })}
              onDelete={() => setDeleteTarget(task)}
              onSuggestTime={task.status !== 'completed' ? () => setSchedulingTask(task) : undefined}
              onClearSchedule={task.scheduledDate ? () => void smartScheduling.clearSchedule(task.id) : undefined}
            />
          ))}
        </ul>
      )}

      <Modal
        open={formState !== null}
        title={formState?.mode === 'edit' ? 'Edit Task' : 'Add Task'}
        onClose={() => setFormState(null)}
      >
        {formState && (
          <TaskForm
            initialTask={formState.mode === 'edit' ? formState.task : undefined}
            onSubmit={handleSubmit}
            onCancel={() => setFormState(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete task"
        message={deleteTarget ? `Delete "${deleteTarget.title}"? This can't be undone.` : ''}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <SmartScheduleModal
        task={schedulingTask}
        getSuggestions={smartScheduling.getSuggestions}
        onConfirm={smartScheduling.confirmSlot}
        onClose={() => setSchedulingTask(null)}
      />
    </div>
  )
}
