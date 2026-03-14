import { motion } from "framer-motion";

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onSelect: (filter: string) => void;
}

const chipVariants = {
  inactive: { scale: 1, opacity: 1 },
  active: { scale: 1.02, opacity: 1 },
};

export function FilterChips({ filters, activeFilter, onSelect }: FilterChipsProps) {
  return (
    <motion.div
      layout
      className="flex flex-wrap gap-2"
      initial={false}
      transition={{ layout: { duration: 0.2 } }}
    >
      {filters.map((filter) => (
        <motion.button
          key={filter}
          layout
          variants={chipVariants}
          animate={activeFilter === filter ? "active" : "inactive"}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(filter)}
          className={`min-h-[44px] touch-manipulation rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors duration-200 sm:py-2 ${
            activeFilter === filter
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }`}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {filter}
        </motion.button>
      ))}
    </motion.div>
  );
}
