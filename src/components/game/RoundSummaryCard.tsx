import { motion } from "framer-motion";
import { Check, SkipForward, AlertTriangle } from "lucide-react";
import type { RoundResult, Team } from "@/types";

interface RoundSummaryCardProps {
  result: RoundResult;
  team: Team;
  onNextRound: () => void;
  onHome: () => void;
  isGameOver: boolean;
}

export function RoundSummaryCard({ result, team, onNextRound, onHome, isGameOver }: RoundSummaryCardProps) {
  const stats = [
    { icon: Check, label: "Correct", value: result.correct, color: "text-accent" },
    { icon: SkipForward, label: "Skipped", value: result.skipped, color: "text-muted-foreground" },
    { icon: AlertTriangle, label: "Taboo", value: result.taboo, color: "text-destructive" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="flex w-full flex-col items-center gap-6 rounded-3xl bg-card p-6 sm:p-8 card-shadow-elevated"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {isGameOver ? "Game Over" : "Round Over"}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-card-foreground">{team.name}</h2>
        <p className="mt-2 tabular-nums text-4xl font-bold text-primary">
          {result.score > 0 ? "+" : ""}{result.score}
        </p>
      </div>

      <div className="flex w-full gap-3">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-muted p-3">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className="tabular-nums text-xl font-bold text-card-foreground">{value}</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-3">
        {!isGameOver && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNextRound}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition-colors touch-manipulation sm:h-14"
          >
            Next Round
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onHome}
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-muted font-semibold text-muted-foreground transition-colors touch-manipulation sm:h-14"
        >
          Back to Home
        </motion.button>
      </div>
    </motion.div>
  );
}
