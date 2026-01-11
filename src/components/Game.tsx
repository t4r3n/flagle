import { useGame } from '../hooks/useGame';
import { FlagDisplay } from './FlagDisplay';
import { OptionsGrid } from './OptionsGrid';
import { ResultTicks } from './ResultTicks';
import { GameOver } from './GameOver';

export function Game() {
  const {
    currentRound,
    currentRoundData,
    results,
    isGameOver,
    selectAnswer,
    todayDate,
    selectedAnswer,
    showingFeedback,
    lastAnswerCorrect,
  } = useGame();

  if (isGameOver) {
    return <GameOver results={results} date={todayDate} />;
  }

  if (!currentRoundData) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-violet-500/10 p-6 md:p-8 flex flex-col gap-6 border border-white/50 animate-fade-in">
      {/* Progress indicator */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300
                ${
                  index < currentRound
                    ? 'bg-violet-500 scale-100'
                    : index === currentRound
                      ? 'bg-violet-500 scale-125 animate-pulse'
                      : 'bg-slate-200'
                }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-slate-500">
          Round {currentRound + 1} of 5
        </span>
      </div>

      <ResultTicks results={results} currentRound={currentRound} />

      <div key={currentRoundData.country.code} className="animate-slide-up">
        <FlagDisplay
          code={currentRoundData.country.code}
          showCorrect={lastAnswerCorrect === true}
          showWrong={lastAnswerCorrect === false}
        />
      </div>

      <p className="text-center text-lg font-medium text-slate-600">
        Which country does this flag belong to?
      </p>

      <OptionsGrid
        options={currentRoundData.options}
        onSelect={selectAnswer}
        disabled={showingFeedback}
        selectedCode={selectedAnswer?.code}
        correctCode={showingFeedback ? currentRoundData.country.code : undefined}
      />
    </div>
  );
}
