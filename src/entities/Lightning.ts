import Phaser from 'phaser';

export class Lightning extends Phaser.Physics.Arcade.Sprite {
  public energyAmount: number = 20;
  private floatOffset: number = 0;
  private startY: number;
  private floatRange: number = 10;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'lightning');

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
    // Floating animation
    this.y = this.startY + Math.sin(time / 500 + this.floatOffset) * this.floatRange;

    // Subtle rotation
    this.rotation = Math.sin(time / 300 + this.floatOffset) * 0.1;
  }

  collect(): void {
    // Disable physics body to prevent multiple collisions
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = false;

    // Flash effect
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 1.5,
      duration: 200,
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
