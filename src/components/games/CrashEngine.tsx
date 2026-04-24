import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, DollarSign } from 'lucide-react';
import { CrashGameState, calculateMultiplier, shouldCrash, formatMultiplier, createInitialGameState } from '../../utils/crash-math';

interface CrashEngineProps {
  serverSeed?: string;
  clientSeed?: string;
  nonce?: number;
}

const CrashEngine: React.FC<CrashEngineProps> = ({
  serverSeed = 'demo-server-seed',
  clientSeed = 'demo-client-seed',
  nonce = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<CrashGameState>(createInitialGameState());
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [crashPoint] = useState(() => {
    let hash = 0;
    const combined = `${serverSeed}-${clientSeed}-${nonce}`;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const r = (Math.abs(hash) % 1000000) / 1000000;
    return 1 / (1 - r * 0.99);
  });

  const animationRef = useRef<number>();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const elapsed = Date.now() - gameState.startTime;
    const multiplier = calculateMultiplier(elapsed, crashPoint);
    const crashed = shouldCrash(multiplier, crashPoint);

    if (crashed && !gameState.crashed) {
      setGameState(prev => ({ ...prev, crashed: true, crashedAt: multiplier }));
    }

    if (!gameState.crashed && !gameState.cashedOut) {
      setGameState(prev => ({ ...prev, multiplier }));
    }

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a1d2e');
    gradient.addColorStop(1, '#0f1117');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const gridSpacing = 40;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const progress = Math.min(elapsed / 10000, 1);
    const lineEndX = progress * width;
    const lineEndY = height - (multiplier - 1) * 30;

    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(lineEndX, lineEndY);
    ctx.strokeStyle = crashed ? '#ef4444' : '#22c55e';
    ctx.lineWidth = 3;
    ctx.shadowColor = crashed ? '#ef4444' : '#22c55e';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const displayMultiplier = gameState.crashed ? gameState.crashedAt || 1 : multiplier;
    ctx.font = 'bold 48px sans-serif';
    ctx.fillStyle = gameState.crashed ? '#ef4444' : '#22c55e';
    ctx.textAlign = 'center';
    ctx.fillText(
      gameState.crashed ? 'CRASHED' : formatMultiplier(displayMultiplier),
      width / 2,
      height / 2 - 30
    );

    if (!gameState.crashed) {
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText('Rising...', width / 2, height / 2 + 10);
    }

    if (!gameState.crashed && !gameState.cashedOut) {
      animationRef.current = requestAnimationFrame(draw);
    }
  }, [gameState, crashPoint]);

  useEffect(() => {
    if (!gameState.crashed && !gameState.cashedOut) {
      animationRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw, gameState.crashed, gameState.cashedOut]);

  const handleCashout = () => {
    if (!gameState.crashed && !gameState.cashedOut) {
      setGameState(prev => ({
        ...prev,
        cashedOut: true,
        cashoutMultiplier: prev.multiplier,
      }));
    }
  };

  const handleStart = () => {
    setGameState(createInitialGameState());
    setTimeout(() => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(draw);
    }, 100);
  };

  return (
    <div className="bg-[#0a0b0f] rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Crash Game</h2>
        <div className="flex items-center gap-2 text-[#22c55e]">
          <TrendingUp className="w-5 h-5" />
          <span className="font-mono text-xl">{formatMultiplier(gameState.multiplier)}</span>
        </div>
      </div>

      <div className="relative bg-[#1a1d2e] rounded-lg overflow-hidden mb-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto"
        />
        {gameState.crashed && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
            <div className="text-center">
              <p className="text-red-500 text-4xl font-bold mb-2">CRASHED!</p>
              <p className="text-white text-2xl">At {formatMultiplier(gameState.crashedAt || 1)}</p>
            </div>
          </div>
        )}
        {gameState.cashedOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
            <div className="text-center">
              <p className="text-green-500 text-4xl font-bold mb-2">CASHED OUT!</p>
              <p className="text-white text-2xl">At {formatMultiplier(gameState.cashoutMultiplier || 1)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1a1d2e] rounded-lg p-4">
          <label className="text-gray-400 text-sm block mb-2">Bet Amount</label>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#f97316]" />
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="bg-[#0f1117] text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            />
          </div>
        </div>
        <div className="bg-[#1a1d2e] rounded-lg p-4">
          <label className="text-gray-400 text-sm block mb-2">Auto Cashout</label>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <input
              type="number"
              value={autoCashout}
              onChange={(e) => setAutoCashout(Number(e.target.value))}
              step="0.1"
              className="bg-[#0f1117] text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="bg-[#1a1d2e] rounded-lg p-4 flex items-center justify-center">
          <p className="text-gray-400 text-sm">
            Potential Win: <span className="text-[#f97316] font-bold">{(betAmount * gameState.multiplier).toFixed(2)}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        {!gameState.crashed && !gameState.cashedOut && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCashout}
            className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Cash Out @ {formatMultiplier(gameState.multiplier)}
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="flex-1 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          {gameState.crashed || gameState.cashedOut ? 'Play Again' : 'Start Game'}
        </motion.button>
      </div>
    </div>
  );
};

export default CrashEngine;
