import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { getRandomCards } from '../systems/UpgradeSystem';
import { SoundGenerator } from '../audio/SoundGenerator';
import type { GameState, UpgradeCard } from '../types';

export class CardSelectScene extends Phaser.Scene {
  private gameState!: GameState;
  private soundGenerator!: SoundGenerator;
  private cards: UpgradeCard[] = [];
  private cardContainers: Phaser.GameObjects.Container[] = [];
  private selectedIndex: number = -1;
  private sparkEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'CardSelectScene' });
  }

  init(data: { gameState: GameState }): void {
    this.gameState = data.gameState;
    // Reset state for new card selection
    this.selectedIndex = -1;
    this.cards = [];
    this.cardContainers = [];
  }

  create(): void {
    this.soundGenerator = new SoundGenerator();

    // Background image
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg_scene2');
    bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    // Dark overlay for better card visibility
    this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x000000,
      0.5
    );

    // Create particle emitter for selection effect
    this.sparkEmitter = this.add.particles(0, 0, 'particle_yellow', {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      lifespan: 600,
      gravityY: -50,
      emitting: false,
    });
    this.sparkEmitter.setDepth(100);

    // Title with stroke
    const title = this.add.text(
      GAME_WIDTH / 2,
      70,
      'CHOOSE UPGRADE',
      {
        fontSize: '52px',
        color: '#ffdd00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6,
      }
    );
    title.setOrigin(0.5);

    // Level complete text
    const levelText = this.add.text(
      GAME_WIDTH / 2,
      130,
      `Level ${this.gameState.currentLevel - 1} Complete!`,
      {
        fontSize: '24px',
        color: '#88ff88',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 3,
      }
    );
    levelText.setOrigin(0.5);

    // Get random cards
    this.cards = getRandomCards(3, this.gameState.collectedUpgrades);

    // Create card displays
    const cardWidth = 260;
    const cardHeight = 340;
    const cardSpacing = 40;
    const totalWidth = this.cards.length * cardWidth + (this.cards.length - 1) * cardSpacing;
    const startX = (GAME_WIDTH - totalWidth) / 2 + cardWidth / 2;

    this.cards.forEach((card, index) => {
      const x = startX + index * (cardWidth + cardSpacing);
      const y = GAME_HEIGHT / 2 + 40;

      const container = this.createCard(card, x, y, cardWidth, cardHeight, index);
      this.cardContainers.push(container);
    });

    // Instructions
    const instructions = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 50,
      'Click a card or press [1] [2] [3]',
      {
        fontSize: '20px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );
    instructions.setOrigin(0.5);

    // Keyboard navigation
    this.input.keyboard?.on('keydown-ONE', () => this.selectCard(0));
    this.input.keyboard?.on('keydown-TWO', () => this.selectCard(1));
    this.input.keyboard?.on('keydown-THREE', () => this.selectCard(2));
  }

  private createCard(
    card: UpgradeCard,
    x: number,
    y: number,
    width: number,
    height: number,
    index: number
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // 8-bit style card background with cut corners
    const cardBg = this.add.graphics();
    const cornerSize = 12;

    // Main card body (dark purple)
    cardBg.fillStyle(0x1a1a3e);
    cardBg.beginPath();
    cardBg.moveTo(-width/2 + cornerSize, -height/2);
    cardBg.lineTo(width/2 - cornerSize, -height/2);
    cardBg.lineTo(width/2, -height/2 + cornerSize);
    cardBg.lineTo(width/2, height/2 - cornerSize);
    cardBg.lineTo(width/2 - cornerSize, height/2);
    cardBg.lineTo(-width/2 + cornerSize, height/2);
    cardBg.lineTo(-width/2, height/2 - cornerSize);
    cardBg.lineTo(-width/2, -height/2 + cornerSize);
    cardBg.closePath();
    cardBg.fillPath();

    // Border (golden/bronze)
    cardBg.lineStyle(4, 0xaa8844);
    cardBg.beginPath();
    cardBg.moveTo(-width/2 + cornerSize, -height/2);
    cardBg.lineTo(width/2 - cornerSize, -height/2);
    cardBg.lineTo(width/2, -height/2 + cornerSize);
    cardBg.lineTo(width/2, height/2 - cornerSize);
    cardBg.lineTo(width/2 - cornerSize, height/2);
    cardBg.lineTo(-width/2 + cornerSize, height/2);
    cardBg.lineTo(-width/2, height/2 - cornerSize);
    cardBg.lineTo(-width/2, -height/2 + cornerSize);
    cardBg.closePath();
    cardBg.strokePath();

    // Inner highlight line
    cardBg.lineStyle(2, 0x3a3a6e);
    cardBg.strokeRect(-width/2 + 8, -height/2 + 8, width - 16, height - 16);

    // Card number badge
    const numberBg = this.add.graphics();
    numberBg.fillStyle(0x4a4a8e);
    numberBg.fillRoundedRect(-24, -height/2 + 8, 48, 28, 4);
    numberBg.lineStyle(2, 0xaa8844);
    numberBg.strokeRoundedRect(-24, -height/2 + 8, 48, 28, 4);

    const numberText = this.add.text(
      0,
      -height / 2 + 22,
      `[${index + 1}]`,
      {
        fontSize: '16px',
        color: '#ffdd88',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      }
    );
    numberText.setOrigin(0.5);

    // Card icon from generated texture
    const iconKey = `card_icon_${card.id}`;
    let icon: Phaser.GameObjects.Image | Phaser.GameObjects.Graphics;

    if (this.textures.exists(iconKey)) {
      icon = this.add.image(0, -55, iconKey);
      icon.setScale(1.5);
    } else {
      // Fallback circle if icon not found
      const fallbackIcon = this.add.graphics();
      fallbackIcon.fillStyle(this.getCardColor(card.id));
      fallbackIcon.fillCircle(0, -55, 30);
      icon = fallbackIcon;
    }

    // Icon glow effect
    const iconGlow = this.add.graphics();
    iconGlow.fillStyle(this.getCardColor(card.id), 0.3);
    iconGlow.fillCircle(0, -55, 40);

    // Card name with retro styling
    const nameText = this.add.text(
      0,
      30,
      card.name,
      {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3,
      }
    );
    nameText.setOrigin(0.5);

    // Card description
    const descText = this.add.text(
      0,
      85,
      card.description,
      {
        fontSize: '16px',
        color: '#cccccc',
        fontFamily: 'monospace',
        wordWrap: { width: width - 50 },
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );
    descText.setOrigin(0.5);

    container.add([cardBg, iconGlow, numberBg, numberText, icon, nameText, descText]);

    // Create invisible hit area for interaction
    const hitArea = this.add.rectangle(0, 0, width, height, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    container.add(hitArea);

    // Hover glow graphics (initially invisible)
    const hoverGlow = this.add.graphics();
    hoverGlow.lineStyle(4, 0xffdd00, 0);
    hoverGlow.beginPath();
    hoverGlow.moveTo(-width/2 + cornerSize, -height/2);
    hoverGlow.lineTo(width/2 - cornerSize, -height/2);
    hoverGlow.lineTo(width/2, -height/2 + cornerSize);
    hoverGlow.lineTo(width/2, height/2 - cornerSize);
    hoverGlow.lineTo(width/2 - cornerSize, height/2);
    hoverGlow.lineTo(-width/2 + cornerSize, height/2);
    hoverGlow.lineTo(-width/2, height/2 - cornerSize);
    hoverGlow.lineTo(-width/2, -height/2 + cornerSize);
    hoverGlow.closePath();
    hoverGlow.strokePath();
    hoverGlow.setAlpha(0);
    container.add(hoverGlow);

    hitArea.on('pointerover', () => {
      hoverGlow.setAlpha(1);
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: 'Power2',
      });
    });

    hitArea.on('pointerout', () => {
      hoverGlow.setAlpha(0);
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Power2',
      });
    });

    hitArea.on('pointerdown', () => {
      this.selectCard(index);
    });

    // Entrance animation - fly in from bottom
    container.setAlpha(0);
    container.setY(y + 100);
    container.setScale(0.8);
    this.tweens.add({
      targets: container,
      alpha: 1,
      y: y,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      delay: index * 150,
      ease: 'Back.easeOut',
    });

    return container;
  }

  private getCardColor(cardId: string): number {
    const colors: Record<string, number> = {
      jump_boost: 0x00ff88,
      speed_boost: 0xffaa00,
      damage_up: 0xff4444,
      max_energy: 0x00aaff,
      energy_regen: 0x44ff44,
      max_health: 0xff8888,
      heal: 0xff66aa,
      energy_refill: 0x66aaff,
      glass_cannon: 0xff0000,
      tank: 0x8888ff,
    };
    return colors[cardId] || 0xffffff;
  }

  private selectCard(index: number): void {
    if (index < 0 || index >= this.cards.length || this.selectedIndex >= 0) return;

    this.selectedIndex = index;
    const card = this.cards[index];

    // Play sound
    this.soundGenerator.cardSelect();

    // Apply card effect
    card.effect(this.gameState.playerStats);
    this.gameState.collectedUpgrades.push(card.id);

    // Get selected card position for particles
    const selectedContainer = this.cardContainers[index];

    // Emit particles at card position
    this.sparkEmitter.setPosition(selectedContainer.x, selectedContainer.y);
    this.sparkEmitter.explode(30);

    // Highlight selected card with glow animation
    this.tweens.add({
      targets: selectedContainer,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 200,
      ease: 'Back.easeOut',
      yoyo: true,
      repeat: 1,
    });

    // Flash effect on selected card
    const flash = this.add.rectangle(
      selectedContainer.x,
      selectedContainer.y,
      280,
      360,
      0xffffff,
      0.8
    );
    flash.setDepth(50);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
    });

    // Fade out and slide other cards
    this.cardContainers.forEach((container, i) => {
      if (i !== index) {
        const direction = i < index ? -1 : 1;
        this.tweens.add({
          targets: container,
          alpha: 0,
          x: container.x + direction * 100,
          duration: 400,
          ease: 'Power2',
        });
      }
    });

    // Transition to next level
    this.time.delayedCall(1000, () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene', { gameState: this.gameState });
      });
    });
  }
}
