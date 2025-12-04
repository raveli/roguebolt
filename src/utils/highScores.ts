const STORAGE_KEY = 'roguebolt_highscores';
const MAX_SCORES = 10;

export interface HighScoreEntry {
  score: number;
  date: string;
}

export function getHighScores(): HighScoreEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HighScoreEntry[];
  } catch {
    return [];
  }
}

export function saveHighScore(score: number): { rank: number; isNewHighScore: boolean } {
  const scores = getHighScores();
  const newEntry: HighScoreEntry = {
    score,
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  };

  // Find where this score ranks
  let rank = scores.findIndex((s) => score > s.score);
  if (rank === -1) {
    rank = scores.length;
  }

  // Insert at the right position
  scores.splice(rank, 0, newEntry);

  // Keep only top scores
  const trimmedScores = scores.slice(0, MAX_SCORES);

  // Save back
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedScores));
  } catch {
    // localStorage might be full or disabled
  }

  // rank is 0-indexed, so add 1 for display
  return {
    rank: rank + 1,
    isNewHighScore: rank < MAX_SCORES,
  };
}

export function getTopScore(): number {
  const scores = getHighScores();
  return scores.length > 0 ? scores[0].score : 0;
}

export function clearHighScores(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}
