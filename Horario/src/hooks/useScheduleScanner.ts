import { useCallback, useState } from 'react'
import * as scannerService from '../services/scanner/scannerService'
import { validateScheduleFile } from '../utils/fileValidation'
import { isScannedEntryComplete } from '../utils/scanValidation'
import { findConflicts } from '../utils/scheduleConflicts'
import { useSchedules } from './useSchedules'
import type { ScannedScheduleEntry } from '../types/scan'
import type { ScheduleEntry } from '../types/schedule'

export type ScanState =
  | { status: 'idle' }
  | { status: 'processing'; fileName: string; attempt: number }
  | { status: 'review_required'; fileName: string; entries: ScannedScheduleEntry[] }
  | { status: 'failed'; fileName: string; attempt: number; error: string; canRetry: boolean }
  | { status: 'saving'; entries: ScannedScheduleEntry[] }
  | { status: 'saved'; savedCount: number }

export function useScheduleScanner() {
  const { entries: existingEntries, createEntry } = useSchedules()
  const [state, setState] = useState<ScanState>({ status: 'idle' })
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const runScan = useCallback(async (file: File, attempt: number) => {
    setState({ status: 'processing', fileName: file.name, attempt })
    try {
      const entries = await scannerService.scanScheduleFile(file, attempt)
      setState({ status: 'review_required', fileName: file.name, entries })
    } catch {
      setState({
        status: 'failed',
        fileName: file.name,
        attempt,
        error: "We couldn't confidently read this schedule. Try a clearer image or enter the schedule manually.",
        canRetry: true,
      })
    }
  }, [])

  const upload = useCallback(
    (file: File) => {
      const validation = validateScheduleFile(file)
      if (!validation.valid) {
        setState({ status: 'failed', fileName: file.name, attempt: 0, error: validation.error ?? 'Invalid file.', canRetry: false })
        return
      }
      setPendingFile(file)
      void runScan(file, 1)
    },
    [runScan],
  )

  const retry = useCallback(() => {
    if (state.status !== 'failed' || !state.canRetry || !pendingFile) return
    void runScan(pendingFile, state.attempt + 1)
  }, [state, pendingFile, runScan])

  const updateEntry = useCallback((id: string, patch: Partial<ScannedScheduleEntry>) => {
    setState((current) => {
      if (current.status !== 'review_required') return current
      return {
        ...current,
        entries: current.entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
      }
    })
  }, [])

  const removeEntry = useCallback((id: string) => {
    setState((current) => {
      if (current.status !== 'review_required') return current
      return { ...current, entries: current.entries.filter((entry) => entry.id !== id) }
    })
  }, [])

  const reset = useCallback(() => {
    setState({ status: 'idle' })
    setPendingFile(null)
  }, [])

  const getConflicts = useCallback(
    (entry: ScannedScheduleEntry): ScheduleEntry[] => {
      if (!entry.dayOfWeek || !entry.startTime || !entry.endTime) return []
      return findConflicts(
        { dayOfWeek: entry.dayOfWeek, startTime: entry.startTime, endTime: entry.endTime },
        existingEntries,
      )
    },
    [existingEntries],
  )

  const confirmAndSave = useCallback(
    async (entriesToSave: ScannedScheduleEntry[]) => {
      const completeEntries = entriesToSave.filter(isScannedEntryComplete)
      setState({ status: 'saving', entries: entriesToSave })

      for (const entry of completeEntries) {
        await createEntry({
          title: entry.title.trim(),
          dayOfWeek: entry.dayOfWeek,
          startTime: entry.startTime,
          endTime: entry.endTime,
          location: entry.location?.trim() || undefined,
          description: entry.notes?.trim() || undefined,
        })
      }

      setState({ status: 'saved', savedCount: completeEntries.length })
    },
    [createEntry],
  )

  return { state, upload, retry, updateEntry, removeEntry, reset, getConflicts, confirmAndSave }
}
