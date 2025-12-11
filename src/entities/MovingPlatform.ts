import Phaser from 'phaser';
import type { MovingPlatformData } from '../types';

export class MovingPlatform extends Phaser.Physics.Arcade.Image {
  private startY: number;
  private moveDistance: number;
  private speed: number;
  private movingDown: boolean;

  constructor(scene: Phaser.Scene, data: MovingPlatformData) {
    // Position at center of platform
    super(
      scene,
      data.x + data.width / 2,
      data.y + data.height / 2,
      'platform'
    );

    this.startY = data.y + data.height / 2;
    this.moveDistance = data.moveDistance;
    this.speed = data.speed;
    this.movingDown = data.startMovingDown ?? false;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set display size
    this.setDisplaySize(data.width, data.height);

    // Configure physics body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);
    body.pushable = false;

    // Set initial velocity
    this.updateVelocity();
  }

  private updateVelocity(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(this.movingDown ? this.speed : -this.speed);
  }

  update(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Check bounds and reverse direction
    if (this.movingDown) {
      // Moving down - check if we've gone far enough
      if (this.y >= this.startY + this.moveDistance) {
        this.y = this.startY + this.moveDistance;
        this.movingDown = false;
        body.setVelocityY(-this.speed);
      }
    } else {
      // Moving up - check if we've returned to start (or beyond)
      if (this.y <= this.startY) {
        this.y = this.startY;
        this.movingDown = true;
        body.setVelocityY(this.speed);
      }
    }
  }
}
