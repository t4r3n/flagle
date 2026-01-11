import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';

interface WorldMapProps {
  highlightedCountry?: string;
  markerCoordinates?: { lat: number; lng: number };
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export function WorldMap({ highlightedCountry, markerCoordinates }: WorldMapProps) {
  return (
    <div className="w-full rounded-xl bg-gradient-to-b from-sky-100 to-sky-200 overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 30],
        }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup zoom={1} center={[0, 30]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHighlighted =
                  highlightedCountry &&
                  geo.properties.name
                    ?.toLowerCase()
                    .includes(highlightedCountry.toLowerCase());

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHighlighted ? '#8b5cf6' : '#d1d5db'}
                    stroke={isHighlighted ? '#7c3aed' : '#9ca3af'}
                    strokeWidth={isHighlighted ? 1.5 : 0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {markerCoordinates && (
            <Marker coordinates={[markerCoordinates.lng, markerCoordinates.lat]}>
              <circle r={6} fill="#7c3aed" stroke="#fff" strokeWidth={2} />
              <circle r={3} fill="#fff" />
              <circle r={12} fill="#8b5cf6" opacity={0.3}>
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
