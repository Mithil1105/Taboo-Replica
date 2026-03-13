import { motion } from "framer-motion";

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onSelect: (filter: string) => void;
}

export function FilterChips({ filters, activeFilter, onSelect }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <motion.button
          key={filter}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(filter)}
          className={`min-h-[44px] touch-manipulation rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors duration-200 sm:py-2 ${
            activeFilter === filter
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }`}
        >
          {filter}
        </motion.button>
      ))}
    </div>
  );
}
