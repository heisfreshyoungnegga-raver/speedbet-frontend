import React, { useState, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Mail,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronRight,
  Clock,
  Bot,
  AlertCircle,
} from 'lucide-react';

interface Prediction {
  id: string;
  match: string;
  kickoff: Date;
  predictedByAdmin: string;
  confidence: number;
  generatedAt: Date;
  reasoning: string;
  homeTeam: string;
  awayTeam: string;
}

const SuperAdminPredictionsPage: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: '1',
      match: 'Arsenal vs Chelsea',
      kickoff: new Date('2026-04-25T15:00:00'),
      predictedByAdmin: 'admin1@speedbet.com',
      confidence: 0.85,
      generatedAt: new Date('2026-04-23T10:00:00'),
      reasoning: 'Arsenal has won 7 of their last 10 home games. Chelsea is missing key players due to injury. Historical head-to-head favors Arsenal at home with 60% win rate.',
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
    },
    {
      id: '2',
      match: 'Liverpool vs Man City',
      kickoff: new Date('2026-04-26T17:30:00'),
      predictedByAdmin: 'admin2@speedbet.com',
      confidence: 0.62,
      generatedAt: new Date('2026-04-23T11:30:00'),
      reasoning: 'Close match expected. Both teams in good form. Liverpool has slight home advantage but City has better away record this season.',
      homeTeam: 'Liverpool',
      awayTeam: 'Man City',
    },
    {
      id: '3',
      match: 'Barcelona vs Real Madrid',
      kickoff: new Date('2026-04-27T20:00:00'),
      predictedByAdmin: 'admin1@speedbet.com',
      confidence: 0.45,
      generatedAt: new Date('2026-04-23T09:00:00'),
      reasoning: 'El Clasico is always unpredictable. Recent form suggests Barcelona might edge it at home, but Real Madrid has better squad depth for rotation.',
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
    },
    {
      id: '4',
      match: 'PSG vs Bayern Munich',
      kickoff: new Date('2026-04-28T19:00:00'),
      predictedByAdmin: 'suspended@speedbet.com',
      confidence: 0.92,
      generatedAt: new Date('2026-04-22T14:00:00'),
      reasoning: 'PSG in exceptional form at home. Bayern missing 3 key defenders. PSG has scored in every home game this season. Strong value on PSG win.',
      homeTeam: 'PSG',
      awayTeam: 'Bayern Munich',
    },
  ]);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [adminFilter, setAdminFilter] = useState<string>('ALL');
  const [confidenceFilter, setConfidenceFilter] = useState<'ALL' | 'GREEN' | 'AMBER' | 'RED'>('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-green-400 bg-green-900/50';
    if (confidence >= 0.5) return 'text-yellow-400 bg-yellow-900/50';
    return 'text-red-400 bg-red-900/50';
  };

  const getConfidenceLevel = (confidence: number): 'GREEN' | 'AMBER' | 'RED' => {
    if (confidence >= 0.7) return 'GREEN';
    if (confidence >= 0.5) return 'AMBER';
    return 'RED';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.7) return <TrendingUp className="w-4 h-4" />;
    if (confidence >= 0.5) return <Minus className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const filteredPredictions = predictions.filter((pred) => {
    const matchesSearch =
      pred.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pred.predictedByAdmin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAdmin = adminFilter === 'ALL' || pred.predictedByAdmin === adminFilter;
    const matchesConfidence =
      confidenceFilter === 'ALL' || getConfidenceLevel(pred.confidence) === confidenceFilter;
    const matchesDateRange =
      !dateRange.start || !dateRange.end
        ? true
        : pred.kickoff >= new Date(dateRange.start) && pred.kickoff <= new Date(dateRange.end);
    return matchesSearch && matchesAdmin && matchesConfidence && matchesDateRange;
  });

  const isGeneratedBeforeKickoff = (pred: Prediction) => {
    return pred.generatedAt < pred.kickoff;
  };

  const exportToCSV = () => {
    const headers = ['Match', 'Kickoff', 'Predicted By', 'Confidence', 'Generated At', 'Reasoning'];
    const rows = filteredPredictions.map((p) => [
      p.match,
      p.kickoff.toLocaleString(),
      p.predictedByAdmin,
      p.confidence.toString(),
      p.generatedAt.toLocaleString(),
      p.reasoning,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'predictions.csv';
    a.click();
  };

  const uniqueAdmins = [...new Set(predictions.map((p) => p.predictedByAdmin))];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">AI Predictions</h1>
            <p className="text-gray-400 mt-1">All AI predictions from all administrators</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by match or admin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <select
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Admins</option>
                {uniqueAdmins.map((admin) => (
                  <option key={admin} value={admin}>
                    {admin}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(e.target.value as 'ALL' | 'GREEN' | 'AMBER' | 'RED')}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Confidence</option>
                <option value="GREEN">Green (≥0.7)</option>
                <option value="AMBER">Amber (0.5-0.69)</option>
                <option value="RED">Red (&lt;0.5)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400 w-8"></th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Match</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Kickoff</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Predicted By</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Confidence</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Generated At</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPredictions.map((pred) => (
                  <React.Fragment key={pred.id}>
                    <tr className="hover:bg-gray-700/30 transition-colors">
                      <td className="p-4">
                        <button
                          onClick={() => toggleRow(pred.id)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {expandedRows.has(pred.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Bot className="w-4 h-4 text-blue-400" />
                          <span className="font-medium">{pred.match}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{pred.kickoff.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">{pred.predictedByAdmin}</span>
                      </td>
                      <td className="p-4">
                        <div
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(
                            pred.confidence
                          )}`}
                        >
                          {getConfidenceIcon(pred.confidence)}
                          <span>{(pred.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{pred.generatedAt.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {isGeneratedBeforeKickoff(pred) ? (
                          <span className="flex items-center space-x-1 text-green-400 text-xs">
                            <CheckCircle className="w-3 h-3" />
                            <span>Valid</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            <span>Invalid Timing</span>
                          </span>
                        )}
                      </td>
                    </tr>
                    {expandedRows.has(pred.id) && (
                      <tr className="bg-gray-900/30">
                        <td colSpan={7} className="p-4">
                          <div className="bg-gray-900/50 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-gray-300 mb-2">Full Reasoning</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">{pred.reasoning}</p>
                            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-xs text-gray-500">
                              <span>Generated: {pred.generatedAt.toLocaleString()}</span>
                              <span>Kickoff: {pred.kickoff.toLocaleString()}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPredictions.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No predictions found</p>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Predictions</p>
            <p className="text-2xl font-bold mt-1">{predictions.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-green-700/50 bg-green-900/10">
            <p className="text-green-400 text-sm">High Confidence (≥0.7)</p>
            <p className="text-2xl font-bold mt-1 text-green-400">
              {predictions.filter((p) => p.confidence >= 0.7).length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-red-700/50 bg-red-900/10">
            <p className="text-red-400 text-sm">Low Confidence (&lt;0.5)</p>
            <p className="text-2xl font-bold mt-1 text-red-400">
              {predictions.filter((p) => p.confidence < 0.5).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPredictionsPage;
