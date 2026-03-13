import { Link } from "react-router-dom";
import { SEOHead } from "@/components/landing/SEOHead";
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
      <SEOHead
        title="FAQ"
        description="Frequently asked questions about the Taboo-style party game: rules, one phone vs two phones, Team Sync mode, scoring, and how to play with friends or at parties."
        path="/faq"
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <PageHeader
            title="Frequently asked questions"
            description="Quick answers about how to play, game modes, devices, and more."
          />

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
