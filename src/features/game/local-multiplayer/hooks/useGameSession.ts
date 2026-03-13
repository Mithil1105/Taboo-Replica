import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionByRoomId } from "@/lib/supabase/sessionService";
import type { GameSessionRow } from "@/lib/supabase/types";
import { subscribeToSessionByRoomId } from "@/lib/supabase/realtime";

interface UseGameSessionResult {
  session: GameSessionRow | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGameSession(roomId: string | undefined | null): UseGameSessionResult {
  const [session, setSession] = useState<GameSessionRow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!roomId || !isSupabaseConfigured) return;
    try {
      const s = await getSessionByRoomId(roomId);
      setSession(s);
      return s;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load session.");
      setSession(null);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    if (!isSupabaseConfigured) {
      setError("Multiplayer backend is not configured.");
      return;
    }

    let channel: ReturnType<typeof subscribeToSessionByRoomId> | null = null;

    setIsLoading(true);
    setError(null);

    getSessionByRoomId(roomId)
      .then((s) => {
        setSession(s);
        channel = subscribeToSessionByRoomId(roomId, (updated) => {
          setSession(updated);
        });
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load session.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      channel?.unsubscribe();
    };
  }, [roomId]);

  const refetch = useCallback(async () => {
    if (!roomId) return;
    setIsLoading(true);
    try {
      await fetchSession();
    } finally {
      setIsLoading(false);
    }
  }, [roomId, fetchSession]);

  return { session, isLoading, error, refetch };
}
