import { useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hideLabel?: boolean
}

export function Textarea({ label, hideLabel = false, id, className = '', ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <div>
      <label htmlFor={textareaId} className={hideLabel ? 'sr-only' : 'mb-1 block text-sm font-medium text-slate-700'}>
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`w-full rounded-clay-sm border border-slate-200 px-4 py-2.5 text-sm text-slate-900 shadow-clay-inset transition-colors duration-200 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 ${className}`}
        {...props}
      />
    </div>
  )
}
