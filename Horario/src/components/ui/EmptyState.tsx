import { Mascot } from '../illustrations/Mascot'
import type { MascotVariant } from '../illustrations/Mascot'

interface EmptyStateProps {
  title: string
  description?: string
  illustration?: MascotVariant
}

export function EmptyState({ title, description, illustration }: EmptyStateProps) {
  return (
    <div className="rounded-clay-sm border border-dashed border-slate-300 bg-transparent px-4 py-8 text-center">
      {illustration && (
        <Mascot
          variant={illustration}
          className="motion-safe:animate-pop-in mx-auto mb-2 h-20 w-20 sm:h-24 sm:w-24"
        />
      )}
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  )
}
