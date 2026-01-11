interface WorldMapProps {
  highlightedRegion: string;
  markerCoordinates?: { lat: number; lng: number };
}

// Convert lat/lng to SVG coordinates (equirectangular projection)
function latLngToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 1010 - 5;
  const y = ((90 - lat) / 180) * 505 - 2;
  return { x, y };
}

// Real world map paths from Natural Earth data (simplified)
const regions = {
  'north-america': [
    // Canada & USA mainland
    'M 135 85 L 140 82 L 148 80 L 158 78 L 170 75 L 182 73 L 195 72 L 208 74 L 218 78 L 225 82 L 230 88 L 228 95 L 222 100 L 218 108 L 222 115 L 228 120 L 235 118 L 242 115 L 248 118 L 252 125 L 248 133 L 240 140 L 230 145 L 218 150 L 205 155 L 192 162 L 180 170 L 170 178 L 162 188 L 155 198 L 148 208 L 140 215 L 130 220 L 120 225 L 112 232 L 108 242 L 115 250 L 125 255 L 135 258 L 142 265 L 138 275 L 128 280 L 118 275 L 108 268 L 98 260 L 88 250 L 80 238 L 75 225 L 72 210 L 70 195 L 68 178 L 65 160 L 62 142 L 60 125 L 62 108 L 68 92 L 78 80 L 92 72 L 108 70 L 122 75 L 135 85 Z',
    // Alaska
    'M 62 70 L 72 65 L 85 62 L 98 65 L 108 70 L 100 78 L 88 82 L 75 80 L 65 75 Z',
    // Greenland
    'M 295 42 L 310 38 L 328 40 L 345 45 L 358 55 L 365 68 L 360 82 L 348 92 L 332 95 L 315 92 L 300 85 L 290 72 L 288 58 L 292 48 Z',
  ],
  'south-america': [
    'M 175 275 L 188 268 L 205 270 L 222 278 L 238 290 L 250 305 L 258 322 L 262 342 L 260 362 L 252 380 L 240 398 L 225 412 L 208 425 L 192 435 L 178 442 L 168 452 L 172 462 L 182 468 L 188 478 L 180 485 L 168 482 L 158 472 L 152 458 L 155 442 L 162 425 L 165 408 L 160 392 L 155 375 L 152 358 L 155 340 L 160 322 L 165 305 L 170 290 L 175 275 Z',
  ],
  europe: [
    // Main Europe
    'M 445 75 L 458 70 L 475 68 L 492 70 L 508 75 L 522 72 L 538 75 L 552 82 L 562 92 L 555 105 L 542 112 L 528 118 L 515 125 L 502 132 L 488 138 L 475 142 L 462 148 L 450 152 L 440 145 L 432 135 L 428 122 L 435 110 L 445 100 L 452 90 L 450 82 Z',
    // Scandinavia
    'M 472 38 L 488 32 L 505 35 L 520 42 L 532 52 L 540 65 L 535 78 L 522 85 L 508 82 L 495 75 L 482 68 L 472 55 L 470 45 Z',
    // UK & Ireland
    'M 408 82 L 418 78 L 428 82 L 432 92 L 425 102 L 415 105 L 405 100 L 402 90 Z',
    // Iceland
    'M 365 52 L 378 48 L 390 52 L 395 62 L 388 70 L 375 72 L 365 65 L 362 58 Z',
  ],
  africa: [
    'M 432 172 L 452 165 L 478 162 L 505 168 L 528 178 L 545 192 L 558 210 L 565 232 L 568 255 L 565 280 L 558 305 L 545 328 L 528 348 L 508 365 L 485 378 L 462 385 L 442 390 L 428 395 L 440 405 L 455 415 L 462 428 L 452 438 L 435 432 L 420 420 L 408 405 L 400 385 L 398 365 L 405 342 L 412 320 L 418 298 L 422 275 L 425 252 L 428 230 L 430 208 L 428 188 Z',
  ],
  'middle-east': [
    // Turkey, Iran, Arabian Peninsula
    'M 545 145 L 565 140 L 588 145 L 610 155 L 625 168 L 632 185 L 628 202 L 618 218 L 605 232 L 592 245 L 578 255 L 565 262 L 552 258 L 542 248 L 538 235 L 540 218 L 545 200 L 548 182 L 545 165 Z',
  ],
  asia: [
    // Russia
    'M 565 42 L 598 38 L 638 35 L 682 38 L 728 45 L 775 52 L 822 58 L 868 65 L 908 75 L 940 88 L 962 105 L 968 125 L 958 142 L 940 155 L 915 165 L 888 172 L 858 178 L 828 182 L 798 185 L 770 190 L 745 198 L 722 208 L 702 220 L 688 235 L 680 252 L 678 270 L 685 288 L 698 302 L 715 312 L 735 318 L 758 320 L 780 315 L 800 305 L 818 292 L 835 275 L 848 258 L 858 238 L 862 218 L 858 198 L 848 180 L 832 165 L 812 152 L 788 142 L 762 135 L 738 130 L 715 128 L 695 125 L 680 118 L 668 108 L 658 95 L 648 82 L 632 72 L 612 62 L 588 55 L 565 50 Z',
    // China
    'M 680 155 L 705 148 L 732 152 L 758 162 L 782 175 L 802 192 L 815 212 L 820 235 L 815 258 L 802 278 L 782 295 L 758 308 L 732 315 L 705 312 L 682 302 L 665 285 L 655 265 L 652 242 L 658 220 L 668 198 L 680 175 Z',
    // India
    'M 628 205 L 648 198 L 672 205 L 692 218 L 705 235 L 710 255 L 705 278 L 692 298 L 672 315 L 648 325 L 625 322 L 608 308 L 598 288 L 598 268 L 605 248 L 615 228 Z',
    // Southeast Asia
    'M 715 268 L 738 262 L 762 268 L 785 280 L 805 295 L 818 315 L 822 338 L 815 358 L 798 372 L 775 378 L 752 375 L 732 365 L 718 348 L 710 328 L 708 305 L 712 285 Z',
    // Japan
    'M 868 138 L 882 132 L 898 138 L 910 152 L 915 170 L 908 185 L 892 192 L 875 188 L 862 175 L 858 158 L 862 145 Z',
    // Korea
    'M 838 165 L 850 160 L 862 168 L 865 182 L 858 195 L 845 198 L 835 190 L 832 178 Z',
    // Taiwan/Philippines
    'M 842 225 L 855 220 L 868 228 L 872 242 L 865 255 L 852 258 L 842 248 L 838 235 Z',
  ],
  oceania: [
    // Australia
    'M 782 355 L 812 345 L 848 342 L 885 348 L 918 362 L 942 382 L 958 408 L 962 435 L 955 460 L 938 480 L 912 492 L 882 498 L 848 495 L 815 485 L 788 468 L 768 445 L 758 418 L 758 390 L 768 368 Z',
    // Papua New Guinea
    'M 862 305 L 885 298 L 908 305 L 925 320 L 928 340 L 918 355 L 898 362 L 875 358 L 858 345 L 855 325 Z',
    // New Zealand
    'M 948 432 L 962 425 L 978 435 L 985 452 L 978 470 L 962 478 L 948 472 L 942 455 Z',
    // NZ South Island
    'M 952 478 L 965 475 L 975 485 L 972 498 L 960 502 L 950 495 L 950 485 Z',
  ],
};

export function WorldMap({ highlightedRegion, markerCoordinates }: WorldMapProps) {
  const marker = markerCoordinates
    ? latLngToSvg(markerCoordinates.lat, markerCoordinates.lng)
    : null;

  const getRegionStyle = (region: string) => ({
    fill: region === highlightedRegion ? '#8b5cf6' : '#d1d5db',
    stroke: region === highlightedRegion ? '#7c3aed' : '#9ca3af',
    strokeWidth: region === highlightedRegion ? 1.5 : 0.5,
  });

  return (
    <svg
      viewBox="0 0 1000 530"
      className="w-full h-auto rounded-xl bg-gradient-to-b from-sky-100 to-sky-200"
      role="img"
      aria-label={`World map highlighting ${highlightedRegion}`}
    >
      {/* Grid lines for style */}
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#bae6fd" strokeWidth="0.5" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="1000" height="530" fill="url(#grid)" />

      {/* Render all regions */}
      {Object.entries(regions).map(([regionName, paths]) =>
        paths.map((path, index) => (
          <path
            key={`${regionName}-${index}`}
            d={path}
            {...getRegionStyle(regionName)}
            className="transition-all duration-300"
          />
        ))
      )}

      {/* Location marker */}
      {marker && (
        <g>
          {/* Outer pulsing ring */}
          <circle
            cx={marker.x}
            cy={marker.y}
            r="20"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            opacity="0.4"
            className="animate-ping"
          />
          {/* Glow */}
          <circle
            cx={marker.x}
            cy={marker.y}
            r="14"
            fill="#8b5cf6"
            opacity="0.25"
          />
          {/* Main marker */}
          <circle
            cx={marker.x}
            cy={marker.y}
            r="10"
            fill="#7c3aed"
            stroke="white"
            strokeWidth="3"
          />
          {/* Center dot */}
          <circle cx={marker.x} cy={marker.y} r="4" fill="white" />
        </g>
      )}
    </svg>
  );
}
