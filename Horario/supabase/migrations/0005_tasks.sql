-- Horario: tasks table, matching the client-side Task type, with per-user RLS.
-- Run this once in the Supabase SQL Editor (SQL Editor -> New query -> paste -> Run),
-- or via `supabase db push` if you have the CLI linked to this project.
--
-- Fixes tasks "coming back after delete": the app previously read/wrote tasks
-- through an in-memory array in src/services/tasks/taskService.ts that reset
-- to its seed data on every reload instead of ever touching Supabase.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  description text,
  deadline timestamptz not null,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  category text,
  estimated_duration_minutes integer,
  recurrence text check (recurrence in ('daily', 'weekly')),
  completed_at timestamptz,
  scheduled_date timestamptz,
  scheduled_start_time time,
  scheduled_end_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_user_id_deadline_idx on public.tasks (user_id, deadline);

comment on table public.tasks is
  'User tasks/todos with optional deadline, recurrence, and smart-scheduled time block. Each row belongs to exactly one user via user_id.';

-- Reuses public.set_updated_at() created in 0001_init_auth_and_schedules.sql.
drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- completed_at auto-maintenance
--
-- Stamps completed_at the moment status transitions TO 'completed', clears it
-- the moment status moves away from 'completed', and leaves it untouched on
-- any other update (e.g. editing the title of an already-completed task does
-- not reset its completion time). Keeps the service layer from having to
-- read-before-write just to get this right.
-- ---------------------------------------------------------------------------

create or replace function public.set_task_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    new.completed_at = now();
  elsif new.status <> 'completed' then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists set_tasks_completed_at on public.tasks;
create trigger set_tasks_completed_at
  before update on public.tasks
  for each row
  execute function public.set_task_completed_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.tasks enable row level security;

drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own"
  on public.tasks for select
  using (auth.uid() = user_id);

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own"
  on public.tasks for insert
  with check (auth.uid() = user_id);

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own"
  on public.tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own"
  on public.tasks for delete
  using (auth.uid() = user_id);
