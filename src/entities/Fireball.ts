import Phaser from 'phaser';
import type { FireballType } from '../types';

export class Fireball extends Phaser.Physics.Arcade.Sprite {
  public fireballType: FireballType;
  public damage: number;
  private speed: number = 500;
  private direction: number;
  private velocitySet: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: number,
    type: FireballType,
    damage: number
  ) {
    const textureKey = type === 'large' ? 'fireball_large' : 'fireball_small';
    super(scene, x, y, textureKey);

    this.fireballType = type;
    this.damage = damage;
    this.direction = direction;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Flip large fireball so flame trail is behind
    if (type === 'large' && direction > 0) {
      this.setFlipX(true);
    }

    // Destroy after traveling off screen or after time
    scene.time.delayedCall(2000, () => {
      if (this.active) {
        this.destroy();
      }
    });
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    // Set velocity on first update (after being added to group)
    if (!this.velocitySet && this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false);
      const velocity = this.fireballType === 'large' ? this.speed * 0.8 : this.speed;
      this.setVelocityX(this.direction * velocity);
      this.velocitySet = true;
    }
  }

  update(): void {
    // Check if off level bounds (use physics world bounds)
    const bounds = this.scene.physics.world.bounds;
    if (
      this.x < bounds.x - 50 ||
      this.x > bounds.x + bounds.width + 50 ||
      this.y < bounds.y - 50 ||
      this.y > bounds.y + bounds.height + 50
    ) {
      this.destroy();
    }
  }
}
