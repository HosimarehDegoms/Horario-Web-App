import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { TaskCard } from '../../../components/tasks/TaskCard'
import { QuickAddTask } from './QuickAddTask'
import type { Task } from '../../../types/task'

interface TodayTasksSectionProps {
  tasks: Task[]
  referenceDate: Date
  onToggleComplete: (taskId: string) => void
  onAddTask: (title: string) => Promise<void>
}

export function TodayTasksSection({ tasks, referenceDate, onToggleComplete, onAddTask }: TodayTasksSectionProps) {
  return (
    <Card title="Today's Tasks">
      <div className="mb-3">
        <QuickAddTask onAdd={onAddTask} />
      </div>
      {tasks.length === 0 ? (
        <EmptyState title="You're all caught up!" description="Add a task when you have something to work on." />
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} referenceDate={referenceDate} onToggleComplete={onToggleComplete} />
          ))}
        </ul>
      )}
    </Card>
  )
}
