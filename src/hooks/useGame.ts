import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Country, Round, RoundResult, DailyGameRecord } from '../types';
import { generateDailyGame, getTodayDateString } from '../utils/gameUtils';
import countries from '../data/countries.json';

const STORAGE_KEY = 'flagGame';
const FEEDBACK_DELAY_MS = 1200;

function loadDailyRecord(): DailyGameRecord | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as DailyGameRecord;
  } catch {
    return null;
  }
}

function saveDailyRecord(record: DailyGameRecord): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function useGame() {
  const todayDate = getTodayDateString();

  // Generate rounds for today (deterministic based on date)
  const rounds: Round[] = useMemo(
    () => generateDailyGame(countries as Country[], todayDate),
    [todayDate]
  );

  // Initialize state from localStorage or fresh
  const [results, setResults] = useState<RoundResult[]>(() => {
    const saved = loadDailyRecord();
    if (saved && saved.date === todayDate) {
      return saved.results;
    }
    return [];
  });

  const [isGameOver, setIsGameOver] = useState<boolean>(() => {
    const saved = loadDailyRecord();
    if (saved && saved.date === todayDate) {
      return saved.completed;
    }
    return false;
  });

  // Feedback state for animations
  const [selectedAnswer, setSelectedAnswer] = useState<Country | null>(null);
  const [showingFeedback, setShowingFeedback] = useState(false);

  const currentRound = results.length;

  const currentRoundData = useMemo(() => {
    if (isGameOver || currentRound >= 5) {
      return undefined;
    }
    return rounds[currentRound];
  }, [rounds, currentRound, isGameOver]);

  const score = useMemo(
    () => results.filter((r) => r.correct).length,
    [results]
  );

  // Save to localStorage whenever results change
  useEffect(() => {
    if (results.length > 0) {
      saveDailyRecord({
        date: todayDate,
        results,
        completed: isGameOver,
      });
    }
  }, [results, isGameOver, todayDate]);

  const selectAnswer = useCallback(
    (selectedCountry: Country) => {
      if (isGameOver || currentRound >= 5 || showingFeedback) return;

      const currentCountry = rounds[currentRound].country;
      const isCorrect = selectedCountry.code === currentCountry.code;

      // Show feedback immediately
      setSelectedAnswer(selectedCountry);
      setShowingFeedback(true);

      // After delay, record result and move to next round
      setTimeout(() => {
        const newResult: RoundResult = {
          correct: isCorrect,
          country: currentCountry,
        };

        const newResults = [...results, newResult];
        setResults(newResults);
        setSelectedAnswer(null);
        setShowingFeedback(false);

        // Check if game is over
        if (newResults.length >= 5) {
          setIsGameOver(true);
          saveDailyRecord({
            date: todayDate,
            results: newResults,
            completed: true,
          });
        }
      }, FEEDBACK_DELAY_MS);
    },
    [currentRound, isGameOver, results, rounds, todayDate, showingFeedback]
  );

  // Compute feedback state
  const lastAnswerCorrect = useMemo(() => {
    if (!showingFeedback || !selectedAnswer || !currentRoundData) return null;
    return selectedAnswer.code === currentRoundData.country.code;
  }, [showingFeedback, selectedAnswer, currentRoundData]);

  return {
    rounds,
    currentRound,
    currentRoundData,
    results,
    isGameOver,
    score,
    selectAnswer,
    todayDate,
    // New feedback state
    selectedAnswer,
    showingFeedback,
    lastAnswerCorrect,
  };
}
