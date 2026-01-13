import type { Country } from '../types';
import { useCountryName } from '../hooks/useCountryName';

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
  const { getCountryName } = useCountryName();
  const stateClasses: Record<ButtonState, string> = {
    default: `bg-[#3a3a3c] hover:bg-[#4a4a4c] hover:-translate-y-0.5`,
    correct: `bg-[#538d4e] animate-correct-pulse`,
    wrong: `bg-[#b91c1c] animate-shake`,
  };

  return (
    <button
      onClick={() => onClick(country)}
      disabled={disabled}
      className={`w-full min-h-[56px] p-4 text-base font-semibold text-white
                  rounded-xl transition-all duration-200 ease-out
                  active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  ${stateClasses[state]}`}
    >
      <span className="flex items-center justify-center gap-2">
        {getCountryName(country.code, country.name)}
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
