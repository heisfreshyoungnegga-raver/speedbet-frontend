import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, MapPin } from 'lucide-react';

interface TeamInfo {
  id: string;
  name: string;
  badge: string;
  score?: number;
}

interface ScoreBannerProps {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  status: 'live' | 'upcoming' | 'finished' | 'postponed';
  competition: {
    name: string;
    round?: string;
    logo?: string;
  };
  kickoffTime?: string;
  elapsedTime?: number;
  venue?: string;
  className?: string;
}

const ScoreBanner: React.FC<ScoreBannerProps> = ({
  homeTeam,
  awayTeam,
  status,
  competition,
  kickoffTime,
  elapsedTime,
  venue,
  className = '',
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins}'`;
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'live':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A00]"></span>
            </span>
            <span className="text-[#FF6A00] font-bold text-sm uppercase tracking-wider">LIVE</span>
            {elapsedTime !== undefined && (
              <span className="text-gray-300 text-sm">{formatTime(elapsedTime)}</span>
            )}
          </motion.div>
        );
      case 'finished':
        return (
          <span className="text-gray-400 font-semibold text-sm uppercase tracking-wider">FT</span>
        );
      case 'upcoming':
        return (
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{kickoffTime}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full bg-[#0f1119] border-b border-gray-800/50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Competition Info */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {competition.logo && (
            <img src={competition.logo} alt={competition.name} className="w-6 h-6" />
          )}
          <span className="text-gray-300 text-sm font-medium">{competition.name}</span>
          {competition.round && (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 text-sm">{competition.round}</span>
            </>
          )}
        </div>

        {/* Teams and Score */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex-1 flex items-center gap-4 justify-end">
            <div className="text-right">
              <h2 className="text-white text-xl md:text-2xl font-bold mb-1">{homeTeam.name}</h2>
            </div>
            <img 
              src={homeTeam.badge} 
              alt={homeTeam.name} 
              className="w-14 h-14 md:w-18 md:h-18 object-contain"
            />
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center px-6">
            {status === 'upcoming' ? (
              <span className="text-3xl md:text-4xl font-bold text-gray-500">VS</span>
            ) : (
              <div className="flex items-center gap-3 md:gap-6">
                <span className="text-4xl md:text-5xl font-bold text-[#FFD700]">
                  {homeTeam.score ?? 0}
                </span>
                <span className="text-2xl text-gray-600">-</span>
                <span className="text-4xl md:text-5xl font-bold text-[#FFD700]">
                  {awayTeam.score ?? 0}
                </span>
              </div>
            )}
            <div className="mt-2">{getStatusBadge()}</div>
          </div>

          {/* Away Team */}
          <div className="flex-1 flex items-center gap-4">
            <img 
              src={awayTeam.badge} 
              alt={awayTeam.name} 
              className="w-14 h-14 md:w-18 md:h-18 object-contain"
            />
            <div className="text-left">
              <h2 className="text-white text-xl md:text-2xl font-bold mb-1">{awayTeam.name}</h2>
            </div>
          </div>
        </div>

        {/* Venue */}
        {venue && (
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-sm">
            <MapPin className="w-3 h-3" />
            <span>{venue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreBanner;
