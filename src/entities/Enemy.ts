import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public health: number = 30;
  public damage: number = 20;
  private patrolDistance: number;
  private startX: number;
  private moveSpeed: number = 80;
  private movingRight: boolean = true;
  private hasLanded: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    patrolDistance: number = 100
  ) {
    super(scene, x, y, 'enemy');

    this.startX = x;
    this.patrolDistance = patrolDistance;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set up physics body
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(28, 28);
    body.setOffset(2, 2);
  }

  update(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Start patrolling once landed on a platform
    if (!this.hasLanded && body.onFloor()) {
      this.hasLanded = true;
      this.startX = this.x; // Update start position to where we landed
      // Random initial direction
      this.movingRight = Math.random() > 0.5;
      this.setVelocityX(this.movingRight ? this.moveSpeed : -this.moveSpeed);
      this.setFlipX(!this.movingRight);
    }

    if (this.hasLanded) {
      this.patrol();
    }
  }

  private patrol(): void {
    // Reverse direction at patrol boundaries
    if (this.movingRight && this.x >= this.startX + this.patrolDistance) {
      this.movingRight = false;
      this.setVelocityX(-this.moveSpeed);
      this.setFlipX(true);
    } else if (!this.movingRight && this.x <= this.startX - this.patrolDistance) {
      this.movingRight = true;
      this.setVelocityX(this.moveSpeed);
      this.setFlipX(false);
    }

    // Also reverse if hitting a wall
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.left) {
      this.movingRight = true;
      this.setVelocityX(this.moveSpeed);
      this.setFlipX(false);
    } else if (body.blocked.right) {
      this.movingRight = false;
      this.setVelocityX(-this.moveSpeed);
      this.setFlipX(true);
    }
  }

  public takeDamage(amount: number): void {
    this.health -= amount;

    // Flash effect
    this.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      if (this.active) {
        this.clearTint();
      }
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    // Death animation
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0,
      scaleY: 0,
      rotation: Math.PI,
      duration: 300,
      onComplete: () => {
        this.scene.events.emit('enemyKilled', this);
        this.destroy();
      },
    });

    // Disable physics immediately
    this.body?.enable && (this.body.enable = false);
  }
}
