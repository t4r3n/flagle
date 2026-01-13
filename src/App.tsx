import { useTranslation } from 'react-i18next';
import { Game } from './components/Game';
import { LanguageToggle } from './components/LanguageToggle';

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#121213] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <header className="text-center py-4 border-b border-[#3a3a3c] mb-6 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <LanguageToggle />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-white uppercase">
            <span className="inline-block animate-bounce-subtle">🏴</span> {t('gameName')}
          </h1>
        </header>
        <Game />
      </div>
    </div>
  );
}

export default App;
