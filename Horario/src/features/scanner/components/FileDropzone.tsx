import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { ACCEPTED_FILE_TYPES } from '../../../constants/scanner'

interface FileDropzoneProps {
  onFileSelected: (file: File) => void
}

export function FileDropzone({ onFileSelected }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragActive(false)
    const file = event.dataTransfer.files[0]
    if (file) onFileSelected(file)
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragActive(true)
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      className={`rounded-clay border-2 border-dashed p-8 text-center transition-colors duration-200 ${
        isDragActive ? 'border-primary-400 bg-primary-50' : 'border-slate-300 bg-slate-50/60'
      }`}
    >
      <p className="text-sm font-medium text-slate-700">Drag and drop your schedule here</p>
      <p className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP, or PDF — up to 10MB</p>
      <Button type="button" variant="secondary" className="mt-4" onClick={() => inputRef.current?.click()}>
        Choose File
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(',')}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFileSelected(file)
          event.target.value = ''
        }}
      />
    </div>
  )
}
