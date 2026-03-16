import { Link } from "react-router-dom";
import { SEOHead } from "@/components/landing/SEOHead";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { ModeComparisonCard } from "@/components/landing/ModeComparisonCard";
import { CTASection } from "@/components/landing/CTASection";
import { ROUTES } from "@/content/siteConfig";
import { gameModes, teamSyncBenefits, modeComparison } from "@/content/modesContent";
import { Check } from "lucide-react";

export default function GameModes() {
  return (
    <>
      <SEOHead
        title="Game Modes"
        description="Pass & Play with one phone or Team Sync with two phones. Learn how the 2-phone team-sync party game reduces chaos and works best for larger groups."
        path="/game-modes"
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <PageHeader
            title="Game modes"
            description="Play with one device or two. Team Sync mode keeps one phone per team so you spend less time passing devices and more time playing."
          />

          <div className="space-y-20">
            <section aria-labelledby="modes-overview">
              <h2 id="modes-overview" className="text-2xl font-bold text-foreground mb-8">Overview</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {gameModes.map((mode, i) => (
                  <ModeComparisonCard key={mode.id} {...mode} index={i} />
                ))}
              </div>
            </section>

            <section aria-labelledby="team-sync-why" className="rounded-2xl border border-border/80 bg-primary/5 p-8 md:p-10">
              <h2 id="team-sync-why" className="text-2xl font-bold text-foreground">Why Local Multiplayer is useful</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl">
                With two phones—one per team—the phone stays with the team. As turns change, the role on each phone
                (clue giver view vs. observer view) updates automatically. You're not passing one device around the
                whole group, so there's less chaos and fewer accidental drops. It's the smarter way to play a
                multiplayer forbidden-words game with a bigger crowd.
              </p>
              <ul className="mt-6 space-y-3">
                {teamSyncBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="comparison">
              <h2 id="comparison" className="text-2xl font-bold text-foreground mb-6">Comparison</h2>
              <div className="overflow-x-auto rounded-2xl border border-border/80">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="p-4 font-semibold text-foreground">Aspect</th>
                      <th className="p-4 font-semibold text-foreground">Pass & Play</th>
                      <th className="p-4 font-semibold text-foreground">Local Multiplayer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modeComparison.map((row, i) => (
                      <tr key={i} className="border-b border-border/80 last:border-0">
                        <td className="p-4 font-medium text-foreground">{row.aspect}</td>
                        <td className="p-4 text-muted-foreground">{row.passPlay}</td>
                        <td className="p-4 text-muted-foreground">{row.teamSync}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="which-mode">
              <h2 id="which-mode" className="text-2xl font-bold text-foreground mb-4">Which mode should you choose?</h2>
              <p className="text-muted-foreground max-w-2xl">
                Use <strong className="text-foreground">Pass & Play</strong> when you only have one device or want a
                quick, simple game—it works offline after the first load. Use <strong className="text-foreground">Local Multiplayer</strong> when you have two
                phones and want a calmer, more organized round—especially for parties, college events, or larger
                groups. Both are the same game; Local Multiplayer just makes the 2-phone setup feel less chaotic.
              </p>
            </section>

            <CTASection
              primaryLabel="Start Playing"
              primaryHref={ROUTES.play}
              secondaryLabel="How to Play"
              secondaryHref={ROUTES.howToPlay}
            />
          </div>
        </SectionContainer>
      </LandingLayout>
    </>
  );
}
