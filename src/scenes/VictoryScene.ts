import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEFAULT_PLAYER_STATS } from '../config';
import type { GameState } from '../types';
import { saveHighScore, getHighScores } from '../utils/highScores';

export class VictoryScene extends Phaser.Scene {
  private gameState!: GameState;
  private scoreResult!: { rank: number; isNewHighScore: boolean };

  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data: { gameState: GameState }): void {
    this.gameState = data.gameState;
    // Save the score and get ranking
    this.scoreResult = saveHighScore(this.gameState.score);
  }

  create(): void {
    // Increase music volume for celebration
    const music = this.sound.get('theme');
    if (music) {
      (music as Phaser.Sound.WebAudioSound).setVolume(0.5);
    }

    // Victory background
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'victory_bg');
    bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    // Semi-transparent overlay for better text readability
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.4);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Subtle confetti from top
    this.add.particles(GAME_WIDTH / 2, -20, 'particle_yellow', {
      speed: { min: 60, max: 120 },
      angle: { min: 70, max: 110 },
      scale: { start: 0.8, end: 0.2 },
      lifespan: 6000,
      gravityY: 50,
      frequency: 200,
      quantity: 1,
      tint: [0xffdd00, 0xff8800, 0x44ff44],
    });

    // === HEADER SECTION ===

    // VICTORY title - large and impactful
    const title = this.add.text(
      GAME_WIDTH / 2,
      90,
      'VICTORY!',
      {
        fontSize: '96px',
        color: '#ffdd00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 10,
        shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 8, fill: true },
      }
    );
    title.setOrigin(0.5);
    title.setScale(0);

    this.tweens.add({
      targets: title,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Back.easeOut',
    });

    // === SCORE CARD SECTION ===

    // Score card background panel
    const cardWidth = 500;
    const cardHeight = 220;
    const cardY = 310;

    const scoreCard = this.add.graphics();
    scoreCard.fillStyle(0x000000, 0.5);
    scoreCard.fillRoundedRect(
      GAME_WIDTH / 2 - cardWidth / 2,
      cardY - cardHeight / 2,
      cardWidth,
      cardHeight,
      16
    );
    scoreCard.lineStyle(2, 0xffdd00, 0.5);
    scoreCard.strokeRoundedRect(
      GAME_WIDTH / 2 - cardWidth / 2,
      cardY - cardHeight / 2,
      cardWidth,
      cardHeight,
      16
    );
    scoreCard.setAlpha(0);

    this.tweens.add({
      targets: scoreCard,
      alpha: 1,
      duration: 400,
      delay: 400,
    });

    // Congratulations text
    const congratsText = this.add.text(
      GAME_WIDTH / 2,
      cardY - 70,
      'You conquered all levels!',
      {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 4,
      }
    );
    congratsText.setOrigin(0.5);
    congratsText.setAlpha(0);

    this.tweens.add({
      targets: congratsText,
      alpha: 1,
      duration: 500,
      delay: 500,
    });

    // Final Score label
    const scoreLabel = this.add.text(
      GAME_WIDTH / 2,
      cardY - 25,
      'FINAL SCORE',
      {
        fontSize: '20px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );
    scoreLabel.setOrigin(0.5);
    scoreLabel.setAlpha(0);

    // Score value - big and bold
    const scoreText = this.add.text(
      GAME_WIDTH / 2,
      cardY + 25,
      `${this.gameState.score}`,
      {
        fontSize: '64px',
        color: '#ffdd00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6,
      }
    );
    scoreText.setOrigin(0.5);
    scoreText.setAlpha(0);

    this.tweens.add({
      targets: [scoreLabel, scoreText],
      alpha: 1,
      duration: 500,
      delay: 600,
    });

    // New high score indicator
    if (this.scoreResult.isNewHighScore) {
      const badgeText = this.scoreResult.rank === 1 ? '★ NEW HIGH SCORE ★' : `★ #${this.scoreResult.rank} BEST ★`;
      const newHighText = this.add.text(
        GAME_WIDTH / 2,
        cardY + 80,
        badgeText,
        {
          fontSize: '24px',
          color: '#ff6644',
          fontFamily: 'monospace',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 4,
        }
      );
      newHighText.setOrigin(0.5);
      newHighText.setAlpha(0);

      this.tweens.add({
        targets: newHighText,
        alpha: 1,
        duration: 400,
        delay: 800,
      });

      this.tweens.add({
        targets: newHighText,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 500,
        yoyo: true,
        repeat: -1,
        delay: 800,
      });
    }

    // === BUTTONS SECTION ===

    const buttonsY = 500;

    const playAgainBtn = this.createButton(
      GAME_WIDTH / 2 - 130,
      buttonsY + 40,
      'PLAY AGAIN',
      () => this.restartGame()
    );
    playAgainBtn.setAlpha(0);
    this.tweens.add({
      targets: playAgainBtn,
      alpha: 1,
      y: buttonsY,
      duration: 500,
      delay: 900,
      ease: 'Back.easeOut',
    });

    const menuBtn = this.createButton(
      GAME_WIDTH / 2 + 130,
      buttonsY + 40,
      'MAIN MENU',
      () => this.goToMenu()
    );
    menuBtn.setAlpha(0);
    this.tweens.add({
      targets: menuBtn,
      alpha: 1,
      y: buttonsY,
      duration: 500,
      delay: 1000,
      ease: 'Back.easeOut',
    });

    // === HIGH SCORES SECTION ===
    this.showHighScores();

    // Keyboard shortcuts
    this.input.keyboard?.on('keydown-ENTER', () => this.restartGame());
    this.input.keyboard?.on('keydown-SPACE', () => this.restartGame());
    this.input.keyboard?.on('keydown-ESC', () => this.goToMenu());
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    const width = 200;
    const height = 50;

    bg.fillStyle(0x336633);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
    bg.lineStyle(3, 0x66aa66);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);

    const btnText = this.add.text(0, 0, text, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    btnText.setOrigin(0.5);

    container.add([bg, btnText]);

    const hitArea = this.add.rectangle(0, 0, width, height, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    container.add(hitArea);

    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x44aa44);
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
      bg.lineStyle(3, 0x88ff88);
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);
      container.setScale(1.05);
    });

    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x336633);
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
      bg.lineStyle(3, 0x66aa66);
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);
      container.setScale(1);
    });

    hitArea.on('pointerdown', callback);

    return container;
  }

  private showHighScores(): void {
    const highScores = getHighScores();
    if (highScores.length === 0) return;

    const startY = 590;

    // Title
    const titleText = this.add.text(GAME_WIDTH / 2, startY, 'HIGH SCORES', {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2,
    });
    titleText.setOrigin(0.5);
    titleText.setAlpha(0);

    this.tweens.add({
      targets: titleText,
      alpha: 1,
      duration: 500,
      delay: 1100,
    });

    // Show top 5 scores in a clean horizontal row
    const displayScores = highScores.slice(0, 5);
    const spacing = 140;
    const totalWidth = (displayScores.length - 1) * spacing;
    const startX = GAME_WIDTH / 2 - totalWidth / 2;

    displayScores.forEach((entry, index) => {
      const isCurrentScore = entry.score === this.gameState.score && index === this.scoreResult.rank - 1;
      const color = isCurrentScore ? '#ffdd00' : '#666666';
      const fontSize = isCurrentScore ? '20px' : '18px';

      const entryText = this.add.text(
        startX + index * spacing,
        startY + 35,
        `#${index + 1}  ${entry.score}`,
        {
          fontSize: fontSize,
          color: color,
          fontFamily: 'monospace',
          stroke: '#000000',
          strokeThickness: 2,
        }
      );
      entryText.setOrigin(0.5);
      entryText.setAlpha(0);

      this.tweens.add({
        targets: entryText,
        alpha: 1,
        duration: 300,
        delay: 1200 + index * 60,
      });
    });
  }

  private restartGame(): void {
    const initialState: GameState = {
      currentLevel: 1,
      playerStats: { ...DEFAULT_PLAYER_STATS },
      collectedUpgrades: [],
      score: 0,
      levelStartTime: Date.now(),
    };
    this.scene.start('GameScene', { gameState: initialState });
  }

  private goToMenu(): void {
    this.scene.start('MenuScene');
  }
}
