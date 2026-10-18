import type { ButtonHTMLAttributes } from 'react'
import { PlusIcon } from '../layout/icons'

interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

/**
 * Mobile-only floating quick-add button, sitting above BottomNav. Desktop
 * already has a visible "Add" button in the page header, so this hides at lg+.
 */
export function Fab({ label, className = '', ...props }: FabProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`theme-surface fixed right-5 bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-[transform,box-shadow,filter] duration-200 ease-clay hover:brightness-110 active:scale-95 active:brightness-95 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:hidden print:hidden ${className}`}
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      {...props}
    >
      <PlusIcon className="h-6 w-6" />
    </button>
  )
}
