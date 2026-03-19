export const SITE_NAME = "Anathema";
export const SITE_TAGLINE = "The game of forbidden words.";
export const SITE_DESCRIPTION =
  "Anathema: the game of forbidden words. Team-based, mobile-friendly PWA with Pass & Play (works offline) and Local Multiplayer modes. Perfect for friends, college events, and family game nights.";

export const CONTACT = {
  email: "info@unimisk.com",
  whatsapp: "918238326605",
  /** Optional: add social links when available */
  social: [] as { label: string; href: string }[],
};

export const ROUTES = {
  home: "/",
  howToPlay: "/how-to-play",
  gameModes: "/game-modes",
  about: "/about",
  faq: "/faq",
  contact: "/contact",
  play: "/play",
  terms: "/terms-of-service",
  privacy: "/privacy-policy",
  cookies: "/cookie-policy",
} as const;
