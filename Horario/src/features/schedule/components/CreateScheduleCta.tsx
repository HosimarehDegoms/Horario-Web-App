import { Mascot } from '../../../components/illustrations/Mascot'
import { Button } from '../../../components/ui/Button'

interface CreateScheduleCtaProps {
  onCreate: () => void
}

export function CreateScheduleCta({ onCreate }: CreateScheduleCtaProps) {
  return (
    <div className="flex flex-col items-center rounded-clay border border-white/60 bg-white px-6 py-10 text-center shadow-clay">
      <Mascot variant="schedule" className="h-28 w-28" />
      <h2 className="mt-3 text-lg font-semibold text-slate-900">Design your schedule</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Pick a template and, if you like, a background wallpaper before you start adding classes and events.
      </p>
      <Button type="button" onClick={onCreate} className="mt-5">
        Create a Schedule
      </Button>
    </div>
  )
}
