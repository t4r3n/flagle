import { describe, it, expect } from 'vitest';
import {
  seededRandom,
  shuffleArray,
  generateDailyGame,
  getTodayDateString,
  generateShareText,
} from './gameUtils';
import type { Country, RoundResult } from '../types';

const mockCountries: Country[] = [
  { name: 'United States', code: 'us' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'France', code: 'fr' },
  { name: 'Germany', code: 'de' },
  { name: 'Japan', code: 'jp' },
  { name: 'Brazil', code: 'br' },
  { name: 'Australia', code: 'au' },
  { name: 'Canada', code: 'ca' },
  { name: 'Italy', code: 'it' },
  { name: 'Spain', code: 'es' },
];

describe('seededRandom', () => {
  it('returns a function that generates numbers between 0 and 1', () => {
    const rng = seededRandom('2026-01-09');
    const value = rng();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  it('generates deterministic values for the same seed', () => {
    const rng1 = seededRandom('2026-01-09');
    const rng2 = seededRandom('2026-01-09');

    const values1 = [rng1(), rng1(), rng1()];
    const values2 = [rng2(), rng2(), rng2()];

    expect(values1).toEqual(values2);
  });

  it('generates different values for different seeds', () => {
    const rng1 = seededRandom('2026-01-09');
    const rng2 = seededRandom('2026-01-10');

    const value1 = rng1();
    const value2 = rng2();

    expect(value1).not.toEqual(value2);
  });
});

describe('shuffleArray', () => {
  it('returns an array with the same elements', () => {
    const original = [1, 2, 3, 4, 5];
    const rng = seededRandom('test');
    const shuffled = shuffleArray([...original], rng);

    expect(shuffled).toHaveLength(original.length);
    expect(shuffled.sort()).toEqual(original.sort());
  });

  it('produces deterministic results with the same seed', () => {
    const original = [1, 2, 3, 4, 5];
    const rng1 = seededRandom('test');
    const rng2 = seededRandom('test');

    const shuffled1 = shuffleArray([...original], rng1);
    const shuffled2 = shuffleArray([...original], rng2);

    expect(shuffled1).toEqual(shuffled2);
  });

  it('does not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    const rng = seededRandom('test');
    shuffleArray(copy, rng);

    expect(original).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('generateDailyGame', () => {
  it('generates 5 rounds', () => {
    const game = generateDailyGame(mockCountries, '2026-01-09');
    expect(game).toHaveLength(5);
  });

  it('each round has 4 options', () => {
    const game = generateDailyGame(mockCountries, '2026-01-09');
    game.forEach((round) => {
      expect(round.options).toHaveLength(4);
    });
  });

  it('the correct country is included in options', () => {
    const game = generateDailyGame(mockCountries, '2026-01-09');
    game.forEach((round) => {
      const correctIncluded = round.options.some(
        (opt) => opt.code === round.country.code
      );
      expect(correctIncluded).toBe(true);
    });
  });

  it('generates the same game for the same date', () => {
    const game1 = generateDailyGame(mockCountries, '2026-01-09');
    const game2 = generateDailyGame(mockCountries, '2026-01-09');

    expect(game1).toEqual(game2);
  });

  it('generates different games for different dates', () => {
    const game1 = generateDailyGame(mockCountries, '2026-01-09');
    const game2 = generateDailyGame(mockCountries, '2026-01-10');

    expect(game1).not.toEqual(game2);
  });

  it('uses unique countries across all 5 rounds', () => {
    const game = generateDailyGame(mockCountries, '2026-01-09');
    const countryCodes = game.map((round) => round.country.code);
    const uniqueCodes = new Set(countryCodes);

    expect(uniqueCodes.size).toBe(5);
  });
});

describe('getTodayDateString', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const dateStr = getTodayDateString();
    expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('generateShareText', () => {
  it('generates correct share text for all correct answers', () => {
    const results: RoundResult[] = [
      { correct: true, country: { name: 'US', code: 'us' } },
      { correct: true, country: { name: 'UK', code: 'gb' } },
      { correct: true, country: { name: 'FR', code: 'fr' } },
      { correct: true, country: { name: 'DE', code: 'de' } },
      { correct: true, country: { name: 'JP', code: 'jp' } },
    ];

    const shareText = generateShareText(results, '2026-01-09');

    expect(shareText).toContain('🏴 Flagle 2026-01-09');
    expect(shareText).toContain('✅✅✅✅✅');
    expect(shareText).toContain('5/5');
  });

  it('generates correct share text for mixed results', () => {
    const results: RoundResult[] = [
      { correct: true, country: { name: 'US', code: 'us' } },
      { correct: false, country: { name: 'UK', code: 'gb' } },
      { correct: true, country: { name: 'FR', code: 'fr' } },
      { correct: true, country: { name: 'DE', code: 'de' } },
      { correct: false, country: { name: 'JP', code: 'jp' } },
    ];

    const shareText = generateShareText(results, '2026-01-09');

    expect(shareText).toContain('🏴 Flagle 2026-01-09');
    expect(shareText).toContain('✅❌✅✅❌');
    expect(shareText).toContain('3/5');
  });

  it('generates correct share text for all wrong answers', () => {
    const results: RoundResult[] = [
      { correct: false, country: { name: 'US', code: 'us' } },
      { correct: false, country: { name: 'UK', code: 'gb' } },
      { correct: false, country: { name: 'FR', code: 'fr' } },
      { correct: false, country: { name: 'DE', code: 'de' } },
      { correct: false, country: { name: 'JP', code: 'jp' } },
    ];

    const shareText = generateShareText(results, '2026-01-09');

    expect(shareText).toContain('❌❌❌❌❌');
    expect(shareText).toContain('0/5');
  });
});
