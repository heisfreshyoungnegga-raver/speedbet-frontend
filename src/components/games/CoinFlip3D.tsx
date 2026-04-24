import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Trophy } from 'lucide-react';

type CoinSide = 'heads' | 'tails';

const CoinFlip3D: React.FC = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<CoinSide | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [betAmount, setBetAmount] = useState(10);
  const [selectedSide, setSelectedSide] = useState<CoinSide>('heads');
  const [history, setHistory] = useState<CoinSide[]>([]);

  const flipCoin = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    const newResult: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails';
    const flips = 5 + Math.floor(Math.random() * 3);
    const endRotationX = flips * 1800 + (newResult === 'tails' ? 180 : 0);

    setRotation({ x: endRotationX, y: rotation.y + 360 });

    setTimeout(() => {
      setResult(newResult);
      setIsFlipping(false);
      setHistory(prev => [newResult, ...prev].slice(0, 10));
    }, 2000);
  };

  const getPayout = () => {
    if (!result) return 0;
    return result === selectedSide ? betAmount * 1.95 : 0;
  };

  return (
    <div className="bg-[#0a0b0f] rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Flip the Coin</h2>

      <div className="perspective-1000 mb-8">
        <div className="flex justify-center items-center h-64">
          <div
            className="relative w-48 h-48"
            style={{ perspective: '1000px' }}
          >
            <div
              className="w-full h-full relative"
              style={{
                transformStyle: 'preserve-3d',
                transition: isFlipping ? 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center text-4xl font-bold"
                style={{
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#000',
                }}
              >
                <div className="text-center">
                  <p className="text-6xl mb-2">👑</p>
                  <p className="text-lg">HEADS</p>
                </div>
              </div>
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center text-4xl font-bold"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                }}
              >
                <div className="text-center">
                  <p className="text-6xl mb-2">🎯</p>
                  <p className="text-lg">TAILS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-6 p-4 rounded-lg ${
            result === selectedSide
              ? 'bg-green-500/20 border border-green-500'
              : 'bg-red-500/20 border border-red-500'
          }`}
        >
          <p className="text-2xl font-bold mb-2">
            {result === 'heads' ? '👑 HEADS' : '🎯 TAILS'}
          </p>
          <p className={`text-lg ${result === selectedSide ? 'text-green-500' : 'text-red-500'}`}>
            {result === selectedSide ? `You Won ${(betAmount * 0.95).toFixed(2)}!` : 'You Lost!'}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setSelectedSide('heads')}
          disabled={isFlipping}
          className={`p-4 rounded-lg font-bold transition-all ${
            selectedSide === 'heads'
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black'
              : 'bg-[#1a1d2e] text-gray-400 hover:bg-[#252840]'
          }`}
        >
          <p className="text-3xl mb-1">👑</p>
          Heads (1.95x)
        </button>
        <button
          onClick={() => setSelectedSide('tails')}
          disabled={isFlipping}
          className={`p-4 rounded-lg font-bold transition-all ${
            selectedSide === 'tails'
              ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
              : 'bg-[#1a1d2e] text-gray-400 hover:bg-[#252840]'
          }`}
        >
          <p className="text-3xl mb-1">🎯</p>
          Tails (1.95x)
        </button>
      </div>

      <div className="bg-[#1a1d2e] rounded-lg p-4 mb-6">
        <label className="text-gray-400 text-sm block mb-2">Bet Amount</label>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#f97316]" />
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
            disabled={isFlipping}
            className="bg-[#0f1117] text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
      </div>

      <button
        onClick={flipCoin}
        disabled={isFlipping}
        className="w-full bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
      >
        <RotateCw className={`w-5 h-5 ${isFlipping ? 'animate-spin' : ''}`} />
        {isFlipping ? 'Flipping...' : 'Flip Coin'}
      </button>

      {history.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-400 text-sm mb-2">Recent Results:</p>
          <div className="flex gap-2 flex-wrap">
            {history.map((h, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  h === 'heads'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-green-500/20 text-green-500'
                }`}
              >
                {h === 'heads' ? 'H' : 'T'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinFlip3D;
