import type { SVGProps } from 'react'

/** Small hand-written line icons for nav — avoids adding an icon library for five glyphs. */

export function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path d="M3 12 12 4l9 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10.5V19a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-3.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V19a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-8.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ScheduleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" />
      <path d="M4 9.5h16" strokeLinecap="round" />
      <path d="M8.5 3.5v3M15.5 3.5v3" strokeLinecap="round" />
    </svg>
  )
}

export function TasksIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <rect x="5" y="4" width="14" height="16" rx="2.5" />
      <path d="M8.5 9.5l1.5 1.5 2.5-3M8.5 15.5l1.5 1.5 2.5-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ScanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path d="M7 4H5.5A1.5 1.5 0 0 0 4 5.5V7M17 4h1.5A1.5 1.5 0 0 1 20 5.5V7M7 20H5.5A1.5 1.5 0 0 1 4 18.5V17M17 20h1.5a1.5 1.5 0 0 0 1.5-1.5V17" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  )
}

export function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path d="M15 4h2.5A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 8l-4 4 4 4M7 12h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
