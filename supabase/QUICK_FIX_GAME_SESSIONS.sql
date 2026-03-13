-- QUICK FIX: Only reset game_sessions (fixes 400 / card_order error)
-- Run this in Supabase SQL Editor if Start Game fails with "card_order" or column errors.
-- In-progress games will be lost. Rooms and participants are kept.

-- Drop dependent tables first (from other schema versions)
drop table if exists public.taboo_events;
drop table if exists public.game_rounds;
drop table if exists public.deck_selections;
-- CASCADE drops any remaining foreign key dependencies
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

-- Add to Realtime (ignore error if already added)
alter publication supabase_realtime add table public.game_sessions;
