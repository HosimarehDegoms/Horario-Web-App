import { useState } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { TemplatePicker } from './TemplatePicker'
import { BackgroundUploader } from './BackgroundUploader'
import type { SaveTimetablePreferencesInput, TimetablePreferences } from '../../../types/timetablePreferences'

interface ScheduleDesignModalProps {
  open: boolean
  initialPreferences: TimetablePreferences | null
  onUploadBackground: (file: File) => Promise<string>
  onSave: (input: SaveTimetablePreferencesInput) => Promise<void>
  onClose: () => void
}

export function ScheduleDesignModal({
  open,
  initialPreferences,
  onUploadBackground,
  onSave,
  onClose,
}: ScheduleDesignModalProps) {
  const [template, setTemplate] = useState(initialPreferences?.template ?? 'weekly_grid')
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(initialPreferences?.backgroundImageUrl ?? null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleUpload(file: File) {
    const url = await onUploadBackground(file)
    setBackgroundImageUrl(url)
  }

  async function handleSave() {
    setError(null)
    setSaving(true)
    try {
      await onSave({ template, backgroundImageUrl })
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title="Design Your Schedule" onClose={onClose}>
      <div className="space-y-5">
        <TemplatePicker value={template} onChange={setTemplate} />
        <BackgroundUploader
          imageUrl={backgroundImageUrl}
          onUpload={handleUpload}
          onRemove={() => setBackgroundImageUrl(null)}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void handleSave()} disabled={saving}>
            {saving ? 'Saving…' : initialPreferences ? 'Save Design' : 'Create Schedule'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
