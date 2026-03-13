import type { LucideIcon } from "lucide-react";
import { BookOpen, Users, Eye, Smartphone } from "lucide-react";

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const features: FeatureItem[] = [
  {
    id: "simple",
    title: "Simple to learn",
    description: "If you've ever played a word guessing game, you're ready. Clear rules, no complicated setup—just pick a mode and play.",
    icon: BookOpen,
  },
  {
    id: "teams",
    title: "Great for teams",
    description: "Two teams, one goal: guess the word. The clue giver can't say the taboo words—everyone else tries to guess before time runs out.",
    icon: Users,
  },
  {
    id: "observer",
    title: "Observer-friendly",
    description: "The other team watches the same card and can call out taboo violations. Fair, transparent, and more fun for everyone.",
    icon: Eye,
  },
  {
    id: "mobile",
    title: "Mobile-ready",
    description: "Built for phones and tablets. Play in the same room with one device, or use Team Sync mode with two phones for a smoother experience.",
    icon: Smartphone,
  },
];
