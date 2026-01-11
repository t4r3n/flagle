import type { Country } from '../types';

export type ButtonState = 'default' | 'correct' | 'wrong';

interface OptionButtonProps {
  country: Country;
  onClick: (country: Country) => void;
  disabled?: boolean;
  state?: ButtonState;
}

export function OptionButton({
  country,
  onClick,
  disabled,
  state = 'default',
}: OptionButtonProps) {
  const stateClasses: Record<ButtonState, string> = {
    default: `bg-white border-slate-200 hover:border-violet-400 hover:bg-violet-50
              hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1`,
    correct: `bg-emerald-50 border-emerald-400 text-emerald-700 animate-correct-pulse`,
    wrong: `bg-rose-50 border-rose-400 text-rose-700 animate-shake`,
  };

  return (
    <button
      onClick={() => onClick(country)}
      disabled={disabled}
      className={`w-full min-h-[60px] p-4 md:p-5 text-base md:text-lg font-semibold
                  border-2 rounded-2xl transition-all duration-200 ease-out
                  active:scale-95 active:translate-y-0
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
                  ${stateClasses[state]}
                  group relative overflow-hidden`}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />

      {/* Button content */}
      <span className="relative flex items-center justify-center gap-2">
        {country.name}
        {state === 'correct' && (
          <svg
            className="w-5 h-5 animate-scale-in"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {state === 'wrong' && (
          <svg
            className="w-5 h-5 animate-scale-in"
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
        )}
      </span>
    </button>
  );
}
