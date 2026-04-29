/**
 * Generic device-cache "first-time" gate for tutorials and onboardings.
 *
 * Each tutorial picks a stable storage key (e.g. "anathema-multiplayer-onboarding-seen")
 * and uses these helpers to check / persist that the user has dismissed it.
 *
 * Persistence is per-browser/device via localStorage, intentionally — there is no
 * cross-device sync. Clearing site data resets the gate.
 */

const VALUE_SEEN = "1";

/** Centralized keys used across the app. Add new tutorials here. */
export const ONBOARDING_KEYS = {
  multiplayer: "anathema-multiplayer-onboarding-seen",
} as const;

export type OnboardingKey =
  | (typeof ONBOARDING_KEYS)[keyof typeof ONBOARDING_KEYS]
  | (string & {});

export function hasSeenOnboarding(key: OnboardingKey): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === VALUE_SEEN;
  } catch {
    return false;
  }
}

export function setOnboardingSeen(key: OnboardingKey): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, VALUE_SEEN);
  } catch {
    /* storage may be unavailable (private mode, quota); fail silently */
  }
}

/** Clears a single onboarding key — useful for in-app "show me again". */
export function clearOnboardingSeen(key: OnboardingKey): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

/** Clears every key registered in ONBOARDING_KEYS — useful for debug/testing. */
export function clearAllOnboardingSeen(): void {
  for (const key of Object.values(ONBOARDING_KEYS)) {
    clearOnboardingSeen(key);
  }
}
