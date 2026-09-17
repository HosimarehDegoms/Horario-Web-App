import { useState } from 'react'
import type { FormEvent } from 'react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'

interface QuickAddTaskProps {
  onAdd: (title: string) => Promise<void>
}

export function QuickAddTask({ onAdd }: QuickAddTaskProps) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      await onAdd(trimmed)
      setTitle('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          label="Quick add a task"
          hideLabel
          placeholder="Add a task for today…"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={submitting}
        />
      </div>
      <Button type="submit" disabled={submitting || title.trim().length === 0}>
        {submitting ? 'Adding…' : 'Add Task'}
      </Button>
    </form>
  )
}
