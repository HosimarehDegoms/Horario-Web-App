-- Horario: spotify_connection (stores only the long-lived refresh token for
-- the Focus tab's "Connect to Spotify" feature; access tokens are short-lived
-- and kept in memory on the client, never persisted). Run this once in the
-- Supabase SQL Editor, after 0001_init_auth_and_schedules.sql (reuses its
-- public.set_updated_at()).

create table if not exists public.spotify_connection (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users (id) on delete cascade,
  refresh_token text not null,
  spotify_user_id text,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.spotify_connection is
  'One row per user: their Spotify OAuth refresh token for the Focus tab music player. Obtained via PKCE, so no client secret is ever involved.';

drop trigger if exists set_spotify_connection_updated_at on public.spotify_connection;
create trigger set_spotify_connection_updated_at
  before update on public.spotify_connection
  for each row
  execute function public.set_updated_at();

alter table public.spotify_connection enable row level security;

drop policy if exists "spotify_connection_select_own" on public.spotify_connection;
create policy "spotify_connection_select_own"
  on public.spotify_connection for select
  using (auth.uid() = user_id);

drop policy if exists "spotify_connection_insert_own" on public.spotify_connection;
create policy "spotify_connection_insert_own"
  on public.spotify_connection for insert
  with check (auth.uid() = user_id);

drop policy if exists "spotify_connection_update_own" on public.spotify_connection;
create policy "spotify_connection_update_own"
  on public.spotify_connection for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "spotify_connection_delete_own" on public.spotify_connection;
create policy "spotify_connection_delete_own"
  on public.spotify_connection for delete
  using (auth.uid() = user_id);
