interface FlagDisplayProps {
  code: string;
  showCorrect?: boolean;
  showWrong?: boolean;
}

export function FlagDisplay({ code, showCorrect, showWrong }: FlagDisplayProps) {
  let animationClass = '';
  if (showCorrect) animationClass = 'animate-celebrate';
  if (showWrong) animationClass = 'animate-shake';

  return (
    <div className="flex justify-center">
      <div className={`relative ${animationClass}`}>
        {/* Flag container */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/40">
          <img
            src={`/flags/${code}.svg`}
            alt="Flag to guess"
            className="w-72 md:w-80 h-auto"
          />
        </div>

        {/* Success sparkle */}
        {showCorrect && (
          <div className="absolute -top-2 -right-2">
            <span className="text-3xl animate-ping">✨</span>
          </div>
        )}
      </div>
    </div>
  );
}
