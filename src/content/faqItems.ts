export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    id: "what-is",
    question: "What is this game?",
    answer:
      "It's a multiplayer taboo-style party game. Two teams take turns: one person gives clues to a secret word while their team guesses, and they must avoid saying certain \"taboo\" words. The other team observes and can call out violations. It's a word guessing game for groups—great for parties, friends, and family.",
  },
  {
    id: "similar-taboo",
    question: "Is this similar to Taboo?",
    answer:
      "Yes. If you've played the classic Taboo board game, you'll feel right at home. Each card has a main word and a list of forbidden words. The clue giver describes the main word without saying it or any of the taboo words. We've added digital features like timers, scoring, and Team Sync mode to make it easier to play in real life with less chaos.",
  },
  {
    id: "one-phone",
    question: "Can I play with one phone?",
    answer:
      "Yes. Use Pass & Play mode: one phone is shared by everyone. When it's a team's turn, the clue giver holds the phone; when the round ends, pass it to the next team. The observer team can look at the same screen to watch for taboo violations.",
  },
  {
    id: "two-phones",
    question: "Can I play with two phones?",
    answer:
      "Yes. Team Sync mode is designed for two phones—one per team. Each team keeps their phone; only the role (clue giver vs. guessers) changes as turns rotate. You don't pass phones around the whole group, which reduces chaos and is especially helpful in larger parties.",
  },
  {
    id: "team-sync-how",
    question: "How does Team Sync Mode work?",
    answer:
      "You need two devices (phones or tablets), one per team. Each team's device stays with that team. When it's your team's turn to give clues, the clue giver uses your team's phone to see the card. When you're guessing or the other team is playing, your phone shows the observer view or waits for your turn. Roles update automatically—no passing devices between teams.",
  },
  {
    id: "how-many-players",
    question: "How many players do I need?",
    answer:
      "At least four: two teams of two or more. There's no strict maximum—larger groups work well, especially with Team Sync mode so you're not passing one phone around too many people.",
  },
  {
    id: "own-device",
    question: "Do all players need their own device?",
    answer:
      "No. In Pass & Play mode, one device is enough; everyone shares it. In Team Sync mode, you need two devices total (one per team), not one per person.",
  },
  {
    id: "taboo-word-said",
    question: "What happens if someone says a taboo word?",
    answer:
      "The observing team can call it out. Typically you'll mark it as a taboo violation in the app (which usually costs a point or ends the clue for that word, depending on house rules). The card might be skipped, and play continues. The app helps keep scoring fair and visible.",
  },
  {
    id: "scoring",
    question: "How are scores calculated?",
    answer:
      "Correct guesses usually add a point; skipped cards or taboo violations often subtract a point (or don't add). The exact rules are shown in the app. At the end of all rounds, the team with the higher score wins.",
  },
  {
    id: "mobile-friendly",
    question: "Is this game mobile-friendly?",
    answer:
      "Yes. It's built to work on phones and tablets. Use it in the same room—no need for everyone to have the app open on their own device unless you choose Team Sync mode with two phones.",
  },
  {
    id: "different-decks",
    question: "Can I choose different decks?",
    answer:
      "Yes. You can pick from different card decks (e.g. classic, movies, everyday) before starting. This keeps the game fresh and lets you match the deck to your group.",
  },
  {
    id: "friends-party",
    question: "Can I play with friends at a party?",
    answer:
      "Absolutely. It's designed for in-person play—same room, same party. One or two phones are enough. It's a party word guessing game that works for game nights, gatherings, and events.",
  },
  {
    id: "observer-see-card",
    question: "Does the observer team see the same card?",
    answer:
      "Yes. The observing team can see the same word and taboo list (on the shared screen or on their team's device in Team Sync mode) so they can fairly call out if the clue giver says a taboo word.",
  },
  {
    id: "college-family",
    question: "Is this suitable for college events or family gatherings?",
    answer:
      "Yes. It works well for college events, dorm games, family game nights, and mixed-age groups. You can choose decks and round length to fit the crowd. Team Sync mode is especially handy for larger or noisier settings.",
  },
  {
    id: "more-decks",
    question: "Will more decks be added later?",
    answer:
      "We plan to add more decks and themes over time so you can keep the game fresh. Stay tuned for updates.",
  },
];
