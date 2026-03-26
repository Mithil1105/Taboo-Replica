import { Link } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { CTASection } from "@/components/landing/CTASection";
import { ROUTES } from "@/content/siteConfig";

export default function CookiePolicy() {
  return (
    <>
      <SEO
        title="Cookie Policy"
        description="Cookie Policy for Anathema - the game of forbidden words. Learn how we use cookies and local storage."
        canonicalUrl="/cookie-policy"
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <PageHeader
            title="Cookie Policy"
            description="How Anathema uses cookies and local storage."
          />

          <article className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto space-y-8">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section>
              <h2 className="text-xl font-bold text-foreground">1. Overview</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Anathema is a Progressive Web App (PWA) that may use browser storage (cookies, local storage, session storage) to provide and improve features. This policy explains what we store and why.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">2. Types of Storage We Use</h2>
              <ul className="mt-2 list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong className="text-foreground">Local Storage:</strong> We use local storage to save your preferences (e.g., theme, sound settings) and to cache the app for offline use. This data stays on your device and is not sent to our servers unless you use features that require it (e.g., Local Multiplayer).
                </li>
                <li>
                  <strong className="text-foreground">Session Storage:</strong> Temporary data used during a single browsing session, such as game state in Pass & Play. This is cleared when you close the browser tab.
                </li>
                <li>
                  <strong className="text-foreground">Service Worker Cache:</strong> For offline support, the app caches assets (HTML, CSS, JavaScript, images) on your device. This enables Pass & Play to work without an internet connection after the first load.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">3. Essential vs. Optional</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                The storage we use is primarily for essential functionality (offline caching, preferences, game sync). We do not use third-party advertising cookies or tracking cookies. We do not sell data collected via cookies or local storage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">4. Your Choices</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                You can clear local storage and cookies through your browser settings. Note that clearing storage may reset your preferences and remove offline cached content. If you use Local Multiplayer, room data is stored server-side and cannot be cleared by your browser alone.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">5. Updates</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                We may update this Cookie Policy as our practices change. The "Last updated" date at the top indicates when this policy was last revised.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">6. Contact</h2>
              <p className="text-muted-foreground leading-relaxed mt-2">
                For questions about cookies or storage, please visit our{" "}
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
