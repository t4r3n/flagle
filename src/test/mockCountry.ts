import type { Country } from '../types';

const defaultCountry: Country = {
  name: 'Unknown',
  code: 'xx',
  capital: 'Unknown',
  population: 0,
  area: 0,
  timezone: 'UTC',
  region: 'europe',
  language: 'Unknown',
  coordinates: { lat: 0, lng: 0 },
};

export function createMockCountry(overrides: Partial<Country> & { name: string; code: string }): Country {
  return { ...defaultCountry, ...overrides };
}
