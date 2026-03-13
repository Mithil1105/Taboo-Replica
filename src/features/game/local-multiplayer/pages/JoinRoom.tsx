import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import { Home } from "lucide-react";
import { TeamSelector } from "../components/TeamSelector";
import type { LocalTeamId } from "../types";
import { useDeviceId } from "../hooks/useDeviceId";
import { useJoinRoom } from "../hooks/useJoinRoom";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function LocalMultiplayerJoinRoom() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deviceId = useDeviceId();
  const { mutate: joinRoom, isLoading, error } = useJoinRoom();
  const [team, setTeam] = useState<LocalTeamId>("B");
  const [roomCode, setRoomCode] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) setRoomCode(code.trim().toUpperCase());
  }, [searchParams]);

  const trimmedCode = roomCode.trim().toUpperCase();
  const hasError = touched && trimmedCode.length < 4;

  const handleJoin = () => {
    setTouched(true);
    if (trimmedCode.length < 4 || !deviceId || isLoading) return;
    joinRoom({ roomCode: trimmedCode, team, deviceId }).then((result) => {
      if (!result) return;
      navigate(`/play/local-multiplayer/room/${encodeURIComponent(result.room.room_code)}`);
    });
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
              Join a room
            </h1>
          </div>
          <div className="flex items-center justify-end">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>

        {/* Content */}
        <section className="flex flex-1 flex-col gap-4">
          <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Room code
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter the 4–8 character code shared by the host.
            </p>
            <div className="mt-3">
              <input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                onBlur={() => setTouched(true)}
                maxLength={10}
                className="flex h-11 w-full rounded-xl border border-input bg-muted/60 px-3 text-center text-base tracking-[0.25em] text-foreground outline-none ring-1 ring-transparent transition-all focus:border-primary focus:ring-2 focus:ring-ring"
                placeholder="ABC123"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
              />
              {hasError && (
                <p className="mt-1 text-[11px] text-destructive">
                  Please enter a valid room code (at least 4 characters).
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Choose your team
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              If the host picked Team A on their phone, you&apos;ll usually join as Team B (and vice versa).
            </p>
            <div className="mt-3">
              <TeamSelector value={team} onChange={setTeam} />
            </div>
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
            onClick={handleJoin}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-50"
            disabled={trimmedCode.length === 0 || !deviceId || isLoading}
          >
            {isLoading ? "Joining..." : "Join lobby"}
          </motion.button>
        </footer>
      </motion.main>
    </div>
  );
}

