import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  YellowCard,
  RedCard,
  Substitution,
  Goal,
  BarChart3,
  List,
  MessageSquare,
  Users,
  Trophy,
  ChevronRight,
  Flashlight,
  AlertCircle,
} from 'lucide-react';
import ScoreBanner from '../components/match/ScoreBanner';
import OddsButton from '../components/match/OddsButton';

// Mock data interfaces
interface MatchData {
  id: string;
  homeTeam: { id: string; name: string; badge: string; score: number };
  awayTeam: { id: string; name: string; badge: string; score: number };
  competition: { name: string; round?: string; logo?: string };
  status: 'live' | 'upcoming' | 'finished';
  elapsedTime?: number;
  kickoffTime?: string;
  venue?: string;
}

interface MatchEvent {
  id: string;
  type: 'goal' | 'card' | 'substitution' | 'yellow_card' | 'red_card';
  minute: number;
  team: 'home' | 'away';
  player?: string;
  assist?: string;
  cardType?: 'yellow' | 'red';
  playerOut?: string;
  playerIn?: string;
}

interface MatchStats {
  possession: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  totalShots: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  cards: { home: number; away: number };
  xG: { home: number; away: number };
}

type TabType = 'stats' | 'events' | 'commentary' | 'lineups' | 'odds';
type OddsTabType = '1X2' | 'Home Win' | 'Away Win' | 'OU' | 'Handicap' | 'CS' | 'HT/FT' | 'BTTS' | 'DC' | 'Live';

const MatchDetailsPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [activeOddsTab, setActiveOddsTab] = useState<OddsTabType>('1X2');
  const [matchData] = useState<MatchData>({
    id: matchId || '1',
    homeTeam: { id: 'h1', name: 'Manchester United', badge: '/badges/man-utd.png', score: 2 },
    awayTeam: { id: 'a1', name: 'Liverpool', badge: '/badges/liverpool.png', score: 1 },
    competition: { name: 'Premier League', round: 'Gameweek 29', logo: '/logos/premier-league.png' },
    status: 'live',
    elapsedTime: 2340,
    venue: 'Old Trafford, Manchester',
  });

  const [events, setEvents] = useState<MatchEvent[]>([
    { id: '1', type: 'goal', minute: 23, team: 'home', player: 'Bruno Fernandes', assist: 'Marcus Rashford' },
    { id: '2', type: 'yellow_card', minute: 35, team: 'away', player: 'Virgil van Dijk', cardType: 'yellow' },
    { id: '3', type: 'goal', minute: 45, team: 'away', player: 'Mohamed Salah' },
    { id: '4', type: 'substitution', minute: 60, team: 'home', playerOut: 'Jadon Sancho', playerIn: 'Alejandro Garnacho' },
    { id: '5', type: 'goal', minute: 78, team: 'home', player: 'Marcus Rashford', assist: 'Bruno Fernandes' },
  ]);

  const [stats, setStats] = useState<MatchStats>({
    possession: { home: 55, away: 45 },
    shotsOnTarget: { home: 6, away: 4 },
    totalShots: { home: 12, away: 9 },
    corners: { home: 5, away: 3 },
    fouls: { home: 8, away: 11 },
    cards: { home: 1, away: 3 },
    xG: { home: 1.8, away: 1.2 },
  });

  const [commentary, setCommentary] = useState<Array<{ id: string; minute: number; text: string }>>([
    { id: '1', minute: 78, text: 'GOAL! Marcus Rashford scores for Manchester United!' },
    { id: '2', minute: 60, text: 'Substitution for United: Garnacho replaces Sancho' },
    { id: '3', minute: 45, text: 'GOAL! Salah equalizes for Liverpool!' },
  ]);

  // Mock WebSocket updates for stats
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const commentaryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (matchData.status === 'live') {
      statsIntervalRef.current = setInterval(() => {
        setStats(prev => ({
          possession: {
            home: Math.min(100, Math.max(0, prev.possession.home + (Math.random() > 0.5 ? 1 : -1))),
            away: Math.min(100, Math.max(0, prev.possession.away + (Math.random() > 0.5 ? 1 : -1))),
          },
          shotsOnTarget: { home: prev.shotsOnTarget.home, away: prev.shotsOnTarget.away },
          totalShots: { home: prev.totalShots.home, away: prev.totalShots.away },
          corners: { home: prev.corners.home, away: prev.corners.away },
          fouls: { home: prev.fouls.home, away: prev.fouls.away },
          cards: { home: prev.cards.home, away: prev.cards.away },
          xG: { home: prev.xG.home, away: prev.xG.away },
        }));
      }, 15000);

      commentaryIntervalRef.current = setInterval(() => {
        const newMinute = matchData.elapsedTime ? Math.floor(matchData.elapsedTime / 60) : 90;
        setCommentary(prev => [...prev, {
          id: Date.now().toString(),
          minute: newMinute,
          text: 'The match continues...',
        }]);
      }, 30000);
    }

    return () => {
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
      if (commentaryIntervalRef.current) clearInterval(commentaryIntervalRef.current);
    };
  }, [matchData.status, matchData.elapsedTime]);

  const handleAddToSlip = useCallback((data: { matchId: string; market: string; selection: string; odds: number }) => {
    const isAuthenticated = false;
    if (!isAuthenticated) {
      alert('Please login to add selections to bet slip');
      return;
    }
  }, []);

  const StatBar: React.FC<{ label: string; homeValue: number; awayValue: number; suffix?: string; decimals?: number }> = ({
    label,
    homeValue,
    awayValue,
    suffix = '',
    decimals = 0,
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1">
          <span className="text-white font-semibold text-xs w-10 text-right">
            {decimals > 0 ? homeValue.toFixed(decimals) : homeValue}{suffix}
          </span>
          <div className="flex-1 bg-gray-700/30 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${homeValue}%` }}
              className="h-full bg-blue-500 rounded-full"
            />
          </div>
        </div>
        <div className="flex-1 flex items-center gap-1">
          <div className="flex-1 bg-gray-700/30 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${awayValue}%` }}
              className="h-full bg-red-500 rounded-full ml-auto"
            />
          </div>
          <span className="text-white font-semibold text-xs w-10">
            {decimals > 0 ? awayValue.toFixed(decimals) : awayValue}{suffix}
          </span>
        </div>
      </div>
    </div>
  );

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return <Goal className="w-4 h-4 text-[#FFD700]" />;
      case 'yellow_card':
        return <YellowCard className="w-4 h-4 text-yellow-400" />;
      case 'red_card':
        return <RedCard className="w-4 h-4 text-red-500" />;
      case 'substitution':
        return <Substitution className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const oddsTabs: OddsTabType[] = ['1X2', 'Home Win', 'Away Win', 'OU', 'Handicap', 'CS', 'HT/FT', 'BTTS', 'DC', 'Live'];

  const getOddsForTab = (tab: OddsTabType) => {
    const baseOdds = {
      '1X2': [
        { selection: '1', odds: 1.85 },
        { selection: 'X', odds: 3.50 },
        { selection: '2', odds: 4.20 },
      ],
      'Home Win': [
        { selection: 'Home', odds: 1.85 },
        { selection: 'Draw', odds: 3.50 },
      ],
      'Away Win': [
        { selection: 'Away', odds: 4.20 },
        { selection: 'Draw', odds: 3.50 },
      ],
      'OU': [
        { selection: 'O 2.5', odds: 1.65 },
        { selection: 'U 2.5', odds: 2.25 },
      ],
      'Handicap': [
        { selection: 'H -1', odds: 2.10 },
        { selection: 'A +1', odds: 1.80 },
      ],
      'CS': [
        { selection: 'Home CS', odds: 2.50 },
        { selection: 'Away CS', odds: 3.00 },
      ],
      'HT/FT': [
        { selection: 'H/H', odds: 2.75 },
        { selection: 'D/D', odds: 4.50 },
        { selection: 'A/A', odds: 7.00 },
      ],
      'BTTS': [
        { selection: 'Yes', odds: 1.80 },
        { selection: 'No', odds: 2.00 },
      ],
      'DC': [
        { selection: '1X', odds: 1.25 },
        { selection: '12', odds: 1.30 },
        { selection: '2X', odds: 1.40 },
      ],
      'Live': [
        { selection: 'Next Goal H', odds: 2.10 },
        { selection: 'Next Goal A', odds: 2.50 },
      ],
    };
    return baseOdds[tab] || [];
  };

  return (
    <div className="min-h-screen bg-[#0f1119]">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Score Banner */}
      <ScoreBanner
        homeTeam={matchData.homeTeam}
        awayTeam={matchData.awayTeam}
        status={matchData.status}
        competition={matchData.competition}
        kickoffTime={matchData.kickoffTime}
        elapsedTime={matchData.elapsedTime}
        venue={matchData.venue}
      />

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto border-b border-gray-800 mt-4 scrollbar-hide">
          {(['stats', 'events', 'commentary', 'lineups', 'odds'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap
                transition-colors border-b-2
                ${activeTab === tab
                  ? 'text-[#FF6A00] border-[#FF6A00]'
                  : 'text-gray-400 border-transparent hover:text-white'
                }
              `}
            >
              {tab === 'stats' && <BarChart3 className="w-4 h-4" />}
              {tab === 'events' && <List className="w-4 h-4" />}
              {tab === 'commentary' && <MessageSquare className="w-4 h-4" />}
              {tab === 'lineups' && <Users className="w-4 h-4" />}
              {tab === 'odds' && <Trophy className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-white text-lg font-bold mb-4">Match Statistics</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1a1d2e] rounded-xl p-6 space-y-4">
                <h4 className="text-white font-semibold mb-4">Match Stats</h4>
                <StatBar label="Possession" homeValue={stats.possession.home} awayValue={stats.possession.away} suffix="%" />
                <StatBar label="Shots on Target" homeValue={stats.shotsOnTarget.home} awayValue={stats.shotsOnTarget.away} />
                <StatBar label="Total Shots" homeValue={stats.totalShots.home} awayValue={stats.totalShots.away} />
                <StatBar label="Corners" homeValue={stats.corners.home} awayValue={stats.corners.away} />
                <StatBar label="Fouls" homeValue={stats.fouls.home} awayValue={stats.fouls.away} />
                <StatBar label="Cards" homeValue={stats.cards.home} awayValue={stats.cards.away} />
              </div>

              <div className="bg-[#1a1d2e] rounded-xl p-6 space-y-4">
                <h4 className="text-white font-semibold mb-4">Expected Goals (xG)</h4>
                <StatBar label="xG" homeValue={stats.xG.home} awayValue={stats.xG.away} decimals={1} />
                
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{stats.xG.home.toFixed(1)}</div>
                      <div className="text-xs text-gray-400 mt-1">{matchData.homeTeam.name}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{stats.xG.away.toFixed(1)}</div>
                      <div className="text-xs text-gray-400 mt-1">{matchData.awayTeam.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white text-lg font-bold mb-6">Match Events</h3>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700" />
              
              <div className="space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-4 ${event.team === 'away' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-12 text-right text-sm text-gray-400 font-semibold pt-1">
                      {event.minute}'
                    </div>
                    
                    <div className="relative z-10 w-12 flex justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#1a1d2e] border-2 border-gray-700 flex items-center justify-center">
                        {getEventIcon(event.type)}
                      </div>
                    </div>

                    <div className={`flex-1 bg-[#1a1d2e] rounded-lg p-3 ${event.team === 'away' ? 'text-right' : ''}`}>
                      {event.type === 'goal' && (
                        <div>
                          <div className="text-white font-semibold">{event.player}</div>
                          {event.assist && (
                            <div className="text-xs text-gray-400">Assist: {event.assist}</div>
                          )}
                        </div>
                      )}
                      {event.type === 'yellow_card' && (
                        <div className="text-yellow-400">Yellow Card: {event.player}</div>
                      )}
                      {event.type === 'red_card' && (
                        <div className="text-red-500">Red Card: {event.player}</div>
                      )}
                      {event.type === 'substitution' && (
                        <div className="text-blue-400">
                          ↻ {event.playerOut} → {event.playerIn}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Commentary Tab */}
        {activeTab === 'commentary' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white text-lg font-bold mb-6">Live Commentary</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {commentary.map((item) => (
                <div key={item.id} className="bg-[#1a1d2e] rounded-lg p-4 flex gap-3">
                  <span className="text-[#FF6A00] font-bold text-sm w-12">{item.minute}'</span>
                  <p className="text-gray-300 text-sm flex-1">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Lineups Tab */}
        {activeTab === 'lineups' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white text-lg font-bold mb-6">Lineups</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1a1d2e] rounded-xl p-6">
                <div className="text-center mb-4">
                  <img src={matchData.homeTeam.badge} alt={matchData.homeTeam.name} className="w-16 h-16 mx-auto mb-2" />
                  <h4 className="text-white font-bold">{matchData.homeTeam.name}</h4>
                  <p className="text-xs text-gray-400">4-3-3 Formation</p>
                </div>
                <div className="space-y-2">
                  {['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'FWD'].map((pos, i) => (
                    <div key={i} className="bg-[#0f1119] rounded-lg px-4 py-2 text-sm text-white flex justify-between">
                      <span>Player {i + 1}</span>
                      <span className="text-gray-400">{pos}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a1d2e] rounded-xl p-6">
                <div className="text-center mb-4">
                  <img src={matchData.awayTeam.badge} alt={matchData.awayTeam.name} className="w-16 h-16 mx-auto mb-2" />
                  <h4 className="text-white font-bold">{matchData.awayTeam.name}</h4>
                  <p className="text-xs text-gray-400">4-4-2 Formation</p>
                </div>
                <div className="space-y-2">
                  {['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'FWD', 'FWD'].map((pos, i) => (
                    <div key={i} className="bg-[#0f1119] rounded-lg px-4 py-2 text-sm text-white flex justify-between">
                      <span>Player {i + 1}</span>
                      <span className="text-gray-400">{pos}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Odds Tab */}
        {activeTab === 'odds' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-white text-lg font-bold mb-4">Odds</h3>
            
            {/* Odds Sub-Tabs */}
            <div className="flex gap-1 overflow-x-auto mb-6 pb-2 scrollbar-hide">
              {oddsTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveOddsTab(tab)}
                  className={`
                    px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg transition-colors
                    ${activeOddsTab === tab
                      ? 'bg-[#FF6A00] text-white'
                      : 'bg-[#1a1d2e] text-gray-400 hover:text-white'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Odds Content */}
            <div className="bg-[#1a1d2e] rounded-xl p-4">
              <div className="grid grid-cols-3 gap-3">
                {getOddsForTab(activeOddsTab).map((odd, index) => (
                  <OddsButton
                    key={index}
                    odds={odd.odds}
                    market={activeOddsTab}
                    selection={odd.selection}
                    matchId={matchData.id}
                    onClick={handleAddToSlip}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default MatchDetailsPage;
