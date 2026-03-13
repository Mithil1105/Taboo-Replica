import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface RoomCodeCardProps {
  roomCode: string;
  helperText?: string;
}

export function RoomCodeCard({ roomCode, helperText }: RoomCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!roomCode || roomCode === "••••••") return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      toast.success("Room code copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Room code
        </p>
        {roomCode && roomCode !== "••••••" && (
          <button
            type="button"
            onClick={handleCopy}
            className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg bg-muted/80 text-muted-foreground transition-colors hover:bg-muted touch-manipulation"
            aria-label={copied ? "Copied" : "Copy room code"}
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
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

