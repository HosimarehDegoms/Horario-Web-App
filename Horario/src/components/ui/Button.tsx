import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'theme-surface text-white hover:brightness-110 active:brightness-95 focus-visible:outline-primary-600',
  secondary: 'border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-slate-400',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-500',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', type = 'button', className = '', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-clay-sm px-4 py-2.5 text-sm font-semibold shadow-clay transition-[transform,box-shadow,background-color,border-color,filter] duration-200 ease-clay hover:shadow-clay-hover active:translate-y-px active:scale-[0.98] active:shadow-clay-pressed motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  )
}
