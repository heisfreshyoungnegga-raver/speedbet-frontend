import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OddsItem {
  label: string;
  odds: number;
  onClick: () => void;
}

interface MarketData {
  [key: string]: OddsItem[];
}

interface MarketPanelProps {
  marketData: MarketData;
  isLoading: boolean;
}

const MARKET_TABS = [
  { id: '1X2', label: '1X2' },
  { id: 'home-win', label: 'Home Win' },
  { id: 'away-win', label: 'Away Win' },
  { id: 'ou', label: 'OU' },
  { id: 'handicap', label: 'Handicap' },
  { id: 'cs', label: 'CS' },
  { id: 'ht-ft', label: 'HT/FT' },
  { id: 'btts', label: 'BTTS' },
  { id: 'dc', label: 'DC' },
  { id: 'live', label: 'Live' },
] as const;

const MarketPanel: React.FC<MarketPanelProps> = ({ marketData, isLoading }) => {
  const [activeTab, setActiveTab] = useState<string>(MARKET_TABS[0].id);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
        {MARKET_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 grid grid-cols-2 md:grid-cols-3 gap-2"
        >
          {marketData[activeTab]?.map((item, index) => (
            <button
              key={`${activeTab}-${index}`}
              onClick={item.onClick}
              className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="text-xs text-gray-500">{item.label}</div>
              <div className="text-lg font-bold text-gray-900">{item.odds.toFixed(2)}</div>
            </button>
          ))}

          {!marketData[activeTab]?.length && (
            <div className="col-span-full text-center py-4 text-gray-500 text-sm">
              No odds available for this market
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MarketPanel;
