-- Horario: theme_preferences (chosen color family + finish style for the
-- whole app's color system). Run this once in the Supabase SQL Editor, after
-- 0001_init_auth_and_schedules.sql (reuses its public.set_updated_at()).

create table if not exists public.theme_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users (id) on delete cascade,
  color_family text not null check (
    color_family in ('indigo', 'violet', 'teal', 'rose', 'sky', 'emerald', 'amber', 'slate', 'fuchsia', 'orange')
  ),
  finish text not null check (finish in ('solid', 'gradient', 'matte', 'metallic')) default 'gradient',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.theme_preferences is
  'One row per user: their chosen app-wide color family and surface finish style.';

drop trigger if exists set_theme_preferences_updated_at on public.theme_preferences;
create trigger set_theme_preferences_updated_at
  before update on public.theme_preferences
  for each row
  execute function public.set_updated_at();

alter table public.theme_preferences enable row level security;

drop policy if exists "theme_preferences_select_own" on public.theme_preferences;
create policy "theme_preferences_select_own"
  on public.theme_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "theme_preferences_insert_own" on public.theme_preferences;
create policy "theme_preferences_insert_own"
  on public.theme_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "theme_preferences_update_own" on public.theme_preferences;
create policy "theme_preferences_update_own"
  on public.theme_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "theme_preferences_delete_own" on public.theme_preferences;
create policy "theme_preferences_delete_own"
  on public.theme_preferences for delete
  using (auth.uid() = user_id);
