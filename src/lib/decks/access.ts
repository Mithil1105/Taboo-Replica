import type { DeckMeta } from "@/types";
import type { AccountRole } from "@/lib/auth/AuthProvider";

/** Returns true if the deck is free or unlocked for the current user. */
export function isDeckAccessible(
  deck: Pick<DeckMeta, "isPremium" | "id">,
  unlockedDeckIds: ReadonlySet<string>,
  role?: AccountRole
): boolean {
  if (role === "super_admin") return true;
  if (!deck.isPremium) return true;
  return unlockedDeckIds.has(deck.id);
}

/** Format a price in INR paise as a localized string (e.g. 9900 -> "₹99"). */
export function formatInrPrice(amountInPaise: number | undefined | null): string {
  if (typeof amountInPaise !== "number" || !Number.isFinite(amountInPaise)) return "";
  const rupees = amountInPaise / 100;
  const integerOnly = Math.round(rupees) === rupees;
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: integerOnly ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
