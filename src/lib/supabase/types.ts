export type RoomStatus = "lobby" | "starting" | "playing" | "closed";

export interface RoomRow {
  id: string;
  room_code: string;
  status: RoomStatus;
  host_device_id: string | null;
  created_by_team: string | null;
  mode: string | null;
  created_at: string;
  updated_at: string;
  team_a_name: string | null;
  team_b_name: string | null;
  selected_decks: unknown | null;
  round_duration: number | null;
  total_rounds: number | null;
  target_score: number | null;
}

export interface RoomParticipantRow {
  id: string;
  room_id: string;
  device_id: string;
  team: "A" | "B";
  is_host: boolean;
  connected: boolean;
  joined_at: string;
  last_seen_at: string | null;
}

export type SessionPhase = "playing" | "round_summary" | "results";

export interface GameSessionRow {
  id: string;
  room_id: string;
  phase: SessionPhase;
  mode: string;
  selected_decks: string[];
  round_duration: number;
  total_rounds: number;
  target_score: number | null;
  current_round: number;
  current_turn_team: "A" | "B";
  current_card_id: string | null;
  current_card_index: number;
  card_order: string[];
  used_card_ids: string[];
  score_team_a: number;
  score_team_b: number;
  timer_started_at: string | null;
  timer_duration_seconds: number | null;
  round_correct: number;
  round_skipped: number;
  round_taboo: number;
  created_at: string;
  updated_at: string;
}

export interface TabooEventRow {
  id: string;
  session_id: string;
  round_number: number;
  card_id: string;
  spoken_word: string;
  reported_by_team: "A" | "B";
  created_at: string;
}

