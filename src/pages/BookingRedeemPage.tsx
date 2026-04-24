import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface Selection {
  id: string;
  match: string;
  market: string;
  selection: string;
  odds: number;
}

interface BookingCodeData {
  code: string;
  selections: Selection[];
  totalOdds: number;
}

const mockBookingData: Record<string, BookingCodeData> = {
  'ABC123XY': {
    code: 'ABC123XY',
    selections: [
      { id: 's1', match: 'Manchester United vs Liverpool', market: '1X2', selection: 'Home Win', odds: 1.85 },
      { id: 's2', match: 'Manchester United vs Liverpool', market: 'Over/Under', selection: 'Over 2.5 Goals', odds: 1.95 },
    ],
    totalOdds: 3.61,
  },
  'XYZ789AB': {
    code: 'XYZ789AB',
    selections: [
      { id: 's3', match: 'Barcelona vs Real Madrid', market: 'Both Teams Score', selection: 'Yes', odds: 1.65 },
    ],
    totalOdds: 1.65,
  },
};

const shakeAnimation = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};

const BookingRedeemPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingCodeData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    setCode(value);
    setError('');
    setBookingData(null);
  };

  const handleRedeem = () => {
    if (code.length !== 8) {
      setError('Please enter a valid 8-character code');
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const data = mockBookingData[code];
      if (data) {
        setBookingData(data);
      } else {
        setError('Invalid booking code. Please check and try again.');
        triggerShake();
      }
      setIsLoading(false);
    }, 1000);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleLoadToSlip = () => {
    alert('Selections loaded to bet slip!');
    setCode('');
    setBookingData(null);
  };

  return (
    <div className="min-h-screen bg-[#0f1119] flex items-center justify-center py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-auto px-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#FF6A00]/20 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8 text-[#FF6A00]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Redeem Booking Code</h1>
          <p className="text-gray-400">Enter your 8-character booking code to load selections</p>
        </div>

        <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50">
          <motion.div
            animate={isShaking ? 'shake' : ''}
            variants={shakeAnimation}
          >
            <div className="relative mb-4">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                value={code}
                onChange={handleChange}
                placeholder="Enter 8-character code"
                className={`w-full pl-12 pr-4 py-4 bg-[#0f1119] border rounded-xl text-white text-center text-lg font-mono tracking-[0.3em] focus:outline-none transition-colors ${
                  error ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-[#FF6A00]'
                }`}
                maxLength={8}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleRedeem}
            disabled={isLoading || code.length !== 8}
            className="w-full py-4 bg-[#FF6A00] hover:bg-[#FF8533] disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redeeming...
              </>
            ) : (
              <>
                <Ticket className="w-5 h-5" />
                Redeem Code
              </>
            )}
          </button>
        </div>

        {/* Booking Data Display */}
        <AnimatePresence>
          {bookingData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 bg-[#1a1d2e] rounded-2xl p-6 border border-green-500/30"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">Code Valid!</h3>
              </div>

              <div className="space-y-3 mb-6">
                {bookingData.selections.map((sel) => (
                  <div key={sel.id} className="bg-[#0f1119] rounded-lg p-4">
                    <p className="text-white font-medium text-sm mb-1">{sel.match}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{sel.market}</span>
                      <span className="text-sm text-white">{sel.selection}</span>
                      <span className="text-[#FFD700] font-bold">{sel.odds.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6 p-4 bg-[#0f1119] rounded-lg">
                <span className="text-gray-400">Total Odds</span>
                <span className="text-2xl font-bold text-[#FFD700]">{bookingData.totalOdds.toFixed(2)}</span>
              </div>

              <button
                onClick={handleLoadToSlip}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Load into Bet Slip</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-gray-600 mt-6">
          Demo codes: ABC123XY, XYZ789AB
        </p>
      </motion.div>
    </div>
  );
};

export default BookingRedeemPage;
