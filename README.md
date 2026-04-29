## Anathema

**Anathema – the game of forbidden words.**  
A modern, mobile-first party game. Players split into two teams, take turns describing a secret word, and try to avoid saying any of the forbidden words on the card.

The UI is optimized for phones, with big touch targets, safe-area padding for notched devices, and fast in-game navigation between rounds.

---

### Game Modes

- **Pass & Play** – One device, shared turns. Pass a single phone between teams. No accounts or backend required.
- **Local Multiplayer** – Two phones, one game. Each team uses their own device. Room-based setup with Supabase realtime sync. Clue mode (give hints) vs Observer mode (call anathema) by round.

### Features

- **Mobile-optimized game experience**
  - Full-screen play view designed primarily for phones
  - Large tap targets for Correct / Skip / Anathema
  - Safe-area padding for devices with notches / home indicators
- **Flexible game rules**
  - Configurable round duration (30 / 60 / 90 seconds)
  - Adjustable number of rounds per team
  - Optional score limit (first team to X points wins)
  - **Correct** → +1 for the clue team
  - **Skip** → no score change (free pass)
  - **Anathema** → −1 for the clue team, +1 for the opponents
- **Multiple themed decks**
  - Classic everyday words
  - Movies & pop culture
  - NSFW / midnight deck (optional)
- **Sound feedback** (optional, toggle in settings)
- **Multiplayer onboarding** (first-time setup guide, skippable after first view)
- **Round summaries and scoreboard**
  - Live team scores
  - Per-round breakdown (correct, skipped, anathema, round score)
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

#### Production site URL (`VITE_SITE_URL`)

Set `VITE_SITE_URL` in `.env` to your canonical origin **without a trailing slash** (e.g. `https://anathema.game`). It drives:

- Canonical URLs, Open Graph, and Twitter meta in the `SEO` component
- Absolute `og:image` / `twitter:image` in `index.html` at build time
- `public/sitemap.xml` and `public/robots.txt` (generated in `prebuild` via `scripts/generate-sitemap.js`)

Copy `.env.example` and adjust. In development, if unset, the app falls back to `window.location.origin` where relevant.

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
   - They **must not** say any of the forbidden words shown below it.
   - Buttons:
     - **Correct** → +1 point, card is removed from the deck
     - **Skip** → no score change (free pass), card may re-appear later
     - **Anathema** → −1 for clue team, +1 for opponents; card is removed

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

Add `?debug=1` to the URL in development, or set `VITE_DEBUG=true` in `.env`, to show a collapsible debug panel with room/session state:

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

On **Vercel**, add these as Environment Variables for the project (same names). No `VITE_` prefix changes needed. The `vercel.json` rewrites ensure SPA routing works on refresh.

#### Vercel deployment

1. Connect your repo to Vercel.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as env vars.
3. Deploy. The `vercel.json` rewrites all routes to `index.html` for SPA behavior.

#### 2. Create the database tables

**Option A – Fresh setup:** Run `supabase/schema.sql` in the Supabase SQL Editor.

**Option B – Fix existing broken schema:** If you get 400 errors or "column not found", run `supabase/FULL_SETUP.sql` (full reset) or `supabase/QUICK_FIX_GAME_SESSIONS.sql` (fix only game_sessions).

**Original migrations (if needed):**
2. `supabase/migrations/130325_reconnect_participant.sql` – optional index
8. `supabase/migrations/130330_stale_room_cleanup.sql` – optional; creates `cleanup_stale_rooms()` for cron
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
- **Playing** → realtime sync; clue team gives hints, observer team calls anathema
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
- Pass & Play does **not** depend on Supabase and works fully offline (see [PWA & Offline Support](#pwa--offline-support)).
- No hardcoded localhost; the app works with Vercel + Supabase out of the box.
- Deck registry and card JSON are validated at runtime; invalid entries are filtered with dev warnings.
- In dev mode, Supabase errors are logged to console with `[createRoom]`, `[joinRoom]`, `[createSession]` prefixes for easier debugging.

---

### Deck / Content Structure

- **Registry**: `src/data/decks.json` – array of deck metadata (id, name, filePath, cardCount, etc.)
- **Cards**: `src/data/decks/*.json` – each file exports an array of `{ id, word, tabooWords[] }`
- **Validation**: `src/lib/deckValidation.ts` validates registry shape and card shape; filters invalid cards, logs warnings in dev
- **Adding a deck**: Add entry to `decks.json`, add import + entry in `sessionService.ts` deckRawMap, create JSON file

### PWA & Offline Support

The app is a **Progressive Web App (PWA)** and supports offline play for Pass & Play.

#### What works offline (after first load while online)

- App shell (HTML, JS, CSS)
- Pass & Play: deck selection, rounds, scoring, sounds
- Mode selection and navigation
- Deck/card data (bundled with the app)

#### What requires internet

- Local Multiplayer (create room, join room, realtime sync)
- Supabase API calls

#### Installability

- On supported browsers (Chrome, Edge, Safari), you can **Add to Home Screen** or **Install** the app.
- Works in Flutter WebView; offline caching remains effective even when the install prompt is unavailable.

#### Cache strategy

- **Precached**: App shell, JS/CSS bundles, icons, manifest
- **Not cached**: Supabase API (network-only)
- Decks are bundled into the app; no separate deck fetch when offline

#### Testing offline

1. Load the app once while online (visit the site).
2. Open DevTools → Application → Service Workers → check "Offline".
3. Refresh. The app should load from cache.
4. Go to Pass & Play and play a round; it should work without network.

#### PWA update strategy

- New deployments auto-update the service worker in the background.
- Users get the latest version on the next page load or app restart.

---

### Room / Session Cleanup

To keep Supabase storage small, finished multiplayer sessions are cleaned up automatically:

- **Host ends game** → Room data (game_sessions, taboo_events, room_participants, room) is deleted.
- **Everyone leaves** → Same cleanup when the last participant disconnects.
- **Stale rooms** → Run `supabase/migrations/130330_stale_room_cleanup.sql` to create `cleanup_stale_rooms()`. Schedule it via Supabase pg_cron (e.g. daily) to delete closed rooms older than 24 hours.

No permanent match history is stored.

---

### Auth & Payments (premium decks)

Login is **optional**. You only need an account to unlock premium decks. Pass & Play and Local Multiplayer continue to work anonymously by `device_id`.

#### Frontend env

Add to `.env`:

```bash
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

#### Supabase setup

1. **Auth providers** (Supabase Dashboard → Authentication → Providers):
   - Enable **Email** (with email/password). Disable email confirmations in dev for faster iteration.
   - Enable **Google** OAuth and add the redirect URL `https://yoursite.com/auth/callback` (and the localhost equivalent for dev).
2. **Email delivery via Resend** (Supabase Dashboard → Authentication → Email / SMTP settings):
   - Set custom SMTP provider to **Resend**.
   - SMTP host: `smtp.resend.com`
   - SMTP port: `465` (SSL) or `587` (STARTTLS)
   - SMTP username: `resend`
   - SMTP password: your Resend API key (`re_...`)
   - Sender email/domain must be verified in Resend.
3. **Database migration**: run `supabase/migrations/28042026_payments_and_unlocks.sql` in the SQL Editor (creates `payment_orders`, `deck_unlocks`, RLS read-own policies, triggers).
4. **Edge Function secrets**:

   ```bash
   supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx RAZORPAY_KEY_SECRET=xxx
   ```

5. **Deploy the Edge Functions**:

   ```bash
   supabase functions deploy razorpay-create-order
   supabase functions deploy razorpay-verify-payment
   ```

#### How payment works

- The user signs in (email/password or Google), opens a locked deck, and taps Buy now.
- The frontend calls the `razorpay-create-order` Edge Function which creates a Razorpay order using `RAZORPAY_KEY_SECRET` and inserts a `payment_orders` row.
- Razorpay Checkout opens client-side. On success, the frontend calls `razorpay-verify-payment` which verifies the HMAC signature, marks the order paid, and inserts a `deck_unlocks` row (idempotent on `(user_id, deck_id)`).
- Premium decks are unlocked instantly; selection is gated by `useDeckUnlocks` and `isDeckAccessible`.

Test cards: see Razorpay test mode docs (`4111 1111 1111 1111` for success).

#### Locked decks

By default these are locked (set in `src/data/decks.json` with `isPremium: true` + `priceInr`):

- `nsfw` (Midnight)
- `nsfw2` (Midnight 2)
- `bollywood2`
- `hollywood2`

To unlock for development without going through Razorpay, insert a `deck_unlocks` row directly:

```sql
insert into public.deck_unlocks (user_id, deck_id) values ('<your-uuid>', 'nsfw');
```

---

### Known Limitations

- Local Multiplayer requires two physical devices (or two browser profiles); no bots
- **Local Multiplayer requires internet**; Pass & Play works offline after cache is primed
- Room codes are 6 characters; no persistence of room history
- Authentication is **optional**; device ID is the identity for anonymous play and a Supabase user is required only to unlock premium decks
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
