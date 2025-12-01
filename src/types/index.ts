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
}
