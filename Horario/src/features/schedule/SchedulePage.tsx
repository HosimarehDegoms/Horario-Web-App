import { useState } from 'react'
import { useSchedules } from '../../hooks/useSchedules'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { DayView } from './components/DayView'
import { WeekView } from './components/WeekView'
import { ScheduleForm } from './components/ScheduleForm'
import type { CreateScheduleInput, ScheduleEntry } from '../../types/schedule'

type ViewMode = 'day' | 'week'
type FormState = { mode: 'create' } | { mode: 'edit'; entry: ScheduleEntry } | null

export function SchedulePage() {
  const { entries, loading, error, refetch, createEntry, updateEntry, deleteEntry } = useSchedules()
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [formState, setFormState] = useState<FormState>(null)
  const [deleteTarget, setDeleteTarget] = useState<ScheduleEntry | null>(null)

  async function handleSubmit(input: CreateScheduleInput) {
    if (formState?.mode === 'edit') {
      await updateEntry(formState.entry.id, input)
    } else {
      await createEntry(input)
    }
    setFormState(null)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    await deleteEntry(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Schedule</h1>
        <Button onClick={() => setFormState({ mode: 'create' })}>Add Schedule</Button>
      </div>

      <div className="inline-flex rounded-clay-sm bg-slate-100 p-1 shadow-clay-inset">
        <button
          type="button"
          onClick={() => setViewMode('day')}
          className={`rounded-clay-sm px-3 py-1.5 text-sm font-medium transition-[background-color,box-shadow,transform] duration-200 ease-clay motion-reduce:transition-none ${
            viewMode === 'day' ? 'bg-white text-slate-900 shadow-clay' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Day
        </button>
        <button
          type="button"
          onClick={() => setViewMode('week')}
          className={`rounded-clay-sm px-3 py-1.5 text-sm font-medium transition-[background-color,box-shadow,transform] duration-200 ease-clay motion-reduce:transition-none ${
            viewMode === 'week' ? 'bg-white text-slate-900 shadow-clay' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Week
        </button>
      </div>

      {loading ? (
        <LoadingState label="Loading your schedule…" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : viewMode === 'day' ? (
        <DayView
          entries={entries}
          onEdit={(entry) => setFormState({ mode: 'edit', entry })}
          onDelete={setDeleteTarget}
        />
      ) : (
        <WeekView
          entries={entries}
          onEdit={(entry) => setFormState({ mode: 'edit', entry })}
          onDelete={setDeleteTarget}
        />
      )}

      <Modal
        open={formState !== null}
        title={formState?.mode === 'edit' ? 'Edit Schedule' : 'Add Schedule'}
        onClose={() => setFormState(null)}
      >
        {formState && (
          <ScheduleForm
            initialEntry={formState.mode === 'edit' ? formState.entry : undefined}
            existingEntries={entries}
            onSubmit={handleSubmit}
            onCancel={() => setFormState(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete schedule entry"
        message={deleteTarget ? `Delete "${deleteTarget.title}"? This can't be undone.` : ''}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
