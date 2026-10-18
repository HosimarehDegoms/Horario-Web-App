interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <div role="status" className="space-y-3 px-1 py-4">
      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
      <div className="h-16 animate-pulse rounded-clay-sm bg-slate-200/70 motion-reduce:animate-none" />
      <div className="h-16 animate-pulse rounded-clay-sm bg-slate-200/70 motion-reduce:animate-none" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
