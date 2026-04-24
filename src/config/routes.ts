// === SPEEDBET ROUTE MAP (from Spec Part 5) ===
export type AppRoute =
  | '/'
  | '/matches/:id'
  | '/games'
  | '/games/:slug'
  | '/predictions'
  | '/promotions'
  | '/referrals'
  | '/bets'
  | '/wallet'
  | '/profile'
  | '/booking'
  | '/vip'
  | '/admin'
  | '/admin/users'
  | '/admin/links'
  | '/admin/booking-codes'
  | '/admin/predictions'
  | '/admin/games'
  | '/admin/payouts'
  | string  // for dynamic super-admin path

export const PUBLIC_ROUTES: string[] = ['/', '/promotions', '/predictions']
export const USER_ROUTES: string[] = ['/bets', '/wallet', '/profile', '/booking', '/vip', '/referrals']
export const ADMIN_ROUTES: string[] = ['/admin', '/admin/users', '/admin/links', '/admin/booking-codes', '/admin/predictions', '/admin/games', '/admin/payouts']

// Super-admin path from env (NEVER shown in UI)
export const SUPER_ADMIN_PATH = import.meta.env.VITE_SUPER_ADMIN_PATH || '/x-control-9f3a2b'

export const ROUTE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/games': 'Games Arcade',
  '/predictions': 'AI Predictions',
  '/promotions': 'Promotions',
  '/bets': 'My Bets',
  '/wallet': 'Wallet',
  '/profile': 'Profile',
  '/booking': 'Redeem Code',
  '/vip': 'VIP Club',
  '/referrals': 'Referrals',
  '/admin': 'Admin Dashboard',
  '/admin/users': 'Users',
  '/admin/links': 'Referral Links',
  '/admin/booking-codes': 'Booking Codes',
  '/admin/predictions': 'AI Predictions',
  '/admin/games': 'Custom Games',
  '/admin/payouts': 'Payouts',
}
