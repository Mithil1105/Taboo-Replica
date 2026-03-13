import { motion } from "framer-motion";
import { Sparkles, Clapperboard, Lock, Moon } from "lucide-react";
import type { DeckMeta } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Clapperboard,
  Moon,
};

interface DeckCardProps {
  deck: DeckMeta;
  isSelected: boolean;
  onToggle: () => void;
}

export function DeckCard({ deck, isSelected, onToggle }: DeckCardProps) {
  const Icon = iconMap[deck.icon] || Sparkles;
  const colorClass =
    deck.colorTag === "blue"
      ? "text-secondary"
      : deck.colorTag === "midnight"
        ? "text-foreground"
        : "text-primary";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      disabled={deck.isPremium}
      className={`relative flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center transition-all duration-300 ${
        deck.isPremium
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      } ${
        isSelected
          ? "card-shadow-hover scale-[1.02] bg-primary/5"
          : "card-shadow bg-card hover:card-shadow-elevated"
      }`}
    >
      {deck.isPremium && (
        <div className="absolute right-3 top-3">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-card-foreground">{deck.name}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">{deck.description}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-center gap-1.5">
        {deck.ageRating && (
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
            {deck.ageRating}
          </span>
        )}
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {deck.difficulty}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {deck.cardCount} cards
        </span>
      </div>

      {isSelected && (
        <motion.div
          layoutId="deck-check"
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
