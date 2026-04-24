import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Star, Lock, Zap } from 'lucide-react';
import GameCard from '../components/games/GameCard';
import { GAMES_LIST, FEATURED_GAMES, VIRTUAL_GAMES, VIP_GAMES, SPECIAL_GAMES } from '../data/games';

const GamesPage: React.FC = () => {
  const [isVip, setIsVip] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'virtual' | 'special' | 'vip'>('all');

  const virtualFootball = VIRTUAL_GAMES.filter(g => g.type === 'Virtual Football');
  const virtualHorse = VIRTUAL_GAMES.filter(g => g.type === 'Virtual Horse Racing');
  const virtualGreyhound = VIRTUAL_GAMES.filter(g => g.type === 'Virtual Greyhounds');
  const virtualPenalty = VIRTUAL_GAMES.filter(g => g.type === 'Virtual Penalties');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const renderGameGrid = (games: typeof GAMES_LIST) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {games.map((game) => (
        <motion.div key={game.id} variants={itemVariants}>
          <GameCard game={game} isVip={isVip} />
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#f97316] to-yellow-500 bg-clip-text text-transparent">
              SpeedBet Games
            </h1>
            <p className="text-gray-400 mt-2">Choose your game and start winning!</p>
          </div>
          <button
            onClick={() => setIsVip(!isVip)}
            className={`mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              isVip
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {isVip ? <Star className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {isVip ? 'VIP ACTIVE' : 'Enable VIP'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'All Games', icon: Zap },
            { key: 'featured', label: 'Featured', icon: Star },
            { key: 'virtual', label: 'Virtual Sports', icon: Trophy },
            { key: 'special', label: 'Special Events', icon: Shield },
            { key: 'vip', label: 'VIP Exclusives', icon: Lock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === key
                  ? 'bg-[#f97316] text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* All Games */}
        {activeTab === 'all' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-[#f97316]" />
              All Games ({GAMES_LIST.length}+)
            </h2>
            {renderGameGrid(GAMES_LIST)}
          </section>
        )}

        {/* Featured Games */}
        {activeTab === 'featured' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-[#f97316]" />
              Featured Games
            </h2>
            {renderGameGrid(FEATURED_GAMES)}
          </section>
        )}

        {/* Virtual Sports */}
        {activeTab === 'virtual' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-green-500" />
                Virtual Football ({virtualFootball.length} matches)
              </h2>
              {renderGameGrid(virtualFootball)}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-blue-500" />
                Virtual Horse Racing ({virtualHorse.length} races)
              </h2>
              {renderGameGrid(virtualHorse)}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-500" />
                Virtual Greyhounds ({virtualGreyhound.length} races)
              </h2>
              {renderGameGrid(virtualGreyhound)}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-red-500" />
                Virtual Penalties ({virtualPenalty.length} rounds)
              </h2>
              {renderGameGrid(virtualPenalty)}
            </section>
          </div>
        )}

        {/* Special Events */}
        {activeTab === 'special' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-yellow-500" />
              Admin Special Events
            </h2>
            <div className="bg-gradient-to-r from-yellow-500/10 to-amber-600/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-yellow-400 font-medium">
                These games are created by administrators. Special prizes and unique gameplay!
              </p>
            </div>
            {renderGameGrid(SPECIAL_GAMES)}
          </section>
        )}

        {/* VIP Exclusives */}
        {activeTab === 'vip' && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-yellow-500" />
              VIP Exclusives
            </h2>
            {!isVip && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 font-medium">
                  Upgrade to VIP to access these exclusive games!
                </p>
              </div>
            )}
            {renderGameGrid(VIP_GAMES)}
          </section>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
