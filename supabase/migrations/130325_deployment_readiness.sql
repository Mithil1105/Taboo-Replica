-- Phase 4: Deployment / Production Readiness
-- Run these in your Supabase project for production deployment.

-- 1. Ensure game_sessions is in the realtime publication (for live gameplay sync)
-- Run in Supabase SQL Editor if not already done:
-- alter publication supabase_realtime add table public.game_sessions;

-- 2. Optional: Add closed_at to rooms for analytics (if not already present)
alter table public.rooms add column if not exists closed_at timestamptz;

-- 3. RLS (Row Level Security) - Enable if you want to restrict access
-- For anon access (no auth), you may use service role or disable RLS.
-- Example policies for anon read/write on rooms and participants:
/*
alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;
alter table public.game_sessions enable row level security;
alter table public.taboo_events enable row level security;

create policy "Allow anon read rooms" on public.rooms for select using (true);
create policy "Allow anon insert rooms" on public.rooms for insert with check (true);
create policy "Allow anon update rooms" on public.rooms for update using (true);

create policy "Allow anon read room_participants" on public.room_participants for select using (true);
create policy "Allow anon insert room_participants" on public.room_participants for insert with check (true);
create policy "Allow anon update room_participants" on public.room_participants for update using (true);

create policy "Allow anon read game_sessions" on public.game_sessions for select using (true);
create policy "Allow anon insert game_sessions" on public.game_sessions for insert with check (true);
create policy "Allow anon update game_sessions" on public.game_sessions for update using (true);

create policy "Allow anon insert taboo_events" on public.taboo_events for insert with check (true);
*/
