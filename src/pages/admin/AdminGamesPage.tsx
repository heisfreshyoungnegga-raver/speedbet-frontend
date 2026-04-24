import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Plus,
  ChevronLeft,
  Trophy,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Edit3,
  Search,
  Filter,
  Play,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { Game, VirtualMatch } from '../../types';

interface CustomGame extends Game {
  home_team: string;
  away_team: string;
  kickoff_at: string;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  score_home?: number;
  score_away?: number;
  available_in_arcade: boolean;
  available_in_virtuals: boolean;
  created_at: string;
}

const AdminGamesPage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<CustomGame[]>([
    {
      id: '1',
      slug: 'custom-super-match-1',
      name: 'Super Derby Special',
      type: 'admin_custom',
      max_payout: 10000,
      description: 'Special admin-created derby match',
      special: true,
      home_team: 'Lions FC',
      away_team: 'Eagles United',
      kickoff_at: '2026-04-25T18:00:00Z',
      status: 'UPCOMING',
      available_in_arcade: true,
      available_in_virtuals: false,
      created_at: '2026-04-20T10:00:00Z',
    },
    {
      id: '2',
      slug: 'custom-charity-cup',
      name: 'Charity Cup Final',
      type: 'admin_custom',
      max_payout: 5000,
      description: 'Charity tournament final',
      special: true,
      home_team: 'Stars XI',
      away_team: 'Galaxy FC',
      kickoff_at: '2026-04-22T15:00:00Z',
      status: 'FINISHED',
      score_home: 2,
      score_away: 1,
      available_in_arcade: true,
      available_in_virtuals: true,
      created_at: '2026-04-18T09:00:00Z',
    },
    {
      id: '3',
      slug: 'custom-speed-challenge',
      name: 'Speed Challenge',
      type: 'admin_custom',
      max_payout: 2000,
      description: 'Fast-paced mini tournament',
      special: false,
      home_team: 'Flash Rangers',
      away_team: 'Thunder Bolts',
      kickoff_at: '2026-04-26T20:00:00Z',
      status: 'UPCOMING',
      available_in_arcade: false,
      available_in_virtuals: true,
      created_at: '2026-04-21T14:30:00Z',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showResultModal, setShowResultModal] = useState<string | null>(null);
  const [resultForm, setResultForm] = useState({ home: 0, away: 0 });
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'UPCOMING' | 'LIVE' | 'FINISHED'>('ALL');

  const filteredGames = games.filter(game => {
    const matchesSearch = !searchTerm ||
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.away_team.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || game.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const toggleActive = (id: string) => {
    setGames(games.map(g =>
      g.id === id ? { ...g, special: !g.special } : g
    ));
  };

  const toggleArcade = (id: string) => {
    setGames(games.map(g =>
      g.id === id ? { ...g, available_in_arcade: !g.available_in_arcade } : g
    ));
  };

  const toggleVirtuals = (id: string) => {
    setGames(games.map(g =>
      g.id === id ? { ...g, available_in_virtuals: !g.available_in_virtuals } : g
    ));
  };

  const setResult = (id: string) => {
    setGames(games.map(g =>
      g.id === id
        ? { ...g, status: 'FINISHED' as const, score_home: resultForm.home, score_away: resultForm.away }
        : g
    ));
    setShowResultModal(null);
    setResultForm({ home: 0, away: 0 });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UPCOMING': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'LIVE': return <Play className="w-4 h-4 text-green-500" />;
      case 'FINISHED': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'LIVE': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'FINISHED': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default: return '';
    }
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
              <Gamepad2 className="w-6 h-6 text-indigo-600" />
              Custom Games
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/games/create')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Game
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              {(['ALL', 'UPCOMING', 'LIVE', 'FINISHED'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filterStatus === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {game.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(game.status)}
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(game.status)}`}>
                        {game.status}
                      </span>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                    <Edit3 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Match Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {game.home_team}
                    </span>
                    {game.status === 'FINISHED' && game.score_home !== undefined ? (
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {game.score_home} - {game.score_away}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">vs</span>
                    )}
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {game.away_team}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(game.kickoff_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Availability Toggles */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Arcade</span>
                    <button
                      onClick={() => toggleArcade(game.id)}
                      className="flex items-center gap-1"
                    >
                      {game.available_in_arcade ? (
                        <ToggleRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Virtuals</span>
                    <button
                      onClick={() => toggleVirtuals(game.id)}
                      className="flex items-center gap-1"
                    >
                      {game.available_in_virtuals ? (
                        <ToggleRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  {game.status === 'FINISHED' && (
                    <button
                      onClick={() => {
                        setShowResultModal(game.id);
                        setResultForm({ home: game.score_home || 0, away: game.score_away || 0 });
                      }}
                      className="flex-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 transition-colors"
                    >
                      Edit Result
                    </button>
                  )}
                  {game.status !== 'FINISHED' && (
                    <button
                      onClick={() => {
                        setShowResultModal(game.id);
                        setResultForm({ home: 0, away: 0 });
                      }}
                      className="flex-1 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 transition-colors"
                    >
                      Set Result
                    </button>
                  )}
                  <button
                    onClick={() => toggleActive(game.id)}
                    className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      game.special
                        ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {game.special ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!filteredGames.length && (
          <div className="text-center py-12 text-slate-500">
            No custom games found matching your criteria
          </div>
        )}
      </div>

      {/* Set Result Modal */}
      <AnimatePresence>
        {showResultModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResultModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Set Match Result
              </h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {games.find(g => g.id === showResultModal)?.home_team}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={resultForm.home}
                    onChange={(e) => setResultForm({ ...resultForm, home: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-center text-lg font-bold"
                  />
                </div>
                <span className="text-2xl font-bold text-slate-400">-</span>
                <div className="flex-1">
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {games.find(g => g.id === showResultModal)?.away_team}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={resultForm.away}
                    onChange={(e) => setResultForm({ ...resultForm, away: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-center text-lg font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setResult(game.id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Result
                </button>
                <button
                  onClick={() => setShowResultModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGamesPage;
