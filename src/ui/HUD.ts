import Phaser from 'phaser';
import { GAME_WIDTH } from '../config';
import type { GameState, PlayerStats } from '../types';

export class HUD {
  private healthBar: Phaser.GameObjects.Graphics;
  private energyBar: Phaser.GameObjects.Graphics;
  private healthText: Phaser.GameObjects.Text;
  private energyText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;

  private barWidth: number = 200;
  private barHeight: number = 16;
  private padding: number = 15;

  constructor(scene: Phaser.Scene, gameState: GameState) {

    // Health label (above bar)
    this.healthText = scene.add.text(
      this.padding,
      this.padding,
      'HP',
      {
        fontSize: '14px',
        color: '#ff6666',
        fontFamily: 'monospace',
      }
    );
    this.healthText.setScrollFactor(0);
    this.healthText.setDepth(51);

    // Health bar (below label)
    this.healthBar = scene.add.graphics();
    this.healthBar.setScrollFactor(0);
    this.healthBar.setDepth(50);

    // Energy label (below health bar)
    this.energyText = scene.add.text(
      this.padding,
      this.padding + 20 + this.barHeight + 5,
      'ENERGIA',
      {
        fontSize: '14px',
        color: '#66ff88',
        fontFamily: 'monospace',
      }
    );
    this.energyText.setScrollFactor(0);
    this.energyText.setDepth(51);

    // Energy bar (below energy label)
    this.energyBar = scene.add.graphics();
    this.energyBar.setScrollFactor(0);
    this.energyBar.setDepth(50);

    // Level indicator
    this.levelText = scene.add.text(
      GAME_WIDTH - this.padding,
      this.padding,
      `Kenttä ${gameState.currentLevel}`,
      {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
      }
    );
    this.levelText.setOrigin(1, 0);
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(50);
  }

  update(stats: PlayerStats): void {
    // Clear previous graphics
    this.healthBar.clear();
    this.energyBar.clear();

    const barX = this.padding;
    const healthBarY = this.padding + 18;
    const energyBarY = this.padding + 18 + this.barHeight + 5 + 18;

    // Health bar
    // Background
    this.healthBar.fillStyle(0x333333, 1);
    this.healthBar.fillRect(barX, healthBarY, this.barWidth, this.barHeight);

    // Fill
    const healthPercent = Math.max(0, stats.health / stats.maxHealth);
    const healthColor = healthPercent > 0.5 ? 0xff4444 : healthPercent > 0.25 ? 0xff8844 : 0xff0000;
    this.healthBar.fillStyle(healthColor, 1);
    this.healthBar.fillRect(barX, healthBarY, this.barWidth * healthPercent, this.barHeight);

    // Border
    this.healthBar.lineStyle(2, 0xffffff, 0.5);
    this.healthBar.strokeRect(barX, healthBarY, this.barWidth, this.barHeight);

    // Energy bar
    // Background
    this.energyBar.fillStyle(0x333333, 1);
    this.energyBar.fillRect(barX, energyBarY, this.barWidth, this.barHeight);

    // Fill
    const energyPercent = Math.max(0, stats.energy / stats.maxEnergy);
    this.energyBar.fillStyle(0x00ff88, 1);
    this.energyBar.fillRect(barX, energyBarY, this.barWidth * energyPercent, this.barHeight);

    // Border
    this.energyBar.lineStyle(2, 0xffffff, 0.5);
    this.energyBar.strokeRect(barX, energyBarY, this.barWidth, this.barHeight);

    // Update text with values
    this.healthText.setText(`HP: ${Math.ceil(stats.health)}/${stats.maxHealth}`);
    this.energyText.setText(`ENERGIA: ${Math.ceil(stats.energy)}/${stats.maxEnergy}`);
  }

  destroy(): void {
    this.healthBar.destroy();
    this.energyBar.destroy();
    this.healthText.destroy();
    this.energyText.destroy();
    this.levelText.destroy();
  }
}
