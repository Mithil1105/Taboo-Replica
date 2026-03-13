import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import { ModeCard } from "../components/ModeCard";
import { Home, Users, Smartphone } from "lucide-react";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function PlayModeSelection() {
  const { theme, toggleTheme } = useTheme();
  const online = useOnlineStatus();

  return (
    <div className="relative flex min-h-svh flex-col bg-background font-figtree">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-16 top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 top-32 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
      </div>
      <motion.main
        {...pageTransition}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] as const }}
        className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-safe pt-4"
      >
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-2">
          <Link
            to="/"
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
            aria-label="Back to site"
          >
            <Home className="h-4 w-4" />
          </Link>
          <div className="flex flex-1 flex-col items-center gap-1 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Play Taboo
            </p>
            <h1 className="text-base font-semibold text-foreground sm:text-lg">
              Choose your play mode
            </h1>
          </div>
          <div className="flex items-center justify-end">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>

        {/* Mode cards */}
        <section className="flex flex-1 flex-col items-center gap-4">
          <ModeCard
            label="Pass & Play"
            title="One device, shared turns"
            description="Pass a single phone between teams for a quick, classic Taboo-style game."
            bullets={[
              "One device for both teams",
              "Fast setup, no accounts",
              "Perfect for couch or party play",
            ]}
            ctaLabel="Play Pass & Play"
            to="/play/pass-and-play"
            accent="primary"
            icon={<Smartphone className="h-5 w-5" />}
            badge={!online ? "Works offline" : undefined}
          />

          <ModeCard
            label="Local Multiplayer"
            title="Two phones, one game"
            description="Each team gets their own phone. Cleaner turns, easier taboo calls, and less chaos."
            bullets={[
              "One phone per team",
              "Room-based setup",
              "Observer can track taboo calls",
            ]}
            ctaLabel="Set up Local Multiplayer"
            to="/play/local-multiplayer"
            accent="secondary"
            icon={<Users className="h-5 w-5" />}
          />

          <p className="mt-1 text-center text-[11px] leading-relaxed text-muted-foreground">
            {online
              ? "You can switch modes any time. Local Multiplayer syncs both devices in realtime."
              : "Pass & Play works offline. Local Multiplayer needs internet."}
          </p>
        </section>
      </motion.main>
    </div>
  );
}

