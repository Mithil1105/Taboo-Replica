import { Link } from "react-router-dom";
import { SEOHead } from "@/components/landing/SEOHead";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { CTASection } from "@/components/landing/CTASection";
import { ROUTES } from "@/content/siteConfig";

export default function About() {
  return (
    <>
      <SEOHead
        title="About"
        description="Taboo Party is a modern digital party game: team word guessing, fair observer play, and flexible modes. Learn about the product vision and what's next."
        path="/about"
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <PageHeader
            title="About Taboo Party"
            description="A party word guessing game built for real groups and real rooms—with less chaos and more fun."
          />

          <article className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-foreground">What this game is</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Taboo Party is a digital take on the classic taboo-style word game. Two teams take turns giving clues
                to secret words while avoiding forbidden words; the other team observes and can call violations. We
                added timers, scoring, multiple decks, and two ways to play—Pass & Play with one device, or Team Sync
                with two phones—so it fits different group sizes and settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">Why it was made</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                We wanted a party word guessing game that actually works in a room full of people: easy to set up,
                fair for both teams (including observers), and flexible enough for one phone or two. The goal was
                something that feels modern and mobile-friendly without losing the social, in-person vibe of the
                original game.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">What problem it solves</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                In group party games, passing one phone around can get messy—especially with more players. Not
                everyone gets a clear view of the card, and scoring can feel arbitrary. Taboo Party gives you a
                shared timer and visible scoring, lets the observer team see the same card so they can fairly call
                taboo, and with Team Sync mode keeps one phone per team so you're not passing a single device around
                the whole group.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">Why digital support improves fairness and fun</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                A digital version keeps time consistent, scores visible, and card content the same for everyone. The
                observing team can follow along on their own screen in Team Sync mode, so there's no arguing about
                what was or wasn't said. You can also switch decks and round length to match the crowd—family night
                vs. college party—without buying extra physical decks.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground">What's next</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                We plan to add more card decks and themes, refine Team Sync for larger groups, and keep improving
                accessibility and performance so the game stays easy to pick up and fun to replay. If you have
                feedback or ideas, we'd love to hear from you on the contact page.
              </p>
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
