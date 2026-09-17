import { useId } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hideLabel?: boolean
  children: ReactNode
}

export function Select({ label, hideLabel = false, id, className = '', children, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div>
      <label htmlFor={selectId} className={hideLabel ? 'sr-only' : 'mb-1 block text-sm font-medium text-slate-700'}>
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full rounded-clay-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-clay-inset transition-colors duration-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
