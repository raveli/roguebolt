import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEFAULT_PLAYER_STATS } from '../config';
import { getTotalLevels } from '../levels/levelData';
import type { GameState } from '../types';

export class MenuScene extends Phaser.Scene {
  private music!: Phaser.Sound.BaseSound;
  private cheatBuffer: string = '';
  private godMode: boolean = false;
  private startLevel: number = 1;

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

    // Cheat code listener
    // - "iddqd" = god mode
    // - "level" + number = jump to level (e.g., "level3")
    this.cheatBuffer = '';
    this.godMode = false;
    this.startLevel = 1;
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      // Track letters and numbers
      if (event.key.length === 1 && event.key.match(/[a-z0-9]/i)) {
        this.cheatBuffer += event.key.toLowerCase();
        // Keep only last 10 characters
        if (this.cheatBuffer.length > 10) {
          this.cheatBuffer = this.cheatBuffer.slice(-10);
        }

        // Check for iddqd (god mode)
        if (this.cheatBuffer.endsWith('iddqd')) {
          this.godMode = true;
          this.showCheatActivated('GOD MODE');
        }

        // Check for level skip (e.g., "level3", "level5")
        const levelMatch = this.cheatBuffer.match(/level(\d)$/);
        if (levelMatch) {
          const level = parseInt(levelMatch[1], 10);
          if (level >= 1 && level <= getTotalLevels()) {
            this.startLevel = level;
            this.showCheatActivated(`LEVEL ${level}`);
          }
        }
      }
    });
  }

  private showCheatActivated(message: string): void {
    const cheatText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `${message} ACTIVATED`, {
      fontSize: '48px',
      color: '#ff0000',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 6,
    });
    cheatText.setOrigin(0.5);
    cheatText.setAlpha(0);

    this.tweens.add({
      targets: cheatText,
      alpha: 1,
      duration: 200,
      yoyo: true,
      hold: 1000,
      onComplete: () => cheatText.destroy(),
    });
  }

  private startGame(): void {
    const initialState: GameState = {
      currentLevel: this.startLevel,
      playerStats: { ...DEFAULT_PLAYER_STATS },
      collectedUpgrades: [],
      godMode: this.godMode,
      score: 0,
      levelStartTime: Date.now(),
    };

    this.scene.start('GameScene', { gameState: initialState });
  }
}
