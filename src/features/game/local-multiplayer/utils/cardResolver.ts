import { validateDeck } from "@/lib/deckValidation";
import type { Card } from "@/types";

import classicEveryday from "@/data/decks/classic-everyday.json";
import moviesPopculture from "@/data/decks/movies-popculture.json";
import nsfw from "@/data/decks/nsfw.json";
import classic from "@/data/decks/classic.json";
import classic2 from "@/data/decks/classic2.json";
import bollywood1 from "@/data/decks/bollywood-1.json";
import bollywood2 from "@/data/decks/bollywood2.json";
import hollywood1 from "@/data/decks/hollywood1.json";
import hollywood2 from "@/data/decks/hollywood2.json";
import nsfw2 from "@/data/decks/nsfw2.json";

const DECK_IDS = [
  "classic-everyday",
  "movies-popculture",
  "nsfw",
  "classic",
  "classic2",
  "bollywood-1",
  "bollywood2",
  "hollywood1",
  "hollywood2",
  "nsfw2",
] as const;
const deckRawMap: Record<string, unknown> = {
  "classic-everyday": classicEveryday,
  "movies-popculture": moviesPopculture,
  nsfw: nsfw,
  classic: classic,
  classic2: classic2,
  "bollywood-1": bollywood1,
  bollywood2: bollywood2,
  hollywood1: hollywood1,
  hollywood2: hollywood2,
  nsfw2: nsfw2,
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
