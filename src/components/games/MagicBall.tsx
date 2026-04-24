import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';

type CupPosition = 0 | 1 | 2;

const MagicBall: React.FC = () => {
  const [shuffling, setShuffling] = useState(false);
  const [ballPosition, setBallPosition] = useState<CupPosition>(0);
  const [selectedCup, setSelectedCup] = useState<CupPosition | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [cups, setCups] = useState<CupPosition[]>([0, 1, 2]);
  const [history, setHistory] = useState<boolean[]>([]);

  const shuffle = () => {
    if (shuffling) return;
    setShuffling(true);
    setSelectedCup(null);
    setRevealed(false);

    const newBallPos = Math.floor(Math.random() * 3) as CupPosition;
    setBallPosition(newBallPos);

    let shuffleCount = 0;
    const maxShuffles = 8 + Math.floor(Math.random() * 5);

    const shuffleInterval = setInterval(() => {
      setCups(prev => {
        const newCups = [...prev];
        const idx1 = Math.floor(Math.random() * 3);
        let idx2 = Math.floor(Math.random() * 3);
        while (idx2 === idx1) idx2 = Math.floor(Math.random() * 3);
        [newCups[idx1], newCups[idx2]] = [newCups[idx2], newCups[idx1]];
        return newCups as CupPosition[];
      });

      shuffleCount++;
      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        setShuffling(false);
      }
    }, 300);
  };

  const selectCup = (index: number) => {
    if (shuffling || revealed) return;
    setSelectedCup(index as CupPosition);
    setRevealed(true);

    const guessedCorrectly = cups[index] === ballPosition;
    setHistory(prev => [guessedCorrectly, ...prev].slice(0, 10));
  };

  const getCupColor = (index: number) => {
    if (!revealed) return 'bg-gradient-to-b from-orange-600 to-orange-800';
    if (cups[index] === ballPosition) return 'bg-gradient-to-b from-green-500 to-green-700';
    return 'bg-gradient-to-b from-orange-600 to-orange-800';
  };

  const getCupTransform = (index: number) => {
    if (revealed && cups[index] === ballPosition) return 'translateY(-40px)';
    return 'translateY(0)';
  };

  const won = selectedCup !== null && revealed && cups[selectedCup] === ballPosition;

  return (
    <div className="bg-[#0a0b0f] rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Magic Ball</h2>

      <div className="bg-[#1a1d2e] rounded-lg p-8 mb-6">
        <div className="flex justify-center items-end gap-4 h-48 relative">
          <div
            className={`absolute bottom-4 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 transition-all duration-500 ${
              revealed ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              left: `calc(16.67% + ${ballPosition * 33.33}% - 12px)`,
              bottom: 'calc(40px + 80px)',
            }}
          />

          {cups.map((cupPos, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => selectCup(index)}
              animate={{ y: revealed && cupPos === ballPosition ? -40 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`w-24 h-20 rounded-t-full relative ${getCupColor(index)} border-2 border-orange-900 shadow-lg`}
                style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                  {String.fromCharCode(65 + index)}
                </div>
                {revealed && cupPos === ballPosition && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
                  />
                )}
              </div>
              <p className="text-gray-400 text-sm mt-2">Cup {String.fromCharCode(65 + index)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-6 p-4 rounded-lg ${
            won ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
          }`}
        >
          <p className="text-2xl font-bold mb-2">
            {won ? '🎉 CORRECT!' : '❌ WRONG!'}
          </p>
          <p className={`text-lg ${won ? 'text-green-500' : 'text-red-500'}`}>
            {won ? `You Won ${(betAmount * 2.9 - betAmount).toFixed(2)}!` : 'Ball was under Cup ' + String.fromCharCode(65 + cups.indexOf(ballPosition))}
          </p>
        </motion.div>
      )}

      <div className="bg-[#1a1d2e] rounded-lg p-4 mb-6">
        <label className="text-gray-400 text-sm block mb-2">Bet Amount</label>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#f97316]" />
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
            disabled={shuffling || (revealed && selectedCup !== null)}
            className="bg-[#0f1117] text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Payout: <span className="text-[#f97316] font-bold">2.9x</span> | Win: <span className="text-green-500 font-bold">{(betAmount * 2.9).toFixed(2)}</span>
        </p>
      </div>

      <button
        onClick={shuffle}
        disabled={shuffling}
        className="w-full bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
      >
        <Play className="w-5 h-5" />
        {shuffling ? 'Shuffling...' : revealed ? 'Play Again' : 'Start Shuffle'}
      </button>

      {history.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-400 text-sm mb-2">Recent Results:</p>
          <div className="flex gap-2 flex-wrap">
            {history.map((h, i) => (
              <span
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  h ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}
              >
                {h ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicBall;
