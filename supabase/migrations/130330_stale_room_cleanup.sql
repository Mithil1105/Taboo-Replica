-- Stale room cleanup: for cron or manual runs
-- Cleans up closed/abandoned rooms to keep storage small.
-- Run via Supabase pg_cron, Edge Function, or manually.

-- Option 1: Delete closed rooms older than 24 hours
-- (Useful if app sometimes marks rooms closed without full cleanup)
-- delete from public.rooms
-- where status = 'closed'
--   and updated_at < now() - interval '24 hours';

-- Option 2: Delete rooms with no connected participants, older than 2 hours
-- (Abandoned rooms where everyone left without triggering cleanup)
-- delete from public.game_sessions gs
-- where gs.room_id in (
--   select r.id from public.rooms r
--   left join public.room_participants rp on rp.room_id = r.id and rp.connected = true
--   where rp.id is null
--     and r.updated_at < now() - interval '2 hours'
-- );
-- delete from public.rooms r
-- where not exists (select 1 from public.room_participants rp where rp.room_id = r.id and rp.connected = true)
--   and r.updated_at < now() - interval '2 hours';

-- Option 3: Function for cron - deletes closed rooms older than 24h
-- Must delete game_sessions first (FK), then rooms (room_participants cascade)
create or replace function public.cleanup_stale_rooms()
returns integer
language plpgsql
security definer
as $$
declare
  deleted_count integer;
  room_ids uuid[];
begin
  select array_agg(id) into room_ids
  from public.rooms
  where status = 'closed'
    and updated_at < now() - interval '24 hours';

  if room_ids is null or array_length(room_ids, 1) is null then
    return 0;
  end if;

  delete from public.game_sessions where room_id = any(room_ids);
  with deleted as (
    delete from public.rooms where id = any(room_ids) returning id
  )
  select count(*)::integer into deleted_count from deleted;
  return deleted_count;
end;
$$;

-- Grant execute to service role (for cron)
-- grant execute on function public.cleanup_stale_rooms() to service_role;
