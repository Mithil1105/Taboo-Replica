import { cn } from "@/lib/utils";

interface RuleCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function RuleCard({ title, children, className }: RuleCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm",
        className
      )}
    >
      <h3 className="mb-3 text-lg font-semibold text-foreground">{title}</h3>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
