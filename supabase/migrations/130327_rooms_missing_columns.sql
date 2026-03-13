-- Fix: Add missing columns to rooms table if schema was created from an older version
-- Run this if you get: "Could not find the 'created_by_team' column of 'rooms' in the schema cache"
-- Also fixes room_participants_team_check if you get: "violates check constraint"

-- Rooms: missing columns
alter table public.rooms add column if not exists created_by_team text;
alter table public.rooms add column if not exists host_device_id text;
alter table public.rooms add column if not exists mode text not null default 'local-multiplayer';
alter table public.rooms add column if not exists team_a_name text;
alter table public.rooms add column if not exists team_b_name text;
alter table public.rooms add column if not exists selected_decks jsonb;
alter table public.rooms add column if not exists round_duration integer;
alter table public.rooms add column if not exists total_rounds integer;
alter table public.rooms add column if not exists target_score integer;

-- Room participants: ensure team check allows 'A' and 'B' (fixes "room_participants_team_check" violation)
alter table public.room_participants drop constraint if exists room_participants_team_check;
alter table public.room_participants add constraint room_participants_team_check check (team in ('A', 'B'));
