interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Something went wrong while loading your data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-clay-sm border border-red-200 bg-red-50 px-4 py-6 text-center shadow-clay-inset">
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-clay-sm bg-red-500 px-3 py-1.5 text-sm font-semibold text-white shadow-clay transition-[transform,box-shadow] duration-200 ease-clay hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-clay-hover active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          Retry
        </button>
      )}
    </div>
  )
}
