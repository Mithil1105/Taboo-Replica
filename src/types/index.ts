export interface Card {
  id: string;
  word: string;
  tabooWords: string[];
  difficulty?: string;
  category?: string;
}

export interface DeckMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  colorTag: string;
  icon: string;
  cardCount: number;
  filePath: string;
  isPremium: boolean;
  isActive: boolean;
  /** Optional age rating, e.g. "18+" */
  ageRating?: string;
}

export interface Team {
  name: string;
  score: number;
  correct: number;
  skipped: number;
  taboo: number;
}

export interface GameSettings {
  roundDuration: number;
  totalRounds: number;
  teams: [Team, Team];
  selectedDeckIds: string[];
  /** Max skips allowed per round (0 = unlimited). */
  maxSkipsPerRound: number;
  /** Game ends when a team reaches this score (0 = disabled, use total rounds only). */
  scoreLimit: number;
}

export interface RoundResult {
  teamIndex: number;
  correct: number;
  skipped: number;
  taboo: number;
  score: number;
}

export type GamePhase = 
  | "home"
  | "deckSelection"
  | "gameSetup"
  | "playing"
  | "roundEnd"
  | "gameOver";
