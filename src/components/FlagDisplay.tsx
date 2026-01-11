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
      <div className={`relative group ${animationClass}`}>
        {/* Decorative background glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />

        {/* Flag container */}
        <div className="relative bg-white p-3 rounded-2xl shadow-2xl shadow-violet-500/20 transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
          <img
            src={`/flags/${code}.svg`}
            alt="Flag to guess"
            className="w-72 md:w-80 h-auto rounded-xl"
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
