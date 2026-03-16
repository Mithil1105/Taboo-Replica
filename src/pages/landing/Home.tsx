import { Link } from "react-router-dom";
import { SEOHead } from "@/components/landing/SEOHead";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { StepCard } from "@/components/landing/StepCard";
import { CTASection } from "@/components/landing/CTASection";
import { ModeComparisonCard } from "@/components/landing/ModeComparisonCard";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { ROUTES } from "@/content/siteConfig";
import { SITE_NAME, SITE_TAGLINE } from "@/content/siteConfig";
import { features } from "@/content/features";
import { howItWorksSteps } from "@/content/steps";
import { gameModes } from "@/content/modesContent";
import { audiences } from "@/content/audiences";
import { faqItems } from "@/content/faqItems";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const PREVIEW_FAQS = 3;

export default function Home() {
  return (
    <>
      <SEOHead
        title={SITE_NAME}
        description="Anathema: the game of forbidden words. Team word guessing with Pass & Play or 2-phone Team Sync. Play with friends, family, or at parties—mobile-friendly and easy to learn."
        path="/"
      />
      <LandingLayout>
        <HeroSection
          headline="The word is on the tip of your tongue."
          subheadline={SITE_TAGLINE}
          primaryCtaLabel="Start Playing"
          primaryCtaHref={ROUTES.play}
          secondaryCtaLabel="Learn How It Works"
          secondaryCtaHref={ROUTES.howToPlay}
          visual={
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-lg max-w-xs text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Secret word</p>
              <p className="mt-1 text-xl font-bold text-foreground">Guitar</p>
              <p className="mt-2 text-xs text-muted-foreground">Don't say: music, strings, band, rock</p>
            </div>
          }
        />

        <SectionContainer id="what-is" wrapperClassName="bg-muted/20">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">What is this game?</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                It's a multiplayer party game online: two teams, one clue giver per round, and a list of forbidden words you
                can't say. Your team guesses the secret word before time runs out. The other team watches and can call out
                anathema violations—so it stays fair and fun. Think of it as a team word guessing game built for real
                rooms: friends, parties, college events, or family game nights.
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm">
              <p className="text-sm font-medium text-primary">Quick summary</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Two teams take turns giving clues</li>
                <li>• Clue giver can&apos;t say the word or forbidden words (no synonyms or translations)</li>
                <li>• Correct = +1; Skip = no change; Anathema = −1 clue team, +1 observers</li>
                <li>• Highest score when rounds end wins</li>
              </ul>
            </div>
          </div>
        </SectionContainer>

        <SectionContainer id="why-better">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">Why it works better</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            A modern party word guessing game that's easy to learn and built for how people actually play.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <FeatureCard key={f.id} {...f} index={i} />
            ))}
          </div>
        </SectionContainer>

        <SectionContainer id="modes" wrapperClassName="bg-muted/20">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">Choose how you play</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            One phone or two—pick the mode that fits your group.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {gameModes.map((mode, i) => (
              <ModeComparisonCard key={mode.id} {...mode} index={i} />
            ))}
          </div>
        </SectionContainer>

        <SectionContainer id="how-it-works">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Get from setup to first round in a few minutes.
          </p>
          <div className="mx-auto mt-12 max-w-2xl space-y-10">
            {howItWorksSteps.map((s, i) => (
              <StepCard key={s.id} {...s} index={i} />
            ))}
          </div>
        </SectionContainer>

        <SectionContainer id="perfect-for" wrapperClassName="bg-muted/20">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">Perfect for…</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Whether you're with friends, family, or a big group, this party word guessing game fits.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Card className="h-full rounded-2xl border border-border/80 bg-card/80 transition-shadow hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                      <h3 className="mt-3 font-semibold text-foreground">{a.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{a.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </SectionContainer>

        <SectionContainer id="faq-preview">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">Common questions</h2>
          <div className="mx-auto mt-8 max-w-2xl">
            <FAQAccordion items={faqItems.slice(0, PREVIEW_FAQS)} />
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link to={ROUTES.faq}>See all FAQs</Link>
            </Button>
          </div>
        </SectionContainer>

        <SectionContainer>
          <CTASection
            title="Ready to play?"
            description="Gather your team, pick a mode, and start. No sign-up required."
            primaryLabel="Start Playing"
            primaryHref={ROUTES.play}
            secondaryLabel="How to Play"
            secondaryHref={ROUTES.howToPlay}
          />
        </SectionContainer>
      </LandingLayout>
    </>
  );
}
