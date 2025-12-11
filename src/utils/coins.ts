const STORAGE_KEY = 'roguebolt_coins';
const COINS_PER_1000_POINTS = 5;

export function getCoins(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;
    const coins = parseInt(stored, 10);
    return isNaN(coins) ? 0 : coins;
  } catch {
    return 0;
  }
}

export function addCoins(amount: number): number {
  const current = getCoins();
  const newTotal = current + amount;
  try {
    localStorage.setItem(STORAGE_KEY, String(newTotal));
  } catch {
    // localStorage might be full or disabled
  }
  return newTotal;
}

export function calculateCoinsFromScore(score: number): number {
  // 5 coins for each 1000 points
  return Math.floor(score / 1000) * COINS_PER_1000_POINTS;
}

export function clearCoins(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}
