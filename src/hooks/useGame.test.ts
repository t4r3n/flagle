import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock the date
vi.mock('../utils/gameUtils', async () => {
  const actual = await vi.importActual('../utils/gameUtils');
  return {
    ...actual,
    getTodayDateString: () => '2026-01-09',
  };
});

describe('useGame', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with round 0 and empty results', () => {
    const { result } = renderHook(() => useGame());

    expect(result.current.currentRound).toBe(0);
    expect(result.current.results).toEqual([]);
    expect(result.current.isGameOver).toBe(false);
  });

  it('has 5 rounds generated', () => {
    const { result } = renderHook(() => useGame());

    expect(result.current.rounds).toHaveLength(5);
  });

  it('each round has a country and 4 options', () => {
    const { result } = renderHook(() => useGame());

    result.current.rounds.forEach((round) => {
      expect(round.country).toBeDefined();
      expect(round.country.name).toBeDefined();
      expect(round.country.code).toBeDefined();
      expect(round.options).toHaveLength(4);
    });
  });

  it('selectAnswer records correct answer', () => {
    const { result } = renderHook(() => useGame());
    const correctCountry = result.current.rounds[0].country;

    act(() => {
      result.current.selectAnswer(correctCountry);
    });

    // Advance timers to complete the feedback delay
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].correct).toBe(true);
    expect(result.current.results[0].country.code).toBe(correctCountry.code);
  });

  it('selectAnswer records incorrect answer', () => {
    const { result } = renderHook(() => useGame());
    const correctCountry = result.current.rounds[0].country;
    const wrongCountry = result.current.rounds[0].options.find(
      (opt) => opt.code !== correctCountry.code
    )!;

    act(() => {
      result.current.selectAnswer(wrongCountry);
    });

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].correct).toBe(false);
  });

  it('advances to next round after selecting answer', () => {
    const { result } = renderHook(() => useGame());
    const correctCountry = result.current.rounds[0].country;

    act(() => {
      result.current.selectAnswer(correctCountry);
    });

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.currentRound).toBe(1);
  });

  it('sets isGameOver to true after 5 rounds', () => {
    const { result } = renderHook(() => useGame());

    // Answer all 5 rounds
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.selectAnswer(result.current.rounds[i].country);
      });
      act(() => {
        vi.advanceTimersByTime(1500);
      });
    }

    expect(result.current.isGameOver).toBe(true);
    expect(result.current.results).toHaveLength(5);
  });

  it('saves results to localStorage after each answer', () => {
    const { result } = renderHook(() => useGame());
    const correctCountry = result.current.rounds[0].country;

    act(() => {
      result.current.selectAnswer(correctCountry);
    });

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    const saved = JSON.parse(localStorageMock.getItem('flagGame') || '{}');
    expect(saved.date).toBe('2026-01-09');
    expect(saved.results).toHaveLength(1);
  });

  it('restores game state from localStorage if played today', () => {
    // Save a partial game to localStorage
    const savedGame = {
      date: '2026-01-09',
      results: [
        { correct: true, country: { name: 'Test', code: 'ts' } },
        { correct: false, country: { name: 'Test2', code: 'ts2' } },
      ],
      completed: false,
    };
    localStorageMock.setItem('flagGame', JSON.stringify(savedGame));

    const { result } = renderHook(() => useGame());

    expect(result.current.results).toHaveLength(2);
    expect(result.current.currentRound).toBe(2);
  });

  it('shows game over if already completed today', () => {
    // Save a completed game to localStorage
    const savedGame = {
      date: '2026-01-09',
      results: [
        { correct: true, country: { name: 'T1', code: 't1' } },
        { correct: true, country: { name: 'T2', code: 't2' } },
        { correct: false, country: { name: 'T3', code: 't3' } },
        { correct: true, country: { name: 'T4', code: 't4' } },
        { correct: true, country: { name: 'T5', code: 't5' } },
      ],
      completed: true,
    };
    localStorageMock.setItem('flagGame', JSON.stringify(savedGame));

    const { result } = renderHook(() => useGame());

    expect(result.current.isGameOver).toBe(true);
    expect(result.current.results).toHaveLength(5);
  });

  it('starts fresh game if localStorage has different date', () => {
    // Save an old game to localStorage
    const savedGame = {
      date: '2026-01-08', // Yesterday
      results: [{ correct: true, country: { name: 'Test', code: 'ts' } }],
      completed: false,
    };
    localStorageMock.setItem('flagGame', JSON.stringify(savedGame));

    const { result } = renderHook(() => useGame());

    expect(result.current.results).toHaveLength(0);
    expect(result.current.currentRound).toBe(0);
  });

  it('calculates score correctly', () => {
    const { result } = renderHook(() => useGame());

    // Answer 3 correct, 2 wrong
    act(() => {
      result.current.selectAnswer(result.current.rounds[0].country); // correct
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    act(() => {
      const wrong = result.current.rounds[1].options.find(
        (o) => o.code !== result.current.rounds[1].country.code
      )!;
      result.current.selectAnswer(wrong); // wrong
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    act(() => {
      result.current.selectAnswer(result.current.rounds[2].country); // correct
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    act(() => {
      result.current.selectAnswer(result.current.rounds[3].country); // correct
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    act(() => {
      const wrong = result.current.rounds[4].options.find(
        (o) => o.code !== result.current.rounds[4].country.code
      )!;
      result.current.selectAnswer(wrong); // wrong
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.score).toBe(3);
  });

  it('provides current round data', () => {
    const { result } = renderHook(() => useGame());

    expect(result.current.currentRoundData).toBeDefined();
    expect(result.current.currentRoundData?.country).toBeDefined();
    expect(result.current.currentRoundData?.options).toHaveLength(4);
  });

  it('currentRoundData is undefined when game is over', () => {
    const { result } = renderHook(() => useGame());

    // Complete the game
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.selectAnswer(result.current.rounds[i].country);
      });
      act(() => {
        vi.advanceTimersByTime(1500);
      });
    }

    expect(result.current.currentRoundData).toBeUndefined();
  });
});
