import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ticket,
  Plus,
  Copy,
  Search,
  Filter,
  ChevronLeft,
  Calendar,
  Hash,
  Percent,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { BookingCode, BookingKind } from '../../types';

const AdminBookingCodesPage = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState<BookingCode[]>([
    {
      id: '1',
      code: 'ABC12345',
      creator_admin_id: 'admin1',
      label: 'Weekend Special',
      kind: '1X2',
      selections: [],
      total_odds: 3.5,
      redemption_count: 12,
      max_redemptions: 100,
      expires_at: '2026-05-01T23:59:59Z',
    },
    {
      id: '2',
      code: 'DEF67890',
      creator_admin_id: 'admin1',
      label: 'Champions League',
      kind: 'CORRECT_SCORE',
      selections: [],
      total_odds: 7.25,
      redemption_count: 5,
      max_redemptions: 50,
      expires_at: '2026-04-30T23:59:59Z',
    },
    {
      id: '3',
      code: 'GHI11223',
      creator_admin_id: 'admin1',
      label: 'Safe Bets',
      kind: 'HOME_WIN',
      selections: [],
      total_odds: 2.1,
      redemption_count: 45,
      max_redemptions: undefined,
      expires_at: undefined,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterKind, setFilterKind] = useState<BookingKind | 'ALL'>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const bookingKinds: (BookingKind | 'ALL')[] = [
    'ALL', '1X2', 'HOME_WIN', 'AWAY_WIN', 'CORRECT_SCORE', 'HANDICAP', 'HT_FT', 'BTTS', 'OVER_UNDER', 'MIXED'
  ];

  const filteredCodes = useMemo(() => {
    return codes.filter(code => {
      const matchesSearch = !searchTerm ||
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (code.label && code.label.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesKind = filterKind === 'ALL' || code.kind === filterKind;

      return matchesSearch && matchesKind;
    });
  }, [codes, searchTerm, filterKind]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getKindColor = (kind: BookingKind) => {
    const colors: Record<string, string> = {
      '1X2': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'HOME_WIN': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'AWAY_WIN': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'CORRECT_SCORE': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'HANDICAP': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'HT_FT': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'BTTS': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      'OVER_UNDER': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      'MIXED': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[kind] || colors['MIXED'];
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-2 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ticket className="w-6 h-6 text-blue-600" />
              Booking Codes
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/booking-codes/create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Code
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by code or label..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <div className="flex flex-wrap gap-2">
                {bookingKinds.map(kind => (
                  <button
                    key={kind}
                    onClick={() => setFilterKind(kind)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filterKind === kind
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {kind}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Codes</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredCodes.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Redemptions</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredCodes.reduce((sum, c) => sum + c.redemption_count, 0)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg. Odds</p>
            <p className="text-2xl font-bold text-blue-600">
              {(filteredCodes.reduce((sum, c) => sum + c.total_odds, 0) / filteredCodes.length || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCodes.map((code, index) => (
            <motion.div
              key={code.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="w-4 h-4 text-slate-400" />
                    <code className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {code.code}
                    </code>
                    <button
                      onClick={() => copyToClipboard(code.code)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      title="Copy code"
                    >
                      {copiedCode === code.code ? (
                        <span className="text-xs text-green-600">Copied!</span>
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </div>
                  {code.label && (
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {code.label}
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getKindColor(code.kind)}`}>
                  {code.kind}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Odds</span>
                  <span className="font-bold text-green-600">{code.total_odds.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Redemptions</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {code.redemption_count} / {code.max_redemptions || '∞'}
                  </span>
                </div>
                {code.expires_at && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>Expires: {new Date(code.expires_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {code.max_redemptions && (
                <div className="mb-4">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((code.redemption_count / code.max_redemptions) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {!filteredCodes.length && (
          <div className="text-center py-12 text-slate-500">
            No booking codes found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingCodesPage;
