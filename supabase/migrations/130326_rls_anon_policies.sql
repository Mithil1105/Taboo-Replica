-- RLS policies for anon (no-auth) Local Multiplayer
-- Run this if room creation/join returns 403 or permission errors.
-- If RLS is not enabled, these have no effect.

-- Enable RLS (idempotent - safe to run multiple times)
alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;
alter table public.game_sessions enable row level security;
alter table public.taboo_events enable row level security;

-- Drop existing policies if they exist (avoid duplicates)
drop policy if exists "Allow anon all rooms" on public.rooms;
drop policy if exists "Allow anon all room_participants" on public.room_participants;
drop policy if exists "Allow anon all game_sessions" on public.game_sessions;
drop policy if exists "Allow anon all taboo_events" on public.taboo_events;
-- Legacy policy names from deployment_readiness
drop policy if exists "Allow anon read rooms" on public.rooms;
drop policy if exists "Allow anon insert rooms" on public.rooms;
drop policy if exists "Allow anon update rooms" on public.rooms;
drop policy if exists "Allow anon read room_participants" on public.room_participants;
drop policy if exists "Allow anon insert room_participants" on public.room_participants;
drop policy if exists "Allow anon update room_participants" on public.room_participants;
drop policy if exists "Allow anon read game_sessions" on public.game_sessions;
drop policy if exists "Allow anon insert game_sessions" on public.game_sessions;
drop policy if exists "Allow anon update game_sessions" on public.game_sessions;
drop policy if exists "Allow anon insert taboo_events" on public.taboo_events;

-- Rooms: anon can select, insert, update
create policy "Allow anon all rooms" on public.rooms
  for all using (true) with check (true);

-- Room participants: anon can select, insert, update
create policy "Allow anon all room_participants" on public.room_participants
  for all using (true) with check (true);

-- Game sessions: anon can select, insert, update, delete
create policy "Allow anon all game_sessions" on public.game_sessions
  for all using (true) with check (true);

-- Taboo events: anon can insert (and select for debugging)
create policy "Allow anon all taboo_events" on public.taboo_events
  for all using (true) with check (true);
