-- Rooms table
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  status text not null default 'lobby',
  host_device_id text,
  created_by_team text,
  mode text not null default 'local-multiplayer',
  team_a_name text,
  team_b_name text,
  selected_decks jsonb,
  round_duration integer,
  total_rounds integer,
  target_score integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_rooms_room_code on public.rooms (room_code);

-- Room participants
create table if not exists public.room_participants (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  device_id text not null,
  team text not null check (team in ('A', 'B')),
  is_host boolean not null default false,
  connected boolean not null default true,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create unique index if not exists idx_room_participants_unique_team
  on public.room_participants (room_id, team);

create index if not exists idx_room_participants_room_id
  on public.room_participants (room_id);

create index if not exists idx_room_participants_device_id
  on public.room_participants (device_id);

-- Game sessions (Phase 3: synced Local Multiplayer gameplay)
create table if not exists public.game_sessions (
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

-- Taboo events (observer reports)
create table if not exists public.taboo_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  round_number integer not null,
  card_id text not null,
  spoken_word text not null,
  reported_by_team text not null check (reported_by_team in ('A', 'B')),
  created_at timestamptz not null default now()
);

create index if not exists idx_taboo_events_session_id on public.taboo_events (session_id);

-- Enable realtime for game_sessions: In Supabase Dashboard > Database > Replication,
-- add "game_sessions" to the supabase_realtime publication for live gameplay sync.
