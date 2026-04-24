import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, ChevronDown, ChevronUp, Trophy, XCircle, Clock, AlertCircle } from 'lucide-react';

type BetStatus = 'OPEN' | 'WON' | 'LOST';

interface Selection {
  id: string;
  match: string;
  market: string;
  selection: string;
  odds: number;
}

interface Bet {
  id: string;
  match: string;
  stake: number;
  potentialReturn: number;
  status: BetStatus;
  createdAt: string;
  selections: Selection[];
}

const mockBets: Bet[] = [
  {
    id: 'bet-1',
    match: 'Manchester United vs Liverpool',
    stake: 100,
    potentialReturn: 185,
    status: 'WON',
    createdAt: '2026-04-20 15:30',
    selections: [
      { id: 's1', match: 'Man Utd vs Liverpool', market: '1X2', selection: 'Home Win', odds: 1.85 },
    ],
  },
  {
    id: 'bet-2',
    match: 'Arsenal vs Chelsea',
    stake: 50,
    potentialReturn: 97.5,
    status: 'LOST',
    createdAt: '2026-04-19 18:00',
    selections: [
      { id: 's2', match: 'Arsenal vs Chelsea', market: 'Over/Under', selection: 'Over 2.5 Goals', odds: 1.95 },
    ],
  },
  {
    id: 'bet-3',
    match: 'Barcelona vs Real Madrid',
    stake: 200,
    potentialReturn: 420,
    status: 'OPEN',
    createdAt: '2026-04-23 20:00',
    selections: [
      { id: 's3', match: 'Barcelona vs Real Madrid', market: '1X2', selection: 'Draw', odds: 3.40 },
      { id: 's4', match: 'Barcelona vs Real Madrid', market: 'Both Teams Score', selection: 'Yes', odds: 1.65 },
    ],
  },
  {
    id: 'bet-4',
    match: 'Bayern vs Dortmund',
    stake: 75,
    potentialReturn: 123.75,
    status: 'OPEN',
    createdAt: '2026-04-23 18:30',
    selections: [
      { id: 's5', match: 'Bayern vs Dortmund', market: '1X2', selection: 'Home Win', odds: 1.65 },
    ],
  },
];

const statusColors: Record<BetStatus, string> = {
  OPEN: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  WON: 'bg-green-500/20 text-green-400 border-green-500/30',
  LOST: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcons: Record<BetStatus, React.ReactNode> = {
  OPEN: <Clock className="w-4 h-4" />,
  WON: <Trophy className="w-4 h-4" />,
  LOST: <XCircle className="w-4 h-4" />,
};

const BetCard: React.FC<{ bet: Bet }> = ({ bet }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1d2e] rounded-xl border border-gray-800/50 overflow-hidden"
    >
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[bet.status]}`}>
            {statusIcons[bet.status]}
            {bet.status}
          </span>
          <span className="text-xs text-gray-500">{bet.createdAt}</span>
        </div>

        <h3 className="text-white font-medium mb-3">{bet.match}</h3>

        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Stake</p>
            <p className="text-white font-semibold">GHS {bet.stake.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Odds</p>
            <p className="text-[#FFD700] font-semibold">
              {bet.selections.reduce((acc, s) => acc * s.odds, 1).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">To Win</p>
            <p className="text-[#FFD700] font-bold">GHS {bet.potentialReturn.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{bet.selections.length} selection{bet.selections.length > 1 ? 's' : ''}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-gray-800/50">
              {bet.selections.map((sel) => (
                <div key={sel.id} className="pt-3 first:pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">{sel.selection}</p>
                      <p className="text-xs text-gray-500">{sel.market}</p>
                    </div>
                    <span className="text-[#FFD700] font-bold text-sm">{sel.odds.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="bg-[#1a1d2e] rounded-xl border border-gray-800/50 p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-6 w-20 bg-gray-700/50 rounded-full" />
      <div className="h-4 w-24 bg-gray-700/50 rounded" />
    </div>
    <div className="h-5 w-3/4 bg-gray-700/50 rounded mb-3" />
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className="h-3 w-10 bg-gray-700/50 rounded mb-1" />
          <div className="h-5 w-16 bg-gray-700/50 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const MyBetsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BetStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const filteredBets = activeTab === 'ALL' ? mockBets : mockBets.filter((b) => b.status === activeTab);

  const tabs: (BetStatus | 'ALL')[] = ['ALL', 'OPEN', 'WON', 'LOST'];

  return (
    <div className="min-h-screen bg-[#0f1119] py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">My Bets</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors
                ${activeTab === tab
                  ? 'text-[#FF6A00] border-b-2 border-[#FF6A00]'
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredBets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Ticket className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No bets yet</h3>
            <p className="text-gray-500 mb-6">Start placing bets to see them here</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-[#FF6A00] hover:bg-[#FF8533] text-white font-bold rounded-lg transition-colors"
            >
              Browse Games
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBetsPage;
