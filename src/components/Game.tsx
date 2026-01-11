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
    <div className="bg-[#1a1a1b] rounded-2xl border border-[#3a3a3c] p-6 md:p-8 flex flex-col gap-6 animate-fade-in">
      <ResultTicks results={results} currentRound={currentRound} />

      <div key={currentRoundData.country.code} className="animate-slide-up">
        <FlagDisplay
          code={currentRoundData.country.code}
          showCorrect={lastAnswerCorrect === true}
          showWrong={lastAnswerCorrect === false}
        />
      </div>

      {/* Round indicator */}
      <p className="text-center text-sm font-medium text-[#565758]">
        Round {currentRound + 1} of 5
      </p>

      <OptionsGrid
        options={currentRoundData.options}
        onSelect={selectAnswer}
        disabled={showingFeedback}
        selectedCode={selectedAnswer?.code}
        correctCode={showingFeedback ? currentRoundData.country.code : undefined}
      />

      <p className="text-center text-[#565758] text-sm">
        Select the country this flag belongs to
      </p>
    </div>
  );
}
