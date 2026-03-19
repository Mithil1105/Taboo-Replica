import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy, Check, SkipForward, AlertTriangle } from "lucide-react";
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
import type { GameSessionRow } from "@/lib/supabase/types";
import { resetSessionToLobby } from "@/lib/supabase/sessionService";
import { closeRoom } from "@/lib/supabase/roomService";

interface MultiplayerResultsProps {
  session: GameSessionRow;
  isHost: boolean;
  hostConnected?: boolean;
  roomId: string;
  roomCode: string;
  teamAName: string;
  teamBName: string;
  onPhaseChange: () => void;
  onLeaveRequest?: () => void;
  onLeave?: () => Promise<void>;
}

export function MultiplayerResults({
  session,
  isHost,
  hostConnected = true,
  roomId,
  roomCode,
  teamAName,
  teamBName,
  onPhaseChange,
  onLeaveRequest,
  onLeave,
}: MultiplayerResultsProps) {
  const navigate = useNavigate();
  const [showReplayConfirm, setShowReplayConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [replayLoading, setReplayLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const aWins = session.score_team_a > session.score_team_b;
  const bWins = session.score_team_b > session.score_team_a;
  const tie = session.score_team_a === session.score_team_b;

  const handlePlayAgain = async () => {
    if (!isHost) return;
    setShowReplayConfirm(false);
    setReplayLoading(true);
    try {
      await resetSessionToLobby(roomId);
      onPhaseChange();
    } catch {
      setReplayLoading(false);
      navigate("/play");
    }
  };

  const handleBackHome = async () => {
    if (onLeave) {
      await onLeave();
    } else {
      navigate("/play");
    }
  };

  const handleEndGame = async () => {
    if (!isHost) return;
    setShowEndConfirm(false);
    setEndLoading(true);
    try {
      await closeRoom(roomId);
      navigate("/play");
    } catch {
      setEndLoading(false);
    }
  };

  const roundScore = session.round_correct - session.round_taboo;
  const lastRoundStats = [
    { icon: Check, label: "Correct", value: session.round_correct, color: "text-accent" },
    { icon: SkipForward, label: "Skipped", value: session.round_skipped, color: "text-muted-foreground" },
    { icon: AlertTriangle, label: "Anathema", value: session.round_taboo, color: "text-destructive" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="flex min-h-svh flex-col px-4 py-6 pb-safe"
    >
      <div className="mx-auto w-full max-w-md space-y-4">
        {/* Team score cards at top */}
        <div className="flex gap-3">
          <div
            className={`flex flex-1 flex-col items-center rounded-2xl border border-border/80 bg-card/90 p-4 ${
              aWins ? "ring-2 ring-primary bg-primary/10" : "bg-muted/30"
            }`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {teamAName}
            </span>
            <span className={`tabular-nums text-3xl font-bold ${aWins ? "text-primary" : "text-foreground"}`}>
              {session.score_team_a}
            </span>
            {aWins && <Trophy className="mt-1 h-5 w-5 text-primary" />}
          </div>
          <div
            className={`flex flex-1 flex-col items-center rounded-2xl border border-border/80 bg-card/90 p-4 ${
              bWins ? "ring-2 ring-primary bg-primary/10" : "bg-muted/30"
            }`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {teamBName}
            </span>
            <span className={`tabular-nums text-3xl font-bold ${bWins ? "text-primary" : "text-foreground"}`}>
              {session.score_team_b}
            </span>
            {bWins && <Trophy className="mt-1 h-5 w-5 text-primary" />}
          </div>
        </div>

        {/* Central results card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Game over
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold text-foreground">
            {tie ? "It's a tie!" : `${aWins ? teamAName : teamBName} wins!`}
          </h2>
          <p className="mt-2 text-center tabular-nums text-4xl font-bold text-primary">
            {roundScore >= 0 ? "+" : ""}{roundScore}
          </p>
          <p className="text-center text-sm text-muted-foreground">Last round</p>

          <div className="mt-4 flex gap-3">
            {lastRoundStats.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-muted p-3">
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="tabular-nums text-xl font-bold text-foreground">{value}</span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {session.current_round} rounds played
        </p>

        <div className="flex flex-col gap-2 pt-2">
          {isHost && (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowReplayConfirm(true)}
                disabled={replayLoading}
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-50"
              >
                Play again
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowEndConfirm(true)}
                disabled={endLoading}
                className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-border bg-muted text-sm font-medium text-muted-foreground disabled:opacity-50"
              >
                End game (close room)
              </motion.button>
              <AlertDialog open={showReplayConfirm} onOpenChange={setShowReplayConfirm}>
                <AlertDialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl border-border bg-card p-6 sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Play again?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Start a new game with the same teams. The room will return to setup.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
                    <AlertDialogCancel className="m-0 min-h-[44px] touch-manipulation">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handlePlayAgain}
                      disabled={replayLoading}
                      className="min-h-[44px] touch-manipulation disabled:opacity-50"
                    >
                      {replayLoading ? "Resetting…" : "Play again"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
                <AlertDialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl border-border bg-card p-6 sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>End game?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will close the room. Everyone will need to create or join a new room.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
                    <AlertDialogCancel className="m-0 min-h-[44px] touch-manipulation">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleEndGame}
                      disabled={endLoading}
                      className="min-h-[44px] touch-manipulation bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                    >
                      {endLoading ? "Closing…" : "End game"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleBackHome}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-muted font-semibold text-muted-foreground"
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
