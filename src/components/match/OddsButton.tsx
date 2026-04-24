import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OddsButtonProps {
  odds: number;
  previousOdds?: number;
  market: string;
  selection: string;
  matchId: string;
  disabled?: boolean;
  onClick?: (data: { matchId: string; market: string; selection: string; odds: number }) => void;
  className?: string;
}

type OddsDirection = 'up' | 'down' | 'neutral';

const OddsButton: React.FC<OddsButtonProps> = ({
  odds,
  previousOdds,
  market,
  selection,
  matchId,
  disabled = false,
  onClick,
  className = '',
}) => {
  const [direction, setDirection] = useState<OddsDirection>('neutral');
  const [isFlashing, setIsFlashing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (previousOdds !== undefined && previousOdds !== odds) {
      setDirection(odds > previousOdds ? 'up' : 'down');
      setIsFlashing(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsFlashing(false);
        setDirection('neutral');
      }, 1500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [odds, previousOdds]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.({ matchId, market, selection, odds });
  }, [disabled, matchId, market, selection, odds, onClick]);

  const getFlashColor = () => {
    if (!isFlashing) return '';
    return direction === 'up' ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500';
  };

  const formatOdds = (value: number): string => {
    return value.toFixed(2);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        px-3 py-2 min-w-[70px]
        rounded-lg
        font-semibold text-sm
        transition-all duration-200
        ${disabled 
          ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
          : 'bg-[#1a1d2e] hover:bg-[#252840] text-white cursor-pointer border border-gray-700/50 hover:border-[#FF6A00]/50'
        }
        ${getFlashColor()}
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className={`absolute inset-0 ${direction === 'up' ? 'bg-green-500/30' : 'bg-red-500/30'}`}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center gap-0.5">
        <span className="text-[10px] uppercase text-gray-400 font-medium">{selection}</span>
        <div className="flex items-center gap-1">
          {direction === 'up' && isFlashing && (
            <TrendingUp className="w-3 h-3 text-green-400" />
          )}
          {direction === 'down' && isFlashing && (
            <TrendingDown className="w-3 h-3 text-red-400" />
          )}
          <span className={`font-bold ${isFlashing && direction === 'up' ? 'text-green-400' : ''} ${isFlashing && direction === 'down' ? 'text-red-400' : 'text-[#FFD700]'}`}>
            {formatOdds(odds)}
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default React.memo(OddsButton);
