import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { formatInrPrice } from "@/lib/decks/access";
import { createDeckOrder, verifyDeckPayment } from "@/lib/payments/api";
import { loadRazorpayCheckout } from "@/lib/razorpay/loadCheckout";
import type { DeckMeta } from "@/types";
import { toast } from "sonner";

interface UnlockDeckDialogProps {
  deck: DeckMeta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful purchase. */
  onUnlocked?: (deckId: string) => void | Promise<void>;
}

export function UnlockDeckDialog({ deck, open, onOpenChange, onUnlocked }: UnlockDeckDialogProps) {
  const auth = useAuth();
  const location = useLocation();
  const [busy, setBusy] = useState(false);

  const next = encodeURIComponent(
    location.pathname + location.search + (deck ? `#unlock=${deck.id}` : "")
  );

  const handleBuy = async () => {
    if (!deck) return;
    if (!auth.configured) {
      toast.error("Payments are not configured. Set Supabase env vars.");
      return;
    }
    if (!auth.user) return;

    setBusy(true);
    try {
      const order = await createDeckOrder(deck.id);
      const Razorpay = await loadRazorpayCheckout();
      await new Promise<void>((resolve, reject) => {
        const rzp = new Razorpay({
          key: order.keyId,
          order_id: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: "Anathema",
          description: `Unlock ${deck.name}`,
          prefill: { email: auth.user?.email ?? undefined },
          theme: { color: "#7c3aed" },
          notes: { deckId: deck.id },
          handler: async (response) => {
            try {
              await verifyDeckPayment(response);
              toast.success(`${deck.name} unlocked.`);
              await onUnlocked?.(deck.id);
              onOpenChange(false);
              resolve();
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Payment verification failed.";
              toast.error(msg);
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              resolve();
            },
          },
        });
        rzp.open();
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment could not be started.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  if (!deck) return null;

  const price = formatInrPrice(deck.priceInr);
  const signedIn = Boolean(auth.user);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center">Unlock {deck.name}</DialogTitle>
          <DialogDescription className="text-center">
            {deck.ageRating === "18+"
              ? "18+ premium deck. One-time purchase, tied to your account."
              : "Premium deck. One-time purchase, tied to your account."}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {deck.name}
            </div>
            {price && (
              <div className="text-base font-bold text-foreground">{price}</div>
            )}
          </div>
          <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">
            {deck.description}
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {deck.cardCount} cards · {deck.difficulty}
            {deck.ageRating ? ` · ${deck.ageRating}` : ""}
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Payment processed securely by Razorpay. Test mode shows test cards.
        </p>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          {!signedIn ? (
            <Button asChild>
              <Link to={`/login?next=${next}`}>Sign in to unlock</Link>
            </Button>
          ) : (
            <Button onClick={handleBuy} disabled={busy}>
              {busy ? "Processing…" : `Buy now${price ? ` · ${price}` : ""}`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
