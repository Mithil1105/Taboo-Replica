export interface GameModeItem {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  bullets: string[];
  bestFor: string;
}

export const gameModes: GameModeItem[] = [
  {
    id: "pass-play",
    name: "Pass & Play",
    shortDescription: "One phone, everyone shares.",
    description:
      "Use a single device. When it's a team's turn, the clue giver holds the phone; when the round ends, pass it to the next team. Simple and works with any group size.",
    bullets: [
      "One phone or tablet for the whole group",
      "Pass the device when turns change",
      "Works offline after first load",
      "Observer team can gather around to watch the same card",
    ],
    bestFor: "Small gatherings, quick games, or when you only have one device.",
  },
  {
    id: "team-sync",
    name: "Local Multiplayer",
    shortDescription: "Two phones—one per team. Less chaos.",
    description:
      "Each team has its own phone. The phone stays with the team; only the role (clue giver vs. guessers) changes as turns rotate. No passing devices around the whole room—just within your team.",
    bullets: [
      "One phone per team (2 phones total)",
      "Phone stays with the team for the whole game",
      "When it's your turn to give clues, you use your team's phone",
      "When you're guessing or observing, the phone stays with your team",
      "Roles on each phone update automatically as turns change",
    ],
    bestFor: "Larger parties, college events, or anyone who wants a calmer, more organized round flow.",
  },
];

export const teamSyncBenefits = [
  "No passing one phone around the entire group",
  "Each team has a clear \"home\" device",
  "Less fumbling and fewer accidental drops",
  "Easier for the observer team to follow along on their own screen",
  "Feels more like a proper party game with dedicated team stations",
];

export const modeComparison = [
  { aspect: "Devices needed", passPlay: "1 (works offline)", teamSync: "2 (one per team, needs internet)" },
  { aspect: "Passing devices", passPlay: "Pass to next team each round", teamSync: "Stay within team only" },
  { aspect: "Best for", passPlay: "Quick games, small groups, offline play", teamSync: "Parties, events, larger groups" },
  { aspect: "Chaos level", passPlay: "Moderate", teamSync: "Low—more organized" },
];
