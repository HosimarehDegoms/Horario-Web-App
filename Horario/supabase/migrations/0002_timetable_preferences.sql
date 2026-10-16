-- Horario: timetable_preferences (chosen template + optional background
-- wallpaper) and the Storage bucket that holds uploaded wallpaper images.
-- Run this once in the Supabase SQL Editor, after 0001_init_auth_and_schedules.sql
-- (it reuses that migration's public.set_updated_at() function).

create table if not exists public.timetable_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users (id) on delete cascade,
  template text not null check (
    template in ('minimal', 'colorful', 'weekly_grid', 'student_planner', 'compact')
  ),
  background_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.timetable_preferences is
  'One row per user: their chosen timetable template and optional uploaded background wallpaper.';

drop trigger if exists set_timetable_preferences_updated_at on public.timetable_preferences;
create trigger set_timetable_preferences_updated_at
  before update on public.timetable_preferences
  for each row
  execute function public.set_updated_at();

alter table public.timetable_preferences enable row level security;

drop policy if exists "timetable_preferences_select_own" on public.timetable_preferences;
create policy "timetable_preferences_select_own"
  on public.timetable_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "timetable_preferences_insert_own" on public.timetable_preferences;
create policy "timetable_preferences_insert_own"
  on public.timetable_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "timetable_preferences_update_own" on public.timetable_preferences;
create policy "timetable_preferences_update_own"
  on public.timetable_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "timetable_preferences_delete_own" on public.timetable_preferences;
create policy "timetable_preferences_delete_own"
  on public.timetable_preferences for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage: background wallpaper uploads.
--
-- Public read (these are decorative images the user chose to show behind
-- their own timetable, not sensitive data) but owner-only write/delete,
-- scoped by the upload path's first segment being the uploader's own user id
-- (e.g. "<user_id>/background-123.png"), mirroring the per-user ownership
-- pattern used everywhere else in this schema.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('schedule-backgrounds', 'schedule-backgrounds', true)
on conflict (id) do nothing;

drop policy if exists "schedule_backgrounds_public_read" on storage.objects;
create policy "schedule_backgrounds_public_read"
  on storage.objects for select
  using (bucket_id = 'schedule-backgrounds');

drop policy if exists "schedule_backgrounds_owner_insert" on storage.objects;
create policy "schedule_backgrounds_owner_insert"
  on storage.objects for insert
  with check (bucket_id = 'schedule-backgrounds' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "schedule_backgrounds_owner_update" on storage.objects;
create policy "schedule_backgrounds_owner_update"
  on storage.objects for update
  using (bucket_id = 'schedule-backgrounds' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "schedule_backgrounds_owner_delete" on storage.objects;
create policy "schedule_backgrounds_owner_delete"
  on storage.objects for delete
  using (bucket_id = 'schedule-backgrounds' and (storage.foldername(name))[1] = auth.uid()::text);
