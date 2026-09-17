import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScheduleScanner } from '../../hooks/useScheduleScanner'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { FileDropzone } from './components/FileDropzone'
import { ScanProcessing } from './components/ScanProcessing'
import { ScanFailed } from './components/ScanFailed'
import { ReviewTable } from './components/ReviewTable'

export function ScannerPage() {
  const scanner = useScheduleScanner()
  const navigate = useNavigate()
  const [showConflictConfirm, setShowConflictConfirm] = useState(false)

  function handleConfirmClick() {
    if (scanner.state.status !== 'review_required') return
    const hasConflicts = scanner.state.entries.some((entry) => scanner.getConflicts(entry).length > 0)
    if (hasConflicts) {
      setShowConflictConfirm(true)
      return
    }
    void scanner.confirmAndSave(scanner.state.entries)
  }

  function handleConfirmAnyway() {
    setShowConflictConfirm(false)
    if (scanner.state.status === 'review_required') {
      void scanner.confirmAndSave(scanner.state.entries)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Scan Schedule</h1>

      {scanner.state.status === 'idle' && (
        <Card title="Upload a schedule">
          <FileDropzone onFileSelected={scanner.upload} />
          <p className="mt-3 text-center text-sm text-slate-500">
            Prefer to type it in?{' '}
            <button
              type="button"
              onClick={() => navigate('/schedule')}
              className="font-medium text-indigo-600 hover:underline"
            >
              Add a schedule entry manually
            </button>
          </p>
        </Card>
      )}

      {scanner.state.status === 'processing' && (
        <ScanProcessing title="Scanning your schedule" label={`Reading "${scanner.state.fileName}"…`} />
      )}

      {scanner.state.status === 'failed' && (
        <ScanFailed
          error={scanner.state.error}
          canRetry={scanner.state.canRetry}
          onRetry={scanner.retry}
          onStartOver={scanner.reset}
        />
      )}

      {scanner.state.status === 'review_required' && (
        <ReviewTable
          entries={scanner.state.entries}
          getConflicts={scanner.getConflicts}
          onChange={scanner.updateEntry}
          onRemove={scanner.removeEntry}
          onCancel={scanner.reset}
          onConfirm={handleConfirmClick}
        />
      )}

      {scanner.state.status === 'saving' && <ScanProcessing title="Saving" label="Adding entries to your schedule…" />}

      {scanner.state.status === 'saved' && (
        <Card title="Saved">
          <p className="text-sm text-slate-600">
            {scanner.state.savedCount} entr{scanner.state.savedCount === 1 ? 'y' : 'ies'} added to your schedule.
          </p>
          <div className="mt-4 flex gap-2">
            <Button type="button" onClick={() => navigate('/schedule')}>
              View Schedule
            </Button>
            <Button type="button" variant="secondary" onClick={scanner.reset}>
              Scan Another
            </Button>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={showConflictConfirm}
        title="Schedule conflicts detected"
        message="Some entries overlap with your existing schedule. Save them anyway?"
        confirmLabel="Save Anyway"
        onConfirm={handleConfirmAnyway}
        onCancel={() => setShowConflictConfirm(false)}
      />
    </div>
  )
}
