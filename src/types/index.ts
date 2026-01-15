export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2 lowercase (e.g., "us", "gb")
  capital: string;
  population: number;
  area: number; // Area in square kilometers
  timezone: string;
  region: string; // For map highlighting: "europe", "asia", "north-america", etc.
  language: string; // Main/official language
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RoundResult {
  correct: boolean;
  country: Country;
}

export interface Round {
  country: Country;
  options: Country[];
}

export interface GameState {
  rounds: Round[];
  currentRound: number; // 0-4
  results: RoundResult[];
  isGameOver: boolean;
}

export interface DailyGameRecord {
  date: string; // "YYYY-MM-DD"
  results: RoundResult[];
  completed: boolean;
}
