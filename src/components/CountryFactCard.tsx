import type { Country } from '../types';
import { WorldMap } from './WorldMap';

interface CountryFactCardProps {
  country: Country;
  wasCorrect: boolean;
}

function formatPopulation(pop: number): string {
  if (pop >= 1_000_000_000) return `${(pop / 1_000_000_000).toFixed(1)}B`;
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M`;
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(1)}K`;
  return pop.toString();
}

export function CountryFactCard({ country, wasCorrect }: CountryFactCardProps) {
  return (
    <div className="flex-shrink-0 w-full px-2">
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 border border-slate-200 shadow-lg">
        {/* Result badge */}
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-3
            ${
              wasCorrect
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
        >
          {wasCorrect ? '✓ Correct' : '✗ Missed'}
        </div>

        {/* Map - full width */}
        <div className="mb-4 -mx-1">
          <WorldMap
            highlightedCountry={country.name}
            markerCoordinates={country.coordinates}
          />
        </div>

        {/* Flag and Country name row */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={`/flags/${country.code}.svg`}
            alt={`${country.name} flag`}
            className="w-12 h-8 object-cover rounded shadow-md border border-slate-200"
          />
          <h4 className="text-lg font-bold text-slate-800">{country.name}</h4>
        </div>

        {/* Facts list */}
        <div className="space-y-1.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-base">🏛️</span>
            <span className="font-medium">Capital:</span>
            <span>{country.capital}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">👥</span>
            <span className="font-medium">Population:</span>
            <span>{formatPopulation(country.population)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🕐</span>
            <span className="font-medium">Timezone:</span>
            <span>{country.timezone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
