import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import { Home } from "lucide-react";
import { TeamSelector } from "../components/TeamSelector";
import { RoomCodeCard } from "../components/RoomCodeCard";
import type { LocalTeamId } from "../types";
import { useDeviceId } from "../hooks/useDeviceId";
import { useCreateRoom } from "../hooks/useCreateRoom";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function LocalMultiplayerCreateRoom() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const deviceId = useDeviceId();
  const { mutate: createRoom, isLoading, error } = useCreateRoom();
  const [team, setTeam] = useState<LocalTeamId>("A");
  const [roomCodePreview, setRoomCodePreview] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!deviceId || isLoading) return;

    const result = await createRoom({
      team,
      deviceId,
    });

    if (!result) return;

    setRoomCodePreview(result.room.room_code);
    navigate(`/play/local-multiplayer/room/${encodeURIComponent(result.room.room_code)}`);
  };

  return (
    <div className="flex min-h-svh flex-col bg-background font-figtree">
      <motion.main
        {...pageTransition}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] as const }}
        className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-safe pt-4"
      >
        {/* Header */}
        <header className="mb-5 flex items-center justify-between gap-2">
          <Link
            to="/play/local-multiplayer"
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
            aria-label="Back to multiplayer intro"
          >
            <Home className="h-4 w-4" />
          </Link>
          <div className="flex flex-1 flex-col items-center gap-1 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Local Multiplayer
            </p>
            <h1 className="text-base font-semibold text-foreground sm:text-lg">
              Create a room
            </h1>
          </div>
          <div className="flex items-center justify-end">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>

        {/* Content */}
        <section className="flex flex-1 flex-col gap-4">
          <RoomCodeCard
            roomCode={roomCodePreview ?? "••••••"}
            helperText={
              roomCodePreview
                ? "Share this code with the other team so they can join from their own phone."
                : "Your room code will appear here as soon as the room is created."
            }
          />

          <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Choose your team
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              This is the team you&apos;ll control from this device.
            </p>
            <div className="mt-3">
              <TeamSelector value={team} onChange={setTeam} />
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-3">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Share this code with the other team. They join from their phone and both devices sync in realtime.
            </p>
          </div>
        </section>

        {/* Actions */}
        <footer className="mt-4 flex flex-col gap-2">
          {error && (
            <p className="text-center text-[11px] text-destructive">
              {error}
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            disabled={!deviceId || isLoading}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating room..." : "Create room"}
          </motion.button>
        </footer>
      </motion.main>
    </div>
  );
}

