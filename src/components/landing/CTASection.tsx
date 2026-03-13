import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/content/siteConfig";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function CTASection({
  title = "Ready to play?",
  description = "Gather your team, pick a mode, and start the party. No sign-up required.",
  primaryLabel = "Start Playing",
  primaryHref = ROUTES.play,
  secondaryLabel = "How to Play",
  secondaryHref = ROUTES.howToPlay,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-card/80 p-8 text-center shadow-sm md:p-12",
        className
      )}
      aria-label="Call to action"
    >
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        {description}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <Button asChild size="lg" className="rounded-xl h-12 px-6 font-semibold">
          <Link to={primaryHref}>{primaryLabel}</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-xl h-12 px-6 font-semibold">
          <Link to={secondaryHref}>{secondaryLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
