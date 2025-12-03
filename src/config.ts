import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { CardSelectScene } from './scenes/CardSelectScene';
import { GameOverScene } from './scenes/GameOverScene';
import { VictoryScene } from './scenes/VictoryScene';
import { PauseScene } from './scenes/PauseScene';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const COLORS = {
  background: 0x1a1a2e,
  player: 0x4a9eff,
  playerOutline: 0x2a6ecf,
  fireballSmall: 0xff6b35,
  fireballLarge: 0xff2222,
  lightning: 0xffdd00,
  enemy: 0xe63946,
  platform: 0x2d5a27,
  platformTop: 0x3d7a37,
  exit: 0x9d4edd,
  hud: 0xffffff,
  energyBar: 0x00ff88,
  healthBar: 0xff4444,
};

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  pixelArt: true,
  backgroundColor: COLORS.background,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 4, // Support multiple touch points
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 900 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, CardSelectScene, GameOverScene, VictoryScene, PauseScene],
};

export const DEFAULT_PLAYER_STATS = {
  speed: 300,
  jumpPower: 580,
  maxHealth: 100,
  health: 100,
  maxEnergy: 100,
  energy: 100,
  energyRegen: 0,
  damage: 10,
};

// Mobile detection helper
export const isMobileDevice = (): boolean => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );
};

// Performance settings based on device type
export const PERFORMANCE_SETTINGS = {
  // Particle counts
  sparkCount: isMobileDevice() ? 8 : 15,
  explosionCount: isMobileDevice() ? 12 : 25,
  energyCount: isMobileDevice() ? 6 : 15,

  // Screen shake intensity multiplier
  shakeIntensity: isMobileDevice() ? 0.6 : 1.0,
};
