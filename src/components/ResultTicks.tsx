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
    <div className="flex justify-center gap-2">
      {[0, 1, 2, 3, 4].map((index) => {
        const result = results[index];
        const isCurrent = index === currentRound && !result;

        let containerClasses =
          'w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300';

        if (result) {
          containerClasses += result.correct
            ? ' bg-[#538d4e] animate-pop-in'
            : ' bg-[#b91c1c] animate-pop-in';
        } else if (isCurrent) {
          containerClasses += ' bg-transparent border-2 border-[#565758] animate-pulse-ring';
        } else {
          containerClasses += ' bg-[#3a3a3c]';
        }

        return (
          <div key={index} data-testid={`tick-slot-${index}`} className={containerClasses}>
            {result ? (
              result.correct ? (
                <CheckIcon className="w-5 h-5 text-white animate-scale-in" />
              ) : (
                <XIcon className="w-5 h-5 text-white animate-scale-in" />
              )
            ) : (
              <span className="text-white font-bold text-sm">
                {isCurrent ? index + 1 : ''}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
