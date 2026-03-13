import { useState, useCallback, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import { Home } from "lucide-react";
import { RoomCodeCard } from "../components/RoomCodeCard";
import { DebugPanel } from "@/components/game/DebugPanel";
import { LobbyTeamSlot } from "../components/LobbyTeamSlot";
import { MultiplayerGameSetup } from "../components/MultiplayerGameSetup";
import { MultiplayerPlayingView } from "../components/MultiplayerPlayingView";
import { MultiplayerRoundSummary } from "../components/MultiplayerRoundSummary";
import { MultiplayerResults } from "../components/MultiplayerResults";
import type { LocalTeamId } from "../types";
import { useDeviceId } from "../hooks/useDeviceId";
import { useRoom } from "../hooks/useRoom";
import { useGameSession } from "../hooks/useGameSession";
import { useLeaveRoom } from "../hooks/useLeaveRoom";
import { createSession } from "@/lib/supabase/sessionService";
import { updateRoomSetup } from "@/lib/supabase/roomService";
import decksRegistry from "@/data/decks.json";
import { getValidatedDecks } from "@/lib/deckValidation";
import type { DeckMeta } from "@/types";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const allDecks = getValidatedDecks(decksRegistry) as DeckMeta[];

export default function LocalMultiplayerRoomPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { roomCode } = useParams<{ roomCode: string }>();
  const deviceId = useDeviceId();
  const { room, participants, isLoading: roomLoading, error: roomError, isReconnecting } = useRoom(roomCode, deviceId);
  const { session, isLoading: sessionLoading, error: sessionError, refetch: refetchSession } = useGameSession(room?.id);
  const { mutate: leaveRoom, isLeaving } = useLeaveRoom();

  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const currentParticipant = participants.find((p) => deviceId && p.device_id === deviceId) || null;
  const currentTeam: LocalTeamId | null = currentParticipant ? currentParticipant.team : null;
  const otherTeam: LocalTeamId = currentTeam === "A" ? "B" : "A";
  const isHost = Boolean(currentParticipant?.is_host);

  const bothTeamsConnected = participants.filter((p) => p.connected).length >= 2;
  const hostParticipant = participants.find((p) => p.is_host);
  const hostConnected = hostParticipant?.connected ?? false;

  const rawDecks = room?.selected_decks;
  const selectedDecks = new Set<string>(
    Array.isArray(rawDecks) ? rawDecks.filter((id): id is string => typeof id === "string") : []
  );
  const roundDuration = room?.round_duration ?? 60;
  const totalRounds = room?.total_rounds ?? 4;
  const targetScore = room?.target_score ?? 0;
  const teamAName = (room?.team_a_name as string) || "Team A";
  const teamBName = (room?.team_b_name as string) || "Team B";

  const handleSetupChange = useCallback(
    (updates: {
      selectedDecks?: Set<string>;
      roundDuration?: number;
      totalRounds?: number;
      targetScore?: number;
      teamAName?: string;
      teamBName?: string;
    }) => {
      if (!room?.id || !isHost) return;
      const decks = updates.selectedDecks ?? selectedDecks;
      updateRoomSetup(room.id, {
        selectedDecks: Array.from(decks),
        roundDuration: updates.roundDuration ?? roundDuration,
        totalRounds: updates.totalRounds ?? totalRounds,
        targetScore: updates.targetScore ?? targetScore,
        teamAName: updates.teamAName ?? teamAName,
        teamBName: updates.teamBName ?? teamBName,
      }).catch((e) => {
        if (import.meta.env.DEV) console.error("[handleSetupChange] updateRoomSetup failed:", e);
      });
    },
    [room?.id, isHost, selectedDecks, roundDuration, totalRounds, targetScore, teamAName, teamBName]
  );

  const handleToggleDeck = useCallback(
    (id: string) => {
      const next = new Set(selectedDecks);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      handleSetupChange({ selectedDecks: next });
    },
    [selectedDecks, handleSetupChange]
  );

  const handleResetSetup = useCallback(() => {
    if (!isHost || !room?.id) return;
    const firstDeck = allDecks.find((d) => d.isActive)?.id;
    handleSetupChange({
      selectedDecks: firstDeck ? new Set([firstDeck]) : new Set(),
      roundDuration: 60,
      totalRounds: 4,
      targetScore: 0,
      teamAName: "Team A",
      teamBName: "Team B",
    });
  }, [isHost, room?.id, handleSetupChange, allDecks]);

  const handleStartGame = async () => {
    if (!room || !isHost || startLoading || selectedDecks.size === 0 || !bothTeamsConnected) return;
    setStartLoading(true);
    setStartError(null);
    try {
      await createSession({
        room,
        selectedDecks: Array.from(selectedDecks),
        roundDuration,
        totalRounds,
        targetScore,
        teamAName: teamAName !== "Team A" ? teamAName : undefined,
        teamBName: teamBName !== "Team B" ? teamBName : undefined,
      });
      await refetchSession();
    } catch (e) {
      setStartError(e instanceof Error ? e.message : "Failed to start game.");
    } finally {
      setStartLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!roomCode || !deviceId) return;
    setShowLeaveConfirm(false);
    await leaveRoom({ roomCode, deviceId });
    window.location.href = "/play";
  };

  const error = roomError || sessionError;

  // When host ends game (room closed), auto-redirect observers
  useEffect(() => {
    if (room?.status === "closed" && !isHost) {
      navigate("/play/local-multiplayer?closed=1", { replace: true });
    }
  }, [room?.status, isHost, navigate]);

  // Room not found or no longer exists
  if (!room && roomCode && !roomLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-center text-sm font-medium text-muted-foreground">
          {roomError || "This room no longer exists or the code is invalid."}
        </p>
        <Link
          to="/play/local-multiplayer"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Create or join a room
        </Link>
      </div>
    );
  }

  if (roomLoading && !room) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background px-4">
        {isReconnecting ? (
          <>
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Reconnecting…</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Loading room…</p>
        )}
      </div>
    );
  }

  if (room && !roomCode) {
    return null;
  }

  if (room?.status === "closed") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-center text-sm font-medium text-muted-foreground">
          {isHost ? "You closed this room." : "The host ended the game. This room is closed."}
        </p>
        <Link
          to="/play/local-multiplayer"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Create or join a room
        </Link>
      </div>
    );
  }

  // Session stale: room says playing but no session (e.g. session deleted, race)
  if (room?.status === "playing" && !session && !sessionLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-center text-sm font-medium text-muted-foreground">
          {sessionError ? "Session load failed." : "Session ended or recovering."}
        </p>
        <div className="flex flex-col gap-2">
          <Link
            to="/play/local-multiplayer"
            className="rounded-xl bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground"
          >
            Create or join a room
          </Link>
          <button
            type="button"
            onClick={() => refetchSession()}
            className="rounded-xl border border-border bg-muted px-6 py-3 text-sm font-medium text-muted-foreground"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (room && !currentParticipant && deviceId) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-center text-sm font-medium text-muted-foreground">You&apos;re not in this room yet.</p>
        <Link
          to={roomCode ? `/play/local-multiplayer/join?code=${encodeURIComponent(roomCode)}` : "/play/local-multiplayer/join"}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Join with room code
        </Link>
      </div>
    );
  }

  const leaveConfirmDialog = (
    <AlertDialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl border-border bg-card p-6 sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">Leave game?</AlertDialogTitle>
          <AlertDialogDescription>
            You&apos;ll disconnect from this room. The other team may need to start a new game.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2 sm:justify-end">
          <AlertDialogCancel className="m-0 min-h-[44px] touch-manipulation">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeave}
            className="min-h-[44px] touch-manipulation bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (session?.phase === "playing") {
    return (
      <div className="flex min-h-svh flex-col bg-background font-figtree">
        {leaveConfirmDialog}
        <AnimatePresence mode="wait">
          {!hostConnected && !isHost && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center justify-center gap-2 overflow-hidden border-b border-border/60 bg-amber-500/10 px-4 py-2 text-center text-xs font-medium text-amber-700 dark:text-amber-400"
            >
              Host disconnected. Waiting for host to return…
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          key="playing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-1 flex-col"
        >
          <MultiplayerPlayingView
          session={session}
          myTeam={currentTeam}
          isHost={isHost}
          hostConnected={hostConnected}
          teamAName={teamAName}
          teamBName={teamBName}
          onPhaseChange={refetchSession}
          onLeaveRequest={() => setShowLeaveConfirm(true)}
        />
        </motion.div>
        <DebugPanel
          roomCode={roomCode}
          deviceId={deviceId}
          team={currentTeam}
          isHost={isHost}
          phase={session.phase}
          currentRound={session.current_round}
          currentTurnTeam={session.current_turn_team}
          currentCardId={session.current_card_id}
          scoreA={session.score_team_a}
          scoreB={session.score_team_b}
          sessionId={session.id}
          connectionState={isReconnecting ? "reconnecting" : "connected"}
          bothTeamsConnected={bothTeamsConnected}
          roomStatus={room?.status}
          hostConnected={hostConnected}
        />
      </div>
    );
  }

  if (session?.phase === "round_summary") {
    return (
      <div className="flex min-h-svh flex-col bg-background font-figtree">
        {leaveConfirmDialog}
        {!hostConnected && !isHost && (
          <div className="flex items-center justify-center gap-2 border-b border-border/60 bg-amber-500/10 px-4 py-2 text-center text-xs font-medium text-amber-700 dark:text-amber-400">
            Host disconnected. Waiting for host to return…
          </div>
        )}
        <MultiplayerRoundSummary
          session={session}
          isHost={isHost}
          hostConnected={hostConnected}
          teamAName={teamAName}
          teamBName={teamBName}
          onPhaseChange={refetchSession}
          onLeaveRequest={() => setShowLeaveConfirm(true)}
        />
        <DebugPanel
          roomCode={roomCode}
          deviceId={deviceId}
          team={currentTeam}
          isHost={isHost}
          phase={session.phase}
          currentRound={session.current_round}
          currentTurnTeam={session.current_turn_team}
          scoreA={session.score_team_a}
          scoreB={session.score_team_b}
          sessionId={session.id}
          bothTeamsConnected={bothTeamsConnected}
          roomStatus={room?.status}
          hostConnected={hostConnected}
        />
      </div>
    );
  }

  if (session?.phase === "results") {
    return (
      <div className="flex min-h-svh flex-col bg-background font-figtree">
        {leaveConfirmDialog}
        {!hostConnected && !isHost && (
          <div className="flex items-center justify-center gap-2 border-b border-border/60 bg-amber-500/10 px-4 py-2 text-center text-xs font-medium text-amber-700 dark:text-amber-400">
            Host disconnected. You can leave or wait for host to return.
          </div>
        )}
        <MultiplayerResults
          session={session}
          isHost={isHost}
          hostConnected={hostConnected}
          roomId={room!.id}
          roomCode={roomCode || ""}
          teamAName={teamAName}
          teamBName={teamBName}
          onPhaseChange={refetchSession}
          onLeaveRequest={() => setShowLeaveConfirm(true)}
          onLeave={handleLeave}
        />
        <DebugPanel
          roomCode={roomCode}
          deviceId={deviceId}
          team={currentTeam}
          isHost={isHost}
          phase={session.phase}
          currentRound={session.current_round}
          scoreA={session.score_team_a}
          scoreB={session.score_team_b}
          sessionId={session.id}
          bothTeamsConnected={bothTeamsConnected}
          roomStatus={room?.status}
          hostConnected={hostConnected}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-background font-figtree">
      <motion.main
        {...pageTransition}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] as const }}
        className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-28 pt-3"
      >
        <header className="mb-3 flex items-center justify-between gap-2">
          <Link
            to="/play/local-multiplayer"
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
            aria-label="Back to multiplayer intro"
          >
            <Home className="h-4 w-4" />
          </Link>
          <div className="flex flex-1 flex-col items-center gap-1 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Lobby
            </p>
            <h1 className="text-base font-semibold text-foreground sm:text-lg">
              {bothTeamsConnected ? "Ready to start" : "Waiting for both teams"}
            </h1>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        <section className="flex flex-1 flex-col gap-4">
          {currentTeam && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-center text-xs font-semibold text-primary">
              You are Team {currentTeam}
            </div>
          )}
          <RoomCodeCard
            roomCode={(room?.room_code ?? roomCode ?? "").toUpperCase()}
            helperText="Share this code with the other team."
          />

          <div className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Teams
            </p>
            <div className="flex gap-2 sm:flex-row">
              <LobbyTeamSlot
                teamId="A"
                label={teamAName}
                status={
                  participants.find((p) => p.team === "A")
                    ? participants.find((p) => p.team === "A" && p.device_id === deviceId)
                      ? "you"
                      : "connected"
                    : "waiting"
                }
              />
              <LobbyTeamSlot
                teamId="B"
                label={teamBName}
                status={
                  participants.find((p) => p.team === "B")
                    ? participants.find((p) => p.team === "B" && p.device_id === deviceId)
                      ? "you"
                      : "connected"
                    : "waiting"
                }
              />
            </div>
          </div>

          <MultiplayerGameSetup
            decks={allDecks}
            selectedDecks={selectedDecks}
            onToggleDeck={handleToggleDeck}
            roundDuration={roundDuration}
            onRoundDuration={(d) => handleSetupChange({ roundDuration: d })}
            totalRounds={totalRounds}
            onTotalRounds={(n) => handleSetupChange({ totalRounds: n })}
            targetScore={targetScore}
            onTargetScore={(n) => handleSetupChange({ targetScore: n })}
            teamAName={teamAName}
            teamBName={teamBName}
            onTeamAName={(s) => handleSetupChange({ teamAName: s })}
            onTeamBName={(s) => handleSetupChange({ teamBName: s })}
            isHost={isHost}
            onResetSetup={isHost ? handleResetSetup : undefined}
          />

          {error && <p className="text-center text-[11px] text-destructive">{error}</p>}
          {startError && <p className="text-center text-[11px] text-destructive">{startError}</p>}
        </section>
      </motion.main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 pb-safe">
        <div className="mx-auto flex max-w-md flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => (session ? setShowLeaveConfirm(true) : handleLeave())}
            disabled={isLeaving}
            className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-muted text-xs font-semibold text-muted-foreground"
          >
            {isLeaving ? "Leaving…" : session ? "Leave game" : "Leave lobby"}
          </motion.button>
          {leaveConfirmDialog}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleStartGame}
            disabled={
              !isHost ||
              startLoading ||
              selectedDecks.size === 0 ||
              !bothTeamsConnected
            }
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-50"
          >
            {startLoading
              ? "Starting…"
              : isHost
              ? bothTeamsConnected
                ? "Start game"
                : "Waiting for both teams"
              : `Waiting for ${otherTeam} to start`}
          </motion.button>
        </div>
      </div>
      <DebugPanel
        roomCode={roomCode}
        deviceId={deviceId}
        team={currentTeam}
        isHost={isHost}
        phase={session?.phase ?? "lobby"}
        bothTeamsConnected={bothTeamsConnected}
        roomStatus={room?.status}
        hostConnected={hostConnected}
        selectedDecks={selectedDecks}
        roomUpdatedAt={room?.updated_at}
      />
    </div>
  );
}
