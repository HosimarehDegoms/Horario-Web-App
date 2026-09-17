-- Horario: profiles + schedules, auto-profile-creation trigger, and RLS.
-- Run this once in the Supabase SQL Editor (SQL Editor -> New query -> paste -> Run),
-- or via `supabase db push` if you have the CLI linked to this project.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_key unique (username)
);

comment on table public.profiles is
  'One row per authenticated user, keyed by auth.users.id. Never stores a password -- Supabase Auth owns that.';

-- ---------------------------------------------------------------------------
-- schedules
-- ---------------------------------------------------------------------------

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  description text,
  day_of_week text not null check (
    day_of_week in ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
  ),
  start_time time not null,
  end_time time not null,
  location text,
  category text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint schedules_time_order_check check (start_time < end_time)
);

create index if not exists schedules_user_id_idx on public.schedules (user_id);
create index if not exists schedules_user_id_day_of_week_idx on public.schedules (user_id, day_of_week);

comment on table public.schedules is
  'Recurring weekly schedule entries. Each row belongs to exactly one user via user_id.';

-- ---------------------------------------------------------------------------
-- updated_at auto-maintenance
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_schedules_updated_at on public.schedules;
create trigger set_schedules_updated_at
  before update on public.schedules
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile when a new auth user signs up.
--
-- The frontend calls supabase.auth.signUp() with `options: { data: { username } }`;
-- that value lands in auth.users.raw_user_meta_data, which this trigger reads.
-- SECURITY DEFINER lets it write to public.profiles despite RLS below -- it runs
-- with the privileges of whichever role executes this migration (in the SQL
-- Editor, that's the project's postgres superuser), not the calling user's.
--
-- If the username is already taken, the unique constraint violation raises
-- here. Because this trigger fires in the SAME transaction as the insert into
-- auth.users, the entire sign-up rolls back atomically -- no orphaned auth
-- user is ever left without a profile.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.schedules enable row level security;

-- profiles: read/update only your own row. No insert or delete policy exists
-- at all -- rows are only ever created by the trigger above and are never
-- deleted directly by the app, so there is nothing to grant.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- schedules: read/write only your own rows. The `with check` clauses on
-- insert/update are what stop a manipulated request from writing a row under
-- someone else's user_id -- enforced by Postgres itself, independent of
-- anything the frontend does or fails to do.
drop policy if exists "schedules_select_own" on public.schedules;
create policy "schedules_select_own"
  on public.schedules for select
  using (auth.uid() = user_id);

drop policy if exists "schedules_insert_own" on public.schedules;
create policy "schedules_insert_own"
  on public.schedules for insert
  with check (auth.uid() = user_id);

drop policy if exists "schedules_update_own" on public.schedules;
create policy "schedules_update_own"
  on public.schedules for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "schedules_delete_own" on public.schedules;
create policy "schedules_delete_own"
  on public.schedules for delete
  using (auth.uid() = user_id);
