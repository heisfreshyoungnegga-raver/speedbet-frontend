import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  DollarSign,
  TrendingUp,
  History,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import CrashEngine from '../components/games/CrashEngine';
import CoinFlip3D from '../components/games/CoinFlip3D';
import DiceRoll from '../components/games/DiceRoll';
import LuckySpin from '../components/games/LuckySpin';
import MagicBall from '../components/games/MagicBall';
import AviatorPro from '../components/games/AviatorPro';

interface GameConfig {
  slug: string;
  title: string;
  description: string;
  maxPayout: number;
  component: string;
  minStake: number;
  maxStake: number;
}

interface GameResult {
  id: string;
  gameTitle: string;
  stake: number;
  result: 'won' | 'lost';
  amount: number;
  timestamp: Date;
  multiplier?: number;
}

interface StakeInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const StakeInputBase: React.FC<StakeInputProps> = ({ value, onChange, min, max }) => {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  const presetAmounts = [10, 50, 100, 500, 1000];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Stake Amount</label>
      <div className="flex items-center space-x-2">
        <DollarSign className="w-5 h-5 text-green-400" />
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          min={min}
          max={max}
          step="0.01"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {presetAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => onChange(amt)}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-colors"
          >
            ${amt}
          </button>
        ))}
      </div>
    </div>
  );
};

const GamePlayPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [stake, setStake] = useState<number>(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [crashMultiplier, setCrashMultiplier] = useState<number>(1.00);
  const [hasCashedOut, setHasCashedOut] = useState(false);

  const games: GameConfig[] = [
    {
      slug: 'crash',
      title: 'Crash Engine',
      description: 'Watch the multiplier grow and cash out before it crashes!',
      maxPayout: 100000,
      component: 'CrashEngine',
      minStake: 1,
      maxStake: 5000,
    },
    {
      slug: 'coinflip',
      title: 'Coin Flip 3D',
      description: 'Heads or tails? 50/50 chance to double your money.',
      maxPayout: 10000,
      component: 'CoinFlip3D',
      minStake: 1,
      maxStake: 1000,
    },
    {
      slug: 'dice',
      title: 'Dice Roll',
      description: 'Roll the dice and predict the outcome. Multiple betting options available.',
      maxPayout: 50000,
      component: 'DiceRoll',
      minStake: 1,
      maxStake: 2000,
    },
    {
      slug: 'luckyspin',
      title: 'Lucky Spin',
      description: 'Spin the wheel of fortune and win amazing prizes!',
      maxPayout: 25000,
      component: 'LuckySpin',
      minStake: 5,
      maxStake: 1000,
    },
    {
      slug: 'magicball',
      title: 'Magic Ball',
      description: 'Mystical predictions with up to 50x multipliers!',
      maxPayout: 50000,
      component: 'MagicBall',
      minStake: 1,
      maxStake: 1000,
    },
    {
      slug: 'aviator',
      title: 'Aviator Pro',
      description: 'Fly high and cash out before the plane flies away!',
      maxPayout: 100000,
      component: 'AviatorPro',
      minStake: 1,
      maxStake: 5000,
    },
  ];

  const currentGame = games.find((g) => g.slug === slug);

  useEffect(() => {
    if (!currentGame) {
      navigate('/games');
    }
  }, [currentGame, navigate]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setGameResult(null);
    setHasCashedOut(false);
    setCrashMultiplier(1.00);

    // Simulate game logic
    const gameDuration = Math.random() * 5000 + 3000;
    setTimeout(() => {
      const won = Math.random() > 0.4;
      const multiplier = currentGame?.slug === 'crash' ? crashMultiplier : (won ? Math.random() * 5 + 1.5 : 0);
      const winAmount = won ? stake * (typeof multiplier === 'number' ? multiplier : 1) : 0;

      const result: GameResult = {
        id: Date.now().toString(),
        gameTitle: currentGame?.title || 'Unknown',
        stake,
        result: won ? 'won' : 'lost',
        amount: won ? winAmount : -stake,
        timestamp: new Date(),
        multiplier: typeof multiplier === 'number' ? multiplier : undefined,
      };

      setGameResult(result);
      setGameHistory((prev) => [result, ...prev].slice(0, 10));
      setIsPlaying(false);
    }, gameDuration);
  }, [stake, currentGame, crashMultiplier]);

  const handleCashOut = () => {
    if (isPlaying && currentGame?.slug === 'crash') {
      setHasCashedOut(true);
      const winAmount = stake * crashMultiplier;
      const result: GameResult = {
        id: Date.now().toString(),
        gameTitle: currentGame.title,
        stake,
        result: 'won',
        amount: winAmount,
        timestamp: new Date(),
        multiplier: crashMultiplier,
      };
      setGameResult(result);
      setGameHistory((prev) => [result, ...prev].slice(0, 10));
      setIsPlaying(false);
    }
  };

  const renderGameComponent = () => {
    if (!currentGame) return null;

    const commonProps = {
      isPlaying,
      stake,
      onCashOut: handleCashOut,
      onMultiplierChange: setCrashMultiplier,
    };

    switch (currentGame.component) {
      case 'CrashEngine':
        return <CrashEngine {...commonProps} />;
      case 'CoinFlip3D':
        return <CoinFlip3D {...commonProps} />;
      case 'DiceRoll':
        return <DiceRoll {...commonProps} />;
      case 'LuckySpin':
        return <LuckySpin {...commonProps} />;
      case 'MagicBall':
        return <MagicBall {...commonProps} />;
      case 'AviatorPro':
        return <AviatorPro {...commonProps} />;
      default:
        return <div className="text-white">Game component not found</div>;
    }
  };

  if (!currentGame) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/games')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Games</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{currentGame.title}</h1>
                  <p className="text-gray-400 mt-2">{currentGame.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Max Payout</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${currentGame.maxPayout.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                {renderGameComponent()}
              </div>

              {gameResult && (
                <div
                  className={`rounded-lg p-4 mb-4 ${
                    gameResult.result === 'won'
                      ? 'bg-green-900/50 border border-green-700'
                      : 'bg-red-900/50 border border-red-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {gameResult.result === 'won' ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-400" />
                      )}
                      <div>
                        <p className="font-bold text-lg">
                          {gameResult.result === 'won' ? 'You Won!' : 'You Lost!'}
                        </p>
                        {gameResult.multiplier && (
                          <p className="text-sm opacity-80">
                            Multiplier: {gameResult.multiplier.toFixed(2)}x
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${
                          gameResult.result === 'won' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {gameResult.result === 'won' ? '+' : '-'}${Math.abs(gameResult.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {gameResult.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Last 10 Plays
                </h2>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {showHistory ? 'Hide' : 'Show'}
                </button>
              </div>

              {showHistory && gameHistory.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {gameHistory.map((play) => (
                    <div
                      key={play.id}
                      className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3">
                        {play.result === 'won' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{play.gameTitle}</p>
                          <p className="text-xs text-gray-400">
                            {play.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            play.result === 'won' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {play.result === 'won' ? '+' : '-'}${Math.abs(play.amount).toFixed(2)}
                        </p>
                        {play.multiplier && (
                          <p className="text-xs text-gray-400">{play.multiplier.toFixed(2)}x</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showHistory && gameHistory.length === 0 && (
                <p className="text-gray-500 text-center py-4">No plays yet. Start playing!</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Game Controls
              </h2>

              <div className="space-y-4">
                <StakeInputBase
                  value={stake}
                  onChange={setStake}
                  min={currentGame.minStake}
                  max={currentGame.maxStake}
                />

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handlePlay}
                    disabled={isPlaying}
                    className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
                      isPlaying
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                    }`}
                  >
                    <Play className="w-5 h-5 inline mr-2" />
                    {isPlaying ? 'Playing...' : 'PLAY'}
                  </button>

                  {currentGame.slug === 'crash' && isPlaying && (
                    <button
                      onClick={handleCashOut}
                      disabled={hasCashedOut}
                      className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
                        hasCashedOut
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
                      }`}
                    >
                      <LogOut className="w-5 h-5 inline mr-2" />
                      Cash Out @ {crashMultiplier.toFixed(2)}x
                    </button>
                  )}
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3 mt-4">
                  <p className="text-xs text-gray-400 mb-1">Game Info</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min Stake</span>
                      <span>${currentGame.minStake}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Stake</span>
                      <span>${currentGame.maxStake}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Payout</span>
                      <span className="text-green-400">${currentGame.maxPayout.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayPage;
