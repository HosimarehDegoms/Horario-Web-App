interface ProgressBarProps {
  value: number
  label?: string
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-3 w-full overflow-hidden rounded-full bg-slate-100 shadow-clay-inset"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-[width] duration-500 ease-clay motion-reduce:transition-none"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
