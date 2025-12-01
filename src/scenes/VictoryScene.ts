import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEFAULT_PLAYER_STATS } from '../config';
import type { GameState } from '../types';

export class VictoryScene extends Phaser.Scene {
  private gameState!: GameState;

  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data: { gameState: GameState }): void {
    this.gameState = data.gameState;
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

    // Stats
    const upgradesCollected = this.gameState.collectedUpgrades.length;

    const statsText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 130,
      `Upgrades Collected: ${upgradesCollected}`,
      {
        fontSize: '22px',
        color: '#aaffaa',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 3,
      }
    );
    statsText.setOrigin(0.5);
    statsText.setAlpha(0);

    this.tweens.add({
      targets: statsText,
      alpha: 1,
      duration: 500,
      delay: 600,
    });

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

  private restartGame(): void {
    const initialState: GameState = {
      currentLevel: 1,
      playerStats: { ...DEFAULT_PLAYER_STATS },
      collectedUpgrades: [],
    };
    this.scene.start('GameScene', { gameState: initialState });
  }

  private goToMenu(): void {
    this.scene.start('MenuScene');
  }
}
