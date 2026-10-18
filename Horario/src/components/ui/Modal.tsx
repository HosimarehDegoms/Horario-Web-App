import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

const EXIT_ANIMATION_MS = 200

export function Modal({ open, title, onClose, children }: ModalProps) {
  const [rendered, setRendered] = useState(open)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined

    function sync() {
      if (open) {
        setRendered(true)
        return
      }
      timeout = setTimeout(() => setRendered(false), EXIT_ANIMATION_MS)
    }

    sync()

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!rendered) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 motion-reduce:transition-none ${open ? 'opacity-100' : 'opacity-0'}`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-clay border border-slate-200 bg-slate-50 p-6 shadow-[0_24px_60px_-20px_rgba(43,39,32,0.35)] transition-[opacity,transform] duration-200 ease-clay motion-reduce:transition-none ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
