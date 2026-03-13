import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ModeComparisonCardProps {
  name: string;
  shortDescription: string;
  description: string;
  bullets: string[];
  bestFor: string;
  className?: string;
  index?: number;
}

export function ModeComparisonCard({
  name,
  shortDescription,
  description,
  bullets,
  bestFor,
  className,
  index = 0,
}: ModeComparisonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          "h-full rounded-2xl border border-border/80 bg-card/80 shadow-sm transition-all duration-200 hover:shadow-md",
          className
        )}
      >
        <CardHeader>
          <h3 className="text-xl font-semibold text-foreground">{name}</h3>
          <p className="text-sm font-medium text-primary">{shortDescription}</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <p className="text-muted-foreground leading-relaxed">{description}</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Best for: </span>
            {bestFor}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
