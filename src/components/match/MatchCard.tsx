import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Trophy, TrendingUp } from 'lucide-react';
import OddsButton from './OddsButton';

export type MatchVariant = 'live' | 'upcoming' | 'result';

interface Team {
  id: string;
  name: string;
  badge: string;
  score?: number;
}

interface MatchCardProps {
  matchId: string;
  variant: MatchVariant;
  homeTeam: Team;
  awayTeam: Team;
  competition: {
    name: string;
    logo?: string;
  };
  status: {
    isLive?: boolean;
    elapsedTime?: number;
    kickoffTime?: string;
    isFinished?: boolean;
    result?: 'home' | 'away' | 'draw';
  };
  odds?: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  onClick?: (matchId: string) => void;
  onAddToSlip?: (data: { matchId: string; market: string; selection: string; odds: number }) => void;
  className?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({
  matchId,
  variant,
  homeTeam,
  awayTeam,
  competition,
  status,
  odds,
  onClick,
  onAddToSlip,
  className = '',
}) => {
  const handleCardClick = useCallback(() => {
    onClick?.(matchId);
  }, [matchId, onClick]);

  const handleOddsClick = useCallback((data: { matchId: string; market: string; selection: string; odds: number }) => {
    onAddToSlip?.(data);
  }, [onAddToSlip]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins}'`;
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`
        bg-[#1a1d2e] rounded-xl border border-gray-800/50 
        overflow-hidden cursor-pointer
        hover:border-[#FF6A00]/30 transition-all duration-200
        ${className}
      `}
    >
      {/* Competition & Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/30">
        <div className="flex items-center gap-2">
          {competition.logo && (
            <img src={competition.logo} alt={competition.name} className="w-4 h-4" />
          )}
          <span className="text-xs text-gray-400 truncate">{competition.name}</span>
        </div>
        
        {variant === 'live' && status.isLive && (
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A00]"></span>
            </span>
            <span className="text-[#FF6A00] text-xs font-bold uppercase">LIVE</span>
            {status.elapsedTime !== undefined && (
              <span className="text-gray-400 text-xs">{formatTime(status.elapsedTime)}</span>
            )}
          </div>
        )}

        {variant === 'upcoming' && status.kickoffTime && (
          <div className="flex items-center gap-1 text-gray-400">
            <Calendar className="w-3 h-3" />
            <span className="text-xs">{status.kickoffTime}</span>
          </div>
        )}

        {variant === 'result' && status.isFinished && (
          <div className="flex items-center gap-1 text-gray-400">
            <Trophy className="w-3 h-3" />
            <span className="text-xs font-semibold uppercase">FT</span>
          </div>
        )}
      </div>

      {/* Teams & Score */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          {/* Home Team */}
          <div className="flex items-center gap-3 flex-1">
            <img src={homeTeam.badge} alt={homeTeam.name} className="w-8 h-8 object-contain" />
            <span className={`text-sm font-semibold truncate ${status.result === 'home' ? 'text-[#FFD700]' : 'text-white'}`}>
              {homeTeam.name}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 mx-4">
            {variant === 'upcoming' ? (
              <span className="text-gray-500 font-bold">VS</span>
            ) : (
              <>
                <span className={`text-xl font-bold ${status.result === 'home' ? 'text-[#FFD700]' : 'text-white'}`}>
                  {homeTeam.score ?? 0}
                </span>
                <span className="text-gray-600">-</span>
                <span className={`text-xl font-bold ${status.result === 'away' ? 'text-[#FFD700]' : 'text-white'}`}>
                  {awayTeam.score ?? 0}
                </span>
              </>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className={`text-sm font-semibold truncate text-right ${status.result === 'away' ? 'text-[#FFD700]' : 'text-white'}`}>
              {awayTeam.name}
            </span>
            <img src={awayTeam.badge} alt={awayTeam.name} className="w-8 h-8 object-contain" />
          </div>
        </div>

        {/* Odds Buttons */}
        {odds && variant !== 'result' && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800/30">
            <OddsButton
              odds={odds.homeWin}
              market="1X2"
              selection="1"
              matchId={matchId}
              onClick={handleOddsClick}
            />
            <OddsButton
              odds={odds.draw}
              market="1X2"
              selection="X"
              matchId={matchId}
              onClick={handleOddsClick}
            />
            <OddsButton
              odds={odds.awayWin}
              market="1X2"
              selection="2"
              matchId={matchId}
              onClick={handleOddsClick}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(MatchCard);
