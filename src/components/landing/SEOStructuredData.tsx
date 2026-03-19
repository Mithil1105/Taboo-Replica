import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { SITE_NAME, CONTACT, ROUTES } from "@/content/siteConfig";
import { faqItems } from "@/content/faqItems";

const getBaseUrl = () =>
  typeof window !== "undefined" ? window.location.origin : "";

export function SEOStructuredData() {
  const { pathname } = useLocation();
  const page =
    pathname === "/"
      ? "home"
      : pathname === "/how-to-play"
        ? "how-to-play"
        : pathname === "/faq"
          ? "faq"
          : "other";
  const scripts = useMemo(() => {
    const baseUrl = getBaseUrl();
    const schemas: object[] = [];

    // WebSite - all pages
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: baseUrl,
      description:
        "Anathema is a taboo game alternative. Play taboo online free—the forbidden words game. Taboo word game, taboo party game with Pass & Play or Team Sync.",
    });

    // Organization - all pages
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: baseUrl,
      logo: `${baseUrl}/icon-512.png`,
      contactPoint: {
        "@type": "ContactPoint",
        email: CONTACT.email,
        contactType: "customer service",
        availableLanguage: "English",
        areaServed: "Worldwide",
        ...(CONTACT.whatsapp && {
          url: `https://wa.me/${CONTACT.whatsapp}`,
        }),
      },
    });

    if (page === "home") {
      // Game / SoftwareApplication
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Game",
        name: SITE_NAME,
        description:
          "Anathema is the taboo game alternative. Play taboo online free—taboo word game, taboo party game. The forbidden words game with Pass & Play or Team Sync. Mobile-friendly taboo game app.",
        url: `${baseUrl}${ROUTES.play}`,
        gamePlatform: "Web",
        applicationCategory: "GameApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      });
    }

    if (page === "faq") {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      });
    }

    if (page === "how-to-play") {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to play the taboo word game",
        description:
          "Learn how to play taboo: the forbidden words game. Goal, roles, rules, scoring, and tips for the taboo party game.",
        step: [
          {
            "@type": "HowToStep",
            name: "Divide into teams",
            text: "Split into two teams. You need at least four players.",
          },
          {
            "@type": "HowToStep",
            name: "Clue giver sees the card",
            text: "One player sees the secret word and forbidden words. They describe the word without saying it or any forbidden word.",
          },
          {
            "@type": "HowToStep",
            name: "Team guesses",
            text: "Teammates guess the word before time runs out. The other team observes and can call violations.",
          },
          {
            "@type": "HowToStep",
            name: "Score and rotate",
            text: "Correct guess: +1. Skip: no change. Violation: -1 clue team, +1 observers. Rotate and repeat.",
          },
        ],
      });
    }

    return schemas.map((schema) => (
      <script
        key={JSON.stringify(schema).slice(0, 50)}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    ));
  }, [page]);

  return <>{scripts}</>;
}

