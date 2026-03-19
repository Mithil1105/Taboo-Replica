import { useEffect } from "react";
import { SITE_NAME, SITE_DESCRIPTION } from "@/content/siteConfig";

const DEFAULT_KEYWORDS =
  "taboo game, taboo word game, taboo card game, taboo party game, taboo online, taboo app, taboo game online free, forbidden words game, word guessing game, party word game";

export interface SEOHeadProps {
  title: string;
  description: string;
  /** Optional path (e.g. /how-to-play) for canonical; if not set, og:url won't be updated */
  path?: string;
  /** Optional per-page keywords for SEO (taboo-related terms only in meta, never visible) */
  keywords?: string;
}

const DEFAULT_DESCRIPTION = SITE_DESCRIPTION;

export function SEOHead({ title, description, path, keywords }: SEOHeadProps) {
  const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const desc = description || DEFAULT_DESCRIPTION;
  const kw = keywords ?? DEFAULT_KEYWORDS;
  const canonicalPath = path ?? "/";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    document.title = fullTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", desc);
    } else {
      const el = document.createElement("meta");
      el.name = "description";
      el.content = desc;
      document.head.appendChild(el);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", kw);
    } else {
      const el = document.createElement("meta");
      el.name = "keywords";
      el.content = kw;
      document.head.appendChild(el);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", desc);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    const url = `${baseUrl}${canonicalPath}`;
    if (ogUrl) {
      ogUrl.setAttribute("content", url);
    } else if (baseUrl) {
      const el = document.createElement("meta");
      el.setAttribute("property", "og:url");
      el.content = url;
      document.head.appendChild(el);
    }

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", fullTitle);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", desc);

    return () => {
      // Optionally restore defaults on unmount if needed
    };
  }, [fullTitle, desc, kw, canonicalPath, baseUrl]);

  return null;
}
