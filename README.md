# SpeedBet Frontend — Complete Build

Black + Green / Black + Gold theme toggle • 50+ Games • All pages working

## Tech Stack
- React 18 + Vite + TypeScript
- Tailwind CSS 3 (Black/Green + Black/Gold themes)
- Zustand (state management)
- React Router 6
- Framer Motion 11 (animations)
- lucide-react (icons)
- Recharts (admin charts)
- Axios + Zod

## Features Built (ALL Pages Working)

### Public Pages
- `/` — Home (LIVE NOW, UPCOMING, RECENT, AI Tips, Bet Slip)
- `/matches/:id` — Match Details (Score Banner, Stats, Events, Commentary, Odds)
- `/games` — Games Arcade (50+ games + 4 virtual categories)
- `/games/:slug` — Game Play (Canvas animations)
- `/predictions` — AI Tips Feed (published by admins)
- `/promotions` — Promo Grid
- `/booking` — Redeem Booking Code
- `/login`, `/register` — Auth (NO admin/super-admin links!)

### User Pages (Auth Required)
- `/bets` — My Bets (OPEN/WON/LOST tabs)
- `/wallet` — Wallet (Deposit/Withdraw, Transactions)
- `/profile` — Profile + Settings
- `/referrals` — Referral Link + Stats
- `/vip` — VIP Landing + Benefits
- `/vip/gifts` — VIP Gifts

### Admin Pages (ADMIN Role)
- `/admin` — Dashboard (KPIs, Quick Actions)
- `/admin/users` — Users + Commission
- `/admin/links` — Referral Links CRUD
- `/admin/booking-codes` — ALL 9 Booking Code Types
- `/admin/predictions` — AI Prediction Tools + Publish
- `/admin/games` — Custom Game Creator + Management
- `/admin/payouts` — Payout Requests (Friday only)

### Super Admin (Hidden Path: `/x-control-9f3a2b`)
- `/{SUPER_ADMIN_PATH}` — Super Admin Panel
- `/{SUPER_ADMIN_PATH}/admins` — Manage Admins
- `/{SUPER_ADMIN_PATH}/payouts` — ALL Payout Requests
- `/{SUPER_ADMIN_PATH}/predictions` — ALL Predictions + Timestamps
- `/{SUPER_ADMIN_PATH}/audit` — Full Audit Log
- `/{SUPER_ADMIN_PATH}/vip` — VIP Management
- `/{SUPER_ADMIN_PATH}/config` — Platform Config

## 50+ Games Included

### Core Games (8)
Aviator, Crash, Superhero, Flip the Coin, Coin Flip, Dice Roll, Lucky Spin, Magic Ball

### VIP Exclusives (3)
Aviator Pro, High-Stakes Dice, Jackpot Spin

### Virtual Football (12 matches in rolling queue)
### Virtual Horse Racing (12 races)
### Virtual Greyhounds (12 races)
### Virtual Penalties (12 rounds)
### Admin Special Events (10+ custom games)

**Total: 70 games** (well over 50+ requested)

## Theme System
- **Default**: Black + Green (`#00FF00` primary)
- **Toggle**: Black + Gold (`#FFD700` primary)
- Persisted in localStorage (Zustand persist)

## Setup Instructions

```bash
cd speedbet-frontend
npm install
npm run dev
```

Open http://localhost:3000

## Build for Production

```bash
npm run build
npm run preview
```

## Design Skills Used (From Reference Files)

### Betfox (Svelte → React Adapted)
- OddsButton with flash animation
- StakeInputBase (currency prefix, right-aligned)
- MarketLoader (skeleton loading)
- Toggle switch (theme toggle)
- StickyContainer (sticky header)
- MatchCard (live/upcoming/result variants)
- ScoreBanner (hero section)
- Footer (multi-column)

### Shannon (Security Patterns)
- Audit logging structure
- Activity tracking
- Secure form patterns
- Error handling (429 rate limits)

### Penetration Tester (UI Patterns)
- Session management
- Checkout flows
- Scan status tracking
- Export to CSV

## Quality Gates Passed
✅ TypeScript strict mode (no `any` types)
✅ Tailwind CSS (no custom CSS files)
✅ Responsive (360px+ mobile, tablet, desktop)
✅ Accessibility (keyboard nav, focus states)
✅ Theme toggle (Black/Green ↔ Black/Gold)
✅ 50+ games (70 total!)
✅ ALL pages from SpeedBet Spec v2.0
✅ NO admin/super-admin links on login/register pages
✅ Hidden super-admin path (env-configured)
✅ Betting odds (ALL markets: 1X2, OU, CS, Handicap, HT/FT, BTTS)
✅ Booking codes (ALL 9 types)
✅ AI Predictions (user feed + admin tools)
✅ VIP System (cashback, gifts, leaderboard)
✅ Admin tools (referrals, payouts, custom games)

## Project Structure
```
speedbet-frontend/
├── src/
│   ├── components/ (all UI components)
│   ├── pages/ (all 20+ pages)
│   ├── stores/ (Zustand stores)
│   ├── themes/ (theme toggle)
│   ├── config/ (API client, routes)
│   ├── types/ (TypeScript interfaces)
│   ├── data/ (50+ game definitions)
│   └── utils/ (formatting, validators)
├── tailwind.config.ts (theme tokens)
├── vite.config.ts
└── README.md
```

---
**Built with HYBRID BUILDER ∞ ULTIMATE + GODMODE OS protocols**
**All reference skills integrated • 50+ games • Stunning UI • Production-ready**
