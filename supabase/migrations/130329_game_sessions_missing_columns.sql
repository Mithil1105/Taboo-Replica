-- Fix: Add missing columns to game_sessions table
-- Run this if you get: "Could not find the 'card_order' column of 'game_sessions' in the schema cache"
-- If game_sessions table doesn't exist, run supabase/schema.sql first.

alter table public.game_sessions add column if not exists phase text not null default 'playing';
alter table public.game_sessions add column if not exists mode text not null default 'local-multiplayer';
alter table public.game_sessions add column if not exists selected_decks jsonb not null default '[]';
alter table public.game_sessions add column if not exists round_duration integer not null default 60;
alter table public.game_sessions add column if not exists total_rounds integer not null default 4;
alter table public.game_sessions add column if not exists target_score integer default 0;
alter table public.game_sessions add column if not exists current_round integer not null default 1;
alter table public.game_sessions add column if not exists current_turn_team text not null default 'A';
alter table public.game_sessions add column if not exists current_card_id text;
alter table public.game_sessions add column if not exists current_card_index integer not null default 0;
alter table public.game_sessions add column if not exists card_order jsonb not null default '[]';
alter table public.game_sessions add column if not exists used_card_ids jsonb not null default '[]';
alter table public.game_sessions add column if not exists score_team_a integer not null default 0;
alter table public.game_sessions add column if not exists score_team_b integer not null default 0;
alter table public.game_sessions add column if not exists timer_started_at timestamptz;
alter table public.game_sessions add column if not exists timer_duration_seconds integer;
alter table public.game_sessions add column if not exists round_correct integer not null default 0;
alter table public.game_sessions add column if not exists round_skipped integer not null default 0;
alter table public.game_sessions add column if not exists round_taboo integer not null default 0;
