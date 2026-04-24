import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, ArrowRight, Star, Crown, Zap, Calendar, Percent } from 'lucide-react';

interface PromoCard {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  expiryDate: string;
  isVip?: boolean;
  bonusType: 'deposit_match' | 'free_bet' | 'cashback' | 'odds_boost';
  value: string;
}

const mockPromos: PromoCard[] = [
  {
    id: 'promo-1',
    title: 'Welcome Bonus',
    description: 'Get 100% match on your first deposit up to GHS 500. Start your betting journey with extra funds!',
    ctaText: 'Claim Now',
    expiryDate: '2026-05-31',
    bonusType: 'deposit_match',
    value: '100% up to GHS 500',
  },
  {
    id: 'promo-2',
    title: 'Midweek Special',
    description: 'Place 3+ bets on Wednesday and get a 10% cashback on net losses.',
    ctaText: 'Learn More',
    expiryDate: '2026-12-31',
    bonusType: 'cashback',
    value: '10% Cashback',
  },
  {
    id: 'promo-3',
    title: 'Accumulator Boost',
    description: 'Boost your accumulator odds by 20% when you place 5+ selections.',
    ctaText: 'Bet Now',
    expiryDate: '2026-06-15',
    bonusType: 'odds_boost',
    value: '20% Boost',
  },
  {
    id: 'promo-4',
    title: 'Free Bet Friday',
    description: 'Deposit GHS 50+ on Friday and receive a GHS 10 free bet automatically.',
    ctaText: 'Deposit & Claim',
    expiryDate: '2026-12-31',
    bonusType: 'free_bet',
    value: 'GHS 10 Free Bet',
  },
];

const vipPromo: PromoCard = {
  id: 'vip-1',
  title: 'VIP Elite Rewards',
  description: 'Exclusive access to higher betting limits, priority withdrawals, personal account manager, and monthly cashback up to 15%.',
  ctaText: 'View VIP Benefits',
  expiryDate: 'Ongoing',
  isVip: true,
  bonusType: 'cashback',
  value: 'Up to 15% Cashback',
};

const bonusIcons: Record<PromoCard['bonusType'], React.ReactNode> = {
  deposit_match: <Percent className="w-6 h-6" />,
  free_bet: <Gift className="w-6 h-6" />,
  cashback: <Zap className="w-6 h-6" />,
  odds_boost: <Star className="w-6 h-6" />,
};

const PromoCardComponent: React.FC<{ promo: PromoCard; index: number }> = ({ promo, index }) => {
  const isExpiringSoon = () => {
    const expiry = new Date(promo.expiryDate);
    const now = new Date();
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7 && daysLeft > 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl overflow-hidden border ${
        promo.isVip
          ? 'bg-gradient-to-br from-[#FFD700]/10 to-[#FF6A00]/10 border-[#FFD700]/30'
          : 'bg-[#1a1d2e] border-gray-800/50'
      }`}
    >
      {/* Card Header */}
      <div className={`p-6 ${promo.isVip ? 'bg-[#FFD700]/5' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${promo.isVip ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-[#FF6A00]/20 text-[#FF6A00]'}`}>
            {promo.isVip ? <Crown className="w-6 h-6" /> : bonusIcons[promo.bonusType]}
          </div>
          {promo.isVip && (
            <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold rounded-full border border-[#FFD700]/30">
              VIP EXCLUSIVE
            </span>
          )}
        </div>

        <h3 className={`text-xl font-bold mb-2 ${promo.isVip ? 'text-[#FFD700]' : 'text-white'}`}>
          {promo.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4">{promo.description}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Bonus</p>
            <p className={`font-bold ${promo.isVip ? 'text-[#FFD700]' : 'text-[#FF6A00]'}`}>{promo.value}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Expires
            </p>
            <p className={`text-sm font-semibold flex items-center gap-1 ${isExpiringSoon() ? 'text-red-400' : 'text-gray-300'}`}>
              {isExpiringSoon() && <Clock className="w-3 h-3" />}
              {promo.expiryDate}
            </p>
          </div>
        </div>

        <button
          className={`w-full py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
            promo.isVip
              ? 'bg-[#FFD700] hover:bg-[#FFE44D] text-black'
              : 'bg-[#FF6A00] hover:bg-[#FF8533] text-white'
          }`}
        >
          {promo.ctaText}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const PromotionsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | PromoCard['bonusType']>('all');

  const filteredPromos = activeFilter === 'all'
    ? mockPromos
    : mockPromos.filter((p) => p.bonusType === activeFilter);

  const isVipEligible = true;

  return (
    <div className="min-h-screen bg-[#0f1119] py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Promotions</h1>
          <p className="text-gray-400">Discover our latest bonuses and special offers</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'deposit_match', 'free_bet', 'cashback', 'odds_boost'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-[#FF6A00] text-white'
                  : 'bg-[#1a1d2e] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {filter === 'all' ? 'All Offers' : filter.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPromos.map((promo, index) => (
            <PromoCardComponent key={promo.id} promo={promo} index={index} />
          ))}
        </div>

        {/* VIP Promotion Section */}
        {isVipEligible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-[#FFD700]" />
              <h2 className="text-xl font-bold text-[#FFD700]">VIP Promotions</h2>
            </div>
            <PromoCardComponent promo={vipPromo} index={0} />
          </motion.div>
        )}

        {filteredPromos.length === 0 && (
          <div className="text-center py-16">
            <Gift className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No promotions available</h3>
            <p className="text-gray-500">Check back later for new offers!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;
