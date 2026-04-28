import { Helmet } from "react-helmet-async";
import { SITE_NAME } from "@/content/siteConfig";
import { getSiteUrl } from "@/lib/siteUrl";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string[];
  ogImage?: string;
  type?: "website" | "article" | "game";
}

const DEFAULT_DESCRIPTION =
  "Anathema is a taboo game alternative. Play taboo online free—the forbidden words game. Taboo word game, taboo party game with Pass & Play or Team Sync.";
const DEFAULT_KEYWORDS = [
  "taboo game",
  "taboo word game",
  "taboo online",
  "taboo alternative",
  "play taboo online",
  "forbidden words game",
  "party game online",
];
export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl,
  keywords = DEFAULT_KEYWORDS,
  ogImage = "/og-image.png",
  type = "website",
}: SEOProps) {
  const baseUrl = getSiteUrl();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – The game of forbidden words`;
  const canonical = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const absoluteOgImage = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
    </Helmet>
  );
}
