-- Realtime: Add rooms and room_participants to publication for live lobby/setup sync
-- Run this in Supabase SQL Editor if room/setup changes don't sync between devices.
-- game_sessions is needed for gameplay sync.

-- Add rooms (for setup changes: selected_decks, round_duration, etc.)
alter publication supabase_realtime add table public.rooms;

-- Add room_participants (for team join/leave, connected status)
alter publication supabase_realtime add table public.room_participants;

-- Add game_sessions (for gameplay: card, scores, phase, round)
alter publication supabase_realtime add table public.game_sessions;

-- If you get "table already in publication", that table is configured. Continue with the rest.
