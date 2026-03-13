/**
 * Centralized multiplayer action guards.
 * Ensures phase checks, role checks, and deduplication are consistent.
 */
import type { GameSessionRow } from "./types";
import type { LocalTeamId } from "@/features/game/local-multiplayer/types";

export type MultiplayerAction =
  | "correct"
  | "skip"
  | "taboo"
  | "nextRound"
  | "playAgain"
  | "leaveRoom";

/** Can the clue device perform Correct/Skip? */
export function canClueAct(session: GameSessionRow, myTeam: LocalTeamId | null): boolean {
  if (!session || !myTeam) return false;
  if (session.phase !== "playing") return false;
  return session.current_turn_team === myTeam;
}

/** Can the observer device perform Taboo? */
export function canObserverAct(session: GameSessionRow, myTeam: LocalTeamId | null): boolean {
  if (!session || !myTeam) return false;
  if (session.phase !== "playing") return false;
  return session.current_turn_team !== myTeam;
}

/** Can Next Round be triggered? (host only, round_summary phase) */
export function canNextRound(session: GameSessionRow, isHost: boolean): boolean {
  if (!session || !isHost) return false;
  return session.phase === "round_summary";
}

/** Can Play Again be triggered? (host only, results phase) */
export function canPlayAgain(session: GameSessionRow, isHost: boolean): boolean {
  if (!session || !isHost) return false;
  return session.phase === "results";
}

/** Is session in a state where card actions are valid? */
export function isPlayingPhase(session: GameSessionRow | null): boolean {
  return session?.phase === "playing";
}
