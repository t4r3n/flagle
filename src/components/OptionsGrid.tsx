import type { Country } from '../types';
import { OptionButton, type ButtonState } from './OptionButton';

interface OptionsGridProps {
  options: Country[];
  onSelect: (country: Country) => void;
  disabled?: boolean;
  selectedCode?: string;
  correctCode?: string;
}

export function OptionsGrid({
  options,
  onSelect,
  disabled,
  selectedCode,
  correctCode,
}: OptionsGridProps) {
  const getButtonState = (country: Country): ButtonState => {
    if (!selectedCode) return 'default';
    if (country.code === correctCode) return 'correct';
    if (country.code === selectedCode) return 'wrong';
    return 'default';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      {options.map((country, index) => (
        <div
          key={country.code}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 75}ms` }}
        >
          <OptionButton
            country={country}
            onClick={onSelect}
            disabled={disabled}
            state={getButtonState(country)}
          />
        </div>
      ))}
    </div>
  );
}
