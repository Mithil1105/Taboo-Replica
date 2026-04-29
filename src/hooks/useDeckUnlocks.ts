import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface UseDeckUnlocksResult {
  unlockedDeckIds: Set<string>;
  loading: boolean;
  /** Refetch from the server (e.g. after a successful purchase). */
  refresh: () => Promise<void>;
}

const EMPTY: ReadonlySet<string> = new Set<string>();

/**
 * Loads the deck IDs the current user has purchased.
 * Returns an empty set when:
 *  - Supabase is not configured, or
 *  - the user is not signed in.
 */
export function useDeckUnlocks(): UseDeckUnlocksResult {
  const { user, configured } = useAuth();
  const [unlockedDeckIds, setUnlockedDeckIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUnlocks = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return new Set<string>();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("deck_unlocks")
      .select("deck_id")
      .eq("user_id", userId);
    if (error) {
      console.warn("[deck_unlocks] fetch failed", error.message);
      return new Set<string>();
    }
    const paidUnlocks = (data ?? []).map((r) => String((r as { deck_id: string }).deck_id));

    const nowIso = new Date().toISOString();
    const { data: grants } = await supabase
      .from("friend_deck_grants")
      .select("deck_id")
      .eq("grantee_user_id", userId)
      .is("revoked_at", null)
      .lte("starts_at", nowIso)
      .gte("expires_at", nowIso);
    const friendUnlocks = (grants ?? []).map((r) => String((r as { deck_id: string }).deck_id));

    return new Set<string>([...paidUnlocks, ...friendUnlocks]);
  }, []);

  const refresh = useCallback(async () => {
    if (!configured || !user) {
      setUnlockedDeckIds(new Set(EMPTY));
      return;
    }
    setLoading(true);
    try {
      const next = await fetchUnlocks(user.id);
      setUnlockedDeckIds(next);
    } finally {
      setLoading(false);
    }
  }, [configured, user, fetchUnlocks]);

  useEffect(() => {
    let active = true;
    if (!configured || !user) {
      setUnlockedDeckIds(new Set(EMPTY));
      return;
    }
    setLoading(true);
    fetchUnlocks(user.id)
      .then((next) => {
        if (active) setUnlockedDeckIds(next);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [configured, user, fetchUnlocks]);

  return { unlockedDeckIds, loading, refresh };
}
