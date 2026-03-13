/**
 * Deck and card validation for safe content loading.
 * Filters invalid cards instead of crashing; logs warnings in development.
 */
import type { Card } from "@/types";

const isDev = import.meta.env.DEV;

/** Minimal deck registry entry shape */
export interface DeckRegistryEntry {
  id: string;
  name?: string;
  filePath?: string;
  cardCount?: number;
  [key: string]: unknown;
}

/** Validate deck registry array. Returns valid entries. */
export function validateDeckRegistry(raw: unknown): DeckRegistryEntry[] {
  if (!Array.isArray(raw)) {
    if (isDev) console.warn("[deck] Registry: expected array, got", typeof raw);
    return [];
  }
  const valid: DeckRegistryEntry[] = [];
  const seenIds = new Set<string>();
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id.trim() : "";
    if (!id) {
      if (isDev) console.warn(`[deck] Registry entry at ${i}: missing id`);
      continue;
    }
    if (seenIds.has(id)) {
      if (isDev) console.warn(`[deck] Registry: duplicate deck id "${id}"`);
      continue;
    }
    seenIds.add(id);
    valid.push({ ...o, id } as DeckRegistryEntry);
  }
  return valid;
}

function devWarn(msg: string) {
  if (isDev) console.warn(`[deck] ${msg}`);
}

/** Get taboo words array from card - supports tabooWords, taboo_words, or taboo */
function getTabooWordsArray(o: Record<string, unknown>): unknown[] | null {
  const arr = o.tabooWords ?? o.taboo_words ?? o.taboo;
  return Array.isArray(arr) ? arr : null;
}

/** Minimal card shape - id, word, taboo words array (tabooWords, taboo_words, or taboo) */
function isValidCardShape(obj: unknown): obj is { id: string; word: string; tabooWords?: unknown[]; taboo_words?: unknown[]; taboo?: unknown[] } {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  const tabooArr = getTabooWordsArray(o);
  return (
    typeof o.id === "string" &&
    o.id.length > 0 &&
    typeof o.word === "string" &&
    o.word.length > 0 &&
    tabooArr !== null &&
    tabooArr.length > 0
  );
}

const MAX_TABOO_LENGTH = 50;
const MIN_TABOO_COUNT = 3;
const MAX_TABOO_COUNT = 6;

/** Validate and sanitize a single taboo word */
function sanitizeTabooWord(w: unknown): string | null {
  if (typeof w !== "string") return null;
  const trimmed = w.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_TABOO_LENGTH) return null;
  return trimmed;
}

/** Normalize for comparison (lowercase, trimmed) */
function normalizeForCompare(s: string): string {
  return s.toLowerCase().trim();
}

/** Validate and sanitize a card. Returns null if invalid. */
export function validateCard(raw: unknown, seenWords?: Set<string>): Card | null {
  if (!isValidCardShape(raw)) {
    devWarn(`Invalid card shape: ${JSON.stringify(raw)?.slice(0, 80)}`);
    return null;
  }

  const o = raw as Record<string, unknown>;
  const mainWord = (raw as { word: string }).word.trim();
  const mainWordNorm = normalizeForCompare(mainWord);

  const tabooArr = getTabooWordsArray(o) ?? [];
  let tabooWords = tabooArr
    .map(sanitizeTabooWord)
    .filter((w): w is string => w !== null);

  if (tabooWords.length === 0) {
    devWarn(`Card "${mainWord}" has no valid taboo words`);
    return null;
  }

  const tabooSet = new Set<string>();
  const filtered: string[] = [];
  for (const w of tabooWords) {
    const norm = normalizeForCompare(w);
    if (norm === mainWordNorm || (mainWordNorm.length > 0 && norm.includes(mainWordNorm))) {
      devWarn(`Card "${mainWord}": taboo word contains main word, skipping "${w}"`);
      continue;
    }
    if (tabooSet.has(norm)) {
      devWarn(`Card "${mainWord}": duplicate taboo word "${w}"`);
      continue;
    }
    tabooSet.add(norm);
    filtered.push(w);
  }

  tabooWords = filtered;
  if (tabooWords.length === 0) {
    devWarn(`Card "${mainWord}" has no valid taboo words after filtering`);
    return null;
  }

  if (tabooWords.length < MIN_TABOO_COUNT && isDev) {
    devWarn(`Card "${mainWord}": only ${tabooWords.length} taboo words (recommend ${MIN_TABOO_COUNT}-${MAX_TABOO_COUNT})`);
  }
  if (tabooWords.length > MAX_TABOO_COUNT) {
    tabooWords = tabooWords.slice(0, MAX_TABOO_COUNT);
    devWarn(`Card "${mainWord}": trimmed taboo list to ${MAX_TABOO_COUNT}`);
  }

  if (seenWords?.has(mainWordNorm)) {
    devWarn(`Deck: duplicate card word "${mainWord}"`);
    return null;
  }
  seenWords?.add(mainWordNorm);

  const difficultyRaw = (raw as Card).difficulty;
  const difficulty =
    typeof difficultyRaw === "string" && ["easy", "medium", "hard"].includes(difficultyRaw.toLowerCase())
      ? (difficultyRaw.toLowerCase() as "easy" | "medium" | "hard")
      : "medium";

  return {
    id: (raw as Record<string, unknown>).id as string,
    word: mainWord,
    tabooWords,
    difficulty,
    category: typeof (raw as Card).category === "string" ? (raw as Card).category : undefined,
  };
}

/** Load and validate cards from a raw deck array. Filters invalid cards. */
export function validateDeck(raw: unknown, deckId: string): Card[] {
  if (!Array.isArray(raw)) {
    devWarn(`Deck ${deckId}: expected array, got ${typeof raw}`);
    return [];
  }

  const valid: Card[] = [];
  const seenIds = new Set<string>();
  const seenWords = new Set<string>();

  for (let i = 0; i < raw.length; i++) {
    const card = validateCard(raw[i], seenWords);
    if (!card) continue;
    if (seenIds.has(card.id)) {
      devWarn(`Deck ${deckId}: duplicate card id "${card.id}" at index ${i}`);
      continue;
    }
    seenIds.add(card.id);
    valid.push(card);
  }

  if (valid.length < raw.length && isDev) {
    devWarn(`Deck ${deckId}: filtered ${raw.length - valid.length} invalid cards, ${valid.length} valid`);
  }

  return valid;
}

/** Map validated registry entry to DeckMeta with safe defaults. */
export function toDeckMeta(entry: DeckRegistryEntry): Record<string, unknown> & { id: string; name: string; cardCount: number; isActive: boolean } {
  const o = entry as Record<string, unknown>;
  return {
    id: entry.id,
    name: typeof entry.name === "string" ? entry.name : entry.id,
    description: typeof o.description === "string" ? o.description : "",
    category: typeof o.category === "string" ? o.category : "General",
    difficulty: typeof o.difficulty === "string" ? o.difficulty : "Medium",
    colorTag: typeof o.colorTag === "string" ? o.colorTag : "gray",
    icon: typeof o.icon === "string" ? o.icon : "Sparkles",
    cardCount: typeof entry.cardCount === "number" && entry.cardCount >= 0 ? entry.cardCount : 0,
    filePath: typeof entry.filePath === "string" ? entry.filePath : "",
    isPremium: Boolean(o.isPremium),
    isActive: o.isActive !== false,
    ...entry,
  } as Record<string, unknown> & { id: string; name: string; cardCount: number; isActive: boolean };
}

/** Get validated deck list from raw registry. Use for setup/lobby. */
export function getValidatedDecks(raw: unknown): ReturnType<typeof toDeckMeta>[] {
  return validateDeckRegistry(raw).map(toDeckMeta);
}
