interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-slate-500">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-primary-500 motion-reduce:animate-none"
        aria-hidden="true"
      />
      {label}
    </div>
  )
}
