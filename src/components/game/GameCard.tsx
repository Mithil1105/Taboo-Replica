import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Card } from "@/types";
import { Ban } from "lucide-react";

interface GameCardProps {
  card: Card;
}

const flipVariants = {
  initial: {
    rotateY: 90,
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: {
      rotateY: { duration: 0.35, ease: [0.32, 0.72, 0, 1] as const },
      opacity: { duration: 0.2 },
      scale: { duration: 0.35, ease: [0.32, 0.72, 0, 1] as const },
    },
  },
  exit: {
    rotateY: -90,
    opacity: 0,
    scale: 0.95,
    transition: {
      rotateY: { duration: 0.25, ease: [0.32, 0.72, 0, 1] as const },
      opacity: { duration: 0.2, delay: 0.05 },
      scale: { duration: 0.25, ease: [0.32, 0.72, 0, 1] as const },
    },
  },
};

export function GameCard({ card }: GameCardProps) {
  return (
    <div className="w-full" style={{ perspective: 1200 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          variants={flipVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          {/* Main word header */}
          <div className="bg-primary/10 px-4 py-4 text-center">
            <h1 className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">
              {card.word}
            </h1>
          </div>

          {/* Taboo words - one per line */}
          <div className="px-4 py-4">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-destructive/80">
              <Ban className="h-3 w-3" />
              <span>Don&apos;t say</span>
            </div>
            <ul className="space-y-2">
              {card.tabooWords.map((word, i) => (
                <li
                  key={i}
                  className="text-center text-base font-medium text-card-foreground"
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
