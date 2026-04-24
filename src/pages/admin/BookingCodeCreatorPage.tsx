import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Plus, X, Copy, Send, Loader2, Calendar, Hash } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type BookingCodeType = '1X2' | 'HOME_WIN' | 'AWAY_WIN' | 'CORRECT_SCORE' | 'HANDICAP' | 'HT_FT' | 'BTTS' | 'OVER_UNDER' | 'MIXED_ACCUMULATOR';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
}

const mockMatches: Match[] = [
  { id: '1', homeTeam: 'Manchester City', awayTeam: 'Arsenal', league: 'Premier League' },
  { id: '2', homeTeam: 'Liverpool', awayTeam: 'Chelsea', league: 'Premier League' },
  { id: '3', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', league: 'La Liga' },
  { id: '4', homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund', league: 'Bundesliga' },
];

const bookingCodeTypes: { value: BookingCodeType; label: string }[] = [
  { value: '1X2', label: '1X2 (Home/Draw/Away)' },
  { value: 'HOME_WIN', label: 'Home Win' },
  { value: 'AWAY_WIN', label: 'Away Win' },
  { value: 'CORRECT_SCORE', label: 'Correct Score' },
  { value: 'HANDICAP', label: 'Handicap' },
  { value: 'HT_FT', label: 'Half Time / Full Time' },
  { value: 'BTTS', label: 'Both Teams to Score' },
  { value: 'OVER_UNDER', label: 'Over/Under' },
  { value: 'MIXED_ACCUMULATOR', label: 'Mixed Accumulator' },
];

const generateBookingCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const BookingCodeCreatorPage = () => {
  const [selectedType, setSelectedType] = useState<BookingCodeType>('1X2');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedMatches, setSelectedMatches] = useState<Match[]>([]);
  const [matchSearch, setMatchSearch] = useState('');
  const [label, setLabel] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [maxRedemptions, setMaxRedemptions] = useState('100');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredMatches = mockMatches.filter((m) =>
    `${m.homeTeam} ${m.awayTeam}`.toLowerCase().includes(matchSearch.toLowerCase())
  );

  const handleAddMatch = (match: Match) => {
    if (!selectedMatches.find((m) => m.id === match.id)) {
      setSelectedMatches([...selectedMatches, match]);
    }
    setMatchSearch('');
  };

  const handleRemoveMatch = (id: string) => {
    setSelectedMatches(selectedMatches.filter((m) => m.id !== id));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setGeneratedCode(generateBookingCode());
    setIsGenerating(false);
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
    }
  };

  const handleShareWhatsApp = () => {
    if (generatedCode) {
      const url = `https://wa.me/?text=${encodeURIComponent(`SpeedBet Booking Code: ${generatedCode} - Use this code to place your bet!`)}`;
      window.open(url, '_blank');
    }
  };

  const handleShareTelegram = () => {
    if (generatedCode) {
      const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(`SpeedBet Booking Code: ${generatedCode}`)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-blue-600" />
            Create Booking Code
          </h1>

          <div className="space-y-6">
            {/* Code Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Booking Code Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as BookingCodeType)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {bookingCodeTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Single Match Selector (not for MIXED_ACCUMULATOR) */}
            {selectedType !== 'MIXED_ACCUMULATOR' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Match
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={matchSearch}
                    onChange={(e) => setMatchSearch(e.target.value)}
                    placeholder="Search for a match..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {matchSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 max-h-48 overflow-auto">
                      {filteredMatches.map((match) => (
                        <button
                          key={match.id}
                          onClick={() => {
                            setSelectedMatch(match);
                            setMatchSearch('');
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                        >
                          <p className="font-medium text-slate-900 dark:text-white">{match.homeTeam} vs {match.awayTeam}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{match.league}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedMatch && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                    <span className="text-blue-700 dark:text-blue-300">
                      {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                    </span>
                    <button onClick={() => setSelectedMatch(null)} className="text-blue-600 hover:text-blue-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Multi-Match Selector (for MIXED_ACCUMULATOR) */}
            {selectedType === 'MIXED_ACCUMULATOR' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Matches
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={matchSearch}
                    onChange={(e) => setMatchSearch(e.target.value)}
                    placeholder="Search and add matches..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {matchSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 max-h-48 overflow-auto">
                      {filteredMatches.map((match) => (
                        <button
                          key={match.id}
                          onClick={() => handleAddMatch(match)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                        >
                          <p className="font-medium text-slate-900 dark:text-white">{match.homeTeam} vs {match.awayTeam}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{match.league}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  {selectedMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="text-slate-900 dark:text-white">
                        {match.homeTeam} vs {match.awayTeam}
                      </span>
                      <button onClick={() => handleRemoveMatch(match.id)} className="text-red-500 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Weekend Special"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Expires At */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Expires At
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Max Redemptions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Max Redemptions
              </label>
              <input
                type="number"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!selectedMatch && selectedType !== 'MIXED_ACCUMULATOR') || (selectedType === 'MIXED_ACCUMULATOR' && selectedMatches.length === 0)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Code'
              )}
            </button>
          </div>
        </div>

        {/* Generated Code Display */}
        {generatedCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Generated Booking Code</h2>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white text-center">
              <p className="text-sm opacity-80 mb-2">{label || 'Booking Code'}</p>
              <p className="text-4xl font-bold tracking-wider mb-4">{generatedCode}</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={handleShareTelegram}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingCodeCreatorPage;
