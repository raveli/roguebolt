import Phaser from 'phaser';

export class Heart extends Phaser.Physics.Arcade.Sprite {
  public healAmount: number = 50;
  private floatOffset: number = 0;
  private startY: number;
  private floatRange: number = 8;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'heart');

    this.startY = y;
    this.floatOffset = Math.random() * Math.PI * 2; // Random start phase

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Disable gravity and make it static
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
  }

  update(time: number): void {
    // Floating animation (slightly slower than lightning)
    this.y = this.startY + Math.sin(time / 600 + this.floatOffset) * this.floatRange;

    // Gentle pulsing scale
    const pulse = 1 + Math.sin(time / 400 + this.floatOffset) * 0.1;
    this.setScale(pulse);
  }

  collect(): void {
    // Disable physics body to prevent multiple collisions
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = false;

    // Heart collection effect - expand and fade with pink tint
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 2,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
