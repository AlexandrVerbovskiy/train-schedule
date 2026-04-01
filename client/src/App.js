import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Train Schedule
        </h1>
        
        <div className="space-y-4">
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.98]">
            Search Trains
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
