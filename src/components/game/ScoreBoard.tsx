import type { Team } from "@/types";

interface ScoreBoardProps {
  teams: [Team, Team];
  currentTeamIndex: number;
}

export function ScoreBoard({ teams, currentTeamIndex }: ScoreBoardProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      {teams.map((team, i) => (
        <div
          key={i}
          className={`flex flex-1 flex-col items-center rounded-xl px-3 py-2 transition-colors ${
            i === currentTeamIndex
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest">{team.name}</span>
          <span className="tabular-nums text-xl font-bold">{team.score}</span>
        </div>
      ))}
    </div>
  );
}
