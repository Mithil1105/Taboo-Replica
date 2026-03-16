import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";

interface RoomCodeCardProps {
  roomCode: string;
  helperText?: string;
}

const canShare = typeof navigator !== "undefined" && !!navigator.share;

export function RoomCodeCard({ roomCode, helperText }: RoomCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const hasCode = roomCode && roomCode !== "••••••";

  const handleCopy = async () => {
    if (!hasCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  const handleShare = async () => {
    if (!hasCode || !canShare) return;
    try {
      await navigator.share({
        title: "Join my Anathema game",
        text: `Join my game! Room code: ${roomCode}`,
      });
      toast.success("Shared!");
    } catch (err) {
      if ((err as Error).name !== "AbortError") toast.error("Could not share");
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Room code
        </p>
        {hasCode && (
          <div className="flex items-center gap-1">
            {canShare && (
              <button
                type="button"
                onClick={handleShare}
                className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg bg-muted/80 text-muted-foreground transition-colors hover:bg-muted touch-manipulation"
                aria-label="Share room"
              >
                <Share2 className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg bg-muted/80 text-muted-foreground transition-colors hover:bg-muted touch-manipulation"
              aria-label={copied ? "Copied" : "Copy"}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-3xl font-bold tracking-[0.25em] text-foreground sm:text-4xl">
        {roomCode}
      </p>
      {helperText && (
        <p className="mt-3 text-center text-xs text-muted-foreground leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  );
}

