import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/game/ThemeToggle";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { Home, Smartphone, Users, Volume2, VolumeX } from "lucide-react";
import { MultiplayerOnboarding, hasSeenMultiplayerOnboarding } from "../components/MultiplayerOnboarding";
import { isSoundEnabled, setSoundEnabled } from "@/hooks/useSound";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function LocalMultiplayerIntro() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showOnboarding, setShowOnboarding] = useState(!hasSeenMultiplayerOnboarding());
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  useEffect(() => {
    if (searchParams.get("closed") === "1") {
      toast.info("The host ended the game.");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleOnboardingComplete = () => setShowOnboarding(false);

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
            to="/play"
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
            aria-label="Back to play modes"
          >
            <Home className="h-4 w-4" />
          </Link>
          <div className="flex flex-1 flex-col items-center gap-1 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Local Multiplayer
            </p>
            <h1 className="text-base font-semibold text-foreground sm:text-lg">
              {showOnboarding ? "Quick setup" : "Two phones, one game"}
            </h1>
          </div>
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                setSoundEnabled(next);
              }}
              className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
              aria-label={soundOn ? "Mute sounds" : "Unmute sounds"}
            >
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>

        {showOnboarding ? (
          <MultiplayerOnboarding onComplete={handleOnboardingComplete} />
        ) : (
          <>
            {/* Content */}
            <section className="flex flex-1 flex-col gap-4">
              <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      One phone per team
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Each team uses their own phone. Rounds feel smoother, turns are clearer, and anathema calls are easier to manage.
                    </p>
                  </div>
                </div>

                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <li>• Team A sees their cards on one device.</li>
                  <li>• Team B sees theirs on another.</li>
                  <li>• An observer can track anathema calls from either side.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      Built for in-person groups
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Best when both teams are in the same room—game nights, college events, retreats, or workshops.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-1 rounded-2xl border border-dashed border-border/80 bg-muted/30 p-3">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {online
                    ? "Create a room, share the code, and join from another device. Both teams play in sync with realtime updates."
                    : "Needs internet. Try Pass & Play offline."}
                </p>
              </div>
            </section>

            {/* Actions */}
            <footer className="mt-4 flex flex-col gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/play/local-multiplayer/create")}
                disabled={!online}
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create a room
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/play/local-multiplayer/join")}
                disabled={!online}
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-muted text-sm font-semibold text-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join with a room code
              </motion.button>
            </footer>
          </>
        )}
      </motion.main>
    </div>
  );
}

