import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hideLabel?: boolean
}

export function Input({ label, hideLabel = false, id, className = '', ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div>
      <label htmlFor={inputId} className={hideLabel ? 'sr-only' : 'mb-1 block text-sm font-medium text-slate-700'}>
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-clay-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-clay-inset transition-colors duration-200 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 ${className}`}
        {...props}
      />
    </div>
  )
}
