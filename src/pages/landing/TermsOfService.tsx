import { Link } from "react-router-dom";
import { SEOHead } from "@/components/landing/SEOHead";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { CTASection } from "@/components/landing/CTASection";
import { ROUTES } from "@/content/siteConfig";

export default function TermsOfService() {
  return (
    <>
      <SEOHead
        title="Terms of Service"
        description="Terms of Service for Anathema - the game of forbidden words. Read our terms and conditions for using the app."
        path="/terms-of-service"
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <PageHeader
            title="Terms of Service"
            description="Please read these terms carefully before using Anathema."
          />

          <article className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto space-y-8">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                By accessing or using Anathema ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Anathema is a party word-guessing game available as a web application. The App offers Pass & Play (single device) and Local Multiplayer (multi-device) modes. Some features require an internet connection; others work offline after initial load.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">3. Use of the App</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                You agree to use the App only for lawful purposes and in accordance with these terms. You must not use the App to harass, offend, or harm others. You are responsible for your conduct while using the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">4. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                The App, including its design, content, and branding, is owned by Anathema. You may not copy, modify, or distribute any part of the App without prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">5. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                The App is provided "as is" without warranties of any kind. We do not guarantee that the App will be uninterrupted, error-free, or secure. Use at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                To the fullest extent permitted by law, Anathema shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">7. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                We may update these terms from time to time. Continued use of the App after changes constitutes acceptance of the updated terms. We encourage you to review this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">8. Contact</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                For questions about these terms, please visit our{" "}
                <Link to={ROUTES.contact} className="text-primary hover:underline">Contact</Link> page.
              </p>
            </section>
          </article>

          <div className="mt-16">
            <CTASection
              primaryLabel="Back to Home"
              primaryHref={ROUTES.home}
              secondaryLabel="Privacy Policy"
              secondaryHref={ROUTES.privacy}
            />
          </div>
        </SectionContainer>
      </LandingLayout>
    </>
  );
}
