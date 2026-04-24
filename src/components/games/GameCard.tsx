import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Game } from '../../data/games';

interface GameCardProps {
  game: Game;
  isVip?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, isVip = false }) => {
  const navigate = useNavigate();
  const isLocked = game.vipOnly && !isVip;

  const handlePlay = () => {
    if (!isLocked) {
      navigate(`/games/${game.slug}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative group cursor-pointer"
      onClick={handlePlay}
    >
      <div className="relative bg-gradient-to-br from-[#1a1d2e] to-[#0f1117] rounded-xl border border-gray-800 overflow-hidden hover:border-[#f97316] transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <span className="text-4xl font-bold text-gray-700 z-0">
            {game.name.charAt(0)}
          </span>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1 z-20">
            {game.special && (
              <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-bold px-2 py-1 rounded-full">
                SPECIAL EVENT
              </span>
            )}
            {game.vipOnly && (
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> VIP
              </span>
            )}
          </div>

          {/* Lock Overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
              <div className="text-center">
                <Lock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <span className="text-yellow-500 text-sm font-semibold">VIP ONLY</span>
              </div>
            </div>
          )}

          {/* Hover Play Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="w-12 h-12 text-white" fill="white" />
          </motion.div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-1 truncate">{game.name}</h3>
          <p className="text-gray-400 text-sm mb-2">{game.type}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs">Max Payout</span>
              <p className="text-[#f97316] font-bold">{game.maxPayout}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
              disabled={isLocked}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                isLocked
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#f97316] hover:bg-[#ea580c] text-white'
              }`}
            >
              {isLocked ? 'LOCKED' : 'PLAY'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
