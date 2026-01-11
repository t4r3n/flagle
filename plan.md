# Plan: Flag Guessing Game

## Overview
A React/TypeScript multiple-choice flag guessing game with Wordle-style scoring. Users see a flag, select from 4 country options, and results are shown as green/red ticks (5 rounds max).

## Requirements
- **Gameplay**: 5 questions per game, multiple choice (1 flag, 4 options)
- **Daily Puzzle**: Same 5 questions for everyone each day (date-based seed)
- **Once Per Day**: Like Wordle - play once, then show results until tomorrow
- **Scoring**: Wordle-style - green tick (✓) for correct, red tick (✗) for wrong
- **Points**: Max 5, Min 0 (displayed as row of ticks at end)
- **Share**: Copy results to clipboard (like Wordle)
- **Data**: Local JSON + bundled SVG flag files
- **Persistence**: localStorage to track daily completion
- **Styling**: Tailwind CSS
- **Stack**: React, TypeScript, Vitest (TDD)

### Share Format Example
```
🏴 Flag Game 2026-01-09
✅❌✅✅✅
4/5
```

## Architecture

### Directory Structure
```
src/
├── components/
│   ├── Game.tsx           # Main game container
│   ├── FlagDisplay.tsx    # Shows the flag image
│   ├── OptionButton.tsx   # Single answer option
│   ├── OptionsGrid.tsx    # Grid of 4 options
│   ├── ResultTicks.tsx    # Wordle-style tick display (✓/✗)
│   └── GameOver.tsx       # End screen with final score + ticks
├── hooks/
│   └── useGame.ts         # Game state logic
├── utils/
│   └── gameUtils.ts       # Shuffle, random selection
├── data/
│   └── countries.json     # Country name + code mapping
├── types/
│   └── index.ts           # TypeScript interfaces
└── App.tsx
public/
└── flags/                 # SVG flag files (e.g., us.svg, gb.svg)
tests/
├── components/
├── hooks/
└── utils/
```

### Data Model
```typescript
interface Country {
  name: string;
  code: string;      // ISO 3166-1 alpha-2 lowercase (e.g., "us", "gb")
}

interface RoundResult {
  correct: boolean;
  country: Country;
}

interface GameState {
  round: number;            // 1-5
  currentCountry: Country;
  options: Country[];       // 4 options including correct
  results: RoundResult[];   // History of answers for tick display
  isGameOver: boolean;
}

// localStorage structure
interface DailyGameRecord {
  date: string;             // "YYYY-MM-DD"
  results: RoundResult[];   // Saved results for the day
  completed: boolean;
}
```

### Game Flow
1. On load: check localStorage for today's date
2. If already played today → show GameOver with saved results
3. If new day:
   a. Generate today's date string ("YYYY-MM-DD")
   b. Use date as seed for deterministic random
   c. Select 5 unique countries + their distractors using seeded random
4. Play round 1-5:
   a. Display flag + 4 shuffled options
   b. User clicks an option
   c. Record result (✓ green or ✗ red), save to localStorage
5. After round 5: show GameOver with all 5 ticks + final score
6. Show "Come back tomorrow!" message (no replay)

## Implementation Steps (TDD)

### Phase 1: Project Setup
1. Initialize React + TypeScript project (Vite)
2. Configure Vitest + React Testing Library
3. Set up Tailwind CSS
4. Set up ESLint + Prettier
5. Download ~50 flag SVGs to `public/flags/`

### Phase 2: Data & Utils (test first)
1. Create `countries.json` with ~50 countries (name + code)
2. Write tests for `gameUtils.ts`
3. Implement:
   - `seededRandom(seed)` - deterministic random from date string
   - `shuffleArray(arr, rng)` - shuffle using seeded random
   - `generateDailyGame(countries, dateStr)` - generate 5 rounds for a date
   - `getTodayDateString()` - returns "YYYY-MM-DD"
   - `generateShareText(results, date)` - creates shareable emoji string

### Phase 3: Game Hook (test first)
1. Write tests for `useGame` hook
2. Implement game state: round tracking, results array
3. Handle: `selectAnswer`, `nextRound`
4. localStorage: `loadDailyRecord`, `saveDailyRecord`
5. Check if already played today on init

### Phase 4: Components (test first)
1. `FlagDisplay` - renders flag SVG from `/flags/{code}.svg`
2. `OptionButton` - clickable country option with hover/active states
3. `OptionsGrid` - 2x2 grid of options
4. `ResultTicks` - row of 5 tick slots (✓ green / ✗ red / empty)
5. `GameOver` - final score + ticks + "Share" button + "Come back tomorrow!"
6. `Game` - orchestrates everything, shows current round

### Phase 5: Styling & Polish
1. Tailwind styling for all components
2. Brief feedback animation on answer (flash green/red)
3. Responsive layout (mobile-friendly)

## Key Files to Create
- `src/data/countries.json` - 50 countries with name + code
- `src/types/index.ts` - Country, RoundResult, GameState interfaces
- `src/utils/gameUtils.ts` - shuffle, random selection helpers
- `src/hooks/useGame.ts` - game state management
- `src/components/Game.tsx` - main game container
- `src/components/FlagDisplay.tsx` - flag image display
- `src/components/OptionButton.tsx` - answer button
- `src/components/OptionsGrid.tsx` - 2x2 options layout
- `src/components/ResultTicks.tsx` - Wordle-style tick row
- `src/components/GameOver.tsx` - end screen with results
- `public/flags/*.svg` - ~50 flag SVG files

## Verification
1. `npm test` - all tests pass
2. `npm run dev` - app starts without errors
3. Manual test: complete a 5-round game
   - Verify ticks appear after each answer (green/red)
   - Verify GameOver shows all 5 ticks + correct score
   - Verify "Come back tomorrow!" message appears
4. Test daily persistence:
   - Complete game, refresh page → should show GameOver with saved results
   - Same questions generated for same date (deterministic)
5. Test share feature:
   - Click "Share" button → copies emoji result to clipboard
   - Paste and verify format matches expected output
6. `npm run lint` - no lint errors
7. `npm run typecheck` - no type errors
