import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';

type BetType = 'over' | 'under';

const DiceRoll: React.FC = () => {
  const [prediction, setPrediction] = useState(50);
  const [betType, setBetType] = useState<BetType>('over');
  const [betAmount, setBetAmount] = useState(10);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [displayNumber, setDisplayNumber] = useState(1);
  const [history, setHistory] = useState<number[]>([]);
  const [winCount, setWinCount] = useState(0);

  const calculateMultiplier = (pred: number, type: BetType): number => {
    const winChance = type === 'over' ? (100 - pred) : pred;
    return Math.floor((100 / winChance) * 0.99 * 100) / 100;
  };

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    setResult(null);

    let count = 0;
    const interval = setInterval(() => {
      setDisplayNumber(Math.floor(Math.random() * 99) + 1);
      count++;
      if (count > 20) {
        clearInterval(interval);
        const finalResult = Math.floor(Math.random() * 99) + 1;
        setDisplayNumber(finalResult);
        setResult(finalResult);
        setRolling(false);
        setHistory(prev => [finalResult, ...prev].slice(0, 10));

        const won = betType === 'over' ? finalResult > prediction : finalResult < prediction;
        if (won) setWinCount(prev => prev + 1);
      }
    }, 50);
  };

  const multiplier = calculateMultiplier(prediction, betType);
  const potentialWin = betAmount * multiplier;
  const won = result !== null && (betType === 'over' ? result > prediction : result < prediction);

  return (
    <div className="bg-[#0a0b0f] rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Dice Roll</h2>

      <div className="bg-[#1a1d2e] rounded-lg p-8 mb-6 text-center">
        <div className="relative inline-block">
          <div
            className={`w-32 h-32 mx-auto bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center border-4 ${
              rolling ? 'border-[#f97316] animate-pulse' : won ? 'border-green-500' : result !== null ? 'border-red-500' : 'border-gray-600'
            }`}
          >
            <span className={`text-6xl font-bold ${rolling ? 'text-[#f97316]' : won ? 'text-green-500' : result !== null ? 'text-red-500' : 'text-white'}`}>
              {displayNumber}
            </span>
          </div>
        </div>
        {result !== null && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-xl font-bold ${won ? 'text-green-500' : 'text-red-500'}`}
          >
            {won ? `Won ${(betAmount * (multiplier - 1)).toFixed(2)}!` : 'Lost!'}
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setBetType('over')}
          disabled={rolling}
          className={`p-4 rounded-lg font-bold transition-all ${
            betType === 'over'
              ? 'bg-green-600 text-white'
              : 'bg-[#1a1d2e] text-gray-400 hover:bg-[#252840]'
          }`}
        >
          OVER
        </button>
        <button
          onClick={() => setBetType('under')}
          disabled={rolling}
          className={`p-4 rounded-lg font-bold transition-all ${
            betType === 'under'
              ? 'bg-red-600 text-white'
              : 'bg-[#1a1d2e] text-gray-400 hover:bg-[#252840]'
          }`}
        >
          UNDER
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Prediction: {prediction}</span>
          <span>Multiplier: {multiplier.toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min="1"
          max="99"
          value={prediction}
          onChange={(e) => setPrediction(Number(e.target.value))}
          disabled={rolling}
          className="w-full h-2 bg-[#1a1d2e] rounded-lg appearance-none cursor-pointer accent-[#f97316]"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>1</span>
          <span>50</span>
          <span>99</span>
        </div>
      </div>

      <div className="bg-[#1a1d2e] rounded-lg p-4 mb-6">
        <label className="text-gray-400 text-sm block mb-2">Bet Amount</label>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#f97316]" />
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
            disabled={rolling}
            className="bg-[#0f1117] text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Potential Win: <span className="text-[#f97316] font-bold">{potentialWin.toFixed(2)}</span>
        </p>
      </div>

      <button
        onClick={rollDice}
        disabled={rolling}
        className="w-full bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
      >
        <Play className="w-5 h-5" />
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>

      {history.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-400 text-sm mb-2">Recent Rolls:</p>
          <div className="flex gap-2 flex-wrap">
            {history.map((h, i) => (
              <span
                key={i}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  h > 50 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRoll;
