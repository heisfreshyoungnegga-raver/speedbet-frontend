import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Users, TrendingUp, DollarSign, Calendar, Gift } from 'lucide-react';

interface ReferredUser {
  id: string;
  name: string;
  joinedDate: string;
  lifetimeStake: number;
  commissionGenerated: number;
}

const mockReferralData = {
  referralLink: 'https://speedbet.com/ref/JOHND123',
  stats: {
    totalReferrals: 12,
    lifetimeStake: 4500,
    lifetimeCommission: 225,
  },
  referredUsers: [
    { id: 'u1', name: 'Alice Johnson', joinedDate: '2026-04-15', lifetimeStake: 800, commissionGenerated: 40 },
    { id: 'u2', name: 'Bob Smith', joinedDate: '2026-04-10', lifetimeStake: 1200, commissionGenerated: 60 },
    { id: 'u3', name: 'Charlie Brown', joinedDate: '2026-04-05', lifetimeStake: 500, commissionGenerated: 25 },
    { id: 'u4', name: 'Diana Prince', joinedDate: '2026-03-28', lifetimeStake: 2000, commissionGenerated: 100 },
  ] as ReferredUser[],
};

const ReferralsPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [referralData] = useState(mockReferralData);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(referralData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [referralData.referralLink]);

  return (
    <div className="min-h-screen bg-[#0f1119] py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Referrals</h1>

        {/* Referral Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 mb-6"
        >
          <p className="text-sm text-gray-400 mb-3">Your Referral Link</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-[#0f1119] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm font-mono truncate">
              {referralData.referralLink}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className={`px-4 py-3 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 ${
                copied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-[#FF6A00] hover:bg-[#FF8533] text-white'
              }`}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
              {copied ? 'Copied!' : 'Copy Link'}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1d2e] rounded-xl p-5 border border-gray-800/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm text-gray-400">Total Referrals</span>
            </div>
            <p className="text-3xl font-bold text-white">{referralData.stats.totalReferrals}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1d2e] rounded-xl p-5 border border-gray-800/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#FFD700]/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#FFD700]" />
              </div>
              <span className="text-sm text-gray-400">Lifetime Stake</span>
            </div>
            <p className="text-3xl font-bold text-white">GHS {referralData.stats.lifetimeStake.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1d2e] rounded-xl p-5 border border-gray-800/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Commission Earned</span>
            </div>
            <p className="text-3xl font-bold text-[#FFD700]">GHS {referralData.stats.lifetimeCommission.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Referred Users List */}
        <div className="bg-[#1a1d2e] rounded-2xl border border-gray-800/50 overflow-hidden">
          <div className="p-6 border-b border-gray-800/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#FF6A00]" />
              Referred Users
            </h2>
          </div>

          <div className="divide-y divide-gray-800/50">
            {referralData.referredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-[#0f1119]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FF8533] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {user.joinedDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white font-semibold">GHS {user.lifetimeStake.toLocaleString()}</p>
                    <p className="text-xs text-[#FFD700]">+GHS {user.commissionGenerated.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {referralData.referredUsers.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400">No referrals yet. Share your link to start earning!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
