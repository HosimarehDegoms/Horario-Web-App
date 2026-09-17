import { useEffect, useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { LoadingState } from '../../../components/ui/LoadingState'
import { EmptyState } from '../../../components/ui/EmptyState'
import { formatRelativeDayLabel, formatTime12h } from '../../../utils/date'
import type { Task } from '../../../types/task'
import type { SuggestedSlot } from '../../../types/scheduling'

interface SmartScheduleModalProps {
  task: Task | null
  getSuggestions: (task: Task) => Promise<SuggestedSlot[]>
  onConfirm: (task: Task, slot: SuggestedSlot) => Promise<void>
  onClose: () => void
}

export function SmartScheduleModal({ task, getSuggestions, onConfirm, onClose }: SmartScheduleModalProps) {
  const [suggestions, setSuggestions] = useState<SuggestedSlot[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [confirmingIndex, setConfirmingIndex] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!task) {
        setSuggestions(null)
        setLoadError(null)
        setConfirmError(null)
        return
      }

      setLoading(true)
      setLoadError(null)
      setConfirmError(null)

      try {
        const result = await getSuggestions(task)
        if (!cancelled) setSuggestions(result)
      } catch {
        if (!cancelled) setLoadError('Something went wrong while finding available time. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [task, getSuggestions])

  async function handleConfirm(slot: SuggestedSlot, index: number) {
    if (!task) return
    setConfirmingIndex(index)
    setConfirmError(null)
    try {
      await onConfirm(task, slot)
      onClose()
    } catch (error) {
      setConfirmError(error instanceof Error ? error.message : 'Could not confirm this time. Please try another suggestion.')
    } finally {
      setConfirmingIndex(null)
    }
  }

  const today = new Date()

  return (
    <Modal open={task !== null} title="Suggested Times" onClose={onClose}>
      {task && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Based on your existing schedule, other planned tasks, and "{task.title}"'s deadline, priority, and
            estimated duration.
          </p>

          {loading ? (
            <LoadingState label="Finding available time…" />
          ) : loadError ? (
            <p className="text-sm text-red-600">{loadError}</p>
          ) : suggestions && suggestions.length === 0 ? (
            <EmptyState
              title="No available time found"
              description="Your schedule is full before this task's deadline. Try a shorter estimated duration, a later deadline, or add the time manually."
            />
          ) : (
            <ul className="space-y-2">
              {(suggestions ?? []).map((slot, index) => (
                <li
                  key={`${slot.date}-${slot.startTime}`}
                  className="rounded-clay-sm border border-white/60 bg-white p-3 shadow-clay transition-[transform,box-shadow] duration-200 ease-clay hover:-translate-y-0.5 hover:shadow-clay-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {formatRelativeDayLabel(new Date(slot.date), today)}, {formatTime12h(slot.startTime)} –{' '}
                    {formatTime12h(slot.endTime)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{slot.reason}</p>
                  <div className="mt-2 flex justify-end">
                    <Button type="button" onClick={() => handleConfirm(slot, index)} disabled={confirmingIndex !== null}>
                      {confirmingIndex === index ? 'Confirming…' : 'Confirm This Time'}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {confirmError && <p className="text-sm text-red-600">{confirmError}</p>}
        </div>
      )}
    </Modal>
  )
}
