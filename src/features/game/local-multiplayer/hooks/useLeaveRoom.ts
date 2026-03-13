import { useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { leaveRoom } from "@/lib/supabase/roomService";
import type { LeaveRoomInput } from "@/lib/supabase/roomService";

export function useLeaveRoom() {
  const [isLeaving, setIsLeaving] = useState(false);

  const mutate = async (input: LeaveRoomInput): Promise<void> => {
    if (!isSupabaseConfigured) return;
    setIsLeaving(true);
    try {
      await leaveRoom(input);
    } finally {
      setIsLeaving(false);
    }
  };

  return { mutate, isLeaving };
}

