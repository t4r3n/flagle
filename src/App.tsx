import { Game } from './components/Game';

function App() {
  return (
    <div className="min-h-screen bg-[#121213] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <header className="text-center py-4 border-b border-[#3a3a3c] mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-white uppercase">
            <span className="inline-block animate-bounce-subtle">🏴</span> Flagle
          </h1>
        </header>
        <Game />
      </div>
    </div>
  );
}

export default App;
