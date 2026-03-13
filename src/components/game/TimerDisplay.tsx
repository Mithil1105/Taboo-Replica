interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
}

export function TimerDisplay({ timeLeft, totalTime }: TimerDisplayProps) {
  const progress = timeLeft / totalTime;
  const isLow = timeLeft <= 10;

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`tabular-nums text-3xl font-bold transition-colors ${
          isLow ? "text-destructive animate-pulse" : "text-foreground"
        }`}
      >
        {timeLeft}
      </span>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isLow ? "bg-destructive" : "bg-primary"
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
