import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { LoadingState } from '../../components/ui/LoadingState'
import { Mascot } from '../../components/illustrations/Mascot'
import { useFocusTimer } from '../../hooks/useFocusTimer'
import { FOCUS_PHASE_LABELS } from '../../constants/focus'
import { formatCountdown, sumFocusMinutesForDay } from '../../utils/focus'
import { FocusSettingsForm } from './components/FocusSettingsForm'
import { FocusSessionHistory } from './components/FocusSessionHistory'

const PHASE_RING_CLASSES = {
  focus: 'from-primary-400 to-primary-600',
  short_break: 'from-sky-400 to-sky-600',
  long_break: 'from-emerald-400 to-emerald-600',
} as const

export function FocusPage() {
  const timer = useFocusTimer()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const todayMinutes = sumFocusMinutesForDay(timer.history, new Date())
  const elapsedPercent =
    timer.totalSeconds === 0 ? 0 : ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100
  const untilLongBreak = timer.settings.sessionsBeforeLongBreak - (timer.completedFocusSessions % timer.settings.sessionsBeforeLongBreak)

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Focus Mode</h1>
        <Button type="button" variant="secondary" onClick={() => setSettingsOpen(true)}>
          Adjust Intervals
        </Button>
      </div>

      {timer.loading ? (
        <LoadingState label="Loading your focus timer…" />
      ) : (
        <>
          <Card className="motion-safe:animate-fade-in-up">
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <Mascot variant="focus" animated={timer.status !== 'running'} className="h-20 w-20" />
              <span
                className={`rounded-full bg-gradient-to-r px-4 py-1.5 text-sm font-semibold text-white shadow-clay ${PHASE_RING_CLASSES[timer.phase]}`}
              >
                {FOCUS_PHASE_LABELS[timer.phase]}
              </span>

              <p className="font-mono text-6xl font-bold tabular-nums text-slate-900 sm:text-7xl">
                {formatCountdown(timer.remainingSeconds)}
              </p>

              <div className="w-full max-w-sm">
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 shadow-clay-inset">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-clay ${PHASE_RING_CLASSES[timer.phase]}`}
                    style={{ width: `${elapsedPercent}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-500">
                {timer.phase === 'focus'
                  ? `${untilLongBreak} focus session${untilLongBreak === 1 ? '' : 's'} until your next long break`
                  : 'Back to a focus session next.'}
              </p>

              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {timer.status === 'running' ? (
                  <Button type="button" onClick={timer.pause}>
                    Pause
                  </Button>
                ) : (
                  <Button type="button" onClick={timer.start}>
                    {timer.status === 'paused' ? 'Resume' : 'Start'}
                  </Button>
                )}
                <Button type="button" variant="secondary" onClick={timer.reset}>
                  Reset
                </Button>
                <Button type="button" variant="secondary" onClick={timer.skip}>
                  Skip
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Today" className="motion-safe:animate-fade-in-up">
            <p className="text-sm text-slate-600">
              <span className="text-lg font-semibold text-slate-900">{todayMinutes}</span> focus minute
              {todayMinutes === 1 ? '' : 's'} so far today.
            </p>
          </Card>

          <Card title="Session History" className="motion-safe:animate-fade-in-up">
            <FocusSessionHistory sessions={timer.history} />
            {timer.history.length > 0 && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => void timer.clearHistory()}
                  className="text-xs font-medium text-slate-500 hover:text-red-600"
                >
                  Clear history
                </button>
              </div>
            )}
          </Card>
        </>
      )}

      <Modal open={settingsOpen} title="Adjust Intervals" onClose={() => setSettingsOpen(false)}>
        <FocusSettingsForm
          settings={timer.settings}
          onCancel={() => setSettingsOpen(false)}
          onSave={(next) => {
            void timer.updateSettings(next)
            setSettingsOpen(false)
          }}
        />
      </Modal>
    </div>
  )
}
