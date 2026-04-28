/** Production base URL (no trailing slash). Set VITE_SITE_URL at build time for canonicals, OG, and schema. */
const DEFAULT_SITE_URL = "https://anathema.byteosaurus.com";

export function getSiteUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") return window.location.origin;
  return DEFAULT_SITE_URL;
}
