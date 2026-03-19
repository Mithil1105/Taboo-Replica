import { Link } from "react-router-dom";
import { SEOHead } from "@/components/landing/SEOHead";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { CTASection } from "@/components/landing/CTASection";
import { ROUTES } from "@/content/siteConfig";

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Privacy Policy for Anathema - the game of forbidden words. Learn how we handle your data."
        path="/privacy-policy"
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <PageHeader
            title="Privacy Policy"
            description="How we collect, use, and protect your information when you use Anathema."
          />

          <article className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto space-y-8">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Anathema is designed with privacy in mind. We collect minimal information:
              </p>
              <ul className="mt-2 list-disc pl-6 text-muted-foreground space-y-1">
                <li><strong className="text-foreground">Usage data:</strong> When you use Local Multiplayer, room codes and game state are stored temporarily to sync devices. This data is not tied to personal identifiers.</li>
                <li><strong className="text-foreground">Contact form:</strong> If you submit feedback via our Contact page, we receive the email and message you provide. We use this only to respond to you.</li>
                <li><strong className="text-foreground">Technical data:</strong> Our hosting provider may collect standard logs (IP address, browser type) for security and performance. We do not use these for tracking or advertising.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                We use collected information only to operate the App, respond to support requests, and improve our services. We do not sell, rent, or share your data with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">3. Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Game data for Local Multiplayer is stored in a real-time database. Room data is typically cleared when a game ends or after a period of inactivity. We use industry-standard security practices to protect data in transit and at rest.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">4. Cookies and Local Storage</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                The App may use local storage (e.g., browser storage) for preferences, game state, and offline caching. For details, see our{" "}
                <Link to={ROUTES.cookies} className="text-primary hover:underline">Cookie Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">5. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Depending on your location, you may have rights to access, correct, or delete your data. Contact us via the Contact page to exercise these rights. We will respond within a reasonable timeframe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">6. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Anathema is a general-audience game. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us and we will take steps to remove it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">7. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                We may update this Privacy Policy from time to time. We will notify users of material changes by posting the updated policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">8. Contact</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                For privacy-related questions, please visit our{" "}
                <Link to={ROUTES.contact} className="text-primary hover:underline">Contact</Link> page.
              </p>
            </section>
          </article>

          <div className="mt-16">
            <CTASection
              primaryLabel="Back to Home"
              primaryHref={ROUTES.home}
              secondaryLabel="Cookie Policy"
              secondaryHref={ROUTES.cookies}
            />
          </div>
        </SectionContainer>
      </LandingLayout>
    </>
  );
}
