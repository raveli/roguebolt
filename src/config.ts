import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { CardSelectScene } from './scenes/CardSelectScene';
import { GameOverScene } from './scenes/GameOverScene';
import { VictoryScene } from './scenes/VictoryScene';

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
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 900 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, CardSelectScene, GameOverScene, VictoryScene],
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
