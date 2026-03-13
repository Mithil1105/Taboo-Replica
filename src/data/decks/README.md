# Card decks

Store your Taboo-style card deck JSON files in this folder.

## Adding a new deck

### 1. Create the deck JSON file

- **Location:** `src/data/decks/your-deck-id.json`
- **Format:** A JSON array of card objects. Each card must have:
  - `id` (string) – unique per card, e.g. `"mydeck-001"`
  - `word` (string) – the main word to guess
  - `tabooWords` (string array) – words the clue giver cannot say
  - Optional: `difficulty`, `category` (for filtering)

**Example card:**

```json
{
  "id": "mydeck-001",
  "word": "Bicycle",
  "tabooWords": ["ride", "wheels", "pedal", "bike", "helmet"],
  "difficulty": "easy",
  "category": "everyday"
}
```

**Example full file** (`src/data/decks/my-custom-deck.json`):

```json
[
  { "id": "mcd-001", "word": "Bicycle", "tabooWords": ["ride", "wheels", "pedal", "bike", "helmet"], "difficulty": "easy", "category": "everyday" },
  { "id": "mcd-002", "word": "Coffee", "tabooWords": ["cup", "mug", "drink", "caffeine", "morning"], "difficulty": "easy", "category": "everyday" }
]
```

### 2. Register the deck in `decks.json`

Edit **`src/data/decks.json`** and add an entry for your deck:

```json
{
  "id": "my-custom-deck",
  "name": "My Custom Deck",
  "description": "Short description of the deck.",
  "category": "Classic",
  "difficulty": "Easy",
  "colorTag": "lilac",
  "icon": "Sparkles",
  "cardCount": 15,
  "filePath": "/data/decks/my-custom-deck.json",
  "isPremium": false,
  "isActive": true
}
```

- `id` must match the filename (without `.json`).
- `cardCount` should be the number of cards in your JSON array.
- `icon` can be any Lucide icon name (e.g. `Sparkles`, `Clapperboard`, `Music`).

### 3. Wire the deck into the game

Edit **`src/hooks/useGame.ts`**:

1. **Import** your deck at the top:

   ```ts
   import myCustomDeck from "@/data/decks/my-custom-deck.json";
   ```

2. **Add it to `deckFileMap`** (use the same `id` as in `decks.json`):

   ```ts
   const deckFileMap: Record<string, Card[]> = {
     "classic-everyday": classicEveryday as Card[],
     "movies-popculture": moviesPopculture as Card[],
     "my-custom-deck": myCustomDeck as Card[],
   };
   ```

Save and run the app; your deck will appear in deck selection and can be used in the game.
