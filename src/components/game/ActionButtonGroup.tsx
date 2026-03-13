import { motion } from "framer-motion";
import { Check, SkipForward, AlertTriangle } from "lucide-react";

interface ActionButtonGroupProps {
  onCorrect: () => void;
  onSkip: () => void;
  onTaboo: () => void;
}

export function ActionButtonGroup({ onCorrect, onSkip, onTaboo }: ActionButtonGroupProps) {
  return (
    <div className="flex w-full gap-2 sm:gap-3">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onTaboo}
        className="flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-destructive font-semibold text-destructive-foreground transition-colors touch-manipulation sm:min-h-[4rem] sm:gap-2"
      >
        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-xs uppercase tracking-wide sm:text-sm">Taboo</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onSkip}
        className="flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-muted font-semibold text-muted-foreground transition-colors touch-manipulation sm:min-h-[4rem] sm:gap-2"
      >
        <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-xs uppercase tracking-wide sm:text-sm">Skip</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onCorrect}
        className="flex min-h-[48px] flex-[1.5] items-center justify-center gap-1.5 rounded-xl bg-accent font-semibold text-accent-foreground transition-colors touch-manipulation sm:min-h-[4rem] sm:gap-2"
      >
        <Check className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-xs uppercase tracking-wide sm:text-sm">Correct</span>
      </motion.button>
    </div>
  );
}
