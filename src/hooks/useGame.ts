import { useState, useCallback, useRef, useEffect } from "react";
import type { Card, GameSettings, Team, RoundResult } from "@/types";

// Deck card imports - dynamic
import classicEveryday from "@/data/decks/classic-everyday.json";
import moviesPopculture from "@/data/decks/movies-popculture.json";
import nsfw from "@/data/decks/nsfw.json";

const deckFileMap: Record<string, Card[]> = {
  "classic-everyday": classicEveryday as Card[],
  "movies-popculture": moviesPopculture as Card[],
  nsfw: nsfw as Card[],
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const createTeam = (name: string): Team => ({
  name,
  score: 0,
  correct: 0,
  skipped: 0,
  taboo: 0,
});

export function useGame() {
  const [settings, setSettings] = useState<GameSettings>({
    roundDuration: 60,
    totalRounds: 4,
    teams: [createTeam("Team A"), createTeam("Team B")],
    selectedDeckIds: [],
    maxSkipsPerRound: 3,
    scoreLimit: 0,
  });

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [usedCardIds, setUsedCardIds] = useState<Set<string>>(new Set());
  const [gameOverByScore, setGameOverByScore] = useState(false);

  // Round-local trackers
  const roundCorrect = useRef(0);
  const roundSkipped = useRef(0);
  const roundTaboo = useRef(0);
  const roundScore = useRef(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentCard = cards[currentCardIndex] || null;

  // Timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
    if (isPlaying && timeLeft === 0) {
      endRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, timeLeft]);

  const loadCards = useCallback((deckIds: string[]) => {
    const allCards: Card[] = [];
    deckIds.forEach((id) => {
      const deckCards = deckFileMap[id];
      if (deckCards) allCards.push(...deckCards);
    });
    const shuffled = shuffle(allCards);
    setCards(shuffled);
    setCurrentCardIndex(0);
  }, []);

  const startGame = useCallback(() => {
    loadCards(settings.selectedDeckIds);
    setCurrentRound(1);
    setCurrentTeamIndex(0);
    setUsedCardIds(new Set());
    setGameOverByScore(false);
    setSettings((s) => ({
      ...s,
      teams: [
        { ...s.teams[0], score: 0, correct: 0, skipped: 0, taboo: 0 },
        { ...s.teams[1], score: 0, correct: 0, skipped: 0, taboo: 0 },
      ],
    }));
  }, [settings.selectedDeckIds, loadCards]);

  const startRound = useCallback(() => {
    roundCorrect.current = 0;
    roundSkipped.current = 0;
    roundTaboo.current = 0;
    roundScore.current = 0;
    setTimeLeft(settings.roundDuration);
    setRoundResult(null);
    setIsPlaying(true);
  }, [settings.roundDuration]);

  /**
   * Advance to the next card. Correct/taboo cards are in usedIds and must not
   * appear again this game; skipped cards can repeat.
   * @param usedIds - Set of card ids that have been answered correct or taboo (never show again)
   */
  const advanceCard = useCallback(
    (usedIds: Set<string>) => {
      const remaining = cards.filter((c) => !usedIds.has(c.id));
      if (remaining.length === 0) {
        setCards(shuffle([...cards]));
        setUsedCardIds(new Set());
        setCurrentCardIndex(0);
        return;
      }
      let nextIndex = currentCardIndex + 1;
      while (nextIndex < cards.length && usedIds.has(cards[nextIndex].id)) {
        nextIndex += 1;
      }
      if (nextIndex < cards.length) {
        setCurrentCardIndex(nextIndex);
        return;
      }
      setCards(shuffle(remaining));
      setCurrentCardIndex(0);
    },
    [cards, currentCardIndex]
  );

  const handleCorrect = useCallback(() => {
    if (!currentCard) return;
    roundCorrect.current += 1;
    roundScore.current += 1;
    const newUsed = new Set(usedCardIds).add(currentCard.id);
    setUsedCardIds(newUsed);
    advanceCard(newUsed);
    setSettings((s) => {
      const teams = [...s.teams] as [Team, Team];
      const idx = currentTeamIndex;
      teams[idx] = {
        ...teams[idx],
        score: teams[idx].score + 1,
        correct: teams[idx].correct + 1,
      };
      return { ...s, teams };
    });
  }, [currentCard, advanceCard, currentTeamIndex, usedCardIds]);

  const handleSkip = useCallback(() => {
    if (!currentCard) return;
    if (
      settings.maxSkipsPerRound > 0 &&
      roundSkipped.current >= settings.maxSkipsPerRound
    )
      return;
    roundSkipped.current += 1;
    // Skip is a free pass: no score change (roundScore and team score stay the same)
    advanceCard(usedCardIds);
    setSettings((s) => {
      const teams = [...s.teams] as [Team, Team];
      const idx = currentTeamIndex;
      teams[idx] = {
        ...teams[idx],
        skipped: teams[idx].skipped + 1,
      };
      return { ...s, teams };
    });
  }, [currentCard, advanceCard, currentTeamIndex, settings.maxSkipsPerRound, usedCardIds]);

  const handleTaboo = useCallback(() => {
    if (!currentCard) return;
    roundTaboo.current += 1;
    roundScore.current -= 1;
    const newUsed = new Set(usedCardIds).add(currentCard.id);
    setUsedCardIds(newUsed);
    advanceCard(newUsed);
    setSettings((s) => {
      const teams = [...s.teams] as [Team, Team];
      const idx = currentTeamIndex;
      teams[idx] = {
        ...teams[idx],
        score: teams[idx].score - 1,
        taboo: teams[idx].taboo + 1,
      };
      return { ...s, teams };
    });
  }, [currentCard, advanceCard, currentTeamIndex, usedCardIds]);

  const endRound = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const result: RoundResult = {
      teamIndex: currentTeamIndex,
      correct: roundCorrect.current,
      skipped: roundSkipped.current,
      taboo: roundTaboo.current,
      score: roundScore.current,
    };
    setRoundResult(result);
    // Team score and correct/skipped/taboo counts were already updated live in
    // handleCorrect, handleSkip, handleTaboo — nothing more to add here.
  }, [currentTeamIndex]);

  // End game when a team reaches the score limit
  useEffect(() => {
    if (!isPlaying || settings.scoreLimit <= 0 || gameOverByScore) return;
    const [a, b] = settings.teams;
    if (a.score >= settings.scoreLimit || b.score >= settings.scoreLimit) {
      endRound();
      setGameOverByScore(true);
    }
  }, [settings.teams, settings.scoreLimit, isPlaying, gameOverByScore, endRound]);

  const nextRound = useCallback(() => {
    const nextTeam = currentTeamIndex === 0 ? 1 : 0;
    setCurrentTeamIndex(nextTeam);
    if (nextTeam === 0) {
      setCurrentRound((r) => r + 1);
    }
    setRoundResult(null);
  }, [currentTeamIndex]);

  const isGameOver =
    gameOverByScore ||
    (currentRound > settings.totalRounds && currentTeamIndex === 0 && roundResult !== null);

  return {
    settings,
    setSettings,
    currentCard,
    currentRound,
    currentTeamIndex,
    timeLeft,
    isPlaying,
    roundResult,
    isGameOver,
    startGame,
    startRound,
    handleCorrect,
    handleSkip,
    handleTaboo,
    nextRound,
    cards,
  };
}
