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
        description="Taboo game FAQ: rules, one phone vs two phones, Team Sync mode, scoring, taboo rules. Frequently asked questions about the forbidden words game."
        path="/faq"
        keywords="taboo game FAQ, taboo rules, forbidden words game, taboo game rules"
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
