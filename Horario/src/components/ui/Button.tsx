import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600',
  secondary: 'bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-400',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-500',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', type = 'button', className = '', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-clay-sm px-4 py-2.5 text-sm font-semibold shadow-clay transition-[transform,box-shadow,background-color] duration-200 ease-clay hover:-translate-y-0.5 hover:shadow-clay-hover active:translate-y-0 active:scale-[0.97] active:shadow-clay-pressed motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  )
}
