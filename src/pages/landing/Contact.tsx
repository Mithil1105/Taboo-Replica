import { Link } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { ROUTES } from "@/content/siteConfig";
import { CONTACT } from "@/content/siteConfig";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact"
        description="Contact Anathema—the taboo game alternative. Email or WhatsApp for feedback, bug reports, or ideas. Get in touch about the forbidden words game."
        canonicalUrl="/contact"
        keywords={["taboo game contact", "taboo game feedback", "Anathema contact"]}
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <PageHeader
            title="Contact"
            description="We'd love to hear from you—suggestions, bug reports, or ideas for new decks and features."
          />

          <div className="mx-auto max-w-xl">
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 md:p-8">
              <p className="text-sm text-muted-foreground mb-6">
                Reach out for feedback, bug reports, or ideas for new decks. We read every message.
              </p>
              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/30 px-4 py-3 text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="font-medium">{CONTACT.email}</span>
                </a>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/30 px-4 py-3 text-foreground hover:bg-muted/50 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium">+91 8238326605</span>
                </a>
                {CONTACT.social.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {CONTACT.social.map(({ label, href }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <Button asChild variant="outline" className="mt-6 rounded-xl">
                <Link to={ROUTES.home}>Back to home</Link>
              </Button>
            </div>
          </div>
        </SectionContainer>
      </LandingLayout>
    </>
  );
}
