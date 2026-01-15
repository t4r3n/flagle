import type { Country, Round, RoundResult } from '../types';

/**
 * Creates a seeded random number generator using a simple hash function.
 * Returns a function that generates deterministic random numbers between 0 and 1.
 */
export function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use a simple LCG (Linear Congruential Generator)
  let state = Math.abs(hash) || 1;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * Shuffles an array using Fisher-Yates algorithm with a seeded RNG.
 * Returns a new shuffled array without mutating the original.
 */
export function shuffleArray<T>(array: T[], rng: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a daily game with 5 rounds for a given date.
 * Each round has a country to guess and 4 options (including the correct one).
 * Picks one country from each continent/region for variety.
 */
export function generateDailyGame(countries: Country[], dateStr: string): Round[] {
  const rng = seededRandom(dateStr);

  // Group countries by region
  const regions = ['europe', 'asia-oceania', 'africa', 'north-america', 'south-america'];
  const countriesByRegion: Record<string, Country[]> = {};
  for (const region of regions) {
    countriesByRegion[region] = countries.filter((c) => c.region === region);
  }

  // Shuffle region order for variety
  const shuffledRegions = shuffleArray(regions, rng);

  // Pick one country from each region
  const selectedCountries: Country[] = shuffledRegions.map((region) => {
    const regionCountries = shuffleArray(countriesByRegion[region], rng);
    return regionCountries[0];
  });

  // Create 5 rounds
  const rounds: Round[] = selectedCountries.map((country) => {
    // Get 3 distractors (countries that are not the correct answer)
    const distractors = shuffleArray(
      countries.filter((c) => c.code !== country.code),
      rng
    ).slice(0, 3);

    // Combine correct answer with distractors and shuffle
    const options = shuffleArray([country, ...distractors], rng);

    return {
      country,
      options,
    };
  });

  return rounds;
}

/**
 * Returns today's date as a string in YYYY-MM-DD format.
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates shareable text for game results (like Wordle).
 */
export function generateShareText(results: RoundResult[], date: string): string {
  const emojis = results.map((r) => (r.correct ? '✅' : '❌')).join('');
  const score = results.filter((r) => r.correct).length;

  return `🏴 Flagle ${date}
${emojis}
${score}/5`;
}
