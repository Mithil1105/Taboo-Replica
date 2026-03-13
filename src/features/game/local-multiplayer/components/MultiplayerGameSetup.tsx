import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import type { DeckMeta } from "@/types";

interface MultiplayerGameSetupProps {
  decks: DeckMeta[];
  selectedDecks: Set<string>;
  onToggleDeck: (id: string) => void;
  roundDuration: number;
  onRoundDuration: (d: number) => void;
  totalRounds: number;
  onTotalRounds: (n: number) => void;
  targetScore: number;
  onTargetScore: (n: number) => void;
  teamAName: string;
  teamBName: string;
  onTeamAName: (s: string) => void;
  onTeamBName: (s: string) => void;
  isHost: boolean;
  onResetSetup?: () => void;
}

export function MultiplayerGameSetup({
  decks,
  selectedDecks,
  onToggleDeck,
  roundDuration,
  onRoundDuration,
  totalRounds,
  onTotalRounds,
  targetScore,
  onTargetScore,
  teamAName,
  teamBName,
  onTeamAName,
  onTeamBName,
  isHost,
  onResetSetup,
}: MultiplayerGameSetupProps) {
  const readOnly = !isHost;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Decks
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            {isHost ? "Select at least one deck." : "Host is configuring decks."}
            {selectedDecks.size > 0 && (
              <span className="ml-1 font-medium text-foreground">
                · {decks.filter((d) => selectedDecks.has(d.id)).reduce((s, d) => s + d.cardCount, 0)} cards
              </span>
            )}
          </p>
          {onResetSetup && (
            <button
              type="button"
              onClick={onResetSetup}
              className="text-[11px] font-medium text-muted-foreground underline underline-offset-2"
            >
              Reset to defaults
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {decks.filter((d) => d.isActive).map((deck) => (
            <motion.button
              key={deck.id}
              whileTap={readOnly ? undefined : { scale: 0.97 }}
              type="button"
              onClick={() => !readOnly && onToggleDeck(deck.id)}
              disabled={readOnly}
              className={`min-h-[40px] touch-manipulation rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                selectedDecks.has(deck.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              } ${readOnly ? "cursor-default opacity-80" : ""}`}
            >
              {deck.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Round duration
        </p>
        <div className="mt-2 flex gap-2">
          {[30, 60, 90].map((d) => (
            <motion.button
              key={d}
              whileTap={readOnly ? undefined : { scale: 0.95 }}
              type="button"
              onClick={() => !readOnly && onRoundDuration(d)}
              disabled={readOnly}
              className={`flex min-h-[44px] flex-1 items-center justify-center rounded-xl font-semibold transition-colors ${
                roundDuration === d ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              } ${readOnly ? "cursor-default" : ""}`}
            >
              {d}s
            </motion.button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Total rounds
        </p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <motion.button
            whileTap={readOnly ? undefined : { scale: 0.9 }}
            type="button"
            onClick={() => !readOnly && onTotalRounds(Math.max(2, totalRounds - 2))}
            disabled={readOnly}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-muted text-muted-foreground"
          >
            <Minus className="h-4 w-4" />
          </motion.button>
          <span className="tabular-nums text-xl font-bold text-foreground">{totalRounds}</span>
          <motion.button
            whileTap={readOnly ? undefined : { scale: 0.9 }}
            type="button"
            onClick={() => !readOnly && onTotalRounds(Math.min(20, totalRounds + 2))}
            disabled={readOnly}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-muted text-muted-foreground"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Score limit (0 = off)
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[0, 10, 15, 20, 25].map((s) => (
            <motion.button
              key={s}
              whileTap={readOnly ? undefined : { scale: 0.95 }}
              type="button"
              onClick={() => !readOnly && onTargetScore(s)}
              disabled={readOnly}
              className={`min-h-[40px] flex-1 rounded-xl px-3 font-semibold transition-colors sm:flex-none ${
                targetScore === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              } ${readOnly ? "cursor-default" : ""}`}
            >
              {s || "Off"}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Team names
        </p>
        <div className="mt-2 space-y-2">
          <input
            type="text"
            value={teamAName}
            onChange={(e) => onTeamAName(e.target.value)}
            disabled={readOnly}
            placeholder="Team A"
            className="flex min-h-[44px] w-full rounded-xl border-0 bg-muted px-3 text-sm font-medium text-foreground outline-none ring-1 ring-transparent transition-all focus:ring-2 focus:ring-ring disabled:opacity-70"
          />
          <input
            type="text"
            value={teamBName}
            onChange={(e) => onTeamBName(e.target.value)}
            disabled={readOnly}
            placeholder="Team B"
            className="flex min-h-[44px] w-full rounded-xl border-0 bg-muted px-3 text-sm font-medium text-foreground outline-none ring-1 ring-transparent transition-all focus:ring-2 focus:ring-ring disabled:opacity-70"
          />
        </div>
      </div>
    </div>
  );
}
