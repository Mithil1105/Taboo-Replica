import { motion } from "framer-motion";
import { Check, SkipForward, AlertTriangle, LogOut } from "lucide-react";
import { useState } from "react";
import type { GameSessionRow } from "@/lib/supabase/types";
import { nextRound, endGameEarly } from "@/lib/supabase/sessionService";
import { canNextRound } from "@/lib/supabase/multiplayerActions";

interface MultiplayerRoundSummaryProps {
  session: GameSessionRow;
  isHost: boolean;
  hostConnected?: boolean;
  teamAName: string;
  teamBName: string;
  onPhaseChange: () => void;
  onLeaveRequest?: () => void;
}

export function MultiplayerRoundSummary({
  session,
  isHost,
  hostConnected = true,
  teamAName,
  teamBName,
  onPhaseChange,
  onLeaveRequest,
}: MultiplayerRoundSummaryProps) {
  const [nextLoading, setNextLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const teamName = session.current_turn_team === "A" ? teamAName : teamBName;
  const roundScore = session.round_correct - session.round_taboo;
  const canProceed = canNextRound(session, isHost);

  const handleNextRound = async () => {
    if (!canProceed || nextLoading) return;
    setNextLoading(true);
    try {
      await nextRound(session);
      onPhaseChange();
    } catch {
      setNextLoading(false);
    }
  };

  const handleEndGame = async () => {
    if (!isHost || endLoading) return;
    setEndLoading(true);
    try {
      await endGameEarly(session);
      onPhaseChange();
    } catch {
      setEndLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="flex min-h-svh flex-col px-4 py-6 pb-safe"
    >
      <div className="mx-auto w-full max-w-md space-y-4">
        {onLeaveRequest && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onLeaveRequest}
              className="flex min-h-[36px] items-center gap-1.5 rounded-lg bg-muted/80 px-3 text-xs font-medium text-muted-foreground touch-manipulation"
            >
              <LogOut className="h-3.5 w-3.5" />
              Leave
            </button>
          </div>
        )}
        <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Round over
        </p>
        <h2 className="text-center text-xl font-bold text-foreground">{teamName}</h2>
        <p className="text-center tabular-nums text-3xl font-bold text-primary">
          {roundScore >= 0 ? "+" : ""}{roundScore}
        </p>

        <div className="flex gap-2 rounded-2xl border border-border/80 bg-card/90 p-4">
          <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
            <Check className="h-5 w-5 text-accent" />
            <span className="tabular-nums text-xl font-bold">{session.round_correct}</span>
            <span className="text-[10px] font-medium uppercase text-muted-foreground">Correct</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
            <SkipForward className="h-5 w-5 text-muted-foreground" />
            <span className="tabular-nums text-xl font-bold">{session.round_skipped}</span>
            <span className="text-[10px] font-medium uppercase text-muted-foreground">Skipped</span>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-muted/50 p-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="tabular-nums text-xl font-bold">{session.round_taboo}</span>
            <span className="text-[10px] font-medium uppercase text-muted-foreground">Taboo</span>
          </div>
        </div>

        <div className="flex gap-2 rounded-2xl border border-border/80 bg-card/90 p-3">
          <div className="flex flex-1 flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">Team A</span>
            <span className="tabular-nums text-xl font-bold">{session.score_team_a}</span>
          </div>
          <div className="flex flex-1 flex-col items-center">
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">Team B</span>
            <span className="tabular-nums text-xl font-bold">{session.score_team_b}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          {isHost ? (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNextRound}
                disabled={!canProceed || nextLoading}
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-50"
              >
                {nextLoading ? "Starting…" : "Next round"}
              </motion.button>
              <button
                type="button"
                onClick={handleEndGame}
                disabled={endLoading}
                className="text-center text-xs font-medium text-muted-foreground underline underline-offset-2 disabled:opacity-50"
              >
                End game early
              </button>
            </>
          ) : (
            <div className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-muted/50 text-sm font-medium text-muted-foreground">
              {hostConnected ? "Waiting for host to start next round" : "Host disconnected. Waiting for host to return…"}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
