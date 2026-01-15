import { useTranslation } from 'react-i18next';
import { Game } from './components/Game';
import { LanguageToggle } from './components/LanguageToggle';

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#121213] flex flex-col items-center justify-center p-4">
      {/* Fixed language toggle in top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-3xl">
        <header className="text-center py-4 border-b border-[#3a3a3c] mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-white uppercase flex items-center justify-center gap-3">
            <img src="/favicon.svg" alt="" className="w-10 h-10 md:w-12 md:h-12 inline-block animate-bounce-subtle" />
            {t('gameName')}
          </h1>
        </header>
        <Game />
      </div>
    </div>
  );
}

export default App;
