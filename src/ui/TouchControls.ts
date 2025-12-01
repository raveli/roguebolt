import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export interface TouchInputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  shoot: boolean;
  shootJustReleased: boolean;
}

export class TouchControls {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private inputState: TouchInputState = {
    left: false,
    right: false,
    jump: false,
    shoot: false,
    shootJustReleased: false,
  };

  private leftBtn!: Phaser.GameObjects.Container;
  private rightBtn!: Phaser.GameObjects.Container;
  private jumpBtn!: Phaser.GameObjects.Container;
  private shootBtn!: Phaser.GameObjects.Container;

  private isVisible: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(1000);

    // Check if touch device
    this.isVisible = this.isTouchDevice();

    if (this.isVisible) {
      this.createButtons();
    }
  }

  private isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
    );
  }

  private createButtons(): void {
    const buttonSize = 70;
    const padding = 20;
    const bottomY = GAME_HEIGHT - buttonSize / 2 - padding;

    // Left side - D-pad style movement
    const leftX = padding + buttonSize / 2;
    const rightX = padding + buttonSize * 1.8;

    // Left button
    this.leftBtn = this.createButton(leftX, bottomY, buttonSize, '◀');
    this.setupButtonInput(this.leftBtn, 'left');

    // Right button
    this.rightBtn = this.createButton(rightX, bottomY, buttonSize, '▶');
    this.setupButtonInput(this.rightBtn, 'right');

    // Right side - action buttons
    const actionRightX = GAME_WIDTH - padding - buttonSize / 2;
    const actionLeftX = GAME_WIDTH - padding - buttonSize * 1.8;

    // Jump button (right side, slightly higher)
    this.jumpBtn = this.createButton(
      actionRightX,
      bottomY - buttonSize * 0.6,
      buttonSize,
      '▲',
      0x44aa44
    );
    this.setupButtonInput(this.jumpBtn, 'jump');

    // Shoot button (left of jump, lower)
    this.shootBtn = this.createButton(
      actionLeftX,
      bottomY,
      buttonSize,
      '●',
      0xaa4444
    );
    this.setupButtonInput(this.shootBtn, 'shoot');

    // Add labels
    this.addLabel(actionRightX, bottomY - buttonSize * 0.6 + buttonSize / 2 + 15, 'JUMP');
    this.addLabel(actionLeftX, bottomY + buttonSize / 2 + 15, 'FIRE');

    this.container.add([this.leftBtn, this.rightBtn, this.jumpBtn, this.shootBtn]);
  }

  private createButton(
    x: number,
    y: number,
    size: number,
    symbol: string,
    color: number = 0x4466aa
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);

    // Button background
    const bg = this.scene.add.graphics();
    bg.fillStyle(color, 0.4);
    bg.fillCircle(0, 0, size / 2);
    bg.lineStyle(3, color, 0.8);
    bg.strokeCircle(0, 0, size / 2);

    // Button symbol
    const text = this.scene.add.text(0, 0, symbol, {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'monospace',
    });
    text.setOrigin(0.5);
    text.setAlpha(0.8);

    // Hit area (larger than visual)
    const hitArea = this.scene.add.circle(0, 0, size / 2 + 10, 0x000000, 0);
    hitArea.setInteractive();

    container.add([bg, text, hitArea]);
    container.setData('bg', bg);
    container.setData('color', color);
    container.setData('size', size);

    return container;
  }

  private setupButtonInput(
    button: Phaser.GameObjects.Container,
    inputKey: keyof Omit<TouchInputState, 'shootJustReleased'>
  ): void {
    const hitArea = button.getAt(2) as Phaser.GameObjects.Arc;
    const bg = button.getData('bg') as Phaser.GameObjects.Graphics;
    const color = button.getData('color') as number;
    const size = button.getData('size') as number;

    hitArea.on('pointerdown', () => {
      this.inputState[inputKey] = true;
      // Highlight effect
      bg.clear();
      bg.fillStyle(color, 0.7);
      bg.fillCircle(0, 0, size / 2);
      bg.lineStyle(4, 0xffffff, 0.9);
      bg.strokeCircle(0, 0, size / 2);
      button.setScale(1.1);
    });

    hitArea.on('pointerup', () => {
      this.inputState[inputKey] = false;
      if (inputKey === 'shoot') {
        this.inputState.shootJustReleased = true;
      }
      // Reset effect
      bg.clear();
      bg.fillStyle(color, 0.4);
      bg.fillCircle(0, 0, size / 2);
      bg.lineStyle(3, color, 0.8);
      bg.strokeCircle(0, 0, size / 2);
      button.setScale(1);
    });

    hitArea.on('pointerout', () => {
      this.inputState[inputKey] = false;
      // Reset effect
      bg.clear();
      bg.fillStyle(color, 0.4);
      bg.fillCircle(0, 0, size / 2);
      bg.lineStyle(3, color, 0.8);
      bg.strokeCircle(0, 0, size / 2);
      button.setScale(1);
    });
  }

  private addLabel(x: number, y: number, text: string): void {
    const label = this.scene.add.text(x, y, text, {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: 'monospace',
    });
    label.setOrigin(0.5);
    label.setAlpha(0.6);
    this.container.add(label);
  }

  public getInputState(): TouchInputState {
    return this.inputState;
  }

  public clearShootJustReleased(): void {
    this.inputState.shootJustReleased = false;
  }

  public isActive(): boolean {
    return this.isVisible;
  }

  public show(): void {
    this.container.setVisible(true);
  }

  public hide(): void {
    this.container.setVisible(false);
  }

  public destroy(): void {
    this.container.destroy();
  }
}
