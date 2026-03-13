## Taboo-Replica

A modern, mobile-first remake of the classic **Taboo** party game.  
Players split into two teams, take turns describing a secret word, and try to avoid saying any of the taboo words on the card.

The UI is optimized for phones, with big touch targets, safe-area padding for notched devices, and fast in-game navigation between rounds.

---

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
- `src/pages/Play.tsx` – entry point that renders the game experience
- `src/hooks/useGame.ts` – core game state and rules
- `src/components/game` – reusable game UI components
- `src/data/decks` – JSON card decks used in the game

---

### Scripts

```bash
npm run dev     # start development server
npm run build   # create production build
npm run preview # preview production build locally
npm test        # run tests (if configured)
```

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

