import Phaser from 'phaser';
import { GAME_WIDTH } from '../config';
import type { GameState, PlayerStats } from '../types';
import { SCORE_VALUES } from '../types';
import { getCoins } from '../utils/coins';

export class HUD {
  private scene: Phaser.Scene;
  private gameState: GameState;
  private healthBar: Phaser.GameObjects.Graphics;
  private energyBar: Phaser.GameObjects.Graphics;
  private healthText: Phaser.GameObjects.Text;
  private energyText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private timerText: Phaser.GameObjects.Text;
  private coinIcon: Phaser.GameObjects.Image;
  private coinText: Phaser.GameObjects.Text;

  private barWidth: number = 200;
  private barHeight: number = 16;
  private padding: number = 15;

  constructor(scene: Phaser.Scene, gameState: GameState) {
    this.scene = scene;
    this.gameState = gameState;

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

    // Level indicator (top center)
    this.levelText = scene.add.text(
      GAME_WIDTH / 2,
      this.padding,
      `Kenttä ${gameState.currentLevel}`,
      {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace',
      }
    );
    this.levelText.setOrigin(0.5, 0);
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(50);

    // Timer (below level text)
    this.timerText = scene.add.text(
      GAME_WIDTH / 2,
      this.padding + 25,
      '0:00',
      {
        fontSize: '24px',
        color: '#ffdd00',
        fontFamily: 'monospace',
      }
    );
    this.timerText.setOrigin(0.5, 0);
    this.timerText.setScrollFactor(0);
    this.timerText.setDepth(50);

    // Score (top right)
    this.scoreText = scene.add.text(
      GAME_WIDTH - this.padding,
      this.padding,
      '0',
      {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'monospace',
      }
    );
    this.scoreText.setOrigin(1, 0);
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(50);

    // Coins count (below score, right-aligned)
    this.coinText = scene.add.text(
      GAME_WIDTH - this.padding,
      this.padding + 32,
      `${getCoins()}`,
      {
        fontSize: '18px',
        color: '#ffd700',
        fontFamily: 'monospace',
      }
    );
    this.coinText.setOrigin(1, 0);
    this.coinText.setScrollFactor(0);
    this.coinText.setDepth(50);

    // Coin icon (to the left of coin count)
    this.coinIcon = scene.add.image(
      GAME_WIDTH - this.padding - this.coinText.width - 16,
      this.padding + 42,
      'coin'
    );
    this.coinIcon.setDisplaySize(20, 20);
    this.coinIcon.setScrollFactor(0);
    this.coinIcon.setDepth(50);
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

    // Update score
    this.scoreText.setText(`${this.gameState.score}`);

    // Update coins (reads from localStorage)
    this.coinText.setText(`${getCoins()}`);
    // Reposition coin icon based on text width
    this.coinIcon.setX(GAME_WIDTH - this.padding - this.coinText.width - 16);

    // Update timer
    const elapsed = Math.floor((Date.now() - this.gameState.levelStartTime) / 1000);
    const remaining = Math.max(0, SCORE_VALUES.LEVEL_TIME_LIMIT - elapsed);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);

    // Timer color changes as time runs out
    if (remaining <= 10) {
      this.timerText.setColor('#ff0000');
    } else if (remaining <= 30) {
      this.timerText.setColor('#ff8800');
    } else {
      this.timerText.setColor('#ffdd00');
    }
  }

  destroy(): void {
    this.healthBar.destroy();
    this.energyBar.destroy();
    this.healthText.destroy();
    this.energyText.destroy();
    this.levelText.destroy();
    this.scoreText.destroy();
    this.timerText.destroy();
    this.coinIcon.destroy();
    this.coinText.destroy();
  }

  // Show score popup animation
  showScorePopup(x: number, y: number, points: number): void {
    const color = points >= 200 ? '#ffff00' : '#ffffff';
    const popup = this.scene.add.text(x, y, `+${points}`, {
      fontSize: '20px',
      color: color,
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 3,
    });
    popup.setOrigin(0.5);
    popup.setDepth(100);

    this.scene.tweens.add({
      targets: popup,
      y: y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => popup.destroy(),
    });
  }
}
