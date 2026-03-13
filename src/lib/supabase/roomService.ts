import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { getSupabaseClient } from "./client";
import type { RoomRow, RoomParticipantRow, RoomStatus } from "./types";

export interface CreateRoomInput {
  team: "A" | "B";
  deviceId: string;
  teamAName?: string;
  teamBName?: string;
}

export interface JoinRoomInput {
  roomCode: string;
  team: "A" | "B";
  deviceId: string;
}

export interface LeaveRoomInput {
  roomCode: string;
  deviceId: string;
}

export interface RoomWithParticipants {
  room: RoomRow;
  participants: RoomParticipantRow[];
}

const ROOM_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateRoomCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += ROOM_CODE_ALPHABET[Math.floor(Math.random() * ROOM_CODE_ALPHABET.length)];
  }
  return code;
}

async function fetchRoomByCode(roomCode: string): Promise<RoomRow | null> {
  const supabase = getSupabaseClient();
  const { data, error }: PostgrestSingleResponse<RoomRow> = await supabase
    .from("rooms")
    .select("*")
    .eq("room_code", roomCode)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data ?? null;
}

/** Extract Supabase error message for user display. */
function formatSupabaseError(err: unknown): string {
  if (err && typeof err === "object" && "message" in err && typeof (err as { message: string }).message === "string") {
    const supabaseErr = err as { message: string; code?: string; details?: string };
    return supabaseErr.details ? `${supabaseErr.message} (${supabaseErr.details})` : supabaseErr.message;
  }
  return err instanceof Error ? err.message : "Unknown error";
}

export async function createRoom(input: CreateRoomInput): Promise<RoomWithParticipants> {
  const supabase = getSupabaseClient();
  const isDev = import.meta.env.DEV;

  let attempts = 0;
  let room: RoomRow | null = null;
  let roomCode: string | null = null;

  while (!room && attempts < 5) {
    attempts += 1;
    const candidate = generateRoomCode();
    const insertPayload = {
      room_code: candidate,
      status: "lobby" as RoomStatus,
      host_device_id: input.deviceId,
      created_by_team: input.team,
      mode: "local-multiplayer",
      team_a_name: input.teamAName ?? null,
      team_b_name: input.teamBName ?? null,
      selected_decks: ["classic-everyday"],
      round_duration: 60,
      total_rounds: 4,
      target_score: 0,
    };

    if (isDev) {
      console.debug("[createRoom] Insert payload:", JSON.stringify(insertPayload, null, 2));
    }

    const { data, error } = await supabase
      .from("rooms")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      if (isDev) {
        console.error("[createRoom] Supabase error:", {
          code: (error as { code?: string }).code,
          message: (error as { message?: string }).message,
          details: (error as { details?: string }).details,
        });
      }
      // Unique violation -> retry with a new code
      const isConflict = typeof (error as { code?: string }).code === "string" && (error as { code: string }).code === "23505";
      if (isConflict) {
        continue;
      }
      throw new Error(`Failed to create room: ${formatSupabaseError(error)}`);
    }

    room = data as RoomRow;
    roomCode = candidate;
  }

  if (!room || !roomCode) {
    throw new Error("Unable to create room after several attempts. Please try again.");
  }

  const team = String(input.team).trim().toUpperCase() === "B" ? "B" : "A";
  const participantPayload = {
    room_id: room.id,
    device_id: input.deviceId,
    team,
    is_host: true,
    connected: true,
  };

  if (isDev) {
    console.debug("[createRoom] Participant insert payload:", JSON.stringify(participantPayload, null, 2));
  }

  const { data: participant, error: participantError } = await getSupabaseClient()
    .from("room_participants")
    .insert(participantPayload)
    .select("*")
    .single();

  if (participantError) {
    if (isDev) {
      console.error("[createRoom] Participant insert error:", participantError);
    }
    throw new Error(`Failed to join room: ${formatSupabaseError(participantError)}`);
  }

  return {
    room,
    participants: [participant as RoomParticipantRow],
  };
}

export async function joinRoom(input: JoinRoomInput): Promise<RoomWithParticipants> {
  const supabase = getSupabaseClient();
  const roomCode = input.roomCode.toUpperCase();

  const room = await fetchRoomByCode(roomCode);
  if (!room) {
    throw new Error("Room not found. Double-check the code and try again.");
  }

  const { data: existingParticipants, error: participantsError } = await supabase
    .from("room_participants")
    .select("*")
    .eq("room_id", room.id);

  if (participantsError) {
    if (import.meta.env.DEV) console.error("[joinRoom] Participants fetch error:", participantsError);
    throw new Error(`Failed to load room: ${formatSupabaseError(participantsError)}`);
  }

  const participants = (existingParticipants ?? []) as RoomParticipantRow[];
  const maxParticipantsReached = participants.length >= 2;
  const existingForDevice = participants.find((p) => p.device_id === input.deviceId);

  if (room.status === "closed") {
    throw new Error("This room has been closed. Create or join a new room.");
  }
  if (room.status === "playing" && !existingForDevice) {
    throw new Error("This game has already started. Ask the host to create a new room.");
  }
  const existingTeam = participants.find((p) => p.team === input.team);

  // Reclaiming own slot
  if (existingForDevice) {
    const { data: updated, error: updateError } = await supabase
      .from("room_participants")
      .update({ connected: true, last_seen_at: new Date().toISOString() })
      .eq("id", existingForDevice.id)
      .select("*")
      .single();

    if (updateError) {
      if (import.meta.env.DEV) console.error("[joinRoom] Reconnect update error:", updateError);
      throw new Error(`Failed to reconnect: ${formatSupabaseError(updateError)}`);
    }

    return {
      room,
      participants: participants.map((p) => (p.id === updated.id ? (updated as RoomParticipantRow) : p)),
    };
  }

  if (existingTeam && existingTeam.device_id !== input.deviceId) {
    throw new Error(`Team ${input.team} is already taken in this room.`);
  }

  if (maxParticipantsReached && !existingTeam) {
    throw new Error("This room already has two devices connected.");
  }

  const isHost = !participants.length;
  const team = String(input.team).trim().toUpperCase() === "B" ? "B" : "A";

  const { data: participant, error: insertError } = await supabase
    .from("room_participants")
    .insert({
      room_id: room.id,
      device_id: input.deviceId,
      team,
      is_host: isHost,
      connected: true,
    })
    .select("*")
    .single();

  if (insertError) {
    if (import.meta.env.DEV) console.error("[joinRoom] Participant insert error:", insertError);
    throw new Error(`Failed to join room: ${formatSupabaseError(insertError)}`);
  }

  return {
    room,
    participants: [...participants, participant as RoomParticipantRow],
  };
}

export async function leaveRoom(input: LeaveRoomInput): Promise<void> {
  const supabase = getSupabaseClient();
  const roomCode = input.roomCode.toUpperCase();
  const room = await fetchRoomByCode(roomCode);
  if (!room) return;

  await supabase
    .from("room_participants")
    .update({ connected: false, last_seen_at: new Date().toISOString() })
    .eq("room_id", room.id)
    .eq("device_id", input.deviceId);

  // If no one left connected, mark room as closed
  const { data: remaining } = await supabase
    .from("room_participants")
    .select("id")
    .eq("room_id", room.id)
    .eq("connected", true);
  if (!remaining?.length) {
    await supabase
      .from("rooms")
      .update({ status: "closed" as RoomStatus, updated_at: new Date().toISOString() })
      .eq("id", room.id);
  }
}

export interface ReconnectParticipantInput {
  roomCode: string;
  deviceId: string;
}

/** Reclaim participant slot on refresh. Sets connected=true and last_seen_at. */
export async function reconnectParticipant(input: ReconnectParticipantInput): Promise<boolean> {
  const supabase = getSupabaseClient();
  const room = await fetchRoomByCode(input.roomCode.toUpperCase());
  if (!room) return false;

  const { data: participants, error: fetchError } = await supabase
    .from("room_participants")
    .select("*")
    .eq("room_id", room.id)
    .eq("device_id", input.deviceId);

  if (fetchError || !participants?.length) return false;

  const { error: updateError } = await supabase
    .from("room_participants")
    .update({ connected: true, last_seen_at: new Date().toISOString() })
    .eq("room_id", room.id)
    .eq("device_id", input.deviceId);

  return !updateError;
}

export async function updateRoomStatus(roomId: string, status: RoomStatus): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("rooms").update({ status }).eq("id", roomId);
  if (error) throw error;
}

export interface RoomSetupInput {
  selectedDecks: string[];
  roundDuration: number;
  totalRounds: number;
  targetScore: number;
  teamAName?: string;
  teamBName?: string;
}

export async function updateRoomSetup(roomId: string, setup: RoomSetupInput): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("rooms")
    .update({
      selected_decks: setup.selectedDecks,
      round_duration: setup.roundDuration,
      total_rounds: setup.totalRounds,
      target_score: setup.targetScore,
      team_a_name: setup.teamAName ?? null,
      team_b_name: setup.teamBName ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", roomId);
  if (error) throw error;
}

/** Close a room (sets status to closed). Host can use this to end the game for everyone. */
export async function closeRoom(roomId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("rooms")
    .update({ status: "closed" as RoomStatus, updated_at: new Date().toISOString() })
    .eq("id", roomId);
  if (error) throw error;
}

export async function getRoomWithParticipants(roomCode: string): Promise<RoomWithParticipants | null> {
  const supabase = getSupabaseClient();
  const room = await fetchRoomByCode(roomCode.toUpperCase());
  if (!room) return null;

  const { data: participantRows, error } = await supabase
    .from("room_participants")
    .select("*")
    .eq("room_id", room.id);

  if (error) throw error;

  return {
    room,
    participants: (participantRows ?? []) as RoomParticipantRow[],
  };
}

