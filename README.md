# Flag Guessing Game

A daily Wordle-style flag guessing game built with React and TypeScript. Test your knowledge of world flags with 5 questions per day.

## How to Play

1. You'll be shown a country's flag
2. Choose the correct country from 4 options
3. Answer 5 questions to complete the daily challenge
4. Share your results with friends

## Features

- **Daily Challenge**: Same 5 flags for everyone each day (date-based seed)
- **Wordle-style Scoring**: Green/red ticks show your results
- **191 Countries**: Flags from all UN member states organized by continent
- **Multi-language Support**: Available in English and Finnish
- **Share Results**: Copy your score to clipboard in emoji format
- **Country Facts**: Learn interesting facts about each country after answering

### Share Format

```
🌍 Flag Game 2026-01-17
✅❌✅✅✅
4/5
```

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Vitest + React Testing Library
- i18next for internationalization

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Project Structure

```
src/
├── components/       # React components (Game, FlagDisplay, etc.)
├── hooks/            # Custom hooks (useGame)
├── utils/            # Helper functions (gameUtils)
├── data/             # Country data (countries.json)
├── i18n/             # Internationalization (en, fi)
└── types/            # TypeScript interfaces
public/
└── flags/            # SVG flag files for 191 countries
```

## Deployment

The app includes Terraform configuration for GCP deployment and a GitHub Actions workflow for CI/CD.
