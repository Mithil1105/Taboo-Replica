import { useEffect, useState, useRef } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getRoomWithParticipants, reconnectParticipant } from "@/lib/supabase/roomService";
import type { RoomRow, RoomParticipantRow } from "@/lib/supabase/types";
import { subscribeToRoom, subscribeToParticipants } from "@/lib/supabase/realtime";

interface UseRoomResult {
  room: RoomRow | null;
  participants: RoomParticipantRow[];
  isLoading: boolean;
  error: string | null;
  isReconnecting: boolean;
}

export function useRoom(
  roomCode: string | undefined | null,
  deviceId?: string | null
): UseRoomResult {
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [participants, setParticipants] = useState<RoomParticipantRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectAttempted = useRef(false);

  useEffect(() => {
    if (!roomCode) return;

    if (!isSupabaseConfigured) {
      setError("Multiplayer backend is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }

    let roomChannel: ReturnType<typeof subscribeToRoom> | null = null;
    let participantsChannel: ReturnType<typeof subscribeToParticipants> | null = null;
    reconnectAttempted.current = false;

    setIsLoading(true);
    setError(null);

    getRoomWithParticipants(roomCode)
      .then(async (result) => {
        if (!result) {
          setError("Room not found.");
          return;
        }
        setRoom(result.room);
        setParticipants(result.participants);

        // Reconnect: reclaim participant slot if this device already belongs to the room
        if (deviceId && !reconnectAttempted.current) {
          const myParticipant = result.participants.find((p) => p.device_id === deviceId);
          if (myParticipant) {
            reconnectAttempted.current = true;
            setIsReconnecting(true);
            try {
              await reconnectParticipant({ roomCode: roomCode.toUpperCase(), deviceId });
              const refreshed = await getRoomWithParticipants(roomCode);
              if (refreshed) setParticipants(refreshed.participants);
            } finally {
              setIsReconnecting(false);
            }
          }
        }

        roomChannel = subscribeToRoom(result.room.id, (updated) => {
          setRoom(updated);
        });

        participantsChannel = subscribeToParticipants(result.room.id, (list) => {
          setParticipants(list);
        });
      })
      .catch((e) => {
        const message = e instanceof Error ? e.message : "Unable to load room.";
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      roomChannel?.unsubscribe();
      participantsChannel?.unsubscribe();
    };
  }, [roomCode, deviceId]);

  return { room, participants, isLoading, error, isReconnecting };
}

