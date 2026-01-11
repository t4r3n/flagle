import { Game } from './components/Game';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-amber-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-violet-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-fuchsia-200/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-amber-200/30 rounded-full blur-2xl" />

      <div className="w-full max-w-xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-center my-8 py-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
          <span className="inline-block animate-bounce-subtle">🏴</span> Flag Game
        </h1>
        <Game />
      </div>
    </div>
  );
}

export default App;
