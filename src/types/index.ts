export interface PlayerStats {
  speed: number;
  jumpPower: number;
  maxHealth: number;
  health: number;
  maxEnergy: number;
  energy: number;
  energyRegen: number;
  damage: number;
}

export interface LevelData {
  id: number;
  name: string;
  width: number;
  height: number;
  platforms: PlatformData[];
  enemies: EnemyData[];
  lightnings: LightningData[];
  hearts: HeartData[];
  playerStart: Position;
  exit: Position;
}

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EnemyData {
  type: 'basic' | 'flying';
  x: number;
  y: number;
  patrolDistance?: number;
}

export interface LightningData {
  x: number;
  y: number;
}

export interface HeartData {
  x: number;
  y: number;
}

export interface Position {
  x: number;
  y: number;
}

export type FireballType = 'small' | 'large';

export interface UpgradeCard {
  id: string;
  name: string;
  description: string;
  effect: (stats: PlayerStats) => void;
}

export interface GameState {
  currentLevel: number;
  playerStats: PlayerStats;
  collectedUpgrades: string[];
  godMode?: boolean;
  unlimitedAmmo?: boolean;
  score: number;
  levelStartTime: number; // timestamp when level started
}

// Scoring constants
export const SCORE_VALUES = {
  ENEMY_KILL_SMALL: 100,    // Kill with small fireball
  ENEMY_KILL_LARGE: 250,    // Kill with charged fireball
  LIGHTNING_COLLECT: 50,     // Collect a lightning bolt
  HEART_COLLECT: 50,         // Collect a heart
  TIME_BONUS_PER_SECOND: 10, // Points per second remaining
  LEVEL_TIME_LIMIT: 120,     // Seconds for max time bonus
} as const;
