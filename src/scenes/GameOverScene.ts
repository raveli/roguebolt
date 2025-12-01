import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEFAULT_PLAYER_STATS } from '../config';
import type { GameState } from '../types';

export class GameOverScene extends Phaser.Scene {
  private gameState!: GameState;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { gameState: GameState }): void {
    this.gameState = data.gameState;
  }

  create(): void {
    // Lower music volume
    const music = this.sound.get('theme');
    if (music) {
      (music as Phaser.Sound.WebAudioSound).setVolume(0.15);
    }

    // Background
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg_scene2');
    bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    // Dark red overlay
    this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x220000,
      0.7
    );

    // Player sprite (grayed out, fallen)
    const player = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 'player');
    player.setScale(3);
    player.setTint(0x666666);
    player.setAlpha(0.6);
    player.setAngle(90); // Fallen over

    // GAME OVER title
    const title = this.add.text(
      GAME_WIDTH / 2,
      -80,
      'GAME OVER',
      {
        fontSize: '72px',
        color: '#ff4444',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 8,
      }
    );
    title.setOrigin(0.5);

    // Animate title in
    this.tweens.add({
      targets: title,
      y: 140,
      duration: 800,
      ease: 'Bounce.easeOut',
    });

    // Stats
    const levelReached = this.gameState.currentLevel;
    const upgradesCollected = this.gameState.collectedUpgrades.length;

    const statsText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 100,
      `Level Reached: ${levelReached}\nUpgrades Collected: ${upgradesCollected}`,
      {
        fontSize: '24px',
        color: '#cccccc',
        fontFamily: 'monospace',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 3,
      }
    );
    statsText.setOrigin(0.5);
    statsText.setAlpha(0);

    // Fade in stats
    this.tweens.add({
      targets: statsText,
      alpha: 1,
      duration: 500,
      delay: 600,
    });

    // Buttons container
    const buttonsY = GAME_HEIGHT / 2 + 200;

    // TRY AGAIN button
    const tryAgainBtn = this.createButton(
      GAME_WIDTH / 2 - 150,
      buttonsY,
      'TRY AGAIN',
      () => this.restartGame()
    );
    tryAgainBtn.setAlpha(0);
    this.tweens.add({
      targets: tryAgainBtn,
      alpha: 1,
      y: buttonsY,
      duration: 400,
      delay: 1000,
      ease: 'Back.easeOut',
    });
    tryAgainBtn.setY(buttonsY + 50);

    // MAIN MENU button
    const menuBtn = this.createButton(
      GAME_WIDTH / 2 + 150,
      buttonsY,
      'MAIN MENU',
      () => this.goToMenu()
    );
    menuBtn.setAlpha(0);
    this.tweens.add({
      targets: menuBtn,
      alpha: 1,
      y: buttonsY,
      duration: 400,
      delay: 1100,
      ease: 'Back.easeOut',
    });
    menuBtn.setY(buttonsY + 50);

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

    // Button background
    const bg = this.add.graphics();
    const width = 200;
    const height = 50;

    bg.fillStyle(0x333366);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
    bg.lineStyle(3, 0x666699);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);

    // Button text
    const btnText = this.add.text(0, 0, text, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    btnText.setOrigin(0.5);

    container.add([bg, btnText]);

    // Make interactive
    const hitArea = this.add.rectangle(0, 0, width, height, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    container.add(hitArea);

    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x4444aa);
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
      bg.lineStyle(3, 0x8888ff);
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);
      container.setScale(1.05);
    });

    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x333366);
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
      bg.lineStyle(3, 0x666699);
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
