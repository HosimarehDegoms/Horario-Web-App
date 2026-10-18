import { Mascot } from '../../../components/illustrations/Mascot'
import { Button } from '../../../components/ui/Button'

interface CreateScheduleCtaProps {
  onCreate: () => void
}

export function CreateScheduleCta({ onCreate }: CreateScheduleCtaProps) {
  return (
    <div className="flex flex-col items-center rounded-clay border border-dashed border-slate-300 px-6 py-14 text-center">
      <Mascot variant="schedule" className="h-28 w-28" />
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">Set up your timetable</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-600">
        Pick a template and, if you like, a background wallpaper before you start adding classes and events.
      </p>
      <Button type="button" onClick={onCreate} className="mt-5">
        Create a schedule
      </Button>
    </div>
  )
}
