-- Phase 4: Room / Session Cleanup
-- Mark rooms as closed when appropriate; support host disconnect detection.

-- Add closed_at for tracking when a room was closed (optional, for analytics)
alter table public.rooms add column if not exists closed_at timestamptz;

-- Ensure status allows 'closed'
-- (schema may already have it; this is idempotent)
-- No change needed if rooms.status already supports 'closed' via application logic.

-- Optional: Function to close room when both participants have left
-- Run manually or via cron if desired:
/*
create or replace function close_empty_rooms()
returns void as $$
begin
  update public.rooms r
  set status = 'closed', closed_at = now(), updated_at = now()
  where r.status in ('lobby', 'playing')
  and not exists (
    select 1 from public.room_participants rp
    where rp.room_id = r.id and rp.connected = true
  );
end;
$$ language plpgsql;
*/
