import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Plus,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Prediction } from '../../types';
import { formatDate } from '../../utils/formatting';

interface AdminPrediction extends Prediction {
  match?: {
    home_team: string;
    away_team: string;
    kickoff_at: string;
  };
  predicted_winner: string;
  is_published_to_users: boolean;
}

const AdminPredictionsPage = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<AdminPrediction[]>([
    {
      id: '1',
      match_id: 'm1',
      model: 'v2.1',
      generated_at: '2026-04-23T10:00:00Z',
      prediction: {
        win_probability: { home: 0.65, draw: 0.20, away: 0.15 },
        predicted_score: { home: 2, away: 1 },
        btts: false,
        over_under_25: 'OVER',
        correct_scores: [{ score: '2-1', prob: 0.35 }],
        confidence: 85,
        reasoning: 'Strong home form',
      },
      is_published_to_users: true,
      admin_note: 'Good value bet',
      match: {
        home_team: 'Manchester City',
        away_team: 'Arsenal',
        kickoff_at: '2026-04-24T15:00:00Z',
      },
      predicted_winner: 'Manchester City',
      shared_at: '2026-04-23T12:00:00Z',
    },
    {
      id: '2',
      match_id: 'm2',
      model: 'v2.1',
      generated_at: '2026-04-22T14:00:00Z',
      prediction: {
        win_probability: { home: 0.30, draw: 0.25, away: 0.45 },
        predicted_score: { home: 1, away: 2 },
        btts: true,
        over_under_25: 'OVER',
        correct_scores: [{ score: '1-2', prob: 0.28 }],
        confidence: 72,
        reasoning: 'Away team in better form',
      },
      is_published_to_users: false,
      match: {
        home_team: 'Liverpool',
        away_team: 'Chelsea',
        kickoff_at: '2026-04-25T17:30:00Z',
      },
      predicted_winner: 'Chelsea',
    },
    {
      id: '3',
      match_id: 'm3',
      model: 'v2.1',
      generated_at: '2026-04-21T09:00:00Z',
      prediction: {
        win_probability: { home: 0.40, draw: 0.35, away: 0.25 },
        predicted_score: { home: 1, away: 1 },
        btts: true,
        over_under_25: 'UNDER',
        correct_scores: [{ score: '1-1', prob: 0.42 }],
        confidence: 55,
        reasoning: 'Evenly matched teams',
      },
      is_published_to_users: true,
      match: {
        home_team: 'Tottenham',
        away_team: 'Manchester United',
        kickoff_at: '2026-04-23T20:00:00Z',
      },
      predicted_winner: 'Draw',
      shared_at: '2026-04-21T11:00:00Z',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterPublished, setFilterPublished] = useState<'ALL' | 'PUBLISHED' | 'UNPUBLISHED'>('ALL');

  const filteredPredictions = useMemo(() => {
    return predictions.filter(pred => {
      const matchesSearch = !searchTerm ||
        pred.match?.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pred.match?.away_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pred.predicted_winner.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDateRange = (!dateRange.start || pred.match?.kickoff_at >= dateRange.start) &&
        (!dateRange.end || pred.match?.kickoff_at <= dateRange.end);

      const matchesPublished =
        filterPublished === 'ALL' ? true :
        filterPublished === 'PUBLISHED' ? pred.is_published_to_users :
        !pred.is_published_to_users;

      return matchesSearch && matchesDateRange && matchesPublished;
    });
  }, [predictions, searchTerm, dateRange, filterPublished]);

  const togglePublish = (id: string) => {
    setPredictions(preds =>
      preds.map(p => p.id === id ? { ...p, is_published_to_users: !p.is_published_to_users } : p)
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600';
    if (confidence >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 70) return <TrendingUp size={16} />;
    if (confidence >= 40) return <Minus size={16} />;
    return <TrendingDown size={16} />;
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
              <Brain className="w-6 h-6 text-purple-600" />
              Predictions
            </h1>
          </div>
          <button
            onClick={() => navigate('/admin/predictions/run')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Run New Prediction
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by team or prediction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <div className="flex gap-2">
                {(['ALL', 'PUBLISHED', 'UNPUBLISHED'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterPublished(status)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filterPublished === status
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Predictions List */}
        <div className="space-y-4">
          {filteredPredictions.map((pred, index) => (
            <motion.div
              key={pred.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Match Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {pred.match?.home_team} vs {pred.match?.away_team}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Kickoff: {pred.match?.kickoff_at ? formatDate(pred.match.kickoff_at) : 'TBD'}
                  </p>
                </div>

                {/* Prediction Info */}
                <div className="flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Predicted Winner</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {pred.predicted_winner}
                  </p>
                </div>

                {/* Confidence */}
                <div className="flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    {getConfidenceIcon(pred.prediction.confidence)}
                    <span className={`font-bold ${getConfidenceColor(pred.prediction.confidence)}`}>
                      {pred.prediction.confidence}%
                    </span>
                  </div>
                </div>

                {/* Published Status Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePublish(pred.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pred.is_published_to_users
                        ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {pred.is_published_to_users ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Unpublished
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Admin Note */}
              {pred.admin_note && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Note: {pred.admin_note}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {!filteredPredictions.length && (
          <div className="text-center py-12 text-slate-500">
            No predictions found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPredictionsPage;
