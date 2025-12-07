import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class PauseScene extends Phaser.Scene {
  private returnSceneKey: string = 'GameScene';

  constructor() {
    super({ key: 'PauseScene' });
  }

  init(data: { returnScene?: string }): void {
    this.returnSceneKey = data.returnScene || 'GameScene';
  }

  create(): void {
    // Semi-transparent overlay
    const overlay = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x000000,
      0.7
    );
    overlay.setScrollFactor(0);

    // Pause title
    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3, 'TAUKO', {
      fontSize: '64px',
      color: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 4,
    });
    title.setOrigin(0.5);

    // Menu options
    const buttonStyle = {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'monospace',
      backgroundColor: '#333333',
      padding: { x: 30, y: 15 },
    };

    const buttonY = GAME_HEIGHT / 2;
    const buttonSpacing = 80;

    // Resume button
    const resumeBtn = this.add.text(GAME_WIDTH / 2, buttonY, 'JATKA', buttonStyle);
    resumeBtn.setOrigin(0.5);
    resumeBtn.setInteractive({ useHandCursor: true });
    resumeBtn.on('pointerover', () => resumeBtn.setStyle({ color: '#ffff00' }));
    resumeBtn.on('pointerout', () => resumeBtn.setStyle({ color: '#ffffff' }));
    resumeBtn.on('pointerdown', () => this.resumeGame());

    // Restart button
    const restartBtn = this.add.text(
      GAME_WIDTH / 2,
      buttonY + buttonSpacing,
      'ALOITA ALUSTA',
      buttonStyle
    );
    restartBtn.setOrigin(0.5);
    restartBtn.setInteractive({ useHandCursor: true });
    restartBtn.on('pointerover', () => restartBtn.setStyle({ color: '#ffff00' }));
    restartBtn.on('pointerout', () => restartBtn.setStyle({ color: '#ffffff' }));
    restartBtn.on('pointerdown', () => this.restartGame());

    // Main menu button
    const menuBtn = this.add.text(
      GAME_WIDTH / 2,
      buttonY + buttonSpacing * 2,
      'PÄÄVALIKKO',
      buttonStyle
    );
    menuBtn.setOrigin(0.5);
    menuBtn.setInteractive({ useHandCursor: true });
    menuBtn.on('pointerover', () => menuBtn.setStyle({ color: '#ffff00' }));
    menuBtn.on('pointerout', () => menuBtn.setStyle({ color: '#ffffff' }));
    menuBtn.on('pointerdown', () => this.goToMenu());

    // ESC to resume
    this.input.keyboard?.on('keydown-ESC', () => {
      this.resumeGame();
    });

    // Fade in
    this.cameras.main.fadeIn(200);
  }

  private resumeGame(): void {
    this.scene.stop();
    this.scene.resume(this.returnSceneKey);
  }

  private restartGame(): void {
    // Get the GameScene to access gameState
    const gameScene = this.scene.get(this.returnSceneKey) as any;
    const gameState = gameScene?.gameState;

    this.scene.stop();
    this.scene.stop(this.returnSceneKey);

    if (gameState) {
      // Reset current level stats but keep the level
      gameState.playerStats = {
        health: 100,
        maxHealth: 100,
        energy: 0,
        maxEnergy: 100,
        damage: 10,
        speed: 200,
        jumpPower: 350,
      };
      // Reset score and timer for fresh start
      gameState.score = 0;
      gameState.levelStartTime = Date.now();
      this.scene.start('GameScene', { gameState });
    } else {
      this.scene.start('MenuScene');
    }
  }

  private goToMenu(): void {
    this.scene.stop();
    this.scene.stop(this.returnSceneKey);
    this.scene.start('MenuScene');
  }
}
