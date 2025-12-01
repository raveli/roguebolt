import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Load background music
    this.load.audio('theme', 'assets/music/theme.mp3');

    // Load sprite assets
    this.load.image('player', 'assets/sprites/player.png');
    this.load.image('exit', 'assets/sprites/exit.png');
    this.load.image('enemy', 'assets/sprites/enemy.png');
    this.load.image('platform', 'assets/sprites/platform.png');
    this.load.image('lightning', 'assets/sprites/lightning.png');
    this.load.image('fireball_large', 'assets/sprites/fireball_large.png');
    this.load.image('fireball_small', 'assets/sprites/fireball_small.png');
    this.load.image('bg_scene1', 'assets/sprites/bg_scene1.png');
    this.load.image('bg_scene2', 'assets/sprites/bg_scene2.png');
    this.load.image('title', 'assets/sprites/title.png');
  }

  create(): void {
    // Create placeholder textures
    this.createPlaceholderTextures();

    // Show loading text
    const loadingText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      'ROGUE BOLT',
      {
        fontSize: '48px',
        color: '#ffffff',
        fontFamily: 'monospace',
      }
    );
    loadingText.setOrigin(0.5);

    const subtitleText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 60,
      'Ladataan...',
      {
        fontSize: '24px',
        color: '#888888',
        fontFamily: 'monospace',
      }
    );
    subtitleText.setOrigin(0.5);

    // Transition to menu after a short delay
    this.time.delayedCall(1000, () => {
      this.scene.start('MenuScene');
    });
  }

  private createPlaceholderTextures(): void {
    // All game sprites are now loaded from files in preload()
    // Only particle textures and card icons are generated programmatically
    this.createParticleTextures();
    this.createCardIcons();
  }

  private createCardIcons(): void {
    const iconSize = 48;

    // jump_boost - Green arrow up
    const jumpIcon = this.make.graphics({ x: 0, y: 0 });
    jumpIcon.fillStyle(0x00ff88);
    jumpIcon.fillRect(18, 8, 12, 32);  // Stem
    jumpIcon.fillTriangle(24, 0, 8, 20, 40, 20);  // Arrow head
    jumpIcon.generateTexture('card_icon_jump_boost', iconSize, iconSize);
    jumpIcon.destroy();

    // speed_boost - Orange speed lines
    const speedIcon = this.make.graphics({ x: 0, y: 0 });
    speedIcon.fillStyle(0xffaa00);
    speedIcon.fillRect(4, 12, 28, 6);
    speedIcon.fillRect(8, 22, 32, 6);
    speedIcon.fillRect(4, 32, 28, 6);
    speedIcon.fillStyle(0xffdd44);
    speedIcon.fillTriangle(40, 24, 28, 16, 28, 32);
    speedIcon.generateTexture('card_icon_speed_boost', iconSize, iconSize);
    speedIcon.destroy();

    // damage_up - Red fireball
    const damageIcon = this.make.graphics({ x: 0, y: 0 });
    damageIcon.fillStyle(0xff4444);
    damageIcon.fillCircle(24, 28, 14);
    damageIcon.fillStyle(0xff8844);
    damageIcon.fillCircle(24, 28, 8);
    damageIcon.fillStyle(0xffcc44);
    damageIcon.fillCircle(24, 28, 4);
    damageIcon.fillStyle(0xff6644);
    damageIcon.fillTriangle(24, 4, 16, 18, 32, 18);
    damageIcon.generateTexture('card_icon_damage_up', iconSize, iconSize);
    damageIcon.destroy();

    // max_energy - Blue battery
    const energyIcon = this.make.graphics({ x: 0, y: 0 });
    energyIcon.fillStyle(0x4488ff);
    energyIcon.fillRect(12, 8, 24, 36);
    energyIcon.fillRect(18, 4, 12, 6);
    energyIcon.fillStyle(0x88ccff);
    energyIcon.fillRect(16, 20, 16, 20);
    energyIcon.fillStyle(0xffff44);
    energyIcon.fillRect(20, 24, 8, 12);
    energyIcon.generateTexture('card_icon_max_energy', iconSize, iconSize);
    energyIcon.destroy();

    // energy_regen - Green circular arrow
    const regenIcon = this.make.graphics({ x: 0, y: 0 });
    regenIcon.lineStyle(6, 0x44ff44);
    regenIcon.beginPath();
    regenIcon.arc(24, 24, 14, -Math.PI * 0.8, Math.PI * 0.6);
    regenIcon.strokePath();
    regenIcon.fillStyle(0x44ff44);
    regenIcon.fillTriangle(36, 16, 42, 28, 30, 28);
    regenIcon.generateTexture('card_icon_energy_regen', iconSize, iconSize);
    regenIcon.destroy();

    // max_health - Red heart
    const healthIcon = this.make.graphics({ x: 0, y: 0 });
    healthIcon.fillStyle(0xff4466);
    healthIcon.fillCircle(16, 18, 10);
    healthIcon.fillCircle(32, 18, 10);
    healthIcon.fillTriangle(6, 20, 42, 20, 24, 44);
    healthIcon.fillStyle(0xff8899);
    healthIcon.fillCircle(14, 14, 4);
    healthIcon.generateTexture('card_icon_max_health', iconSize, iconSize);
    healthIcon.destroy();

    // heal - Pink heart with +
    const healIcon = this.make.graphics({ x: 0, y: 0 });
    healIcon.fillStyle(0xff66aa);
    healIcon.fillCircle(16, 18, 10);
    healIcon.fillCircle(32, 18, 10);
    healIcon.fillTriangle(6, 20, 42, 20, 24, 44);
    healIcon.fillStyle(0xffffff);
    healIcon.fillRect(20, 22, 8, 16);
    healIcon.fillRect(16, 26, 16, 8);
    healIcon.generateTexture('card_icon_heal', iconSize, iconSize);
    healIcon.destroy();

    // energy_refill - Blue lightning
    const refillIcon = this.make.graphics({ x: 0, y: 0 });
    refillIcon.fillStyle(0x44aaff);
    refillIcon.beginPath();
    refillIcon.moveTo(28, 4);
    refillIcon.lineTo(16, 22);
    refillIcon.lineTo(22, 22);
    refillIcon.lineTo(18, 44);
    refillIcon.lineTo(34, 20);
    refillIcon.lineTo(26, 20);
    refillIcon.lineTo(32, 4);
    refillIcon.closePath();
    refillIcon.fillPath();
    refillIcon.fillStyle(0xaaddff);
    refillIcon.fillRect(22, 16, 6, 8);
    refillIcon.generateTexture('card_icon_energy_refill', iconSize, iconSize);
    refillIcon.destroy();

    // glass_cannon - Red skull
    const cannonIcon = this.make.graphics({ x: 0, y: 0 });
    cannonIcon.fillStyle(0xff4444);
    cannonIcon.fillCircle(24, 20, 16);
    cannonIcon.fillRect(14, 32, 20, 12);
    cannonIcon.fillStyle(0x000000);
    cannonIcon.fillCircle(18, 18, 4);
    cannonIcon.fillCircle(30, 18, 4);
    cannonIcon.fillRect(20, 28, 8, 4);
    cannonIcon.fillStyle(0xff4444);
    cannonIcon.fillRect(14, 36, 4, 8);
    cannonIcon.fillRect(22, 36, 4, 8);
    cannonIcon.fillRect(30, 36, 4, 8);
    cannonIcon.generateTexture('card_icon_glass_cannon', iconSize, iconSize);
    cannonIcon.destroy();

    // tank - Blue shield
    const tankIcon = this.make.graphics({ x: 0, y: 0 });
    tankIcon.fillStyle(0x4488ff);
    tankIcon.beginPath();
    tankIcon.moveTo(24, 4);
    tankIcon.lineTo(8, 12);
    tankIcon.lineTo(8, 28);
    tankIcon.lineTo(24, 44);
    tankIcon.lineTo(40, 28);
    tankIcon.lineTo(40, 12);
    tankIcon.closePath();
    tankIcon.fillPath();
    tankIcon.fillStyle(0x88bbff);
    tankIcon.beginPath();
    tankIcon.moveTo(24, 10);
    tankIcon.lineTo(14, 16);
    tankIcon.lineTo(14, 26);
    tankIcon.lineTo(24, 36);
    tankIcon.lineTo(34, 26);
    tankIcon.lineTo(34, 16);
    tankIcon.closePath();
    tankIcon.fillPath();
    tankIcon.fillStyle(0xffffff);
    tankIcon.fillRect(20, 18, 8, 14);
    tankIcon.fillRect(16, 22, 16, 6);
    tankIcon.generateTexture('card_icon_tank', iconSize, iconSize);
    tankIcon.destroy();
  }

  private createParticleTextures(): void {
    // Orange spark particle (for fireball hits)
    const sparkGraphics = this.make.graphics({ x: 0, y: 0 });
    sparkGraphics.fillStyle(0xff6b35);
    sparkGraphics.fillCircle(4, 4, 4);
    sparkGraphics.generateTexture('particle_spark', 8, 8);
    sparkGraphics.destroy();

    // Red particle (for enemy death / player damage)
    const redGraphics = this.make.graphics({ x: 0, y: 0 });
    redGraphics.fillStyle(0xff4444);
    redGraphics.fillCircle(3, 3, 3);
    redGraphics.generateTexture('particle_red', 6, 6);
    redGraphics.destroy();

    // Yellow star particle (for energy collection)
    const starGraphics = this.make.graphics({ x: 0, y: 0 });
    starGraphics.fillStyle(0xffdd00);
    starGraphics.fillCircle(3, 3, 3);
    starGraphics.generateTexture('particle_yellow', 6, 6);
    starGraphics.destroy();

    // White particle (generic)
    const whiteGraphics = this.make.graphics({ x: 0, y: 0 });
    whiteGraphics.fillStyle(0xffffff);
    whiteGraphics.fillCircle(2, 2, 2);
    whiteGraphics.generateTexture('particle_white', 4, 4);
    whiteGraphics.destroy();
  }
}
