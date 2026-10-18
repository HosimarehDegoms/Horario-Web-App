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
const VIEW_MODES: { id: ViewMode; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
]

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
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5 print:hidden">
        <div>
          <p className="text-sm font-medium text-slate-500">Your timetable</p>
          <h1 className="mt-1 text-3xl leading-tight font-semibold text-slate-900 sm:text-4xl">Schedule</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {preferences && (
            <Button type="button" variant="secondary" onClick={() => setDesignModalOpen(true)}>
              Change design
            </Button>
          )}
          {!isLoading && !loadError && entries.length > 0 && (
            <Button type="button" variant="secondary" onClick={() => setExportModalOpen(true)}>
              Export
            </Button>
          )}
          <Button onClick={() => setFormState({ mode: 'create' })}>Add entry</Button>
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
          {preferences?.backgroundImageUrl && <div className="absolute inset-0 bg-slate-50/80" aria-hidden="true" />}
          <div className="relative space-y-4 p-3 sm:p-4">
            {!preferences && (
              <div
                data-export-ignore="true"
                className="rounded-clay-sm border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 print:hidden"
              >
                Your schedule isn't designed yet.{' '}
                <button
                  type="button"
                  onClick={() => setDesignModalOpen(true)}
                  className="font-semibold underline underline-offset-2"
                >
                  Create a schedule
                </button>{' '}
                to pick a template and background.
              </div>
            )}

            <div
              data-export-ignore="true"
              role="group"
              aria-label="Schedule view"
              className="inline-flex rounded-clay-sm bg-slate-200/70 p-1 print:hidden"
            >
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  aria-pressed={viewMode === mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`min-h-9 min-w-16 cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-200 ease-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 motion-reduce:transition-none ${
                    viewMode === mode.id
                      ? 'bg-white text-slate-900 shadow-clay'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
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

      <Fab label="Add entry" onClick={() => setFormState({ mode: 'create' })} />
    </div>
  )
}
