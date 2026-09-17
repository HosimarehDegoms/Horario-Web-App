import { parseScannedEntries } from '../../utils/scanValidation'
import type { ScannedScheduleEntry } from '../../types/scan'

/**
 * Temporary mock for the AI/OCR scanning call.
 *
 * The real implementation is a Supabase Edge Function (see
 * supabase/functions/scan-schedule/index.ts at the project root) that holds
 * the OpenAI API key server-side, calls OpenAI's vision API, and returns
 * structured JSON. That function isn't deployed yet because no Supabase
 * project has been created for this app. Once it is, replace the body of
 * scanScheduleFile with a fetch to that function's URL, passing the file as
 * multipart form data — the return shape (validated ScannedScheduleEntry[])
 * stays the same, so nothing else in the app (useScheduleScanner, the
 * review UI) needs to change.
 *
 * To make the retry flow demonstrable without a flaky random chance, this
 * mock deterministically fails on the first attempt for any file and
 * succeeds from the second attempt on.
 */

const SIMULATED_LATENCY_MS = 1200

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS))
}

function createSimulatedRawResponse(): unknown {
  return [
    {
      title: 'Mathematics',
      dayOfWeek: 'monday',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Room 204',
      notes: null,
      confidence: 0.94,
    },
    {
      title: 'Physics Lab',
      dayOfWeek: 'monday',
      startTime: '13:00',
      endTime: '15:00',
      location: 'Lab 3',
      notes: 'Bring safety goggles',
      confidence: 0.88,
    },
    {
      title: 'English Literature',
      dayOfWeek: null,
      startTime: '10:00',
      endTime: '11:00',
      location: null,
      notes: null,
      confidence: 0.42,
    },
    {
      title: 'Chemistry',
      dayOfWeek: 'wednesday',
      startTime: '09:15',
      endTime: null,
      location: 'Room 108',
      notes: null,
      confidence: 0.55,
    },
  ]
}

export async function scanScheduleFile(file: File, attempt: number): Promise<ScannedScheduleEntry[]> {
  void file // the mock doesn't inspect file contents; a real backend call would send the bytes

  await delay(undefined)

  if (attempt <= 1) {
    throw new Error('Simulated OCR failure (the mock always fails the first attempt so retry is testable).')
  }

  return parseScannedEntries(createSimulatedRawResponse())
}
