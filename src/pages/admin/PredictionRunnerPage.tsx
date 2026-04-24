import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, Loader2, Send, MessageSquare, ToggleLeft, ToggleRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
}

interface PredictionResult {
  winProbabilities: { outcome: string; probability: number }[];
  predictedScore: { home: number; away: number };
  btts: { yes: number; no: number };
  overUnder25: { over: number; under: number };
  topScores: { score: string; probability: number }[];
  confidence: number;
  reasoning: string;
}

const mockMatches: Match[] = [
  { id: '1', homeTeam: 'Manchester City', awayTeam: 'Arsenal', league: 'Premier League', time: 'Today 20:00' },
  { id: '2', homeTeam: 'Liverpool', awayTeam: 'Chelsea', league: 'Premier League', time: 'Tomorrow 15:00' },
  { id: '3', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', league: 'La Liga', time: 'Sat 18:30' },
];

const PredictionRunnerPage = () => {
  const { theme } = useTheme();
  const [matchSearch, setMatchSearch] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [publishToUsers, setPublishToUsers] = useState(false);
  const [personalNote, setPersonalNote] = useState('');

  const filteredMatches = mockMatches.filter((m) =>
    `${m.homeTeam} ${m.awayTeam}`.toLowerCase().includes(matchSearch.toLowerCase())
  );

  const handleRunPrediction = async () => {
    if (!selectedMatch) return;
    setIsPredicting(true);
    setPrediction(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setPrediction({
      winProbabilities: [
        { outcome: 'Home', probability: 45 },
        { outcome: 'Draw', probability: 30 },
        { outcome: 'Away', probability: 25 },
      ],
      predictedScore: { home: 2, away: 1 },
      btts: { yes: 65, no: 35 },
      overUnder25: { over: 70, under: 30 },
      topScores: [
        { score: '2-1', probability: 18 },
        { score: '1-1', probability: 15 },
        { score: '2-0', probability: 12 },
      ],
      confidence: 78,
      reasoning: 'Manchester City has won 4 of their last 5 home games against Arsenal. Their attacking form has been exceptional with an average of 2.3 goals per game. Arsenal\'s defense has shown vulnerabilities in recent away matches.',
    });

    setIsPredicting(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600 dark:text-green-400';
    if (confidence >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 70) return 'bg-green-100 dark:bg-green-900/20';
    if (confidence >= 50) return 'bg-amber-100 dark:bg-amber-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Run Prediction
          </h1>

          {/* Match Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search Upcoming Match
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={matchSearch}
                onChange={(e) => setMatchSearch(e.target.value)}
                placeholder="Search for a match..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
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
                      <p className="text-sm text-slate-600 dark:text-slate-400">{match.league} • {match.time}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedMatch && (
              <div className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="font-semibold text-purple-700 dark:text-purple-300">
                  {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  {selectedMatch.league} • {selectedMatch.time}
                </p>
              </div>
            )}
          </div>

          {/* Run Prediction Button */}
          <button
            onClick={handleRunPrediction}
            disabled={isPredicting || !selectedMatch}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isPredicting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Prediction...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Run Prediction
              </>
            )}
          </button>
        </div>

        {/* Prediction Results */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Prediction Results</h2>

              {/* Predicted Score */}
              <div className="text-center mb-8">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Predicted Score</p>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-slate-900 dark:text-white">{prediction.predictedScore.home}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedMatch?.homeTeam}</p>
                  </div>
                  <p className="text-3xl text-slate-400">-</p>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-slate-900 dark:text-white">{prediction.predictedScore.away}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedMatch?.awayTeam}</p>
                  </div>
                </div>
              </div>

              {/* Win Probabilities Chart */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Win Probabilities</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={prediction.winProbabilities}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="outcome" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                    <Bar dataKey="probability" fill="#8b5cf6">
                      {prediction.winProbabilities.map((entry, index) => (
                        <Cell key={index} fill={index === 0 ? '#8b5cf6' : index === 1 ? '#f59e0b' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* BTTS and Over/Under */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">BTTS</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Yes</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{prediction.btts.yes}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${prediction.btts.yes}%` }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">No</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{prediction.btts.no}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${prediction.btts.no}%` }} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Over/Under 2.5</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Over 2.5</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{prediction.overUnder25.over}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${prediction.overUnder25.over}%` }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Under 2.5</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{prediction.overUnder25.under}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${prediction.overUnder25.under}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Correct Scores */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Top 3 Correct Scores</h3>
                <div className="space-y-2">
                  {prediction.topScores.map((score, index) => (
                    <div key={score.score} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">{score.score}</span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{score.probability}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Confidence Level</h3>
                <div className={`p-4 rounded-lg ${getConfidenceBg(prediction.confidence)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Confidence</span>
                    <span className={`text-2xl font-bold ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-white/50 dark:bg-slate-600/50 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        prediction.confidence >= 70 ? 'bg-green-500' :
                        prediction.confidence >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Reasoning</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{prediction.reasoning}</p>
              </div>

              {/* Publish and Note */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Publish to Users</span>
                  <button
                    onClick={() => setPublishToUsers(!publishToUsers)}
                    className="text-2xl"
                  >
                    {publishToUsers ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-400" />
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Add Personal Note
                  </label>
                  <textarea
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    placeholder="Add your analysis note..."
                  />
                </div>

                <button
                  onClick={() => {
                    // Handle publish
                  }}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {publishToUsers ? 'Publish with Note' : 'Save Prediction'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PredictionRunnerPage;
