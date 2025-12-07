import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export interface TouchInputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  shoot: boolean;
  shootJustReleased: boolean;
  pause: boolean;
}

// Haptics helper - will use Capacitor when available
const Haptics = {
  impact: async (style: 'Light' | 'Medium' | 'Heavy' = 'Light') => {
    try {
      // Try Capacitor Haptics if available (using dynamic import for tree-shaking)
      if ((window as any).Capacitor?.isNativePlatform?.()) {
        const { Haptics: CapHaptics, ImpactStyle } = await import('@capacitor/haptics');
        const impactStyle = style === 'Light' ? ImpactStyle.Light
          : style === 'Medium' ? ImpactStyle.Medium
          : ImpactStyle.Heavy;
        await CapHaptics.impact({ style: impactStyle });
      } else if (navigator.vibrate) {
        // Fallback to basic vibration for web
        const duration = style === 'Light' ? 10 : style === 'Medium' ? 20 : 30;
        navigator.vibrate(duration);
      }
    } catch {
      // Haptics not available, silently fail
    }
  }
};

// Safe area insets for notched devices (in game coordinates)
// These are approximate values - the actual CSS safe-area-inset handles the real positioning
const SAFE_AREA_LEFT = 50; // Extra padding for iPhone notch/Dynamic Island in landscape
const SAFE_AREA_RIGHT = 50;
const SAFE_AREA_BOTTOM = 20;

// Button definition for hit testing
interface ButtonDef {
  x: number;
  y: number;
  radius: number;
  key: 'left' | 'right' | 'jump' | 'shoot' | 'pause';
  container?: Phaser.GameObjects.Container;
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
    pause: false,
  };

  private leftBtn!: Phaser.GameObjects.Container;
  private rightBtn!: Phaser.GameObjects.Container;
  private jumpBtn!: Phaser.GameObjects.Container;
  private shootBtn!: Phaser.GameObjects.Container;
  private pauseBtn!: Phaser.GameObjects.Container;

  private isVisible: boolean = false;
  private buttonSize: number = 70;

  // Global touch tracking
  private buttons: ButtonDef[] = [];
  private previousState: Record<string, boolean> = {};

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(1000);

    // Check if touch device
    this.isVisible = this.isTouchDevice();

    // Adjust button size based on screen density
    this.buttonSize = this.calculateButtonSize();

    if (this.isVisible) {
      this.createButtons();
      this.setupGlobalTouchTracking();
    }
  }

  private calculateButtonSize(): number {
    // Scale buttons based on game height for different device sizes
    // iPhone 15 Pro in landscape has a viewport height of ~393px (logical)
    // Our game height is 720, so buttons should be proportionally sized
    const baseSize = 70;
    const scaleFactor = Math.min(1.2, Math.max(0.8, GAME_HEIGHT / 720));
    return Math.round(baseSize * scaleFactor);
  }

  private isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
    );
  }

  private createButtons(): void {
    const buttonSize = this.buttonSize;
    const padding = 20;
    const bottomY = GAME_HEIGHT - buttonSize / 2 - padding - SAFE_AREA_BOTTOM;
    const hitRadius = buttonSize / 2 + 15; // Larger hit area for easier touch

    // Left side - D-pad style movement (with safe area padding for notch)
    const leftX = SAFE_AREA_LEFT + padding + buttonSize / 2;
    const rightX = SAFE_AREA_LEFT + padding + buttonSize * 1.8;

    // Left button
    this.leftBtn = this.createButton(leftX, bottomY, buttonSize, '◀');
    this.buttons.push({ x: leftX, y: bottomY, radius: hitRadius, key: 'left', container: this.leftBtn });

    // Right button
    this.rightBtn = this.createButton(rightX, bottomY, buttonSize, '▶');
    this.buttons.push({ x: rightX, y: bottomY, radius: hitRadius, key: 'right', container: this.rightBtn });

    // Right side - action buttons (with safe area padding for notch)
    const actionRightX = GAME_WIDTH - SAFE_AREA_RIGHT - padding - buttonSize / 2;
    const actionLeftX = GAME_WIDTH - SAFE_AREA_RIGHT - padding - buttonSize * 1.8;

    // Jump button (right side, slightly higher)
    const jumpY = bottomY - buttonSize * 0.6;
    this.jumpBtn = this.createButton(
      actionRightX,
      jumpY,
      buttonSize,
      '▲',
      0x44aa44
    );
    this.buttons.push({ x: actionRightX, y: jumpY, radius: hitRadius, key: 'jump', container: this.jumpBtn });

    // Shoot button (left of jump, lower)
    this.shootBtn = this.createButton(
      actionLeftX,
      bottomY,
      buttonSize,
      '●',
      0xaa4444
    );
    this.buttons.push({ x: actionLeftX, y: bottomY, radius: hitRadius, key: 'shoot', container: this.shootBtn });

    // Add labels
    this.addLabel(actionRightX, jumpY + buttonSize / 2 + 15, 'JUMP');
    this.addLabel(actionLeftX, bottomY + buttonSize / 2 + 15, 'FIRE');

    // Pause button (top right)
    const pauseSize = buttonSize * 0.6;
    const pauseX = GAME_WIDTH - SAFE_AREA_RIGHT - padding - pauseSize / 2;
    const pauseY = SAFE_AREA_BOTTOM + padding + pauseSize / 2;
    this.pauseBtn = this.createButton(
      pauseX,
      pauseY,
      pauseSize,
      '❚❚',
      0x666666
    );
    this.buttons.push({ x: pauseX, y: pauseY, radius: pauseSize / 2 + 10, key: 'pause', container: this.pauseBtn });

    this.container.add([this.leftBtn, this.rightBtn, this.jumpBtn, this.shootBtn, this.pauseBtn]);
  }

  private setupGlobalTouchTracking(): void {
    // Use scene update to check all pointers every frame
    this.scene.events.on('update', this.updateTouchState, this);
    this.scene.events.once('shutdown', () => {
      this.scene.events.off('update', this.updateTouchState, this);
    });
  }

  private updateTouchState(): void {
    // Get all active pointers
    const pointers = [
      this.scene.input.pointer1,
      this.scene.input.pointer2,
      this.scene.input.pointer3,
      this.scene.input.pointer4,
    ];

    // Track which buttons are pressed this frame
    const pressedThisFrame: Set<string> = new Set();

    // Check each active pointer against all buttons
    for (const pointer of pointers) {
      if (!pointer.isDown) continue;

      // Convert pointer position to game coordinates (accounting for camera/scale)
      const px = pointer.x;
      const py = pointer.y;

      // Check against each button
      for (const btn of this.buttons) {
        const dx = px - btn.x;
        const dy = py - btn.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= btn.radius) {
          pressedThisFrame.add(btn.key);
        }
      }
    }

    // Update input state and visual feedback for each button
    for (const btn of this.buttons) {
      const wasPressed = this.previousState[btn.key] || false;
      const isPressed = pressedThisFrame.has(btn.key);

      if (btn.key === 'pause') {
        // Pause is special - only trigger on initial press
        if (isPressed && !wasPressed) {
          this.inputState.pause = true;
          Haptics.impact('Light');
          this.animateButtonPress(btn, true);
        } else if (!isPressed && wasPressed) {
          this.animateButtonPress(btn, false);
        }
      } else {
        // Regular button
        this.inputState[btn.key] = isPressed;

        // Handle shoot release
        if (btn.key === 'shoot' && wasPressed && !isPressed) {
          this.inputState.shootJustReleased = true;
          Haptics.impact('Heavy');
        }

        // Visual/haptic feedback on state change
        if (isPressed && !wasPressed) {
          Haptics.impact(btn.key === 'shoot' ? 'Medium' : 'Light');
          this.animateButtonPress(btn, true);
        } else if (!isPressed && wasPressed) {
          this.animateButtonPress(btn, false);
        }
      }

      this.previousState[btn.key] = isPressed;
    }
  }

  private animateButtonPress(btn: ButtonDef, pressed: boolean): void {
    if (!btn.container) return;

    const bg = btn.container.getData('bg') as Phaser.GameObjects.Graphics;
    const color = btn.container.getData('color') as number;
    const size = btn.container.getData('size') as number;

    if (pressed) {
      // Pressed state - glow effect
      bg.clear();
      bg.fillStyle(0xffffff, 0.15);
      bg.fillCircle(0, 0, size / 2 + 8);
      bg.fillStyle(color, 0.8);
      bg.fillCircle(0, 0, size / 2);
      bg.lineStyle(4, 0xffffff, 0.9);
      bg.strokeCircle(0, 0, size / 2);

      this.scene.tweens.add({
        targets: btn.container,
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 80,
        ease: 'Back.easeOut',
      });
    } else {
      // Normal state
      bg.clear();
      bg.fillStyle(color, 0.4);
      bg.fillCircle(0, 0, size / 2);
      bg.lineStyle(3, color, 0.8);
      bg.strokeCircle(0, 0, size / 2);

      this.scene.tweens.add({
        targets: btn.container,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Back.easeIn',
      });
    }
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

    container.add([bg, text]);
    container.setData('bg', bg);
    container.setData('color', color);
    container.setData('size', size);

    return container;
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

  public clearPause(): void {
    this.inputState.pause = false;
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
