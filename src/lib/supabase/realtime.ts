import { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabaseClient } from "./client";
import type { RoomRow, RoomParticipantRow, GameSessionRow } from "./types";

export type RoomCallback = (room: RoomRow) => void;
export type ParticipantsCallback = (participants: RoomParticipantRow[]) => void;

export type RoomOrNullCallback = (room: RoomRow | null) => void;

export function subscribeToRoom(
  roomId: string,
  onChange: RoomCallback | RoomOrNullCallback,
): RealtimeChannel {
  const supabase = getSupabaseClient();
  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
      (payload) => {
        if (payload.eventType === "DELETE") {
          (onChange as RoomOrNullCallback)(null);
        } else if (payload.new) {
          (onChange as RoomCallback)(payload.new as RoomRow);
        }
      },
    )
    .subscribe();

  return channel;
}

export function subscribeToParticipants(
  roomId: string,
  onChange: ParticipantsCallback,
): RealtimeChannel {
  const supabase = getSupabaseClient();
  const channel = supabase
    .channel(`room-participants:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "room_participants",
        filter: `room_id=eq.${roomId}`,
      },
      async () => {
        const { data, error } = await supabase
          .from("room_participants")
          .select("*")
          .eq("room_id", roomId);

        if (error) {
          if (import.meta.env.DEV) console.warn("[realtime] Failed to refresh participants:", error);
          return;
        }

        onChange((data ?? []) as RoomParticipantRow[]);
      },
    )
    .subscribe();

  return channel;
}

export type SessionCallback = (session: GameSessionRow) => void;

/** Subscribe to a specific session by ID. Use when you already have the session. */
export function subscribeToSession(
  sessionId: string,
  onChange: SessionCallback
): RealtimeChannel {
  const supabase = getSupabaseClient();
  const channel = supabase
    .channel(`session:${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "game_sessions",
        filter: `id=eq.${sessionId}`,
      },
      (payload) => {
        if (payload.new) {
          onChange(payload.new as GameSessionRow);
        }
      }
    )
    .subscribe();
  return channel;
}

/** Subscribe to game_sessions by room_id. Fires on INSERT (session created), UPDATE, DELETE. */
export function subscribeToSessionByRoomId(
  roomId: string,
  onChange: (session: GameSessionRow | null) => void
): RealtimeChannel {
  const supabase = getSupabaseClient();
  const channel = supabase
    .channel(`session-room:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "game_sessions",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        if (payload.eventType === "DELETE") {
          onChange(null);
        } else if (payload.new) {
          onChange(payload.new as GameSessionRow);
        }
      }
    )
    .subscribe();
  return channel;
}

