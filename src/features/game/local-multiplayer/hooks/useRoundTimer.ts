import { useEffect, useState } from "react";

/**
 * Returns remaining seconds for the round timer.
 * - Invalid/missing timer data => returns duration (safe, won't trigger auto-end)
 * - Valid timer data => returns actual countdown
 * Never returns 0 on initial render before the effect runs (avoids immediate round end).
 */
export function useRoundTimer(
  timerStartedAt: string | null | undefined,
  durationSeconds: number | null | undefined,
  phase: string
): number {
  const duration = Number(durationSeconds) || 60;
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    if (phase !== "playing" || !timerStartedAt || duration <= 0) {
      setRemaining(0);
      return;
    }

    const startMs = new Date(timerStartedAt).getTime();
    if (Number.isNaN(startMs)) {
      setRemaining(duration);
      return;
    }

    const compute = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startMs) / 1000);
      return Math.max(0, duration - elapsed);
    };

    setRemaining(compute());

    const interval = setInterval(() => {
      const r = compute();
      setRemaining(r);
      if (r <= 0) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, [timerStartedAt, duration, phase]);

  return remaining;
}
