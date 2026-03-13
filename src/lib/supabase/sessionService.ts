import { getSupabaseClient } from "./client";
import type { RoomRow, GameSessionRow, SessionPhase } from "./types";

import { validateDeck } from "@/lib/deckValidation";
import type { Card } from "@/types";

// Deck imports - same as useGame
import classicEveryday from "@/data/decks/classic-everyday.json";
import moviesPopculture from "@/data/decks/movies-popculture.json";
import nsfw from "@/data/decks/nsfw.json";

const deckRawMap: Record<string, unknown> = {
  "classic-everyday": classicEveryday,
  "movies-popculture": moviesPopculture,
  nsfw: nsfw,
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadCardsFromDecks(deckIds: string[]): Card[] {
  const all: Card[] = [];
  deckIds.forEach((id) => {
    const raw = deckRawMap[id];
    const cards = raw ? validateDeck(raw, id) : [];
    if (cards.length === 0 && deckRawMap[id]) {
      // deck exists but validation filtered all
      console.warn(`[session] Deck ${id} has no valid cards after validation`);
    }
    all.push(...cards);
  });
  return shuffle(all);
}

export interface CreateSessionInput {
  room: RoomRow;
  selectedDecks: string[];
  roundDuration: number;
  totalRounds: number;
  targetScore: number;
  teamAName?: string;
  teamBName?: string;
}

export async function createSession(input: CreateSessionInput): Promise<GameSessionRow> {
  const supabase = getSupabaseClient();
  const cards = loadCardsFromDecks(input.selectedDecks);
  if (cards.length === 0) {
    throw new Error("No cards in selected decks. Choose at least one deck.");
  }
  const cardOrder = cards.map((c) => c.id);
  const firstCardId = cardOrder[0];

  const { data, error } = await supabase
    .from("game_sessions")
    .insert({
      room_id: input.room.id,
      phase: "playing",
      mode: "local-multiplayer",
      selected_decks: input.selectedDecks,
      round_duration: input.roundDuration,
      total_rounds: input.totalRounds,
      target_score: input.targetScore || 0,
      current_round: 1,
      current_turn_team: "A",
      current_card_id: firstCardId,
      current_card_index: 0,
      card_order: cardOrder,
      used_card_ids: [],
      score_team_a: 0,
      score_team_b: 0,
      timer_started_at: new Date().toISOString(),
      timer_duration_seconds: input.roundDuration || 60,
      round_correct: 0,
      round_skipped: 0,
      round_taboo: 0,
    })
    .select("*")
    .single();

  if (error) {
    const err = error as { message?: string; code?: string; details?: string };
    const msg = typeof err.message === "string" ? err.message : "Failed to create session";
    if (import.meta.env.DEV) {
      console.error("[createSession] Supabase error:", { code: err.code, message: err.message, details: err.details });
    }
    throw new Error(
      err.code === "PGRST204"
        ? `Database schema mismatch. Run supabase/QUICK_FIX_GAME_SESSIONS.sql in Supabase SQL Editor, then try again.`
        : `Failed to start game: ${msg}`
    );
  }

  const { error: roomUpdateError } = await supabase
    .from("rooms")
    .update({ status: "playing", updated_at: new Date().toISOString() })
    .eq("id", input.room.id);

  if (roomUpdateError && import.meta.env.DEV) {
    console.warn("[createSession] Room status update failed:", roomUpdateError);
  }

  return data as GameSessionRow;
}

export async function getSessionByRoomId(roomId: string): Promise<GameSessionRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("room_id", roomId)
    .maybeSingle();
  if (error) throw error;
  return data as GameSessionRow | null;
}

function getNextCardId(
  cardOrder: string[],
  usedIds: string[],
  currentIndex: number
): { nextId: string | null; nextIndex: number; newUsedIds: string[] } {
  const usedSet = new Set(usedIds);
  let idx = currentIndex + 1;
  while (idx < cardOrder.length && usedSet.has(cardOrder[idx])) idx++;
  if (idx < cardOrder.length) return { nextId: cardOrder[idx], nextIndex: idx, newUsedIds: usedIds };
  const remaining = cardOrder.filter((id) => !usedSet.has(id));
  if (remaining.length === 0) {
    return { nextId: cardOrder[0], nextIndex: 0, newUsedIds: [] };
  }
  const nextId = remaining[0];
  const nextIndex = cardOrder.indexOf(nextId);
  return { nextId, nextIndex, newUsedIds: usedIds };
}

export type CardAction = "correct" | "skip" | "taboo";

export async function advanceCard(
  session: GameSessionRow,
  action: CardAction,
  tabooWord?: string
): Promise<GameSessionRow> {
  const supabase = getSupabaseClient();
  if (session.phase !== "playing") return session;
  const cardId = session.current_card_id;
  if (!cardId) return session;

  const usedIds = [...(session.used_card_ids || [])];
  let scoreA = session.score_team_a;
  let scoreB = session.score_team_b;
  let roundCorrect = session.round_correct;
  let roundSkipped = session.round_skipped;
  let roundTaboo = session.round_taboo;

  const team = session.current_turn_team;

  if (action === "correct") {
    scoreA = team === "A" ? scoreA + 1 : scoreA;
    scoreB = team === "B" ? scoreB + 1 : scoreB;
    roundCorrect += 1;
    usedIds.push(cardId);
  } else if (action === "skip") {
    roundSkipped += 1;
  } else if (action === "taboo") {
    scoreA = team === "A" ? scoreA - 1 : scoreA;
    scoreB = team === "B" ? scoreB - 1 : scoreB;
    roundTaboo += 1;
    usedIds.push(cardId);
    if (tabooWord) {
      await supabase.from("taboo_events").insert({
        session_id: session.id,
        round_number: session.current_round,
        card_id: cardId,
        spoken_word: tabooWord,
        reported_by_team: team === "A" ? "B" : "A",
      });
    }
  }

  const { nextId, nextIndex, newUsedIds } = getNextCardId(
    session.card_order || [],
    usedIds,
    session.current_card_index
  );

  const { data, error } = await supabase
    .from("game_sessions")
    .update({
      current_card_id: nextId,
      current_card_index: nextIndex,
      used_card_ids: newUsedIds,
      score_team_a: scoreA,
      score_team_b: scoreB,
      round_correct: roundCorrect,
      round_skipped: roundSkipped,
      round_taboo: roundTaboo,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.id)
    .select("*")
    .single();

  if (error) throw error;
  return data as GameSessionRow;
}

export async function endRound(session: GameSessionRow): Promise<GameSessionRow> {
  const supabase = getSupabaseClient();
  if (session.phase !== "playing") return session;

  const { data, error } = await supabase
    .from("game_sessions")
    .update({
      phase: "round_summary",
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.id)
    .select("*")
    .single();

  if (error) throw error;
  return data as GameSessionRow;
}

export async function nextRound(session: GameSessionRow): Promise<GameSessionRow> {
  const supabase = getSupabaseClient();
  if (session.phase !== "round_summary") return session;

  const nextTeam = session.current_turn_team === "A" ? "B" : "A";
  const newRound = session.current_round + 1;

  const cardOrder = session.card_order || [];
  const usedIds = session.used_card_ids || [];
  const { nextId, nextIndex } = getNextCardId(cardOrder, usedIds, -1);

  const isGameOver =
    newRound > session.total_rounds ||
    (session.target_score && session.target_score > 0 &&
      (session.score_team_a >= session.target_score || session.score_team_b >= session.target_score));

  const phase: SessionPhase = isGameOver ? "results" : "playing";

  const updates: Record<string, unknown> = {
    phase,
    current_round: newRound,
    current_turn_team: nextTeam,
    round_correct: 0,
    round_skipped: 0,
    round_taboo: 0,
    updated_at: new Date().toISOString(),
  };

  if (phase === "playing") {
    updates.current_card_id = nextId;
    updates.current_card_index = nextIndex;
    updates.timer_started_at = new Date().toISOString();
    updates.timer_duration_seconds = session.round_duration || 60;
  }

  const { data, error } = await supabase
    .from("game_sessions")
    .update(updates)
    .eq("id", session.id)
    .select("*")
    .single();

  if (error) throw error;
  return data as GameSessionRow;
}

export async function resetSessionToLobby(roomId: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.from("game_sessions").delete().eq("room_id", roomId);
  await supabase.from("rooms").update({ status: "lobby" }).eq("id", roomId);
}

/** End game early from round_summary: transition to results. */
export async function endGameEarly(session: GameSessionRow): Promise<GameSessionRow> {
  const supabase = getSupabaseClient();
  if (session.phase !== "round_summary") return session;
  const { data, error } = await supabase
    .from("game_sessions")
    .update({ phase: "results", updated_at: new Date().toISOString() })
    .eq("id", session.id)
    .select("*")
    .single();
  if (error) throw error;
  return data as GameSessionRow;
}

export { loadCardsFromDecks };
