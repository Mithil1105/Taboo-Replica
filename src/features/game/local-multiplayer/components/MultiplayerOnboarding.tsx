import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, MessageCircle, Trophy, ChevronRight } from "lucide-react";
import {
  ONBOARDING_KEYS,
  hasSeenOnboarding,
  setOnboardingSeen,
} from "@/lib/onboarding";

const MULTIPLAYER_ONBOARDING_KEY = ONBOARDING_KEYS.multiplayer;

export function hasSeenMultiplayerOnboarding(): boolean {
  return hasSeenOnboarding(MULTIPLAYER_ONBOARDING_KEY);
}

export function setMultiplayerOnboardingSeen(): void {
  setOnboardingSeen(MULTIPLAYER_ONBOARDING_KEY);
}

interface MultiplayerOnboardingProps {
  onComplete: () => void;
}

const screens = [
  {
    icon: Smartphone,
    title: "Two phones setup",
    body: "Each team uses their own phone. One device shows the card and gives clues. The other watches and can call anathema when a forbidden word is said.",
    hint: "Create a room on one phone, join with the code on the other.",
  },
  {
    icon: MessageCircle,
    title: "How anathema works",
    body: "The clue giver must get their team to guess the main word using only spoken words—no gestures or sounds allowed. No breaking words, synonyms, or translations—even if a teammate has guessed. If they slip, the opposing team taps Anathema and selects which word was said.",
    hint: "Observers must pick the exact forbidden word that was spoken.",
  },
  {
    icon: Trophy,
    title: "Scoring rules",
    body: "Correct guess: +1 for the clue team. Skip: no change. Anathema: -1 for the clue team, +1 for the opponents. The team with the most points after all rounds wins.",
    hint: "Anathema hurts the clue team and rewards the observers.",
  },
];

export function MultiplayerOnboarding({ onComplete }: MultiplayerOnboardingProps) {
  const [step, setStep] = useState(0);
  const isLast = step === screens.length - 1;

  const handleNext = () => {
    if (isLast) {
      setMultiplayerOnboardingSeen();
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkipForever = () => {
    setMultiplayerOnboardingSeen();
    onComplete();
  };

  return (
    <div className="flex min-h-[60vh] flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col items-center justify-center px-2 py-4">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              {(() => {
                const Icon = screens[step].icon;
                return <Icon className="h-7 w-7" />;
              })()}
            </div>
            <h2 className="mb-2 text-center text-lg font-bold text-foreground">
              {screens[step].title}
            </h2>
            <p className="mb-3 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
              {screens[step].body}
            </p>
            <p className="text-center text-xs text-muted-foreground/80">
              {screens[step].hint}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 pb-2">
            {screens.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? "w-5 bg-primary" : "w-1.5 bg-muted"
                  }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleNext}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground"
      >
        {isLast ? "Got it — Start Game" : "Next"}
        <ChevronRight className="h-4 w-4" />
      </motion.button>

      <button
        type="button"
        onClick={handleSkipForever}
        className="mt-2 min-h-[40px] w-full rounded-xl text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Skip &amp; don&apos;t show again
      </button>
    </div>
  );
}
