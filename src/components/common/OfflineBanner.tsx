import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/**
 * Compact banner shown when offline.
 * Explains that Pass & Play still works; Local Multiplayer needs internet.
 */
export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 flex min-h-[28px] items-center justify-center gap-1.5 bg-muted/95 px-2 py-1 text-center text-[11px] text-muted-foreground"
    >
      <WifiOff className="h-3 w-3 shrink-0" />
      <span>Offline. Pass & Play works.</span>
    </div>
  );
}
