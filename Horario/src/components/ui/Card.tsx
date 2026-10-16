import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <section className={`rounded-clay border border-primary-100/60 bg-white p-4 shadow-clay sm:p-5 ${className}`}>
      {title && <h2 className="mb-3 text-base font-semibold text-slate-900 sm:text-lg">{title}</h2>}
      {children}
    </section>
  )
}
