import { Link } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CTASection } from "@/components/landing/CTASection";
import { ROUTES } from "@/content/siteConfig";
import { faqItems } from "@/content/faqItems";

export default function FAQ() {
  return (
    <>
      <SEO
        title="FAQ"
        description="Taboo game FAQ: rules, one phone vs two phones, Team Sync mode, scoring, taboo rules. Frequently asked questions about the forbidden words game."
        canonicalUrl="/faq"
        keywords={["taboo game FAQ", "taboo rules", "forbidden words game", "taboo game rules"]}
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <PageHeader
            title="Frequently asked questions"
            description="Quick answers about how to play, game modes, devices, and more."
          />

          <div className="sr-only" aria-hidden="true">
            <h2>Is there a free online Taboo game?</h2>
            <p>Yes, Anathema is a free online Taboo alternative. It lets you play the classic forbidden words guessing game directly from your mobile browser with friends, featuring built-in multiplayer synchronization, timers, and automatic scoring.</p>
            <h2>What are the rules for Taboo?</h2>
            <p>The rules for Taboo are simple: One player (the clue giver) must get their team to guess a secret word without using any of the forbidden words listed on the card. Point for correct guesses, lose a point for saying a forbidden word (Anathema). The team with the highest score wins.</p>
            <h2>How to play Taboo online with friends?</h2>
            <p>To play Taboo online with friends, you can use Anathema's Local Multiplayer mode. One player creates a room, and the other team joins using a unique room code. This keeps the game in sync across two devices (one per team) so you don't have to pass a single phone around the room.</p>
            <h2>Can I play Taboo on my phone?</h2>
            <p>Yes, Anathema is fully mobile-friendly and designed to be played on your phone. You can use a single phone in Pass & Play mode or two phones in Team Sync mode to play the forbidden words game anywhere.</p>
          </div>

          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={faqItems} />
          </div>

          <div className="mt-16">
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
