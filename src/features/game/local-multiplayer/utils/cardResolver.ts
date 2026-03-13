import { validateDeck } from "@/lib/deckValidation";
import type { Card } from "@/types";

import classicEveryday from "@/data/decks/classic-everyday.json";
import moviesPopculture from "@/data/decks/movies-popculture.json";
import nsfw from "@/data/decks/nsfw.json";

const DECK_IDS = ["classic-everyday", "movies-popculture", "nsfw"] as const;
const deckRawMap: Record<string, unknown> = {
  "classic-everyday": classicEveryday,
  "movies-popculture": moviesPopculture,
  nsfw: nsfw,
};

let cardById: Map<string, Card> | null = null;

function buildCardMap(): Map<string, Card> {
  if (cardById) return cardById;
  const map = new Map<string, Card>();
  DECK_IDS.forEach((id) => {
    const raw = deckRawMap[id];
    const cards = raw ? validateDeck(raw, id) : [];
    cards.forEach((c) => map.set(c.id, c));
  });
  cardById = map;
  return map;
}

export function getCardById(id: string): Card | null {
  return buildCardMap().get(id) ?? null;
}
