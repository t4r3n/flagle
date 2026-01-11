import type { RoundResult } from '../types';

interface ResultTicksProps {
  results: RoundResult[];
  currentRound?: number;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export function ResultTicks({ results, currentRound }: ResultTicksProps) {
  return (
    <div className="flex justify-center gap-3">
      {[0, 1, 2, 3, 4].map((index) => {
        const result = results[index];
        const isCurrent = index === currentRound && !result;

        let containerClasses =
          'w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 transform';

        if (result) {
          containerClasses += result.correct
            ? ' bg-emerald-100 border-2 border-emerald-400 animate-pop-in'
            : ' bg-rose-100 border-2 border-rose-400 animate-pop-in';
        } else if (isCurrent) {
          containerClasses += ' bg-violet-50 border-2 border-violet-300 animate-pulse-ring';
        } else {
          containerClasses += ' bg-slate-100 border-2 border-slate-200';
        }

        return (
          <div key={index} data-testid={`tick-slot-${index}`} className={containerClasses}>
            {result &&
              (result.correct ? (
                <CheckIcon className="w-6 h-6 text-emerald-600 animate-scale-in" />
              ) : (
                <XIcon className="w-6 h-6 text-rose-600 animate-scale-in" />
              ))}
          </div>
        );
      })}
    </div>
  );
}
