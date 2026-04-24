import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveTv, Schedule, Trophy, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MatchCard from '../components/match/MatchCard';

// Mock data interfaces
interface Match {
  id: string;
  homeTeam: { id: string; name: string; badge: string; score?: number };
  awayTeam: { id: string; name: string; badge: string; score?: number };
  competition: { name: string; logo?: string };
  status: {
    isLive?: boolean;
    elapsedTime?: number;
    kickoffTime?: string;
    isFinished?: boolean;
    result?: 'home' | 'away' | 'draw';
  };
  odds?: { homeWin: number; draw: number; awayWin: number };
}

interface AITip {
  id: string;
  matchId: string;
  match: string;
  predictedOutcome: string;
  confidence: number;
  odds: number;
}

// Mock data
const liveMatches: Match[] = [
  {
    id: 'live-1',
    homeTeam: { id: 't1', name: 'Manchester United', badge: '/badges/man-utd.png', score: 2 },
    awayTeam: { id: 't2', name: 'Liverpool', badge: '/badges/liverpool.png', score: 1 },
    competition: { name: 'Premier League', logo: '/logos/premier-league.png' },
    status: { isLive: true, elapsedTime: 2340 },
    odds: { homeWin: 1.85, draw: 3.50, awayWin: 4.20 },
  },
  {
    id: 'live-2',
    homeTeam: { id: 't3', name: 'Barcelona', badge: '/badges/barcelona.png', score: 0 },
    awayTeam: { id: 't4', name: 'Real Madrid', badge: '/badges/real-madrid.png', score: 0 },
    competition: { name: 'La Liga', logo: '/logos/la-liga.png' },
    status: { isLive: true, elapsedTime: 1200 },
    odds: { homeWin: 2.10, draw: 3.40, awayWin: 3.80 },
  },
];

const upcomingMatches: Match[] = [
  {
    id: 'up-1',
    homeTeam: { id: 't5', name: 'Arsenal', badge: '/badges/arsenal.png' },
    awayTeam: { id: 't6', name: 'Chelsea', badge: '/badges/chelsea.png' },
    competition: { name: 'Premier League', logo: '/logos/premier-league.png' },
    status: { kickoffTime: 'Today 20:00' },
    odds: { homeWin: 2.05, draw: 3.30, awayWin: 3.60 },
  },
  {
    id: 'up-2',
    homeTeam: { id: 't7', name: 'Bayern Munich', badge: '/badges/bayern.png' },
    awayTeam: { id: 't8', name: 'Dortmund', badge: '/badges/dortmund.png' },
    competition: { name: 'Bundesliga', logo: '/logos/bundesliga.png' },
    status: { kickoffTime: 'Tomorrow 18:30' },
    odds: { homeWin: 1.65, draw: 4.00, awayWin: 5.50 },
  },
  {
    id: 'up-3',
    homeTeam: { id: 't9', name: 'PSG', badge: '/badges/psg.png' },
    awayTeam: { id: 't10', name: 'Marseille', badge: '/badges/marseille.png' },
    competition: { name: 'Ligue 1', logo: '/logos/ligue1.png' },
    status: { kickoffTime: 'Sat 15:00' },
    odds: { homeWin: 1.45, draw: 4.50, awayWin: 7.00 },
  },
];

const recentResults: Match[] = [
  {
    id: 'res-1',
    homeTeam: { id: 't11', name: 'Manchester City', badge: '/badges/man-city.png', score: 3 },
    awayTeam: { id: 't12', name: 'Newcastle', badge: '/badges/newcastle.png', score: 1 },
    competition: { name: 'Premier League', logo: '/logos/premier-league.png' },
    status: { isFinished: true, result: 'home' },
  },
  {
    id: 'res-2',
    homeTeam: { id: 't13', name: 'Juventus', badge: '/badges/juventus.png', score: 1 },
    awayTeam: { id: 't14', name: 'Inter Milan', badge: '/badges/inter.png', score: 1 },
    competition: { name: 'Serie A', logo: '/logos/serie-a.png' },
    status: { isFinished: true, result: 'draw' },
  },
];

const aiTips: AITip[] = [
  { id: 'tip-1', matchId: 'up-1', match: 'Arsenal vs Chelsea', predictedOutcome: 'Arsenal Win', confidence: 78, odds: 2.05 },
  { id: 'tip-2', matchId: 'up-2', match: 'Bayern vs Dortmund', predictedOutcome: 'Over 2.5 Goals', confidence: 85, odds: 1.65 },
  { id: 'tip-3', matchId: 'live-1', match: 'Man Utd vs Liverpool', predictedOutcome: 'Both Teams Score', confidence: 72, odds: 1.80 },
];

// Bet Slip Drawer Component
const BetSlipDrawer: React.FC<{ isOpen: boolean; onClose: () => void; isMobile: boolean }> = ({
  isOpen,
  onClose,
  isMobile,
}) => {
  const [selections, setSelections] = useState<Array<{ id: string; match: string; selection: string; odds: number }>>([
    { id: '1', match: 'Man Utd vs Liverpool', selection: 'Home Win', odds: 1.85 },
    { id: '2', match: 'Arsenal vs Chelsea', selection: 'Over 2.5', odds: 1.95 },
  ]);

  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const stake = 100;
  const potentialWin = stake * totalOdds;

  if (!isOpen) return null;

  const content = (
    <div className="h-full flex flex-col bg-[#1a1d2e]">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="text-white font-bold text-lg">Bet Slip ({selections.length})</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {selections.map((sel) => (
          <div key={sel.id} className="bg-[#0f1119] rounded-lg p-3 border border-gray-800/50">
            <div className="text-sm text-white font-medium mb-1">{sel.match}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{sel.selection}</span>
              <span className="text-[#FFD700] font-bold">{sel.odds.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-800 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Odds</span>
          <span className="text-white font-bold">{totalOdds.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Stake"
            defaultValue={stake}
            className="flex-1 bg-[#0f1119] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF6A00]"
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">To Win</span>
          <span className="text-[#FFD700] font-bold">{potentialWin.toFixed(2)}</span>
        </div>
        <button className="w-full bg-[#FF6A00] hover:bg-[#FF8533] text-white font-bold py-3 rounded-lg transition-colors">
          Place Bet
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed bottom-0 left-0 right-0 h-[70vh] z-50 rounded-t-2xl overflow-hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 360 }}
      exit={{ width: 0 }}
      className="h-screen border-l border-gray-800 overflow-hidden"
    >
      {content}
    </motion.div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [betSlipOpen, setBetSlipOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'live' | 'upcoming' | 'results'>('live');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMatchClick = useCallback((matchId: string) => {
    navigate(`/matches/${matchId}`);
  }, [navigate]);

  const handleAddToSlip = useCallback((data: { matchId: string; market: string; selection: string; odds: number }) => {
    const isAuthenticated = false;
    if (!isAuthenticated) {
      alert('Please login to add selections to bet slip');
      return;
    }
    setBetSlipOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1119]">
      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 ${!isMobile && betSlipOpen ? 'mr-[360px]' : ''} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
            
            {/* LIVE NOW Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <LiveTv className="w-5 h-5 text-[#FF6A00]" />
                  <h2 className="text-white text-xl font-bold">Live Now</h2>
                </div>
                <span className="bg-[#FF6A00] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {liveMatches.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    matchId={match.id}
                    variant="live"
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                    competition={match.competition}
                    status={match.status}
                    odds={match.odds}
                    onClick={handleMatchClick}
                    onAddToSlip={handleAddToSlip}
                  />
                ))}
              </div>
            </section>

            {/* AI Tips Strip */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                <h2 className="text-white text-xl font-bold">AI Predictions</h2>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {aiTips.map((tip) => (
                  <motion.div
                    key={tip.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex-shrink-0 w-72 bg-gradient-to-br from-[#1a1d2e] to-[#252840] rounded-xl border border-[#FFD700]/20 p-4"
                  >
                    <div className="text-sm text-gray-300 mb-2">{tip.match}</div>
                    <div className="text-white font-bold mb-3">{tip.predictedOutcome}</div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-[#FFD700] font-semibold">{tip.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#FF6A00] to-[#FFD700] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${tip.confidence}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#FFD700] font-bold">{tip.odds.toFixed(2)}</span>
                      <button
                        onClick={() => handleAddToSlip({
                          matchId: tip.matchId,
                          market: 'AI Prediction',
                          selection: tip.predictedOutcome,
                          odds: tip.odds,
                        })}
                        className="bg-[#FF6A00] hover:bg-[#FF8533] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Add to Slip
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Section Tabs */}
            <div className="flex gap-2 border-b border-gray-800">
              {(['live', 'upcoming', 'results'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`
                    px-4 py-2 text-sm font-semibold capitalize transition-colors
                    ${activeSection === section
                      ? 'text-[#FF6A00] border-b-2 border-[#FF6A00]'
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* UPCOMING Section */}
            {activeSection === 'upcoming' && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Schedule className="w-5 h-5 text-blue-400" />
                  <h2 className="text-white text-xl font-bold">Upcoming</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      matchId={match.id}
                      variant="upcoming"
                      homeTeam={match.homeTeam}
                      awayTeam={match.awayTeam}
                      competition={match.competition}
                      status={match.status}
                      odds={match.odds}
                      onClick={handleMatchClick}
                      onAddToSlip={handleAddToSlip}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* RECENT RESULTS Section */}
            {activeSection === 'results' && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-5 h-5 text-[#FFD700]" />
                  <h2 className="text-white text-xl font-bold">Recent Results</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentResults.map((match) => (
                    <MatchCard
                      key={match.id}
                      matchId={match.id}
                      variant="result"
                      homeTeam={match.homeTeam}
                      awayTeam={match.awayTeam}
                      competition={match.competition}
                      status={match.status}
                      onClick={handleMatchClick}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Live Now also shown in tab */}
            {activeSection === 'live' && (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    matchId={match.id}
                    variant="live"
                    homeTeam={match.homeTeam}
                    awayTeam={match.awayTeam}
                    competition={match.competition}
                    status={match.status}
                    odds={match.odds}
                    onClick={handleMatchClick}
                    onAddToSlip={handleAddToSlip}
                  />
                ))}
              </section>
            )}

          </div>
        </div>

        {/* Bet Slip Widget (Desktop) */}
        {!isMobile && (
          <BetSlipDrawer
            isOpen={betSlipOpen}
            onClose={() => setBetSlipOpen(false)}
            isMobile={false}
          />
        )}
      </div>

      {/* Bet Slip Toggle (Mobile) */}
      {isMobile && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setBetSlipOpen(true)}
          className="fixed bottom-4 right-4 bg-[#FF6A00] text-white rounded-full px-6 py-3 font-bold shadow-lg z-30 flex items-center gap-2"
        >
          <span>Bet Slip</span>
          <span className="bg-white text-[#FF6A00] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            2
          </span>
        </motion.button>
      )}

      {/* Bet Slip Drawer (Mobile) */}
      {isMobile && (
        <BetSlipDrawer
          isOpen={betSlipOpen}
          onClose={() => setBetSlipOpen(false)}
          isMobile={true}
        />
      )}
    </div>
  );
};

export default HomePage;
