import { useMemo, useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import topologyData from 'world-atlas/countries-110m.json';

// Type assertion for the topology data
const topology = topologyData as Parameters<typeof Geographies>[0]['geography'];

// Color constants
const COLORS = {
  highlighted: {
    fill: '#86efac',
    stroke: '#22c55e',
  },
  default: {
    fill: '#d1d5db',
    stroke: '#9ca3af',
  },
  marker: {
    primary: '#538d4e',
    secondary: '#5a9a54',
    white: '#fff',
  },
} as const;

// Map projection settings
const PROJECTION_CONFIG = {
  scale: 120,
  center: [0, 30] as [number, number],
};

interface WorldMapProps {
  highlightedCountry?: string;
  markerCoordinates?: { lat: number; lng: number };
}

interface GeoProperties {
  name: string;
}

// Country name mappings for GeoJSON variations
const COUNTRY_NAME_MAP: Record<string, string[]> = {
  'United States': ['United States of America', 'USA'],
  'United Kingdom': ['UK', 'Great Britain'],
  'Czech Republic': ['Czechia'],
  'South Korea': ['Korea', 'Republic of Korea'],
  'North Korea': ["Dem. Rep. Korea", "Democratic People's Republic of Korea"],
  'Russia': ['Russian Federation'],
  'Vietnam': ['Viet Nam'],
  'Democratic Republic of the Congo': ['Dem. Rep. Congo', 'DRC'],
  'Republic of the Congo': ['Congo'],
  'Ivory Coast': ["Côte d'Ivoire"],
  'Dominican Republic': ['Dominican Rep.'],
};

function normalizeCountryName(name: string): string {
  return name.toLowerCase().trim();
}

function countryNamesMatch(geoName: string, targetName: string): boolean {
  const normalizedGeo = normalizeCountryName(geoName);
  const normalizedTarget = normalizeCountryName(targetName);

  // Exact match
  if (normalizedGeo === normalizedTarget) {
    return true;
  }

  // Check if target has aliases that match
  const aliases = COUNTRY_NAME_MAP[targetName] || [];
  for (const alias of aliases) {
    if (normalizeCountryName(alias) === normalizedGeo) {
      return true;
    }
  }

  // Check if geo name is an alias for the target
  for (const [canonical, aliasList] of Object.entries(COUNTRY_NAME_MAP)) {
    if (normalizeCountryName(canonical) === normalizedTarget) {
      for (const alias of aliasList) {
        if (normalizeCountryName(alias) === normalizedGeo) {
          return true;
        }
      }
    }
  }

  return false;
}

export function WorldMap({ highlightedCountry, markerCoordinates }: WorldMapProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Trigger zoom animation after 1 second
  useEffect(() => {
    if (markerCoordinates) {
      const timer = setTimeout(() => {
        setIsZoomed(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [markerCoordinates]);

  const geographyStyles = useMemo(
    () => ({
      default: { outline: 'none' },
      hover: { outline: 'none' },
      pressed: { outline: 'none' },
    }),
    []
  );

  // Calculate zoom target
  const zoomLevel = isZoomed ? 4 : 1;
  const center: [number, number] = isZoomed && markerCoordinates
    ? [markerCoordinates.lng, markerCoordinates.lat]
    : PROJECTION_CONFIG.center;

  return (
    <div
      className="w-full rounded-xl bg-gradient-to-b from-sky-100 to-sky-200 overflow-hidden"
      role="img"
      aria-label={
        highlightedCountry
          ? `World map highlighting ${highlightedCountry}`
          : 'World map'
      }
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={PROJECTION_CONFIG}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup
          zoom={zoomLevel}
          center={center}
          filterZoomEvent={() => false}
          style={{
            transition: 'transform 1s ease-in-out',
          }}
        >
          <Geographies geography={topology}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoProps = geo.properties as GeoProperties;
                const isHighlighted =
                  highlightedCountry &&
                  geoProps.name &&
                  countryNamesMatch(geoProps.name, highlightedCountry);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHighlighted ? COLORS.highlighted.fill : COLORS.default.fill}
                    stroke={isHighlighted ? COLORS.highlighted.stroke : COLORS.default.stroke}
                    strokeWidth={isHighlighted ? 1.5 : 0.5}
                    style={geographyStyles}
                  />
                );
              })
            }
          </Geographies>

          {markerCoordinates && (
            <Marker coordinates={[markerCoordinates.lng, markerCoordinates.lat]}>
              <circle r={6} fill={COLORS.marker.primary} stroke={COLORS.marker.white} strokeWidth={2} />
              <circle r={3} fill={COLORS.marker.white} />
              <circle r={12} fill={COLORS.marker.secondary} opacity={0.3}>
                <animate
                  attributeName="r"
                  from="6"
                  to="18"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.4"
                  to="0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
