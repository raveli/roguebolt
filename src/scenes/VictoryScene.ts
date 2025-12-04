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

    // Background - use title screen
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'title');
    bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    // Golden overlay
    this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x332200,
      0.5
    );

    // Confetti particles
    this.add.particles(GAME_WIDTH / 2, -20, 'particle_yellow', {
      speed: { min: 100, max: 300 },
      angle: { min: 80, max: 100 },
      scale: { start: 1.5, end: 0.5 },
      lifespan: 4000,
      gravityY: 150,
      frequency: 50,
      quantity: 2,
      tint: [0xffdd00, 0xff8800, 0x44ff44, 0x4488ff, 0xff44ff],
    });

    // Also emit from sides
    this.add.particles(0, GAME_HEIGHT / 2, 'particle_yellow', {
      speed: { min: 200, max: 400 },
      angle: { min: -30, max: 30 },
      scale: { start: 1.2, end: 0.3 },
      lifespan: 3000,
      gravityY: 100,
      frequency: 100,
      quantity: 1,
      tint: [0xffdd00, 0xff8800, 0x44ff44],
    });

    this.add.particles(GAME_WIDTH, GAME_HEIGHT / 2, 'particle_yellow', {
      speed: { min: 200, max: 400 },
      angle: { min: 150, max: 210 },
      scale: { start: 1.2, end: 0.3 },
      lifespan: 3000,
      gravityY: 100,
      frequency: 100,
      quantity: 1,
      tint: [0xffdd00, 0xff8800, 0x44ff44],
    });

    // Player sprite (celebrating)
    const player = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, 'player');
    player.setScale(4);

    // Pulsing glow effect on player
    this.tweens.add({
      targets: player,
      scaleX: 4.5,
      scaleY: 4.5,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // VICTORY title
    const title = this.add.text(
      GAME_WIDTH / 2,
      100,
      'VICTORY!',
      {
        fontSize: '84px',
        color: '#ffdd00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 10,
      }
    );
    title.setOrigin(0.5);
    title.setScale(0);

    // Bounce in title
    this.tweens.add({
      targets: title,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Back.easeOut',
    });

    // Pulsing glow on title
    this.tweens.add({
      targets: title,
      alpha: 0.8,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 600,
    });

    // Congratulations text
    const congratsText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 80,
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
      delay: 400,
    });

    // Final Score (big and prominent)
    const scoreLabel = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 110,
      'FINAL SCORE',
      {
        fontSize: '18px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );
    scoreLabel.setOrigin(0.5);
    scoreLabel.setAlpha(0);

    const scoreText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 145,
      `${this.gameState.score}`,
      {
        fontSize: '48px',
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
      const newHighText = this.add.text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 185,
        this.scoreResult.rank === 1 ? 'NEW HIGH SCORE!' : `#${this.scoreResult.rank} BEST!`,
        {
          fontSize: '24px',
          color: '#ff4444',
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
        duration: 300,
        delay: 800,
      });

      // Pulsing effect on new high score text
      this.tweens.add({
        targets: newHighText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 400,
        yoyo: true,
        repeat: -1,
        delay: 800,
      });
    }

    // High scores list (right side)
    this.showHighScores();

    // Buttons
    const buttonsY = GAME_HEIGHT / 2 + 220;

    // PLAY AGAIN button
    const playAgainBtn = this.createButton(
      GAME_WIDTH / 2 - 150,
      buttonsY + 50,
      'PLAY AGAIN',
      () => this.restartGame()
    );
    playAgainBtn.setAlpha(0);
    this.tweens.add({
      targets: playAgainBtn,
      alpha: 1,
      y: buttonsY,
      duration: 500,
      delay: 1000,
      ease: 'Back.easeOut',
    });

    // MAIN MENU button
    const menuBtn = this.createButton(
      GAME_WIDTH / 2 + 150,
      buttonsY + 50,
      'MAIN MENU',
      () => this.goToMenu()
    );
    menuBtn.setAlpha(0);
    this.tweens.add({
      targets: menuBtn,
      alpha: 1,
      y: buttonsY,
      duration: 500,
      delay: 1100,
      ease: 'Back.easeOut',
    });

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

    const startX = GAME_WIDTH - 200;
    const startY = 150;

    const titleText = this.add.text(startX, startY, 'TOP SCORES', {
      fontSize: '18px',
      color: '#ffdd00',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 2,
    });
    titleText.setOrigin(0.5, 0);
    titleText.setAlpha(0);

    this.tweens.add({
      targets: titleText,
      alpha: 1,
      duration: 500,
      delay: 1000,
    });

    // Show top 5 scores
    const displayScores = highScores.slice(0, 5);
    displayScores.forEach((entry, index) => {
      const isCurrentScore = entry.score === this.gameState.score && index === this.scoreResult.rank - 1;
      const color = isCurrentScore ? '#ffff00' : '#ffffff';

      const entryText = this.add.text(
        startX,
        startY + 30 + index * 25,
        `${index + 1}. ${entry.score}`,
        {
          fontSize: '16px',
          color: color,
          fontFamily: 'monospace',
          stroke: '#000000',
          strokeThickness: 2,
        }
      );
      entryText.setOrigin(0.5, 0);
      entryText.setAlpha(0);

      this.tweens.add({
        targets: entryText,
        alpha: 1,
        duration: 300,
        delay: 1100 + index * 100,
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
