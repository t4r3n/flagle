import { useTranslation } from 'react-i18next';
import type { Country } from '../types';
import { WorldMap } from './WorldMap';
import { useCountryName } from '../hooks/useCountryName';

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

function formatArea(area: number): string {
  return area.toLocaleString();
}

// World ranking by area (out of 191 countries)
const AREA_WORLD_RANK: Record<string, number> = {
  ru: 1, ca: 2, us: 3, cn: 4, br: 5, au: 6, in: 7, ar: 8, kz: 9, dz: 10,
  cd: 11, sa: 12, mx: 13, id: 14, sd: 15, ly: 16, ir: 17, mn: 18, pe: 19, td: 20,
  ne: 21, ao: 22, ml: 23, za: 24, co: 25, et: 26, bo: 27, mr: 28, eg: 29, tz: 30,
  ng: 31, ve: 32, pk: 33, na: 34, mz: 35, tr: 36, cl: 37, zm: 38, mm: 39, af: 40,
  ss: 41, fr: 42, so: 43, cf: 44, ua: 45, mg: 46, bw: 47, ke: 48, ye: 49, th: 50,
  es: 51, tm: 52, cm: 53, se: 54, uz: 55, ma: 56, iq: 57, py: 58, zw: 59, jp: 60,
  de: 61, cg: 62, fi: 63, vn: 64, my: 65, no: 66, ci: 67, pl: 68, om: 69, it: 70,
  ph: 71, ec: 72, bf: 73, nz: 74, ga: 75, gn: 76, gb: 77, ug: 78, gh: 79, ro: 80,
  la: 81, gy: 82, by: 83, kg: 84, sn: 85, sy: 86, kh: 87, uy: 88, sr: 89, tn: 90,
  bd: 91, np: 92, tj: 93, gr: 94, ni: 95, mw: 96, er: 97, bj: 98, hn: 99, lr: 100,
  bg: 101, cu: 102, gt: 103, is: 104, kr: 105, hu: 106, pt: 107, jo: 108, rs: 109, az: 110,
  at: 111, ae: 112, cz: 113, pa: 114, sl: 115, ie: 116, ge: 117, lk: 118, lt: 119, lv: 120,
  tg: 121, hr: 122, ba: 123, cr: 124, sk: 125, do: 126, ee: 127, dk: 128, nl: 129, ch: 130,
  bt: 131, tw: 132, gw: 133, md: 134, be: 135, ls: 136, am: 137, al: 138, gq: 139, bi: 140,
  ht: 141, rw: 142, mk: 143, dj: 144, bz: 145, sv: 146, il: 147, si: 148, fj: 149, kw: 150,
  sz: 151, bs: 152, me: 153, qa: 154, gm: 155, jm: 156, xk: 157, lb: 158, cy: 159, ps: 160,
  bn: 161, tt: 162, cv: 163, ws: 164, lu: 165, mu: 166, km: 167, hk: 168, st: 169, tc: 170,
  dm: 171, sg: 172, lc: 173, ad: 174, sc: 175, ag: 176, bb: 177, vc: 178, gd: 179, mt: 180,
  mv: 181, kn: 182, aw: 183, li: 184, ai: 185, sm: 186, bm: 187, mo: 188, tk: 189, mc: 190,
  va: 191,
};

export function CountryFactCard({ country, wasCorrect }: CountryFactCardProps) {
  const { t } = useTranslation();
  const { getCountryName } = useCountryName();
  const translatedName = getCountryName(country.code, country.name);

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
            countryCode={country.code}
          />
        </div>

        {/* Flag and Country name row */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={`/flags/${country.code}.svg`}
            alt={`${translatedName} flag`}
            className="w-12 h-8 object-cover rounded shadow-md border border-[#3a3a3c]"
          />
          <h4 className="text-lg font-bold text-[#d7dadc]">{translatedName}</h4>
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
            <span className="text-base">📐</span>
            <span className="font-medium text-[#d7dadc]">{t('facts.area')}:</span>
            <span>
              {formatArea(country.area)} {t('facts.areaUnit')}
              {AREA_WORLD_RANK[country.code] && (
                <span className="text-[#565758]"> ({t('facts.areaRank', { rank: AREA_WORLD_RANK[country.code] })})</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🕐</span>
            <span className="font-medium text-[#d7dadc]">{t('facts.timezone')}:</span>
            <span>{country.timezone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🗣️</span>
            <span className="font-medium text-[#d7dadc]">{t('facts.language')}:</span>
            <span>{country.language}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
