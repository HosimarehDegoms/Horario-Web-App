import { useRef, useState } from 'react'
import {
  ACCEPTED_BACKGROUND_IMAGE_TYPES,
  ACCEPTED_BACKGROUND_IMAGE_TYPES_LABEL,
  MAX_BACKGROUND_IMAGE_SIZE_BYTES,
  MAX_BACKGROUND_IMAGE_SIZE_LABEL,
} from '../../../constants/backgroundUpload'
import { validateFile } from '../../../utils/fileValidation'

interface BackgroundUploaderProps {
  imageUrl: string | null
  onUpload: (file: File) => Promise<void>
  onRemove: () => void
}

export function BackgroundUploader({ imageUrl, onUpload, onRemove }: BackgroundUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(file: File | undefined) {
    if (!file) return
    const validation = validateFile(file, {
      acceptedTypes: ACCEPTED_BACKGROUND_IMAGE_TYPES,
      acceptedTypesLabel: ACCEPTED_BACKGROUND_IMAGE_TYPES_LABEL,
      maxSizeBytes: MAX_BACKGROUND_IMAGE_SIZE_BYTES,
      maxSizeLabel: MAX_BACKGROUND_IMAGE_SIZE_LABEL,
    })
    if (!validation.valid) {
      setError(validation.error ?? 'Invalid file.')
      return
    }

    setError(null)
    setUploading(true)
    try {
      await onUpload(file)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Something went wrong. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <span className="text-sm font-medium text-slate-700">Background wallpaper (optional)</span>

      {imageUrl ? (
        <div
          className="relative mt-2 h-28 overflow-hidden rounded-clay-sm bg-cover bg-center "
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-2 top-2 rounded-full bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-white transition-colors duration-150 hover:bg-slate-900/80"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-2 flex w-full flex-col items-center gap-1 rounded-clay-sm border-2 border-dashed border-slate-300 bg-slate-50/60 py-6 text-center transition-colors duration-200 hover:border-primary-400 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-sm font-medium text-slate-700">
            {uploading ? 'Uploading…' : 'Upload a background image'}
          </span>
          <span className="text-xs text-slate-500">
            {ACCEPTED_BACKGROUND_IMAGE_TYPES_LABEL} — up to {MAX_BACKGROUND_IMAGE_SIZE_LABEL}
          </span>
        </button>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_BACKGROUND_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={(event) => {
          void handleFileChange(event.target.files?.[0])
          event.target.value = ''
        }}
      />
    </div>
  )
}
