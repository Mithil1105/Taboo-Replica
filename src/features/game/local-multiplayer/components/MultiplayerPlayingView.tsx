import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, SkipForward, AlertTriangle, LogOut, Volume2, VolumeX } from "lucide-react";
import type { GameSessionRow } from "@/lib/supabase/types";
import type { LocalTeamId } from "../types";
import { advanceCard, endRound } from "@/lib/supabase/sessionService";
import { getCardById } from "../utils/cardResolver";
import { useRoundTimer } from "../hooks/useRoundTimer";
import { TabooWordPicker } from "./TabooWordPicker";
import { playCorrectSound, playSkipSound, playTabooSound, playTimerBuzzerSound, playTickSound, isSoundEnabled, setSoundEnabled } from "@/hooks/useSound";
import { isDebugEnabled } from "@/lib/debug";

interface MultiplayerPlayingViewProps {
  session: GameSessionRow;
  myTeam: LocalTeamId | null;
  isHost: boolean;
  hostConnected?: boolean;
  teamAName?: string;
  teamBName?: string;
  onPhaseChange: () => void;
  onLeaveRequest?: () => void;
}

export function MultiplayerPlayingView({
  session,
  myTeam,
  isHost,
  hostConnected = true,
  teamAName = "Team A",
  teamBName = "Team B",
  onPhaseChange,
  onLeaveRequest,
}: MultiplayerPlayingViewProps) {
  const [actionLoading, setActionLoading] = useState(false);
  const [tabooPickerOpen, setTabooPickerOpen] = useState(false);
  const [cardFlash, setCardFlash] = useState<"correct" | "taboo" | null>(null);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const prevTimeRef = useRef(0);
  const actionLockRef = useRef(false);

  const isClueMode = myTeam !== null && session.current_turn_team === myTeam;
  const isObserverMode = myTeam !== null && session.current_turn_team !== myTeam;

  const durationSec = Number(session.timer_duration_seconds) || 60;
  const timeLeft = useRoundTimer(
    session.timer_started_at,
    durationSec,
    session.phase
  );
  const isLastFiveSeconds = timeLeft > 0 && timeLeft <= 5;

  useEffect(() => {
    if (prevTimeRef.current > 0 && timeLeft === 0 && session.phase === "playing") {
      playTimerBuzzerSound();
    }
    prevTimeRef.current = timeLeft;
  }, [timeLeft, session.phase]);

  const lastTickedRef = useRef<number | null>(null);
  useEffect(() => {
    if (timeLeft > 0 && timeLeft <= 5 && session.phase === "playing") {
      if (lastTickedRef.current !== timeLeft) {
        lastTickedRef.current = timeLeft;
        playTickSound();
      }
    } else {
      lastTickedRef.current = null;
    }
  }, [timeLeft, session.phase]);

  const endRoundCalledRef = useRef(false);
  const hasSeenPositiveTimeRef = useRef(false);

  useEffect(() => {
    if (session.phase !== "playing") endRoundCalledRef.current = false;
  }, [session.phase]);

  useEffect(() => {
    hasSeenPositiveTimeRef.current = false;
  }, [session.current_round]);

  useEffect(() => {
    if (timeLeft > 0) hasSeenPositiveTimeRef.current = true;
  }, [timeLeft]);

  useEffect(() => {
    const hasValidTimer = session.timer_started_at && durationSec > 0;
    const timerActuallyExpired =
      hasSeenPositiveTimeRef.current && timeLeft <= 0;
    if (
      timerActuallyExpired &&
      session.phase === "playing" &&
      isHost &&
      hasValidTimer &&
      !endRoundCalledRef.current
    ) {
      endRoundCalledRef.current = true;
      endRound(session).then(() => onPhaseChange()).catch(() => {
        endRoundCalledRef.current = false;
      });
    }
  }, [timeLeft, session.phase, session, isHost, onPhaseChange, durationSec]);

  const runAction = useCallback(
    async (fn: () => Promise<void>) => {
      if (actionLockRef.current || actionLoading || session.phase !== "playing") return;
      actionLockRef.current = true;
      setActionLoading(true);
      try {
        await fn();
        onPhaseChange();
      } finally {
        actionLockRef.current = false;
        setActionLoading(false);
      }
    },
    [actionLoading, session.phase, onPhaseChange]
  );

  const handleCorrect = useCallback(async () => {
    if (!isClueMode) return;
    setCardFlash("correct");
    setTimeout(() => setCardFlash(null), 400);
    await runAction(async () => {
      playCorrectSound();
      await advanceCard(session, "correct");
    });
  }, [isClueMode, session, runAction]);

  const handleSkip = useCallback(async () => {
    if (!isClueMode) return;
    await runAction(async () => {
      playSkipSound();
      await advanceCard(session, "skip");
    });
  }, [isClueMode, session, runAction]);

  const handleTabooObserverClick = useCallback(() => {
    if (!isObserverMode || actionLoading) return;
    setTabooPickerOpen(true);
  }, [isObserverMode, actionLoading]);

  const handleTabooClueClick = useCallback(async () => {
    if (!isClueMode || actionLoading || session.phase !== "playing") return;
    setCardFlash("taboo");
    setTimeout(() => setCardFlash(null), 400);
    actionLockRef.current = true;
    setActionLoading(true);
    try {
      playTabooSound();
      await advanceCard(session, "taboo");
      onPhaseChange();
    } finally {
      actionLockRef.current = false;
      setActionLoading(false);
    }
  }, [isClueMode, actionLoading, session, onPhaseChange]);

  const handleTabooConfirm = useCallback(
    async (word: string) => {
      if (actionLockRef.current || actionLoading || session.phase !== "playing") return;
      setCardFlash("taboo");
      setTimeout(() => setCardFlash(null), 400);
      actionLockRef.current = true;
      setActionLoading(true);
      try {
        playTabooSound();
        await advanceCard(session, "taboo", word);
        onPhaseChange();
      } finally {
        actionLockRef.current = false;
        setActionLoading(false);
      }
    },
    [actionLoading, session, onPhaseChange]
  );

  const card = session.current_card_id ? getCardById(session.current_card_id) : null;

  return (
    <div className="flex min-h-svh flex-col">
      {/* Compact header - Team A vs Team B, round, clue team, scores */}
      <header className="flex shrink-0 flex-col gap-1.5 px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {onLeaveRequest && (
              <button
                type="button"
                onClick={onLeaveRequest}
                className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg bg-muted/80 text-muted-foreground touch-manipulation"
                aria-label="Leave game"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground">
                {teamAName} vs {teamBName}
              </span>
              {isHost && (
                <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  Host
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                setSoundEnabled(next);
              }}
              className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-lg bg-muted/80 text-muted-foreground touch-manipulation"
              aria-label={soundOn ? "Mute" : "Unmute"}
            >
              {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 tabular-nums text-lg font-bold transition-colors ${
                isLastFiveSeconds ? "animate-pulse bg-destructive/20 text-destructive" : "bg-muted/80 text-foreground"
              }`}
            >
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-semibold uppercase text-muted-foreground">
            Round {session.current_round} / {session.total_rounds ?? "?"}
            {session.current_turn_team === "A" ? ` · ${teamAName} (Clue)` : ` · ${teamBName} (Clue)`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold">
          <span className={session.current_turn_team === "A" ? "text-primary" : "text-muted-foreground"}>
            {teamAName}: {session.score_team_a}
          </span>
          <span className="text-muted-foreground">—</span>
          <span className={session.current_turn_team === "B" ? "text-primary" : "text-muted-foreground"}>
            {teamBName}: {session.score_team_b}
          </span>
        </div>
      </header>

      {/* Card */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-2">
        <AnimatePresence mode="wait">
          {card ? (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className={`flex w-full max-w-md flex-col overflow-hidden rounded-2xl border-2 shadow-sm transition-colors duration-200 ${
                cardFlash === "correct"
                  ? "border-accent bg-accent/10"
                  : cardFlash === "taboo"
                    ? "animate-shake border-destructive bg-destructive/10"
                    : "border-border/80 bg-card"
              }`}
            >
              {/* Main word header */}
              <div className="bg-primary/10 px-4 py-3 text-center">
                <h1 className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">
                  {card.word}
                </h1>
              </div>

              {/* Taboo words - one per line */}
              <div className="px-4 py-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-destructive/80">
                  Don&apos;t say
                </p>
                <ul className="space-y-2">
                  {card.tabooWords.map((w) => (
                    <li key={w} className="text-center text-base font-medium text-card-foreground">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <p className="text-sm text-muted-foreground">No card</p>
          )}
        </AnimatePresence>
      </div>

      {/* Actions - role-based */}
      <div className="shrink-0 border-t border-border bg-background/95 px-4 py-2.5 pb-safe">
        {isClueMode && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSkip}
                disabled={actionLoading || session.phase !== "playing"}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-muted font-semibold text-muted-foreground disabled:opacity-60"
              >
                <SkipForward className="h-4 w-4" />
                Skip
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCorrect}
                disabled={actionLoading || session.phase !== "playing"}
                className="flex min-h-[48px] flex-[1.5] items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-accent-foreground disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                Correct
              </motion.button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleTabooClueClick}
              disabled={actionLoading || !card || session.phase !== "playing"}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border-2 border-destructive/60 bg-destructive/10 font-semibold text-destructive disabled:opacity-60"
            >
              <AlertTriangle className="h-4 w-4" />
              I said a taboo word
            </motion.button>
          </div>
        )}
        {isObserverMode && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleTabooObserverClick}
            disabled={actionLoading || !card || session.phase !== "playing"}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-destructive font-semibold text-destructive-foreground disabled:opacity-60"
          >
            <AlertTriangle className="h-4 w-4" />
            Taboo
          </motion.button>
        )}
      </div>

      <TabooWordPicker
        open={tabooPickerOpen}
        onOpenChange={setTabooPickerOpen}
        tabooWords={card?.tabooWords ?? []}
        onConfirm={handleTabooConfirm}
      />

      {isDebugEnabled() && (
        <div className="fixed bottom-2 left-2 right-2 z-[9998] max-w-xs rounded border border-amber-500/50 bg-amber-950/95 px-2 py-1 text-[9px] font-mono text-amber-100">
          <div className="font-semibold text-amber-300">Timer Debug</div>
          <div className="mt-0.5 space-y-0.5">
            <div>phase: {session.phase}</div>
            <div>timer_started_at: {session.timer_started_at ? new Date(session.timer_started_at).toISOString() : "null"}</div>
            <div>timer_duration_seconds: {session.timer_duration_seconds ?? "null"}</div>
            <div>timeLeft: {timeLeft}</div>
            <div>hasValidTimer: {session.timer_started_at && durationSec > 0 ? "yes" : "no"}</div>
            <div>isHost: {isHost ? "yes" : "no"}</div>
            <div>endRoundCalled: {endRoundCalledRef.current ? "yes" : "no"}</div>
            <div>hasSeenPositiveTime: {hasSeenPositiveTimeRef.current ? "yes" : "no"}</div>
            <div>current_round: {session.current_round}</div>
            <div>updated_at: {session.updated_at ? new Date(session.updated_at).toLocaleTimeString() : "—"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
