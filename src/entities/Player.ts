import Phaser from 'phaser';
import type { PlayerStats, FireballType } from '../types';

export class Player extends Phaser.Physics.Arcade.Sprite {
  public stats: PlayerStats;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey: Phaser.Input.Keyboard.Key;
  private isCharging: boolean = false;
  private chargeTime: number = 0;
  private maxChargeTime: number = 1000;
  private chargeIndicator: Phaser.GameObjects.Graphics;
  private facingRight: boolean = true;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    stats: PlayerStats
  ) {
    super(scene, x, y, 'player');

    this.stats = stats;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set up physics body (no world bounds - player can fall through gaps)
    this.setCollideWorldBounds(false);
    this.setBounce(0.1);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(28, 28);
    body.setOffset(2, 2);

    // Set up input
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.spaceKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Create charge indicator
    this.chargeIndicator = scene.add.graphics();
    this.chargeIndicator.setDepth(10);
  }

  update(delta: number): void {
    this.handleMovement();
    this.handleCharging(delta);
    this.updateChargeIndicator();
    this.regenerateEnergy(delta);
  }

  private handleMovement(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.setVelocityX(-this.stats.speed);
      this.facingRight = false;
      this.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.stats.speed);
      this.facingRight = true;
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // Jumping
    if (this.cursors.up.isDown && body.onFloor()) {
      this.setVelocityY(-this.stats.jumpPower);
      this.scene.events.emit('playerJump');
    }
  }

  private handleCharging(delta: number): void {
    if (this.spaceKey.isDown && !this.isCharging && this.stats.energy >= 5) {
      this.isCharging = true;
      this.chargeTime = 0;
    }

    if (this.isCharging) {
      this.chargeTime = Math.min(this.chargeTime + delta, this.maxChargeTime);
    }

    if (Phaser.Input.Keyboard.JustUp(this.spaceKey) && this.isCharging) {
      this.shoot();
      this.isCharging = false;
      this.chargeTime = 0;
    }
  }

  private shoot(): void {
    const chargePower = this.chargeTime / this.maxChargeTime;
    const fireballType: FireballType = chargePower > 0.6 ? 'large' : 'small';

    const energyCost = fireballType === 'large' ? 25 : 5;

    if (this.stats.energy >= energyCost) {
      this.stats.energy -= energyCost;

      const direction = this.facingRight ? 1 : -1;
      const offsetX = this.facingRight ? 20 : -20;

      this.scene.events.emit('playerShoot', {
        x: this.x + offsetX,
        y: this.y,
        direction,
        type: fireballType,
        damage: fireballType === 'large'
          ? this.stats.damage * 3
          : this.stats.damage,
      });
    }
  }

  private updateChargeIndicator(): void {
    this.chargeIndicator.clear();

    if (this.isCharging) {
      const progress = this.chargeTime / this.maxChargeTime;
      const radius = 20 + progress * 10;

      // Outer circle (charging progress)
      this.chargeIndicator.lineStyle(3, 0xffaa00, 0.8);
      this.chargeIndicator.beginPath();
      this.chargeIndicator.arc(
        this.x,
        this.y,
        radius,
        -Math.PI / 2,
        -Math.PI / 2 + progress * Math.PI * 2
      );
      this.chargeIndicator.strokePath();

      // Inner glow when fully charged
      if (progress > 0.6) {
        this.chargeIndicator.lineStyle(2, 0xff4400, 0.6);
        this.chargeIndicator.strokeCircle(this.x, this.y, radius - 5);
      }
    }
  }

  private regenerateEnergy(delta: number): void {
    if (this.stats.energyRegen > 0 && this.stats.energy < this.stats.maxEnergy) {
      this.stats.energy = Math.min(
        this.stats.maxEnergy,
        this.stats.energy + this.stats.energyRegen * (delta / 1000)
      );
    }
  }

  public collectEnergy(amount: number): void {
    this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + amount);
    this.scene.events.emit('energyCollected');
  }

  public takeDamage(amount: number): void {
    this.stats.health -= amount;
    this.scene.events.emit('playerDamaged', this.stats.health);

    // Flash effect
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    if (this.stats.health <= 0) {
      this.scene.events.emit('playerDeath');
    }
  }

  public destroy(fromScene?: boolean): void {
    this.chargeIndicator.destroy();
    super.destroy(fromScene);
  }
}
