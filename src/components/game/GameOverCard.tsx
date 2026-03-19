import { motion } from "framer-motion";
import { Check, SkipForward, AlertTriangle, Trophy } from "lucide-react";
import type { RoundResult, Team } from "@/types";

interface GameOverCardProps {
  teams: [Team, Team];
  lastRoundResult: RoundResult;
  onHome: () => void;
}

export function GameOverCard({ teams, lastRoundResult, onHome }: GameOverCardProps) {
  const [teamA, teamB] = teams;
  const winnerIndex = teamA.score >= teamB.score ? 0 : 1;
  const winner = teams[winnerIndex];
  const isTie = teamA.score === teamB.score;

  const stats = [
    { icon: Check, label: "Correct", value: lastRoundResult.correct, color: "text-accent" },
    { icon: SkipForward, label: "Skipped", value: lastRoundResult.skipped, color: "text-muted-foreground" },
    { icon: AlertTriangle, label: "Anathema", value: lastRoundResult.taboo, color: "text-destructive" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="flex w-full flex-col items-center gap-6"
    >
      {/* Team score cards at top */}
      <div className="flex w-full gap-3">
        <div
          className={`flex flex-1 flex-col items-center rounded-2xl border border-border/80 bg-card/90 p-4 ${
            !isTie && winnerIndex === 0 ? "ring-2 ring-primary bg-primary/10" : "bg-muted/30"
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {teamA.name}
          </span>
          <span
            className={`tabular-nums text-3xl font-bold ${
              !isTie && winnerIndex === 0 ? "text-primary" : "text-foreground"
            }`}
          >
            {teamA.score}
          </span>
          {!isTie && winnerIndex === 0 && <Trophy className="mt-1 h-5 w-5 text-primary" />}
        </div>
        <div
          className={`flex flex-1 flex-col items-center rounded-2xl border border-border/80 bg-card/90 p-4 ${
            !isTie && winnerIndex === 1 ? "ring-2 ring-primary bg-primary/10" : "bg-muted/30"
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {teamB.name}
          </span>
          <span
            className={`tabular-nums text-3xl font-bold ${
              !isTie && winnerIndex === 1 ? "text-primary" : "text-foreground"
            }`}
          >
            {teamB.score}
          </span>
          {!isTie && winnerIndex === 1 && <Trophy className="mt-1 h-5 w-5 text-primary" />}
        </div>
      </div>

      {/* Central results card */}
      <div className="flex w-full flex-col items-center gap-4 rounded-3xl border border-border/80 bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Game Over
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          {isTie ? "It's a tie!" : `${winner.name} wins!`}
        </h2>
        <p className="tabular-nums text-4xl font-bold text-primary">
          {lastRoundResult.score > 0 ? "+" : ""}{lastRoundResult.score}
        </p>
        <p className="text-sm text-muted-foreground">Last round</p>

        <div className="flex w-full gap-3">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-muted p-3">
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="tabular-nums text-xl font-bold text-foreground">{value}</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onHome}
          className="mt-2 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-muted font-semibold text-muted-foreground transition-colors hover:bg-muted/80 touch-manipulation sm:h-14"
        >
          Back to Home
        </motion.button>
      </div>
    </motion.div>
  );
}
