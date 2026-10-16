import { useRef, useState } from 'react'
import { useSchedules } from '../../hooks/useSchedules'
import { useTimetablePreferences } from '../../hooks/useTimetablePreferences'
import { Button } from '../../components/ui/Button'
import { Fab } from '../../components/ui/Fab'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { DayView } from './components/DayView'
import { WeekView } from './components/WeekView'
import { MonthView } from './components/MonthView'
import { ScheduleForm } from './components/ScheduleForm'
import { CreateScheduleCta } from './components/CreateScheduleCta'
import { ScheduleDesignModal } from './components/ScheduleDesignModal'
import { ExportScheduleModal } from './components/ExportScheduleModal'
import { useTasks } from '../../hooks/useTasks'
import { TimetableTemplateStyleContext } from './templateStyleContext'
import { TIMETABLE_TEMPLATE_STYLES } from '../../constants/timetableTemplates'
import type { CreateScheduleInput, ScheduleEntry } from '../../types/schedule'

type ViewMode = 'day' | 'week' | 'month'
type FormState = { mode: 'create' } | { mode: 'edit'; entry: ScheduleEntry } | null

export function SchedulePage() {
  const { entries, loading, error, refetch, createEntry, updateEntry, deleteEntry } = useSchedules()
  const {
    preferences,
    loading: preferencesLoading,
    error: preferencesError,
    refetch: refetchPreferences,
    savePreferences,
    uploadBackgroundImage,
  } = useTimetablePreferences()

  const { tasks } = useTasks()

  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [formState, setFormState] = useState<FormState>(null)
  const [deleteTarget, setDeleteTarget] = useState<ScheduleEntry | null>(null)
  const [designModalOpen, setDesignModalOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

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

  const isLoading = loading || preferencesLoading
  const loadError = error ?? preferencesError
  const retry = () => {
    refetch()
    refetchPreferences()
  }

  const showCreateSchedulePrompt = !isLoading && !loadError && !preferences && entries.length === 0
  const templateStyle = preferences ? TIMETABLE_TEMPLATE_STYLES[preferences.template] : undefined

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Schedule</h1>
        <div className="flex flex-wrap gap-2">
          {preferences && (
            <Button type="button" variant="secondary" onClick={() => setDesignModalOpen(true)}>
              Change Design
            </Button>
          )}
          {!isLoading && !loadError && entries.length > 0 && (
            <Button type="button" variant="secondary" onClick={() => setExportModalOpen(true)}>
              Export
            </Button>
          )}
          <Button onClick={() => setFormState({ mode: 'create' })}>Add Schedule</Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="Loading your schedule…" />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={retry} />
      ) : showCreateSchedulePrompt ? (
        <CreateScheduleCta onCreate={() => setDesignModalOpen(true)} />
      ) : (
        <div
          ref={exportRef}
          className="relative overflow-hidden rounded-clay print:rounded-none"
          style={
            preferences?.backgroundImageUrl
              ? {
                  backgroundImage: `url(${preferences.backgroundImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          {preferences?.backgroundImageUrl && <div className="absolute inset-0 bg-white/75" aria-hidden="true" />}
          <div className="relative space-y-4 p-3 sm:p-4">
            {!preferences && (
              <div
                data-export-ignore="true"
                className="rounded-clay-sm border border-dashed border-primary-300 bg-primary-50/70 px-4 py-3 text-sm text-primary-700 print:hidden"
              >
                Your schedule isn't designed yet.{' '}
                <button
                  type="button"
                  onClick={() => setDesignModalOpen(true)}
                  className="font-semibold underline underline-offset-2"
                >
                  Create a Schedule
                </button>{' '}
                to pick a template and background.
              </div>
            )}

            <div
              data-export-ignore="true"
              className="inline-flex rounded-clay-sm bg-slate-100 p-1 shadow-clay-inset print:hidden"
            >
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
              <button
                type="button"
                onClick={() => setViewMode('month')}
                className={`rounded-clay-sm px-3 py-1.5 text-sm font-medium transition-[background-color,box-shadow,transform] duration-200 ease-clay motion-reduce:transition-none ${
                  viewMode === 'month' ? 'bg-white text-slate-900 shadow-clay' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Month
              </button>
            </div>

            <TimetableTemplateStyleContext.Provider value={templateStyle ?? TIMETABLE_TEMPLATE_STYLES.weekly_grid}>
              {viewMode === 'day' ? (
                <DayView
                  entries={entries}
                  onEdit={(entry) => setFormState({ mode: 'edit', entry })}
                  onDelete={setDeleteTarget}
                />
              ) : viewMode === 'week' ? (
                <WeekView
                  entries={entries}
                  onEdit={(entry) => setFormState({ mode: 'edit', entry })}
                  onDelete={setDeleteTarget}
                />
              ) : (
                <MonthView entries={entries} tasks={tasks} referenceDate={new Date()} />
              )}
            </TimetableTemplateStyleContext.Provider>
          </div>
        </div>
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

      <ScheduleDesignModal
        open={designModalOpen}
        initialPreferences={preferences}
        onUploadBackground={uploadBackgroundImage}
        onSave={savePreferences}
        onClose={() => setDesignModalOpen(false)}
      />

      <ExportScheduleModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        getScheduleNode={() => exportRef.current}
      />

      <Fab label="Add Schedule" onClick={() => setFormState({ mode: 'create' })} />
    </div>
  )
}
