import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/content/siteConfig";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./AnimatedBackground";
import appLogo from "@/images/applogo.png";

interface HeroSectionProps {
  headline: string;
  subheadline: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** Optional visual area (illustration or mockup) */
  visual?: ReactNode;
  className?: string;
}

export function HeroSection({
  headline,
  subheadline,
  primaryCtaLabel = "Start Playing",
  primaryCtaHref = ROUTES.play,
  secondaryCtaLabel = "Learn How It Works",
  secondaryCtaHref = ROUTES.howToPlay,
  visual,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-20 landing-hero-bg sm:min-h-[80vh]",
        className
      )}
      aria-label="Hero"
    >
      <AnimatedBackground />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <img src={appLogo} alt="" className="mx-auto mb-6 h-16 w-16 rounded-2xl sm:h-20 sm:w-20" aria-hidden />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {headline}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          {subheadline}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button asChild size="lg" className="rounded-xl text-base font-semibold h-12 px-6">
            <Link to={primaryCtaHref}>{primaryCtaLabel}</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="rounded-xl text-base font-semibold h-12 px-6">
            <Link to={secondaryCtaHref}>{secondaryCtaLabel}</Link>
          </Button>
        </div>
        {visual && (
          <div className="mt-12 flex justify-center">
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
