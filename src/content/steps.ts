export interface StepItem {
  id: string;
  step: number;
  title: string;
  description: string;
}

export const howItWorksSteps: StepItem[] = [
  {
    id: "split",
    step: 1,
    title: "Split into two teams",
    description: "Grab your friends and divide into Team A and Team B. You can play with as few as four people or as many as you like.",
  },
  {
    id: "clue",
    step: 2,
    title: "Give clues—but not the taboo words",
    description: "One player sees the secret word and a list of forbidden words. Describe the word to your team without saying it or any of the taboo words.",
  },
  {
    id: "guess",
    step: 3,
    title: "Guess before time runs out",
    description: "Your team tries to guess the word. The other team watches and can call out if you slip and say a taboo word. Score points for correct guesses.",
  },
  {
    id: "win",
    step: 4,
    title: "Most points wins",
    description: "Take turns between teams. After each round, the next team's clue giver goes. When all rounds are done, the team with the highest score wins.",
  },
];
