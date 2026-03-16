import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { useGame } from "@/hooks/useGame";
import type { DeckMeta, GamePhase } from "@/types";
import decksRegistry from "@/data/decks.json";
import { getValidatedDecks } from "@/lib/deckValidation";

import { ThemeToggle } from "@/components/game/ThemeToggle";
import { DeckCard } from "@/components/game/DeckCard";
import { FilterChips } from "@/components/game/FilterChips";
import { GameCard } from "@/components/game/GameCard";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { TimerDisplay } from "@/components/game/TimerDisplay";
import { ActionButtonGroup } from "@/components/game/ActionButtonGroup";
import { RoundSummaryCard } from "@/components/game/RoundSummaryCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Home } from "lucide-react";
import { playCorrectSound, playSkipSound, playTabooSound, playTimerBuzzerSound } from "@/hooks/useSound";

const allDecks = getValidatedDecks(decksRegistry) as DeckMeta[];

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] as const },
};

const FILTERS = ["All", "Easy", "Medium", "Classic", "Entertainment", "Midnight"];

export default function Index() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const game = useGame();
  const [phase, setPhase] = useState<GamePhase>("deckSelection");
  const [selectedDecks, setSelectedDecks] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("All");
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const prevTimeLeft = useRef<number | null>(null);

  // Play buzzer when timer hits 0
  useEffect(() => {
    if (prevTimeLeft.current !== null && prevTimeLeft.current > 0 && game.timeLeft === 0 && phase === "playing") {
      playTimerBuzzerSound();
    }
    prevTimeLeft.current = game.timeLeft;
  }, [game.timeLeft, phase]);

  const handleCorrectWithSound = useCallback(() => {
    playCorrectSound();
    game.handleCorrect();
  }, [game.handleCorrect]);

  const handleSkipWithSound = useCallback(() => {
    playSkipSound();
    game.handleSkip();
  }, [game.handleSkip]);

  const handleTabooWithSound = useCallback(() => {
    playTabooSound();
    game.handleTaboo();
  }, [game.handleTaboo]);

  const toggleDeck = useCallback((id: string) => {
    setSelectedDecks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filteredDecks = allDecks.filter((d) => {
    if (!d.isActive) return false;
    if (filter === "All") return true;
    return (
      d.difficulty.toLowerCase() === filter.toLowerCase() ||
      d.category.toLowerCase() === filter.toLowerCase()
    );
  });

  const totalCards = allDecks
    .filter((d) => selectedDecks.has(d.id))
    .reduce((sum, d) => sum + d.cardCount, 0);

  const goToDeckSelection = () => setPhase("deckSelection");
  const goToSetup = () => {
    game.setSettings((s) => ({ ...s, selectedDeckIds: Array.from(selectedDecks) }));
    setPhase("gameSetup");
  };
  const goToGame = () => {
    game.startGame();
    game.startRound();
    setPhase("playing");
  };
  const goHome = () => {
    setPhase("deckSelection");
    setSelectedDecks(new Set());
    setFilter("All");
    navigate("/play");
  };
  const handleNextRound = () => {
    game.nextRound();
    game.startRound();
    setPhase("playing");
  };

  return (
    <div className="flex min-h-svh flex-col bg-background font-figtree">
      <AnimatePresence mode="wait">
        {/* ─── DECK SELECTION ─── */}
        {phase === "deckSelection" && (
          <motion.div key="decks" {...pageTransition} className="flex min-h-svh flex-col px-4 pb-24 pt-4 pt-safe">
            <div className="mx-auto w-full max-w-4xl">
              <div className="mb-6 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    to="/"
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
                    aria-label="Back to main site"
                  >
                    <Home className="h-5 w-5" />
                  </Link>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={goHome} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <ArrowLeft className="h-5 w-5" />
                  </motion.button>
                </div>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>

              <div className="mb-6 space-y-1">
                <h2 className="text-2xl font-bold text-foreground">Select Decks</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedDecks.size > 0
                    ? `${selectedDecks.size} deck${selectedDecks.size > 1 ? "s" : ""} · ${totalCards} cards`
                    : "Choose at least one deck to continue"}
                </p>
              </div>

              <div className="mb-6">
                <FilterChips filters={FILTERS} activeFilter={filter} onSelect={setFilter} />
              </div>

              {filteredDecks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <p className="text-sm text-muted-foreground">No decks match this filter.</p>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                  initial={false}
                  transition={{ layout: { duration: 0.25 } }}
                >
                  <AnimatePresence mode="sync">
                    {filteredDecks.map((deck, i) => (
                      <motion.div
                        key={deck.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -8 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 28,
                          delay: i * 0.03,
                        }}
                      >
                        <DeckCard
                          deck={deck}
                          isSelected={selectedDecks.has(deck.id)}
                          onToggle={() => toggleDeck(deck.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Fixed bottom CTA - always visible, above content */}
            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 pb-safe backdrop-blur-md">
              <div className="mx-auto max-w-md">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={goToSetup}
                  disabled={selectedDecks.size === 0}
                  className="flex min-h-[48px] w-full touch-manipulation items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue{selectedDecks.size > 0 && ` · ${totalCards} Cards`}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── GAME SETUP ─── */}
        {phase === "gameSetup" && (
          <motion.div key="setup" {...pageTransition} className="flex min-h-svh flex-col items-center px-4 pb-6 pt-4 pt-safe md:pb-8">
            <div className="w-full max-w-md">
              <div className="mb-6 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    to="/"
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
                    aria-label="Back to main site"
                  >
                    <Home className="h-5 w-5" />
                  </Link>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={goToDeckSelection} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <ArrowLeft className="h-5 w-5" />
                  </motion.button>
                </div>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>

              <h2 className="mb-6 text-2xl font-bold text-foreground md:mb-8">Game Setup</h2>

              <div className="space-y-4 md:space-y-6">
                {/* Team Names */}
                {game.settings.teams.map((team, i) => (
                  <div key={i} className="space-y-1.5 md:space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Team {i + 1}
                    </label>
                    <input
                      type="text"
                      value={team.name}
                      onChange={(e) => {
                        game.setSettings((s) => {
                          const teams = [...s.teams] as [typeof s.teams[0], typeof s.teams[1]];
                          teams[i] = { ...teams[i], name: e.target.value };
                          return { ...s, teams };
                        });
                      }}
                      className="flex h-11 w-full rounded-xl border-0 bg-muted px-4 text-base font-medium text-foreground outline-none ring-1 ring-transparent transition-all focus:ring-2 focus:ring-ring placeholder:text-muted-foreground md:h-14"
                      placeholder={`Team ${i + 1}`}
                    />
                  </div>
                ))}

                {/* Round Duration */}
                <div className="space-y-1.5 md:space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Round Duration
                  </label>
                  {/* Mobile: dropdown */}
                  <div className="md:hidden">
                    <Select
                      value={String(game.settings.roundDuration)}
                      onValueChange={(v) => game.setSettings((s) => ({ ...s, roundDuration: Number(v) }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-muted font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[30, 60, 90].map((dur) => (
                          <SelectItem key={dur} value={String(dur)}>
                            {dur}s
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Desktop: buttons */}
                  <div className="hidden gap-3 md:flex">
                    {[30, 60, 90].map((dur) => (
                      <motion.button
                        key={dur}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => game.setSettings((s) => ({ ...s, roundDuration: dur }))}
                        className={`flex h-14 flex-1 items-center justify-center rounded-xl font-semibold transition-all ${
                          game.settings.roundDuration === dur
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {dur}s
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Total Rounds */}
                <div className="space-y-1.5 md:space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Total Rounds
                  </label>
                  {/* Mobile: dropdown */}
                  <div className="md:hidden">
                    <Select
                      value={String(game.settings.totalRounds)}
                      onValueChange={(v) => game.setSettings((s) => ({ ...s, totalRounds: Number(v) }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-muted font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} ({n / 2} per team)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Desktop: counter */}
                  <div className="hidden md:block">
                    <div className="flex items-center justify-center gap-6">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => game.setSettings((s) => ({ ...s, totalRounds: Math.max(2, s.totalRounds - 2) }))}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                      >
                        <Minus className="h-5 w-5" />
                      </motion.button>
                      <span className="tabular-nums text-3xl font-bold text-foreground">
                        {game.settings.totalRounds}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => game.setSettings((s) => ({ ...s, totalRounds: Math.min(20, s.totalRounds + 2) }))}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                      >
                        <Plus className="h-5 w-5" />
                      </motion.button>
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      {game.settings.totalRounds / 2} round{game.settings.totalRounds / 2 > 1 ? "s" : ""} per team
                    </p>
                  </div>
                </div>

                {/* Max skips per round */}
                <div className="space-y-1.5 md:space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Skips per round
                  </label>
                  {/* Mobile: dropdown */}
                  <div className="md:hidden">
                    <Select
                      value={String(game.settings.maxSkipsPerRound)}
                      onValueChange={(v) => game.setSettings((s) => ({ ...s, maxSkipsPerRound: Number(v) }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-muted font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { value: 0, label: "Unlimited" },
                          { value: 3, label: "3" },
                          { value: 5, label: "5" },
                          { value: 10, label: "10" },
                        ].map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {game.settings.maxSkipsPerRound === 0
                        ? "Teams can skip as many cards as they want."
                        : `Up to ${game.settings.maxSkipsPerRound} skips per round.`}
                    </p>
                  </div>
                  {/* Desktop: buttons */}
                  <div className="hidden md:block">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 0, label: "Unlimited" },
                        { value: 3, label: "3" },
                        { value: 5, label: "5" },
                        { value: 10, label: "10" },
                      ].map((opt) => (
                        <motion.button
                          key={opt.value}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => game.setSettings((s) => ({ ...s, maxSkipsPerRound: opt.value }))}
                          className={`flex h-12 min-w-[4rem] flex-1 items-center justify-center rounded-xl font-semibold transition-all sm:flex-none sm:px-4 ${
                            game.settings.maxSkipsPerRound === opt.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {opt.label}
                        </motion.button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {game.settings.maxSkipsPerRound === 0
                        ? "Teams can skip as many cards as they want each round."
                        : `Each team can skip up to ${game.settings.maxSkipsPerRound} cards per round.`}
                    </p>
                  </div>
                </div>

                {/* Score limit (game ends when a team reaches this) */}
                <div className="space-y-1.5 md:space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Score limit (first to reach wins)
                  </label>
                  {/* Mobile: dropdown */}
                  <div className="md:hidden">
                    <Select
                      value={String(game.settings.scoreLimit)}
                      onValueChange={(v) => game.setSettings((s) => ({ ...s, scoreLimit: Number(v) }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-muted font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { value: 0, label: "Off" },
                          { value: 10, label: "10" },
                          { value: 15, label: "15" },
                          { value: 20, label: "20" },
                          { value: 25, label: "25" },
                          { value: 30, label: "30" },
                        ].map((opt) => (
                          <SelectItem key={opt.value} value={String(opt.value)}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {game.settings.scoreLimit === 0
                        ? "Game ends after set rounds."
                        : `First to ${game.settings.scoreLimit} wins.`}
                    </p>
                  </div>
                  {/* Desktop: buttons */}
                  <div className="hidden md:block">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 0, label: "Off" },
                        { value: 10, label: "10" },
                        { value: 15, label: "15" },
                        { value: 20, label: "20" },
                        { value: 25, label: "25" },
                        { value: 30, label: "30" },
                      ].map((opt) => (
                        <motion.button
                          key={opt.value}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => game.setSettings((s) => ({ ...s, scoreLimit: opt.value }))}
                          className={`flex h-12 min-w-[3rem] flex-1 items-center justify-center rounded-xl font-semibold transition-all sm:flex-none sm:px-3 ${
                            game.settings.scoreLimit === opt.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {opt.label}
                        </motion.button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {game.settings.scoreLimit === 0
                        ? "Game ends after the set number of rounds."
                        : `Game ends as soon as a team reaches ${game.settings.scoreLimit} points.`}
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={goToGame}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground md:mt-10 md:h-14"
              >
                Start Round
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ─── PLAYING ─── */}
        {phase === "playing" && !game.roundResult && (
          <motion.div key="playing" {...pageTransition} className="flex min-h-svh flex-col items-center px-4 py-3 pb-safe">
            <div className="flex w-full max-w-md flex-1 flex-col gap-3">
              {/* Header with Quit + Theme - mobile-first compact layout */}
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQuitConfirm(true)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
                  aria-label="Quit game and go home"
                >
                  <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs font-medium sm:text-sm">Quit</span>
                </motion.button>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Round {game.currentRound}
                </div>
                <TimerDisplay timeLeft={game.timeLeft} totalTime={game.settings.roundDuration} />
                <div className="flex min-w-[44px] items-center justify-end gap-1.5 sm:min-w-[80px]">
                  <span className="hidden text-right text-xs font-semibold uppercase tracking-widest text-primary sm:inline">
                    {game.settings.teams[game.currentTeamIndex].name}
                  </span>
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                </div>
              </div>

              <div className="shrink-0">
                <ScoreBoard teams={game.settings.teams} currentTeamIndex={game.currentTeamIndex} />
              </div>

              {/* Card area */}
              <div className="flex min-h-0 flex-1 items-center justify-center py-1">
                {game.currentCard && <GameCard card={game.currentCard} />}
              </div>

              {/* Actions */}
              <div className="shrink-0 pb-1">
                <ActionButtonGroup
                  onCorrect={handleCorrectWithSound}
                  onSkip={handleSkipWithSound}
                  onTaboo={handleTabooWithSound}
                  skipsRemaining={game.skipsRemaining}
                />
              </div>
            </div>

            {/* Quit confirmation (in-game popup) */}
            <AlertDialog open={showQuitConfirm} onOpenChange={setShowQuitConfirm}>
              <AlertDialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl border-border bg-card p-6 shadow-lg sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl text-card-foreground">
                    Quit game?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Are you sure you want to quit? You’ll return to the game menu and this round’s progress will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
                  <AlertDialogCancel className="m-0 min-h-[44px] touch-manipulation">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setShowQuitConfirm(false);
                      goHome();
                    }}
                    className="min-h-[44px] touch-manipulation bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, quit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        )}

        {/* ─── ROUND END ─── */}
        {(phase === "playing" && game.roundResult) && (
          <motion.div key="roundEnd" {...pageTransition} className="flex min-h-svh flex-col items-center justify-center px-4 py-8 pb-safe">
            <div className="absolute right-4 top-4">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
            <div className="w-full max-w-md space-y-6">
              <ScoreBoard teams={game.settings.teams} currentTeamIndex={game.currentTeamIndex} />
              <RoundSummaryCard
                result={game.roundResult}
                team={game.settings.teams[game.roundResult.teamIndex]}
                onNextRound={handleNextRound}
                onHome={goHome}
                isGameOver={game.isGameOver}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
