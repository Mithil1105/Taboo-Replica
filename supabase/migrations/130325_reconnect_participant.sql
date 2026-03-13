-- Phase 4: Reconnect / Session Recovery
-- Ensures participants can reclaim their slot on refresh.
-- No schema changes required - room_participants.connected and last_seen_at already exist.
-- This file documents the reconnect flow; the app calls roomService.reconnectParticipant() on room mount.

-- Optional: Add index for faster device_id lookups when reclaiming (if not already present)
create index if not exists idx_room_participants_device_room
  on public.room_participants (device_id, room_id);
