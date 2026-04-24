import * as CryptoJS from 'crypto-js';

export interface CrashGameState {
  startTime: number;
  crashed: boolean;
  crashedAt: number | null;
}

export const createInitialGameState = (): CrashGameState => ({
  startTime: Date.now(),
  crashed: false,
  crashedAt: null,
});

interface CrashSeed {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

/**
 * Generates provably fair crash point using HMAC-SHA256
 * @param params - Server seed, client seed, and nonce
 * @returns Crash point (1.00 - 1000.00)
 */
export const generateCrashPoint = ({ serverSeed, clientSeed, nonce }: CrashSeed): number => {
  const message = `${clientSeed}:${nonce}`;
  const hash = CryptoJS.HmacSHA256(message, serverSeed).toString(CryptoJS.enc.Hex);
  
  // Convert first 8 chars of hash to integer
  const intVal = parseInt(hash.substring(0, 8), 16);
  
  // Calculate crash point (max 1000x, min 1x)
  const crashPoint = Math.max(1, (10000 - (intVal % 10000)) / 100);
  return parseFloat(crashPoint.toFixed(2));
};

/**
 * Calculates current multiplier based on elapsed time
 * @param elapsedMs - Time elapsed since game start (ms)
 * @param crashPoint - The crash point at which game crashes
 * @returns Current multiplier
 */
export const calculateMultiplier = (elapsedMs: number, crashPoint: number): number => {
  const elapsedSeconds = elapsedMs / 1000;
  // Simple linear growth: multiplier = 1 + (elapsedSeconds * 0.01 * crashPoint)
  const multiplier = 1 + (elapsedSeconds * 0.01 * crashPoint);
  return parseFloat(multiplier.toFixed(2));
};

/**
 * Determines if the game should crash based on current multiplier and crash point
 */
export const shouldCrash = (currentMultiplier: number, crashPoint: number): boolean => {
  return currentMultiplier >= crashPoint;
};

/**
 * Formats multiplier for display
 */
export const formatMultiplier = (multiplier: number): string => {
  return `${multiplier.toFixed(2)}x`;
};

/**
 * Calculates cashout amount
 * @param stake - Bet stake amount
 * @param multiplier - Cashout multiplier
 * @returns Total cashout amount
 */
export const calculateCashout = (stake: number, multiplier: number): number => {
  return parseFloat((stake * multiplier).toFixed(2));
};
