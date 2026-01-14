import { useState, useRef } from 'react';
import type { TouchEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Country, RoundResult } from '../types';
import { CountryFactCard } from './CountryFactCard';

interface FactCarouselProps {
  countries: Country[];
  results: RoundResult[];
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function FactCarousel({ countries, results }: FactCarouselProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIndex < countries.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const goToPrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (activeIndex < countries.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  if (countries.length === 0) return null;

  return (
    <div className="relative">
      {/* Carousel container */}
      <div
        className="overflow-hidden rounded-xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {countries.map((country, index) => (
            <CountryFactCard
              key={country.code}
              country={country}
              wasCorrect={results[index]?.correct ?? false}
            />
          ))}
        </div>
      </div>

      {/* Navigation arrows (desktop) */}
      <button
        onClick={goToPrevious}
        disabled={activeIndex === 0}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
                    w-10 h-10 bg-[#3a3a3c] rounded-full
                    hidden md:flex items-center justify-center
                    transition-all duration-200
                    ${
                      activeIndex === 0
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-[#4a4a4c] hover:scale-110'
                    }`}
        aria-label="Previous country"
      >
        <ChevronLeftIcon className="w-6 h-6 text-[#d7dadc]" />
      </button>

      <button
        onClick={goToNext}
        disabled={activeIndex === countries.length - 1}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                    w-10 h-10 bg-[#3a3a3c] rounded-full
                    hidden md:flex items-center justify-center
                    transition-all duration-200
                    ${
                      activeIndex === countries.length - 1
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-[#4a4a4c] hover:scale-110'
                    }`}
        aria-label="Next country"
      >
        <ChevronRightIcon className="w-6 h-6 text-[#d7dadc]" />
      </button>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-4">
        {countries.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200
              ${
                index === activeIndex
                  ? 'bg-[#d7dadc] scale-125'
                  : 'bg-[#3a3a3c] hover:bg-[#565758]'
              }`}
            aria-label={`Go to country ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe hint (mobile) */}
      <p className="text-center text-xs text-[#565758] mt-2 md:hidden">
        {t('facts.swipeHint')}
      </p>
    </div>
  );
}
