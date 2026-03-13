/**
 * Development-only debug panel for room/session state visibility.
 * Only visible when VITE_DEBUG=true or ?debug=1 in dev.
 */
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { isDebugEnabled } from "@/lib/debug";

interface DebugPanelProps {
  roomCode?: string | null;
  deviceId?: string | null;
  team?: string | null;
  isHost?: boolean;
  phase?: string | null;
  currentRound?: number;
  currentTurnTeam?: string | null;
  currentCardId?: string | null;
  scoreA?: number;
  scoreB?: number;
  sessionId?: string | null;
  /** e.g. "connected" | "reconnecting" | "disconnected" */
  connectionState?: string;
  /** Both teams have connected participants */
  bothTeamsConnected?: boolean;
  /** Room status from DB */
  roomStatus?: string | null;
  /** Host participant connected */
  hostConnected?: boolean;
  /** Selected deck IDs (lobby) */
  selectedDecks?: string[] | Set<string>;
  /** Room updated_at timestamp */
  roomUpdatedAt?: string | null;
}

export function DebugPanel(props: DebugPanelProps) {
  const [open, setOpen] = useState(false);
  if (!isDebugEnabled()) return null;

  const entries = [
    ["Room", props.roomCode ?? "—"],
    ["Room status", props.roomStatus ?? "—"],
    ["Device ID", props.deviceId ? `${props.deviceId.slice(0, 12)}…` : "—"],
    ["Team", props.team ?? "—"],
    ["Host", props.isHost ? "Yes" : "No"],
    ["Host conn", props.hostConnected != null ? (props.hostConnected ? "Yes" : "No") : "—"],
    ["Both ready", props.bothTeamsConnected != null ? (props.bothTeamsConnected ? "Yes" : "No") : "—"],
    ["Phase", props.phase ?? "—"],
    ["Round", props.currentRound ?? "—"],
    ["Turn", props.currentTurnTeam ?? "—"],
    ["Card ID", props.currentCardId ? `${props.currentCardId.slice(0, 12)}…` : "—"],
    ["Score A/B", props.scoreA != null && props.scoreB != null ? `${props.scoreA} / ${props.scoreB}` : "—"],
    ["Session", props.sessionId ? `${props.sessionId.slice(0, 8)}…` : "—"],
    ["Connection", props.connectionState ?? "—"],
    ["Decks", props.selectedDecks ? (Array.isArray(props.selectedDecks) ? props.selectedDecks.join(", ") : [...props.selectedDecks].join(", ")) : "—"],
    ["Room updated", props.roomUpdatedAt ? new Date(props.roomUpdatedAt).toLocaleTimeString() : "—"],
  ].filter(([, v]) => v !== "—" || open);

  return (
    <div className="fixed bottom-20 left-2 right-2 z-[9999] max-w-xs rounded-lg border border-amber-500/50 bg-amber-950/95 px-2 py-1.5 text-[10px] font-mono text-amber-100 shadow-lg dark:bg-amber-950/98">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 py-1"
      >
        <span className="font-semibold">Debug</span>
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
      </button>
      {open && (
        <div className="mt-1 space-y-0.5 border-t border-amber-500/30 pt-1.5">
          {entries.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2">
              <span className="text-amber-300/80">{k}:</span>
              <span className="truncate">{String(v)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
