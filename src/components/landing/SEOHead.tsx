import { useEffect } from "react";

export interface SEOHeadProps {
  title: string;
  description: string;
  /** Optional path (e.g. /how-to-play) for canonical; if not set, og:url won't be updated */
  path?: string;
}

const SITE_NAME = "Taboo Party";
const DEFAULT_DESCRIPTION =
  "A modern Taboo-style party game for real groups. Team word guessing, Pass & Play or Team Sync mode. Play with friends, family, or at parties.";

export function SEOHead({ title, description, path }: SEOHeadProps) {
  const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const desc = description || DEFAULT_DESCRIPTION;
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

    return () => {
      // Optionally restore defaults on unmount if needed
    };
  }, [fullTitle, desc, canonicalPath, baseUrl]);

  return null;
}
