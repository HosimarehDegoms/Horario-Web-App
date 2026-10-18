import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <section className={`rounded-clay border border-slate-200 bg-white/90 p-5 shadow-clay sm:p-6 ${className}`}>
      {title && <h2 className="mb-4 text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{title}</h2>}
      {children}
    </section>
  )
}
