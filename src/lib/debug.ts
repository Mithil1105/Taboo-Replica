/**
 * Debug mode: VITE_DEBUG=true or ?debug=1 in dev.
 * Production: always false.
 */
export function isDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (import.meta.env.VITE_DEBUG === "true") return true;
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get("debug") === "1") return true;
  return false;
}
