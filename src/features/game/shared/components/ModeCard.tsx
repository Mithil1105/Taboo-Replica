import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ModeCardProps {
  label: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  to: string;
  accent?: "primary" | "secondary";
  icon?: ReactNode;
}

export function ModeCard({
  label,
  title,
  description,
  bullets,
  ctaLabel,
  to,
  accent = "primary",
  icon,
}: ModeCardProps) {
  const accentClasses =
    accent === "secondary"
      ? "bg-secondary/10 text-secondary border-secondary/30"
      : "bg-primary/10 text-primary border-primary/30";

  return (
    <motion.article
      whileHover={{ translateY: -2 }}
      transition={{ duration: 0.18 }}
      className="flex w-full max-w-md flex-col rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest ${accentClasses}`}>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
          <span>{label}</span>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>

      <h2 className="mt-3 text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed sm:text-sm">{description}</p>

      <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        {bullets.map((item) => (
          <li key={item} className="flex gap-1.5">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/70" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

      <motion.div
        whileTap={{ scale: 0.97 }}
        className="mt-4 flex"
      >
        <Link
          to={to}
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/90 active:bg-foreground/80"
        >
          {ctaLabel}
        </Link>
      </motion.div>
    </motion.article>
  );
}

