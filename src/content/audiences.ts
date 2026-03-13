import type { LucideIcon } from "lucide-react";
import { Heart, GraduationCap, Home, PartyPopper } from "lucide-react";

export interface AudienceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const audiences: AudienceItem[] = [
  {
    id: "friends",
    title: "Friends",
    description: "Game night with your crew? This is the perfect word guessing game for friends. Easy to learn, fun to replay.",
    icon: Heart,
  },
  {
    id: "college",
    title: "College & events",
    description: "Great for dorm rooms, club events, or campus get-togethers. Team Sync mode keeps things smooth when the group is big.",
    icon: GraduationCap,
  },
  {
    id: "family",
    title: "Family game nights",
    description: "All ages can play. Pick easier decks for younger players and keep the vibe light. No complicated rules—just guess the word.",
    icon: Home,
  },
  {
    id: "parties",
    title: "Parties",
    description: "Icebreaker or main event. Works with one phone or two. A modern party word guessing game that actually fits the room.",
    icon: PartyPopper,
  },
];
