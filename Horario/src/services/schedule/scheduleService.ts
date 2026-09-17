import { supabase } from '../../lib/supabase'
import type { CreateScheduleInput, DayOfWeek, ScheduleEntry, UpdateScheduleInput } from '../../types/schedule'

/**
 * Real Supabase-backed schedule data layer. Row Level Security on the
 * `schedules` table (see supabase/migrations) is what actually enforces
 * per-user access for every one of these queries — there is no client-side
 * `.eq('user_id', ...)` filter here because none is needed: RLS restricts
 * every select/insert/update/delete to the caller's own rows regardless of
 * what the client asks for. `user_id` is likewise never sent on insert; the
 * column defaults to `auth.uid()`, and RLS's `with check` independently
 * verifies that value anyway.
 */

interface ScheduleRow {
  id: string
  user_id: string
  title: string
  description: string | null
  day_of_week: DayOfWeek
  start_time: string
  end_time: string
  location: string | null
  category: string | null
  color: string | null
}

const SELECT_COLUMNS = 'id, user_id, title, description, day_of_week, start_time, end_time, location, category, color'

function toScheduleEntry(row: ScheduleRow): ScheduleEntry {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description ?? undefined,
    dayOfWeek: row.day_of_week,
    // Postgres `time` columns come back as "HH:mm:ss"; the app uses "HH:mm" throughout.
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
    location: row.location ?? undefined,
    category: row.category ?? undefined,
    color: row.color ?? undefined,
  }
}

export async function getScheduleEntries(): Promise<ScheduleEntry[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select(SELECT_COLUMNS)
    .order('day_of_week')
    .order('start_time')

  if (error) {
    throw new Error('Something went wrong while loading your schedule. Please try again.')
  }

  return (data as ScheduleRow[]).map(toScheduleEntry)
}

export async function createScheduleEntry(input: CreateScheduleInput): Promise<ScheduleEntry> {
  const { data, error } = await supabase
    .from('schedules')
    .insert({
      title: input.title,
      description: input.description,
      day_of_week: input.dayOfWeek,
      start_time: input.startTime,
      end_time: input.endTime,
      location: input.location,
      category: input.category,
      color: input.color,
    })
    .select(SELECT_COLUMNS)
    .single()

  if (error) {
    throw new Error('Something went wrong while saving this schedule entry. Please try again.')
  }

  return toScheduleEntry(data as ScheduleRow)
}

export async function updateScheduleEntry(id: string, input: UpdateScheduleInput): Promise<ScheduleEntry> {
  const { data, error } = await supabase
    .from('schedules')
    .update({
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.dayOfWeek !== undefined && { day_of_week: input.dayOfWeek }),
      ...(input.startTime !== undefined && { start_time: input.startTime }),
      ...(input.endTime !== undefined && { end_time: input.endTime }),
      ...(input.location !== undefined && { location: input.location }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.color !== undefined && { color: input.color }),
    })
    .eq('id', id)
    .select(SELECT_COLUMNS)
    .single()

  if (error) {
    throw new Error('Something went wrong while updating this schedule entry. Please try again.')
  }

  return toScheduleEntry(data as ScheduleRow)
}

export async function deleteScheduleEntry(id: string): Promise<void> {
  const { error } = await supabase.from('schedules').delete().eq('id', id)

  if (error) {
    throw new Error('Something went wrong while deleting this schedule entry. Please try again.')
  }
}
