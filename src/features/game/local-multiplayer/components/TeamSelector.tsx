import { motion } from "framer-motion";
import type { LocalTeamId } from "../types";

interface TeamSelectorProps {
  value: LocalTeamId;
  onChange: (team: LocalTeamId) => void;
}

export function TeamSelector({ value, onChange }: TeamSelectorProps) {
  const options: { id: LocalTeamId; label: string }[] = [
    { id: "A", label: "Team A" },
    { id: "B", label: "Team B" },
  ];

  return (
    <div className="flex w-full gap-2">
      {options.map((opt) => (
        <motion.button
          key={opt.id}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex min-h-[44px] flex-1 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
            value === opt.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-muted text-muted-foreground"
          }`}
        >
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}

