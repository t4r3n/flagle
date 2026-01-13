import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <div className="flex-shrink-0 w-full px-2">
      <div className="bg-[#121213] rounded-xl p-4 border border-[#3a3a3c]">
        {/* Result badge */}
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-3
            ${
              wasCorrect
                ? 'bg-[#538d4e] text-white'
                : 'bg-[#b91c1c] text-white'
            }`}
        >
          {wasCorrect ? `✓ ${t('facts.correct')}` : `✗ ${t('facts.missed')}`}
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
            className="w-12 h-8 object-cover rounded shadow-md border border-[#3a3a3c]"
          />
          <h4 className="text-lg font-bold text-[#d7dadc]">{country.name}</h4>
        </div>

        {/* Facts list */}
        <div className="space-y-1.5 text-sm text-[#818384]">
          <div className="flex items-center gap-2">
            <span className="text-base">🏛️</span>
            <span className="font-medium text-[#d7dadc]">{t('facts.capital')}:</span>
            <span>{country.capital}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">👥</span>
            <span className="font-medium text-[#d7dadc]">{t('facts.population')}:</span>
            <span>{formatPopulation(country.population)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🕐</span>
            <span className="font-medium text-[#d7dadc]">{t('facts.timezone')}:</span>
            <span>{country.timezone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
