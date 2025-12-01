import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEFAULT_PLAYER_STATS } from '../config';
import type { GameState } from '../types';

export class MenuScene extends Phaser.Scene {
  private music!: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    // Start background music if not already playing
    if (!this.sound.get('theme')) {
      this.music = this.sound.add('theme', { loop: true, volume: 0.3 });
      this.music.play();
    } else {
      this.music = this.sound.get('theme')!;
      (this.music as Phaser.Sound.WebAudioSound).setVolume(0.3);
    }

    // Title screen background
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'title');
    bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    // Start button
    const startButton = this.add.text(GAME_WIDTH / 2, 550, '[ START GAME ]', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 4,
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setColor('#ffdd00');
      startButton.setScale(1.1);
    });

    startButton.on('pointerout', () => {
      startButton.setColor('#ffffff');
      startButton.setScale(1);
    });

    startButton.on('pointerdown', () => {
      this.startGame();
    });

    // Controls info
    const controls = this.add.text(
      GAME_WIDTH / 2,
      650,
      'Arrow keys to move  |  SPACE to shoot (hold to charge)',
      {
        fontSize: '16px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );
    controls.setOrigin(0.5);

    // Allow starting with Enter or Space
    this.input.keyboard?.on('keydown-ENTER', () => {
      this.startGame();
    });

    this.input.keyboard?.on('keydown-SPACE', () => {
      this.startGame();
    });
  }

  private startGame(): void {
    const initialState: GameState = {
      currentLevel: 1,
      playerStats: { ...DEFAULT_PLAYER_STATS },
      collectedUpgrades: [],
    };

    this.scene.start('GameScene', { gameState: initialState });
  }
}
