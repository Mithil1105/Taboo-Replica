import { useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { joinRoom } from "@/lib/supabase/roomService";
import type { JoinRoomInput, RoomWithParticipants } from "@/lib/supabase/roomService";

export function useJoinRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (input: JoinRoomInput): Promise<RoomWithParticipants | null> => {
    if (!isSupabaseConfigured) {
      setError("Multiplayer backend is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await joinRoom(input);
      return result;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to join room.";
      setError(message);
      if (import.meta.env.DEV && e) console.error("[useJoinRoom]", e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}

