export interface Game {
  id: string;
  slug: string;
  name: string;
  type: 'Crash' | 'Classic' | 'Skill & Luck' | 'VIP' | 'Virtual Football' | 'Virtual Horse Racing' | 'Virtual Greyhounds' | 'Virtual Penalties' | 'Special Event';
  maxPayout: string;
  description: string;
  special?: boolean;
  vipOnly?: boolean;
  category: 'core' | 'virtual' | 'special' | 'vip';
  thumbnail?: string;
}

export const GAMES_LIST: Game[] = [
  // CORE 8 GAMES
  {
    id: 'aviator',
    slug: 'aviator',
    name: 'Aviator',
    type: 'Crash',
    maxPayout: '~10x',
    description: 'Rising plane multiplier',
    category: 'core',
  },
  {
    id: 'crash',
    slug: 'crash',
    name: 'Crash',
    type: 'Crash',
    maxPayout: '~10x',
    description: 'Rising line chart',
    category: 'core',
  },
  {
    id: 'superhero',
    slug: 'superhero',
    name: 'Superhero',
    type: 'Crash',
    maxPayout: '~10x',
    description: 'Hero dodges obstacles',
    category: 'core',
  },
  {
    id: 'flip',
    slug: 'flip',
    name: 'Flip the Coin',
    type: 'Classic',
    maxPayout: '1.95x',
    description: '3D coin flip',
    category: 'core',
  },
  {
    id: 'coin',
    slug: 'coin',
    name: 'Coin Flip',
    type: 'Classic',
    maxPayout: '1.95x',
    description: 'Instant 50/50',
    category: 'core',
  },
  {
    id: 'dice',
    slug: 'dice',
    name: 'Dice Roll',
    type: 'Classic',
    maxPayout: 'up to 99x',
    description: 'Over/under slider',
    category: 'core',
  },
  {
    id: 'spin',
    slug: 'spin',
    name: 'Lucky Spin',
    type: 'Classic',
    maxPayout: '10x',
    description: '8-segment wheel',
    category: 'core',
  },
  {
    id: 'magicball',
    slug: 'magicball',
    name: 'Magic Ball',
    type: 'Skill & Luck',
    maxPayout: '2.9x',
    description: '3 cups shuffle',
    category: 'core',
  },
  // VIP GAMES
  {
    id: 'aviator-pro',
    slug: 'aviator-pro',
    name: 'Aviator Pro',
    type: 'VIP',
    maxPayout: '~10x',
    description: 'Private lobby, double cashout',
    vipOnly: true,
    category: 'vip',
  },
  {
    id: 'high-stakes-dice',
    slug: 'high-stakes-dice',
    name: 'High-Stakes Dice',
    type: 'VIP',
    maxPayout: '~200x',
    description: 'Min stake 10x, higher ceiling',
    vipOnly: true,
    category: 'vip',
  },
  {
    id: 'jackpot-spin',
    slug: 'jackpot-spin',
    name: 'Jackpot Lucky Spin',
    type: 'VIP',
    maxPayout: '50x',
    description: 'One segment at 50x',
    vipOnly: true,
    category: 'vip',
  },
  {
    id: 'big-odds',
    slug: 'big-odds',
    name: 'Biggest Odds Club',
    type: 'VIP',
    maxPayout: 'Weekly contest',
    description: 'Weekly contest for high rollers',
    vipOnly: true,
    category: 'vip',
  },
  // VIRTUAL FOOTBALL (12 matches)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `virtual-football-${i + 1}`,
    slug: `virtual-football-${i + 1}`,
    name: `Virtual Football #${i + 1}`,
    type: 'Virtual Football' as const,
    maxPayout: '1X2+OU+CS',
    description: '90s match cycle, 22 player dots + ball tracking',
    category: 'virtual' as const,
  })),
  // VIRTUAL HORSE RACING (12 races)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `virtual-horse-${i + 1}`,
    slug: `virtual-horse-${i + 1}`,
    name: `Horse Race #${i + 1}`,
    type: 'Virtual Horse Racing' as const,
    maxPayout: '8s sprint, 6 horses',
    description: '8 second sprint race with 6 horses',
    category: 'virtual' as const,
  })),
  // VIRTUAL GREYHOUNDS (12 races)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `virtual-greyhound-${i + 1}`,
    slug: `virtual-greyhound-${i + 1}`,
    name: `Greyhound Race #${i + 1}`,
    type: 'Virtual Greyhounds' as const,
    maxPayout: '6s sprint',
    description: '6 second sprint with greyhounds',
    category: 'virtual' as const,
  })),
  // VIRTUAL PENALTIES (12 rounds)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `virtual-penalty-${i + 1}`,
    slug: `virtual-penalty-${i + 1}`,
    name: `Penalty Round #${i + 1}`,
    type: 'Virtual Penalties' as const,
    maxPayout: '3s instant',
    description: '3 second instant penalty shootout',
    category: 'virtual' as const,
  })),
  // ADMIN CUSTOM GAMES (SPECIAL EVENTS)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `custom-special-${i + 1}`,
    slug: `custom-special-${i + 1}`,
    name: `Special Event #${i + 1}`,
    type: 'Special Event' as const,
    maxPayout: 'Admin configured',
    description: 'Admin-created special event game',
    special: true,
    category: 'special' as const,
  })),
];

export const FEATURED_GAMES = GAMES_LIST.filter(g => g.category === 'core').slice(0, 9);
export const VIRTUAL_GAMES = GAMES_LIST.filter(g => g.category === 'virtual');
export const VIP_GAMES = GAMES_LIST.filter(g => g.vipOnly);
export const SPECIAL_GAMES = GAMES_LIST.filter(g => g.special);
