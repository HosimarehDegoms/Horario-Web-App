import { useDashboard } from '../../hooks/useDashboard'
import { useAuth } from '../../app/providers/useAuth'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { DateHeader } from './components/DateHeader'
import { DeadlinesSection } from './components/DeadlinesSection'
import { TodayScheduleSection } from './components/TodayScheduleSection'
import { TodayTasksSection } from './components/TodayTasksSection'
import { ProgressSection } from './components/ProgressSection'

export function DashboardPage() {
  const dashboard = useDashboard()
  const { profile } = useAuth()

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <DateHeader date={dashboard.today} username={profile?.username ?? 'there'} />

      {dashboard.loading ? (
        <LoadingState label="Loading your dashboard…" />
      ) : dashboard.error ? (
        <ErrorState message={dashboard.error} onRetry={dashboard.retry} />
      ) : (
        <>
          <DeadlinesSection
            overdueTasks={dashboard.overdueTasks}
            upcomingDeadlines={dashboard.upcomingDeadlines}
            referenceDate={dashboard.today}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <TodayScheduleSection entries={dashboard.todaySchedule} />
            <TodayTasksSection
              tasks={dashboard.todayTasks}
              referenceDate={dashboard.today}
              onToggleComplete={dashboard.toggleTaskComplete}
              onAddTask={dashboard.addTask}
            />
          </div>

          <ProgressSection daily={dashboard.dailyProgress} weekly={dashboard.weeklyProgress} />
        </>
      )}
    </div>
  )
}
