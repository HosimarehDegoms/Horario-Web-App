import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { ErrorState } from '../../../components/ui/ErrorState'

interface ScanFailedProps {
  error: string
  canRetry: boolean
  onRetry: () => void
  onStartOver: () => void
}

export function ScanFailed({ error, canRetry, onRetry, onStartOver }: ScanFailedProps) {
  return (
    <Card title="Scan failed">
      <ErrorState message={error} onRetry={canRetry ? onRetry : undefined} />
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
        <button type="button" onClick={onStartOver} className="font-medium text-slate-600 hover:underline">
          Try a different file
        </button>
        <span className="text-slate-300">·</span>
        <Link to="/schedule" className="font-medium text-indigo-600 hover:underline">
          Enter manually instead
        </Link>
      </div>
    </Card>
  )
}
