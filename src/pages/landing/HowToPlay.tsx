import { Link } from "react-router-dom";
import { SEOHead } from "@/components/landing/SEOHead";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { RuleCard } from "@/components/landing/RuleCard";
import { CTASection } from "@/components/landing/CTASection";
import { ROUTES } from "@/content/siteConfig";
import { MessageCircle, Users, Eye, AlertCircle } from "lucide-react";

export default function HowToPlay() {
  return (
    <>
      <SEOHead
        title="How to Play"
        description="Learn how to play Anathema - the game of forbidden words: goal, roles (clue giver, guessers, observer team), rules, scoring, and round flow. Quick guide for first-time players."
        path="/how-to-play"
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <PageHeader
            title="How to play the game"
            description="A quick guide so everyone can jump in. Goal, roles, rules, scoring, and a few tips for more fun."
          />

          <article className="space-y-16">
            <section aria-labelledby="goal-heading">
              <h2 id="goal-heading" className="text-2xl font-bold text-foreground mb-4">Goal of the game</h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl">
                Two teams compete to guess secret words. On each turn, one player (the clue giver) sees the word and a
                list of forbidden words they cannot say. They describe the word to their team; the team tries to guess
                before time runs out. The other team observes and can call out if a forbidden word is said. The team with
                the most points when all rounds are over wins.
              </p>
            </section>

            <section aria-labelledby="roles-heading">
              <h2 id="roles-heading" className="text-2xl font-bold text-foreground mb-6">Role breakdown</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <RuleCard
                  title={
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" aria-hidden />
                      Clue giver
                    </span>
                  }
                >
                  <p>Sees the secret word and the forbidden words on the card (or screen). Describes the word to their team
                    using only spoken words—no gestures or sounds allowed. Must not say the word or any forbidden word. Only one clue giver per team per round.</p>
                </RuleCard>
                <RuleCard
                  title={
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" aria-hidden />
                      Guessers
                    </span>
                  }
                >
                  <p>Teammates of the clue giver. Listen to the clues and try to guess the word before the timer runs out.
                    They don't see the card.</p>
                </RuleCard>
                <RuleCard
                  title={
                    <span className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" aria-hidden />
                      Observer team
                    </span>
                  }
                >
                  <p>The other team. They can watch the same card (on a shared screen or their device in Team Sync
                    mode) and call out if the clue giver says a forbidden word. This keeps play fair and fun.</p>
                </RuleCard>
                <RuleCard
                  title={
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" aria-hidden />
                      Anathema violation
                    </span>
                  }
                >
                  <p>If the clue giver says the secret word or any word on the forbidden list, it&apos;s a violation. The observer team can call it. Also forbidden: breaking words into parts, using synonyms, or using translations of the forbidden words or the main word—even if a teammate has already guessed correctly. The clue team loses 1 point; the observer team gains 1 point. The card is done and play continues.</p>
                </RuleCard>
              </div>
            </section>

            <section aria-labelledby="scoring-heading">
              <h2 id="scoring-heading" className="text-2xl font-bold text-foreground mb-4">Scoring rules</h2>
              <div className="rounded-2xl border border-border/80 bg-card/80 p-6 max-w-2xl">
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Correct guess:</strong> +1 point for the clue team.</li>
                  <li><strong className="text-foreground">Skip:</strong> Pass the card; no score change.</li>
                  <li><strong className="text-foreground">Anathema:</strong> Said a forbidden word; −1 for the clue team, +1 for the observer team. The card is done.</li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  At the end of all rounds, the team with the higher score wins. You can set round length, total rounds, and skip limits in the app.
                </p>
              </div>
            </section>

            <section aria-labelledby="round-flow-heading">
              <h2 id="round-flow-heading" className="text-2xl font-bold text-foreground mb-4">Round flow</h2>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground max-w-2xl">
                <li>Split into two teams and decide who goes first.</li>
                <li>Team A's clue giver gets the card; their team guesses until time runs out (or all cards are used in the round).</li>
                <li>Team B observes and can call anathema violations.</li>
                <li>When the round ends, switch: Team B's clue giver goes, Team A observes.</li>
                <li>Repeat until you've played the agreed number of rounds. Highest total score wins.</li>
              </ol>
            </section>

            <section aria-labelledby="tips-heading">
              <h2 id="tips-heading" className="text-2xl font-bold text-foreground mb-4">Tips for more fun</h2>
              <ul className="space-y-2 text-muted-foreground max-w-2xl">
                <li>• The opposing team can speak and disturb the clue giver—interference and banter add to the chaos and fun.</li>
                <li>• Pick a round length that fits your group—shorter for fast games, longer for relaxed play.</li>
                <li>• In Local Multiplayer mode, keep one phone per team so you&apos;re not passing devices around the whole room.</li>
                <li>• Choose a deck that matches the group (e.g. family-friendly vs. pop culture).</li>
              </ul>
            </section>
          </article>

          <div className="mt-16">
            <CTASection
              primaryLabel="Start Playing"
              primaryHref={ROUTES.play}
              secondaryLabel="Game Modes"
              secondaryHref={ROUTES.gameModes}
            />
          </div>
        </SectionContainer>
      </LandingLayout>
    </>
  );
}
