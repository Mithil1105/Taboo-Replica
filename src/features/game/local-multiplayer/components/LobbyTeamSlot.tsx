import type { LocalTeamId } from "../types";

interface LobbyTeamSlotProps {
  teamId: LocalTeamId;
  label: string;
  status: "you" | "waiting" | "connected";
}

export function LobbyTeamSlot({ teamId, label, status }: LobbyTeamSlotProps) {
  const statusText =
    status === "you" ? "You" : status === "connected" ? "Connected" : "Waiting…";
  const statusColor =
    status === "you"
      ? "text-primary"
      : status === "connected"
      ? "text-emerald-500"
      : "text-muted-foreground";

  const isConnected = status === "you" || status === "connected";
  return (
    <div className="flex flex-1 items-center justify-between rounded-2xl border border-border/80 bg-card/90 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">
          {teamId}
          {isConnected && (
            <span
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background"
              aria-hidden
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <span className={`text-[11px] font-medium ${statusColor}`}>{statusText}</span>
        </div>
      </div>
    </div>
  );
}

