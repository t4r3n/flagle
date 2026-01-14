import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Country, RoundResult } from '../types';
import { ResultTicks } from './ResultTicks';
import { FactCarousel } from './FactCarousel';
import countriesData from '../data/countries.json';

interface GameOverProps {
  results: RoundResult[];
  date: string;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );
}

// Pre-computed confetti pieces with deterministic pseudo-random positions
const CONFETTI_COLORS = ['#538d4e', '#b91c1c', '#d7dadc', '#3a3a3c'] as const;
const CONFETTI_PIECES = [...Array(50)].map((_, i) => ({
  id: i,
  // Deterministic distribution using golden ratio for visual variety
  left: ((i * 61.8) % 100),
  delay: (i * 0.04) % 2,
  duration: 2 + ((i * 0.07) % 2),
  color: CONFETTI_COLORS[i % 4],
}));

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {CONFETTI_PIECES.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-sm animate-confetti"
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function GameOver({ results, date }: GameOverProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const score = results.filter((r) => r.correct).length;

  // Get full country data for the carousel
  const playedCountries = results
    .map((r) => (countriesData as Country[]).find((c) => c.code === r.country.code))
    .filter((c): c is Country => c !== undefined);

  const getMessage = () => {
    if (score === 5) return t('messages.perfect');
    if (score === 4) return t('messages.amazing');
    if (score === 3) return t('messages.good');
    if (score === 2) return t('messages.notBad');
    return t('messages.betterLuck');
  };

  const generateShareText = () => {
    const emojis = results.map((r) => (r.correct ? '✅' : '❌')).join('');
    return t('share.text', { date, emojis, score });
  };

  const handleShare = async () => {
    const shareText = generateShareText();

    // Try Web Share API first (works well on mobile/iOS)
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to clipboard
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fall back to clipboard API
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Final fallback: use legacy execCommand
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy:', fallbackErr);
      }
    }
  };

  return (
    <div className="bg-[#1a1a1b] rounded-2xl border border-[#3a3a3c] p-8 flex flex-col items-center gap-6 animate-fade-in">
      {/* Confetti for perfect score */}
      {score === 5 && <Confetti />}

      <h2 className="text-3xl md:text-4xl font-extrabold text-white animate-bounce-in">
        {t('game.gameOver')}
      </h2>

      {/* Animated score */}
      <div className="relative">
        <div className="text-7xl md:text-8xl font-black text-[#538d4e] animate-count-up">
          {score}/5
        </div>
        {score >= 4 && (
          <div className="absolute -top-4 -right-4 text-4xl animate-wiggle">
            {score === 5 ? '👑' : '⭐'}
          </div>
        )}
      </div>

      {/* Personalized message */}
      <p className="text-lg font-medium text-[#818384] text-center animate-fade-in-delay">
        {getMessage()}
      </p>

      <ResultTicks results={results} />

      {/* Share button */}
      <button
        onClick={handleShare}
        className={`flex items-center gap-3 px-8 py-4 text-white font-bold text-lg rounded-full transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95
          ${
            copied
              ? 'bg-[#538d4e]'
              : 'bg-[#538d4e] hover:bg-[#5a9a54]'
          }`}
      >
        {copied ? (
          <>
            <CheckIcon className="w-6 h-6" />
            {t('game.copied')}
          </>
        ) : (
          <>
            <ShareIcon className="w-6 h-6" />
            {t('game.shareResult')}
          </>
        )}
      </button>

      <p className="text-[#565758] text-center max-w-xs">
        {t('game.comeBackTomorrow')}
        <span className="inline-block ml-1 animate-bounce">🌍</span>
      </p>

      {/* Did you know? section */}
      {playedCountries.length > 0 && (
        <div className="w-full mt-2">
          <h3 className="text-lg font-bold text-[#d7dadc] text-center mb-3">
            {t('facts.didYouKnow')}
          </h3>
          <FactCarousel countries={playedCountries} results={results} />
        </div>
      )}
    </div>
  );
}
