import { useDashboard } from '../../hooks/useDashboard'
import { useAuth } from '../../app/providers/useAuth'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { TodaySnapshotStrip } from '../../components/dashboard/TodaySnapshotStrip'
import { DateHeader } from './components/DateHeader'
import { DeadlinesSection } from './components/DeadlinesSection'
import { TodayScheduleSection } from './components/TodayScheduleSection'
import { TodayTasksSection } from './components/TodayTasksSection'
import { ProgressSection } from './components/ProgressSection'

export function DashboardPage() {
  const dashboard = useDashboard()
  const { profile } = useAuth()

  const nextDeadline = dashboard.overdueTasks[0] ?? dashboard.upcomingDeadlines[0] ?? null

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <DateHeader date={dashboard.today} username={profile?.username ?? 'there'} />

      {dashboard.loading ? (
        <LoadingState label="Loading your dashboard…" />
      ) : dashboard.error ? (
        <ErrorState message={dashboard.error} onRetry={dashboard.retry} />
      ) : (
        <>
          <div className="motion-safe:animate-fade-in-up">
            <TodaySnapshotStrip
              dailyProgress={dashboard.dailyProgress}
              focusMinutesToday={dashboard.focusMinutesToday}
              nextDeadline={nextDeadline}
              referenceDate={dashboard.today}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="motion-safe:animate-fade-in-up [animation-delay:80ms]">
              <TodayScheduleSection entries={dashboard.todaySchedule} />
            </div>
            <div className="motion-safe:animate-fade-in-up [animation-delay:140ms]">
              <TodayTasksSection
                tasks={dashboard.todayTasks}
                referenceDate={dashboard.today}
                onToggleComplete={dashboard.toggleTaskComplete}
                onAddTask={dashboard.addTask}
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="motion-safe:animate-fade-in-up [animation-delay:200ms]">
              <DeadlinesSection
                overdueTasks={dashboard.overdueTasks}
                upcomingDeadlines={dashboard.upcomingDeadlines}
                referenceDate={dashboard.today}
              />
            </div>
            <div className="motion-safe:animate-fade-in-up [animation-delay:240ms]">
              <ProgressSection weekly={dashboard.weeklyProgress} focusMinutesToday={dashboard.focusMinutesToday} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
