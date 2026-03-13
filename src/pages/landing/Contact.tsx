import { useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/landing/SEOHead";
import { LandingLayout } from "@/components/landing/LandingLayout";
import { PageHeader } from "@/components/landing/PageHeader";
import { SectionContainer } from "@/components/landing/SectionContainer";
import { ROUTES } from "@/content/siteConfig";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEOHead
        title="Contact & Feedback"
        description="Send feedback or get in touch about the Taboo Party game. We'd love to hear how you're using it and what you'd like to see next."
        path="/contact"
      />
      <LandingLayout>
        <SectionContainer className="pt-12 md:pt-16">
          <PageHeader
            title="Contact & feedback"
            description="We'd love to hear from you—suggestions, bug reports, or ideas for new decks and features."
          />

          <div className="mx-auto max-w-xl">
            {submitted ? (
              <div className="rounded-2xl border border-border/80 bg-card/80 p-8 text-center">
                <p className="text-foreground font-medium">Thanks for your message!</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  We read all feedback. If we need to follow up, we'll use the email you provided.
                </p>
                <Button asChild variant="outline" className="mt-6 rounded-xl">
                  <Link to={ROUTES.home}>Back to home</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border/80 bg-card/80 p-6 md:p-8">
                <p className="text-sm text-muted-foreground">
                  This form is a placeholder. Connect it to your backend or email service when ready.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Your feedback or question..."
                    rows={5}
                    className="rounded-xl resize-none"
                    required
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl" size="lg">
                  Send feedback
                </Button>
              </form>
            )}
          </div>
        </SectionContainer>
      </LandingLayout>
    </>
  );
}
