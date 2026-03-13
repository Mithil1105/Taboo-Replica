## Taboo-Replica

A modern, mobile-first remake of the classic **Taboo** party game.  
Players split into two teams, take turns describing a secret word, and try to avoid saying any of the taboo words on the card.

The UI is optimized for phones, with big touch targets, safe-area padding for notched devices, and fast in-game navigation between rounds.

---

### Game Modes

- **Pass & Play** – One device, shared turns. Pass a single phone between teams. No accounts or backend required.
- **Local Multiplayer** – Two phones, one game. Each team uses their own device. Room-based setup with Supabase realtime sync. Clue mode (give hints) vs Observer mode (call taboo) by round.

### Features

- **Mobile-optimized game experience**
  - Full-screen play view designed primarily for phones
  - Large tap targets for Correct / Skip / Taboo
  - Safe-area padding for devices with notches / home indicators
- **Flexible game rules**
  - Configurable round duration (30 / 60 / 90 seconds)
  - Adjustable number of rounds per team
  - Optional score limit (first team to X points wins)
  - **Skip is a free pass** (no score penalty), Taboo is −1, Correct is +1
- **Multiple themed decks**
  - Classic everyday words
  - Movies & pop culture
  - NSFW / midnight deck (optional)
- **Round summaries and scoreboard**
  - Live team scores
  - Per-round breakdown (correct, skipped, taboo, round score)
  - Clear “Next Round” / “Back to Home” flow
- **Dark / light theme toggle**
  - Instant theme switcher available on all key screens

---

### Tech Stack

- **React + TypeScript** – core UI and game logic
- **Vite** – fast dev server and bundler
- **Tailwind CSS** – utility-first styling
- **shadcn-ui + Radix UI** – accessible, composable UI primitives
- **Framer Motion** – smooth card flips and page transitions
- **Supabase** – backend for multiplayer rooms and realtime lobby sync

---

### Getting Started

#### Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node) or bun / pnpm if you prefer

#### Install & Run

```bash
# Clone your fork or this repository
git clone https://github.com/Mithil1105/Taboo-Replica.git
cd Taboo-Replica

# Install dependencies
npm install

# Start the dev server
npm run dev
```

By default the app runs on something like `http://localhost:5173` (or the port Vite prints in your terminal).

---

### How to Play (Rules)

1. **Create teams**  
   Choose two team names on the setup screen.

2. **Select decks**  
   Pick one or more decks (e.g. Classic, Entertainment, Midnight). The game shows how many cards you’ve selected in total.

3. **Configure the game**  
   - Set **round duration** (e.g. 60 seconds)  
   - Choose **total rounds** (even numbers – rounds are split across the two teams)  
   - Optionally set a **score limit** (first team to reach this score wins early)  
   - Optionally limit **skips per round** (or set to unlimited)

4. **During a round**
   - One player describes the main word on the card to their team.
   - They **must not** say any of the taboo words shown below it.
   - Buttons:
     - **Correct** → +1 point, card is removed from the deck
     - **Skip** → no score change (free pass), card may re-appear later
     - **Taboo** → −1 point, card is removed from the deck

5. **When the timer hits 0**
   - The round ends automatically with a buzzer sound.
   - You see a **round summary** for that team.
   - From there, you can go to the **Next Round** or **Back to Home**.

6. **Quitting mid-round**
   - Tap **Quit** in the header while playing.
   - An in-game popup asks if you really want to quit.
   - Confirming returns you to the game home screen; the current round’s progress is lost.

---

### Project Structure (high level)

- `src/pages/landing` – marketing/landing pages (home, how-to-play, about, etc.)
- `src/pages/Play.tsx` – mode selection (Pass & Play vs Local Multiplayer)
- `src/pages/Index.tsx` – Pass & Play game flow
- `src/features/game/local-multiplayer` – Local Multiplayer (Lobby, setup, gameplay, summary, results)
- `src/lib/supabase` – room, session, realtime services
- `src/lib/deckValidation.ts` – deck/card validation for safe content loading

### Debug Mode

Add `?debug=1` to the URL in development, or set `VITE_DEBUG=true` in `.env`, to show a collapsible debug panel with:

- Room code, room status, device ID
- Team, host status, host connectivity
- Both teams connected (ready to start)
- Phase, round, turn, current card ID
- Scores, session ID
- Connection state (connected / reconnecting)

Useful for diagnosing room/session issues during development.

---

### Scripts

```bash
npm run dev     # start development server
npm run build   # create production build
npm run preview # preview production build locally
npm test        # run tests (if configured)
```

---

### Supabase & Local Multiplayer

Local Multiplayer uses **Supabase** for:

- room creation and persistence
- participants (per-device, per-team)
- game sessions (synced gameplay, scores, timer)
- realtime lobby and gameplay sync

#### 1. Configure environment variables

Copy `.env.example` to `.env` (or `.env.local`) and fill in:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

On **Vercel**, add these as Environment Variables for the project (same names). No `VITE_` prefix changes needed.

#### 2. Create the database tables

**Option A – Fresh setup:** Run `supabase/schema.sql` in the Supabase SQL Editor.

**Option B – Fix existing broken schema:** If you get 400 errors or "column not found", run `supabase/FULL_SETUP.sql` (full reset) or `supabase/QUICK_FIX_GAME_SESSIONS.sql` (fix only game_sessions).

**Original migrations (if needed):**
2. `supabase/migrations/130325_reconnect_participant.sql` – optional index
3. `supabase/migrations/130325_room_cleanup.sql` – optional closed_at column
4. `supabase/migrations/130325_deployment_readiness.sql` – realtime notes
5. `supabase/migrations/130326_rls_anon_policies.sql` – **required if room create/join returns 403** – enables anon access for Local Multiplayer
6. `supabase/migrations/130327_rooms_missing_columns.sql` – **required if you get "created_by_team" or "room_participants_team_check" errors** – adds missing columns and fixes team constraint
7. `supabase/migrations/130329_game_sessions_missing_columns.sql` – **required if you get "card_order" or "Could not find column of game_sessions"** – adds missing game_sessions columns

#### 3. Enable Realtime (required for live sync)

Run `supabase/migrations/130328_realtime_publication.sql` in the Supabase SQL Editor. This adds `rooms`, `room_participants`, and `game_sessions` to the `supabase_realtime` publication.

Without this, setup changes and gameplay will not sync live between devices.

#### 4. Room lifecycle

- **Create** → host creates room, joins as Team A or B
- **Join** → second device joins with room code, picks the other team
- **Lobby** → both teams connected, host configures decks/rounds, starts game
- **Playing** → realtime sync; clue team gives hints, observer team calls taboo
- **Round summary** → host advances to next round or ends game early
- **Results** → host can Play again (return to lobby) or End game (close room)
- **Leave** → participant disconnects; if both leave, room is closed
- **Refresh** → participant reclaims slot via `reconnectParticipant`; session state is restored from DB

#### 5. Troubleshooting

- **400 Bad Request / "Could not find the 'created_by_team' column"**: Your `rooms` table is missing columns. Run `supabase/migrations/130327_rooms_missing_columns.sql` in the Supabase SQL Editor.
- **"room_participants_team_check" violation**: The `team` column must be exactly `'A'` or `'B'`. Run `130327_rooms_missing_columns.sql` to fix the constraint; the app also normalizes team values defensively.
- **"Could not find the 'card_order' column of game_sessions"** / **400 on Start Game**: Run `supabase/QUICK_FIX_GAME_SESSIONS.sql` in the Supabase SQL Editor. This resets `game_sessions` with the correct schema. For a full reset of all tables, run `supabase/FULL_SETUP.sql`.
- **403 / permission denied**: Run `supabase/migrations/130326_rls_anon_policies.sql` to allow anon read/write.
- **Room not found**: Verify room code is correct and room exists in Supabase Dashboard → Table Editor → rooms.

#### 6. Dev notes

- If Supabase env vars are missing, Local Multiplayer shows an inline error; create/join actions are disabled.
- Pass & Play does **not** depend on Supabase and works fully offline.
- No hardcoded localhost; the app works with Vercel + Supabase out of the box.
- Deck registry and card JSON are validated at runtime; invalid entries are filtered with dev warnings.
- In dev mode, Supabase errors are logged to console with `[createRoom]`, `[joinRoom]`, `[createSession]` prefixes for easier debugging.

---

### Deck / Content Structure

- **Registry**: `src/data/decks.json` – array of deck metadata (id, name, filePath, cardCount, etc.)
- **Cards**: `src/data/decks/*.json` – each file exports an array of `{ id, word, tabooWords[] }`
- **Validation**: `src/lib/deckValidation.ts` validates registry shape and card shape; filters invalid cards, logs warnings in dev
- **Adding a deck**: Add entry to `decks.json`, add import + entry in `sessionService.ts` deckRawMap, create JSON file

### Known Limitations

- Local Multiplayer requires two physical devices (or two browser profiles); no bots
- Room codes are 6 characters; no persistence of room history
- No authentication; device ID is the identity
- Realtime depends on Supabase; offline multiplayer is not supported
- Pass & Play and Local Multiplayer are separate flows; no cross-mode play

---

### Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch and open a Pull Request

---

### License

This project is currently private for client use.  
If you plan to open-source it later, you can replace this section with a specific license (e.g. MIT).

