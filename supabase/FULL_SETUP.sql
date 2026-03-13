-- =============================================================================
-- TABOO LOCAL MULTIPLAYER - FULL SUPABASE SETUP
-- =============================================================================
-- Run this ENTIRE file in Supabase SQL Editor to fix schema issues.
-- This will RESET game_sessions and taboo_events (in-progress games will be lost).
-- Rooms and participants are preserved.
-- =============================================================================

-- 1. Drop and recreate game_sessions (fixes missing columns like card_order)
-- Drop dependent tables first (game_rounds, deck_selections may exist from other schema versions)
drop table if exists public.taboo_events;
drop table if exists public.game_rounds;
drop table if exists public.deck_selections;
drop table if exists public.game_sessions cascade;

create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  phase text not null default 'playing' check (phase in ('playing', 'round_summary', 'results')),
  mode text not null default 'local-multiplayer',
  selected_decks jsonb not null default '[]',
  round_duration integer not null default 60,
  total_rounds integer not null default 4,
  target_score integer default 0,
  current_round integer not null default 1,
  current_turn_team text not null check (current_turn_team in ('A', 'B')),
  current_card_id text,
  current_card_index integer not null default 0,
  card_order jsonb not null default '[]',
  used_card_ids jsonb not null default '[]',
  score_team_a integer not null default 0,
  score_team_b integer not null default 0,
  timer_started_at timestamptz,
  timer_duration_seconds integer,
  round_correct integer not null default 0,
  round_skipped integer not null default 0,
  round_taboo integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_game_sessions_room_id on public.game_sessions (room_id);
create index if not exists idx_game_sessions_phase on public.game_sessions (phase);

create table public.taboo_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  round_number integer not null,
  card_id text not null,
  spoken_word text not null,
  reported_by_team text not null check (reported_by_team in ('A', 'B')),
  created_at timestamptz not null default now()
);

create index if not exists idx_taboo_events_session_id on public.taboo_events (session_id);

-- 2. Ensure rooms has all columns
alter table public.rooms add column if not exists created_by_team text;
alter table public.rooms add column if not exists host_device_id text;
alter table public.rooms add column if not exists mode text;
alter table public.rooms add column if not exists team_a_name text;
alter table public.rooms add column if not exists team_b_name text;
alter table public.rooms add column if not exists selected_decks jsonb;
alter table public.rooms add column if not exists round_duration integer;
alter table public.rooms add column if not exists total_rounds integer;
alter table public.rooms add column if not exists target_score integer;

-- 3. Fix room_participants team constraint
alter table public.room_participants drop constraint if exists room_participants_team_check;
alter table public.room_participants add constraint room_participants_team_check check (team in ('A', 'B'));

-- 4. Realtime (required for live sync)
alter publication supabase_realtime add table public.rooms;
alter publication supabase_realtime add table public.room_participants;
alter publication supabase_realtime add table public.game_sessions;

-- 5. RLS policies (allow anon access)
alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;
alter table public.game_sessions enable row level security;
alter table public.taboo_events enable row level security;

drop policy if exists "Allow anon all rooms" on public.rooms;
drop policy if exists "Allow anon all room_participants" on public.room_participants;
drop policy if exists "Allow anon all game_sessions" on public.game_sessions;
drop policy if exists "Allow anon all taboo_events" on public.taboo_events;

create policy "Allow anon all rooms" on public.rooms for all using (true) with check (true);
create policy "Allow anon all room_participants" on public.room_participants for all using (true) with check (true);
create policy "Allow anon all game_sessions" on public.game_sessions for all using (true) with check (true);
create policy "Allow anon all taboo_events" on public.taboo_events for all using (true) with check (true);

-- Done. If you get "already exists" or "table already in publication" errors, ignore them.
