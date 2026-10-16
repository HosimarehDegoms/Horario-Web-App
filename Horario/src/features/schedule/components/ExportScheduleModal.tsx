import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { exportScheduleAsImage, exportScheduleAsPdf, printSchedule } from '../../../utils/exportSchedule'

interface ExportScheduleModalProps {
  open: boolean
  onClose: () => void
  getScheduleNode: () => HTMLElement | null
}

type ExportState = { kind: 'idle' } | { kind: 'working'; action: 'image' | 'pdf' } | { kind: 'error'; message: string }

function filename(extension: string): string {
  const date = new Date().toISOString().slice(0, 10)
  return `horario-schedule-${date}.${extension}`
}

export function ExportScheduleModal({ open, onClose, getScheduleNode }: ExportScheduleModalProps) {
  const [state, setState] = useState<ExportState>({ kind: 'idle' })

  async function handleExport(action: 'image' | 'pdf') {
    const node = getScheduleNode()
    if (!node) {
      setState({ kind: 'error', message: "Couldn't find your schedule to export. Try again." })
      return
    }

    setState({ kind: 'working', action })
    try {
      if (action === 'image') {
        await exportScheduleAsImage(node, filename('png'))
      } else {
        await exportScheduleAsPdf(node, filename('pdf'))
      }
      setState({ kind: 'idle' })
      onClose()
    } catch (error) {
      console.error('Schedule export failed', error)
      setState({ kind: 'error', message: 'Something went wrong while exporting. Please try again.' })
    }
  }

  function handlePrint() {
    printSchedule()
    onClose()
  }

  const working = state.kind === 'working'

  return (
    <Modal open={open} title="Export Schedule" onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Export your schedule exactly as it's designed, with your chosen template and background.</p>

        {state.kind === 'error' && <p className="text-sm text-red-600">{state.message}</p>}

        <div className="grid gap-2 sm:grid-cols-3">
          <Button type="button" variant="secondary" onClick={handlePrint} disabled={working}>
            Print
          </Button>
          <Button type="button" variant="secondary" onClick={() => void handleExport('image')} disabled={working}>
            {state.kind === 'working' && state.action === 'image' ? 'Exporting…' : 'Save as Image'}
          </Button>
          <Button type="button" onClick={() => void handleExport('pdf')} disabled={working}>
            {state.kind === 'working' && state.action === 'pdf' ? 'Exporting…' : 'Save as PDF'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
