// === SPEEDBET TYPES (from SpeedBet Build Spec v2.0) ===

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface User {
  id: string
  email: string
  phone?: string
  first_name?: string
  last_name?: string
  role: UserRole
  status: 'ACTIVE' | 'DISABLED' | 'LOCKED'
  created_at: string
}

export interface Wallet {
  id: string
  user_id: string
  currency: string
  balance: number
}

export interface Transaction {
  id: string
  wallet_id: string
  kind: 'DEPOSIT' | 'WITHDRAW' | 'BET_STAKE' | 'BET_WIN' | 'REFERRAL_COMMISSION' | 'PAYOUT' | 'ADJUSTMENT' | 'VIP_CASHBACK' | 'VIP_MEMBERSHIP'
  amount: number
  balance_after: number
  created_at: string
}

export type MatchSource = 'SPORTDB' | 'SPORTSRC' | 'VIRTUAL' | 'ADMIN_CREATED'

export type MatchStatus = 'UPCOMING' | 'LIVE' | 'FINISHED'

export interface Match {
  id: string
  source: MatchSource
  external_id?: string
  sport: string
  league: string
  home_team: string
  away_team: string
  kickoff_at: string
  status: MatchStatus
  score_home?: number
  score_away?: number
  metadata?: Record<string, any>
}

export type OddsMarket = '1X2' | 'HOME_WIN' | 'AWAY_WIN' | 'OVER_UNDER' | 'HANDICAP' | 'CORRECT_SCORE' | 'HT_FT' | 'DOUBLE_CHANCE' | 'BTTS' | 'FTS' | 'LIVE'

export interface Odds {
  id: string
  match_id: string
  market: OddsMarket
  selection: string
  value: number
  captured_at: string
}

export type BetStatus = 'PENDING' | 'WON' | 'LOST' | 'VOID' | 'CASHED_OUT'

export interface BetSelection {
  id: string
  bet_id: string
  match_id: string
  market: OddsMarket
  selection: string
  odds_locked: number
  result: 'WON' | 'LOST' | 'VOID' | 'PENDING'
}

export interface Bet {
  id: string
  user_id: string
  stake: number
  currency: string
  total_odds?: number
  potential_return?: number
  status: BetStatus
  placed_at: string
  settled_at?: string
}

export type BookingKind = '1X2' | 'HOME_WIN' | 'AWAY_WIN' | 'CORRECT_SCORE' | 'HANDICAP' | 'HT_FT' | 'BTTS' | 'OVER_UNDER' | 'MIXED'

export interface BookingCode {
  id: string
  code: string
  creator_admin_id: string
  label?: string
  kind: BookingKind
  selections: BetSelection[]
  total_odds: number
  redemption_count: number
  max_redemptions?: number
  expires_at?: string
}

export interface Prediction {
  id: string
  match_id: string
  model: string
  generated_at: string
  prediction: {
    win_probability: { home: number; draw: number; away: number }
    predicted_score: { home: number; away: number }
    btts: boolean
    over_under_25: 'OVER' | 'UNDER'
    correct_scores: { score: string; prob: number }[]
    confidence: number
    reasoning: string
  }
  shared_at?: string
  is_published_to_users: boolean
  admin_note?: string
}

// === GAME TYPES (8 core + 50+ virtual) ===
export type GameType = 
  | 'aviator' | 'crash' | 'superhero' | 'flip' | 'coin' | 'dice' | 'spin' | 'magicball'
  | 'virtual_football' | 'virtual_horse_racing' | 'virtual_greyhounds' | 'virtual_penalties'
  | 'admin_custom'

export interface Game {
  id: string
  slug: string
  name: string
  type: GameType
  max_payout: number
  description: string
  special?: boolean  // admin-created special event
}

export interface VirtualMatch {
  id: string
  category: 'football' | 'horse_racing' | 'greyhounds' | 'penalties' | 'custom'
  home_team: string
  away_team: string
  kickoff_at: string
  status: 'UPCOMING' | 'LIVE' | 'FINISHED'
  score_home?: number
  score_away?: number
  predicted_score?: { home: number; away: number }
  is_special?: boolean
}

export interface VipStatus {
  is_active: boolean
  expires_at?: string
  cashback_eligible: boolean
}

export interface VipGift {
  id: string
  type: 'FREE_BET' | 'BOOSTED_ODDS' | 'DEPOSIT_BONUS' | 'CASHBACK_CREDIT' | 'ENTRY_TICKET'
  value: number
  expires_at: string
}

export interface AdminReferralLink {
  id: string
  code: string
  label: string
  commission_percent: number
  is_active: boolean
  created_at: string
}

export interface AiPredictionAdmin extends Prediction {
  shared_by_admin_id: string
}
