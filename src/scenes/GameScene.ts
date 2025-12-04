import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Fireball } from '../entities/Fireball';
import { Lightning } from '../entities/Lightning';
import { Enemy } from '../entities/Enemy';
import { HUD } from '../ui/HUD';
import { TouchControls } from '../ui/TouchControls';
import { SoundGenerator } from '../audio/SoundGenerator';
import { getLevelData, getTotalLevels } from '../levels/levelData';
import { GAME_WIDTH, GAME_HEIGHT, PERFORMANCE_SETTINGS } from '../config';
import type { GameState, LevelData, FireballType } from '../types';
import { SCORE_VALUES } from '../types';
import { ProceduralBackground } from '../graphics/ProceduralBackground';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;
  private lightnings!: Phaser.Physics.Arcade.Group;
  private fireballs!: Phaser.Physics.Arcade.Group;
  private exitPortal!: Phaser.GameObjects.Sprite;
  private hud!: HUD;
  private touchControls!: TouchControls;
  private soundGenerator!: SoundGenerator;
  private gameState!: GameState;
  private levelData!: LevelData;
  private levelComplete: boolean = false;
  private isInvulnerable: boolean = false;
  private isPaused: boolean = false;

  // Parallax backgrounds
  private bgLayers: Phaser.GameObjects.TileSprite[] = [];
  private proceduralBg: ProceduralBackground | null = null;

  // Particle emitters
  private sparkEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private explosionEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private energyEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  // Music
  private music!: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { gameState: GameState }): void {
    this.gameState = data.gameState;
    this.levelComplete = false;
    this.bgLayers = [];
    this.proceduralBg = null;
    // Start level timer
    this.gameState.levelStartTime = Date.now();
  }

  create(): void {
    // Initialize sound generator
    this.soundGenerator = new SoundGenerator();

    // Increase music volume for gameplay
    const existingMusic = this.sound.get('theme');
    if (existingMusic) {
      this.music = existingMusic;
      (this.music as Phaser.Sound.WebAudioSound).setVolume(0.4);
    }

    // Get level data
    const levelData = getLevelData(this.gameState.currentLevel);
    if (!levelData) {
      // All levels complete - go directly to victory scene
      this.scene.start('VictoryScene', { gameState: this.gameState });
      return;
    }
    this.levelData = levelData;

    // Create parallax backgrounds
    this.createParallaxBackground();

    // Create particle emitters
    this.createParticleEmitters();

    // Create groups
    this.platforms = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.lightnings = this.physics.add.group({ allowGravity: false });
    this.fireballs = this.physics.add.group({ allowGravity: false });

    // Build level
    this.buildLevel();

    // Create player
    this.player = new Player(
      this,
      this.levelData.playerStart.x,
      this.levelData.playerStart.y,
      this.gameState.playerStats
    );

    // Set up collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);

    // Player-enemy collision
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Fireball-enemy collision
    this.physics.add.overlap(
      this.fireballs,
      this.enemies,
      this.handleFireballEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Player-lightning collision
    this.physics.add.overlap(
      this.player,
      this.lightnings,
      this.handleLightningCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Player-exit collision
    this.physics.add.overlap(
      this.player,
      this.exitPortal,
      this.handleExitCollision,
      undefined,
      this
    );

    // Create HUD
    this.hud = new HUD(this, this.gameState);

    // Create touch controls (only visible on touch devices)
    this.touchControls = new TouchControls(this);

    // Set up event listeners
    this.setupEventListeners();

    // Set up pause input
    this.setupPauseInput();

    // Camera follow player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, this.levelData.width, this.levelData.height);

    // Set physics world bounds to match level size
    this.physics.world.setBounds(0, 0, this.levelData.width, this.levelData.height);

    // Show level name
    this.showLevelName();
  }

  update(time: number, delta: number): void {
    if (this.levelComplete || this.isPaused) return;

    // Check for touch pause button
    if (this.touchControls.isActive()) {
      const touchInput = this.touchControls.getInputState();
      if (touchInput.pause) {
        this.pauseGame();
        return;
      }
      this.player.setTouchInput(touchInput);
    }

    this.player.update(delta);

    // Update parallax backgrounds
    this.updateParallaxBackground();

    // Check if player fell off the map (unless god mode)
    if (this.player.y > GAME_HEIGHT + 50 && !this.gameState.godMode) {
      this.player.stats.health = 0;
      this.handlePlayerDeath();
    }

    // Update lightnings (floating animation)
    this.lightnings.getChildren().forEach((lightning) => {
      (lightning as Lightning).update(time);
    });

    // Update enemies
    this.enemies.getChildren().forEach((enemy) => {
      (enemy as Enemy).update();
    });

    // Update fireballs
    this.fireballs.getChildren().forEach((fireball) => {
      (fireball as Fireball).update();
    });

    // Update HUD
    this.hud.update(this.player.stats);
  }

  private createParallaxBackground(): void {
    // Level 5 uses procedural parallax background
    if (this.gameState.currentLevel === 5) {
      this.proceduralBg = new ProceduralBackground(this, this.levelData.width, 54321);
      return;
    }

    // Use loaded background image based on current level
    const bgKey = this.gameState.currentLevel <= 2 ? 'bg_scene1' : 'bg_scene2';

    // Single background layer that scrolls slowly
    const bg = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, bgKey);
    bg.setOrigin(0, 0);
    bg.setScrollFactor(0);
    bg.setDepth(-10);
    this.bgLayers.push(bg);
  }

  private updateParallaxBackground(): void {
    const camX = this.cameras.main.scrollX;

    // Procedural background for level 5
    if (this.proceduralBg) {
      this.proceduralBg.update(camX);
      return;
    }

    // Slow parallax scroll for background
    if (this.bgLayers[0]) {
      this.bgLayers[0].tilePositionX = camX * 0.3;
    }
  }

  private createParticleEmitters(): void {
    // Spark emitter (for fireball hits)
    this.sparkEmitter = this.add.particles(0, 0, 'particle_spark', {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 300,
      gravityY: 200,
      emitting: false,
    });
    this.sparkEmitter.setDepth(20);

    // Explosion emitter (for enemy death)
    this.explosionEmitter = this.add.particles(0, 0, 'particle_red', {
      speed: { min: 80, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      lifespan: 400,
      gravityY: 100,
      emitting: false,
    });
    this.explosionEmitter.setDepth(20);

    // Energy emitter (for lightning collection)
    this.energyEmitter = this.add.particles(0, 0, 'particle_yellow', {
      speed: { min: 50, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 500,
      emitting: false,
    });
    this.energyEmitter.setDepth(20);
  }

  // Public methods for particle effects (using mobile-optimized counts)
  public emitSparks(x: number, y: number, count?: number): void {
    const finalCount = count ?? PERFORMANCE_SETTINGS.sparkCount;
    this.sparkEmitter.emitParticleAt(x, y, finalCount);
  }

  public emitExplosion(x: number, y: number, count?: number): void {
    const finalCount = count ?? PERFORMANCE_SETTINGS.explosionCount;
    this.explosionEmitter.emitParticleAt(x, y, finalCount);
  }

  public emitEnergy(x: number, y: number, count?: number): void {
    const finalCount = count ?? PERFORMANCE_SETTINGS.energyCount;
    this.energyEmitter.emitParticleAt(x, y, finalCount);
  }

  // Screen shake effect (reduced on mobile)
  public screenShake(intensity: number = 5, duration: number = 150): void {
    const adjustedIntensity = intensity * PERFORMANCE_SETTINGS.shakeIntensity;
    this.cameras.main.shake(duration, adjustedIntensity / 1000);
  }

  private buildLevel(): void {
    // Create platforms
    this.levelData.platforms.forEach((platform) => {
      const p = this.platforms.create(
        platform.x + platform.width / 2,
        platform.y + platform.height / 2,
        'platform'
      ) as Phaser.Physics.Arcade.Sprite;
      p.setDisplaySize(platform.width, platform.height);
      p.refreshBody();
    });

    // Create enemies
    this.levelData.enemies.forEach((enemyData) => {
      const enemy = new Enemy(
        this,
        enemyData.x,
        enemyData.y,
        enemyData.patrolDistance || 100
      );
      this.enemies.add(enemy);
    });

    // Create lightnings
    this.levelData.lightnings.forEach((lightningData) => {
      const lightning = new Lightning(this, lightningData.x, lightningData.y);
      this.lightnings.add(lightning);
    });

    // Create exit portal
    this.exitPortal = this.add.sprite(
      this.levelData.exit.x,
      this.levelData.exit.y,
      'exit'
    );
    this.physics.add.existing(this.exitPortal, true);

    // Animate exit portal
    this.tweens.add({
      targets: this.exitPortal,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private setupEventListeners(): void {
    // Player shoot event
    this.events.on('playerShoot', (data: {
      x: number;
      y: number;
      direction: number;
      type: FireballType;
      damage: number;
    }) => {
      const fireball = new Fireball(
        this,
        data.x,
        data.y,
        data.direction,
        data.type,
        data.damage
      );
      this.fireballs.add(fireball);

      if (data.type === 'large') {
        this.soundGenerator.shootCharged();
        this.screenShake(3, 100);
      } else {
        this.soundGenerator.shootSmall();
      }
    });

    // Player jump event
    this.events.on('playerJump', () => {
      this.soundGenerator.jump();
    });

    // Energy collected event
    this.events.on('energyCollected', () => {
      this.soundGenerator.collectEnergy();
    });

    // Player damaged event
    this.events.on('playerDamaged', () => {
      this.soundGenerator.playerHit();
      this.screenShake(4, 150);
    });

    // Player death event
    this.events.on('playerDeath', () => {
      this.handlePlayerDeath();
    });

    // Enemy killed event
    this.events.on('enemyKilled', (enemy: Enemy) => {
      this.soundGenerator.enemyHit();
      this.emitExplosion(enemy.x, enemy.y, 25);
      this.screenShake(3, 100);
    });
  }

  private handlePlayerEnemyCollision(
    player: Phaser.GameObjects.GameObject,
    enemy: Phaser.GameObjects.GameObject
  ): void {
    if (this.isInvulnerable || this.levelComplete || this.gameState.godMode) return;

    const p = player as Player;
    const e = enemy as Enemy;

    p.takeDamage(e.damage);

    // Emit particles at collision point
    this.emitSparks(p.x, p.y, 10);

    // Brief invulnerability
    this.isInvulnerable = true;
    this.time.delayedCall(1000, () => {
      this.isInvulnerable = false;
    });

    // Knockback
    const knockbackX = p.x < e.x ? -200 : 200;
    p.setVelocityX(knockbackX);
    p.setVelocityY(-150);
  }

  private handleFireballEnemyCollision(
    fireball: Phaser.GameObjects.GameObject,
    enemy: Phaser.GameObjects.GameObject
  ): void {
    const f = fireball as Fireball;
    const e = enemy as Enemy;

    // Emit sparks at impact
    this.emitSparks(f.x, f.y, f.fireballType === 'large' ? 20 : 10);

    if (f.fireballType === 'large') {
      this.screenShake(5, 150);
    }

    // Check if this hit will kill the enemy
    const willKill = e.health <= f.damage;

    e.takeDamage(f.damage);

    // Award score if enemy was killed
    if (willKill) {
      const points = f.fireballType === 'large'
        ? SCORE_VALUES.ENEMY_KILL_LARGE
        : SCORE_VALUES.ENEMY_KILL_SMALL;
      this.addScore(points, e.x, e.y);
    }

    f.destroy();
  }

  private handleLightningCollision(
    player: Phaser.GameObjects.GameObject,
    lightning: Phaser.GameObjects.GameObject
  ): void {
    const p = player as Player;
    const l = lightning as Lightning;

    // Emit energy particles
    this.emitEnergy(l.x, l.y, 15);

    p.collectEnergy(l.energyAmount);

    // Award score for collecting lightning
    this.addScore(SCORE_VALUES.LIGHTNING_COLLECT, l.x, l.y);

    l.collect();
  }

  private handleExitCollision(): void {
    if (this.levelComplete) return;

    this.levelComplete = true;
    this.soundGenerator.levelComplete();

    // Calculate time bonus
    const elapsed = Math.floor((Date.now() - this.gameState.levelStartTime) / 1000);
    const remaining = Math.max(0, SCORE_VALUES.LEVEL_TIME_LIMIT - elapsed);
    const timeBonus = remaining * SCORE_VALUES.TIME_BONUS_PER_SECOND;

    if (timeBonus > 0) {
      this.gameState.score += timeBonus;
      // Show time bonus text
      const bonusText = this.add.text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 - 50,
        `AIKABONUS: +${timeBonus}`,
        {
          fontSize: '32px',
          color: '#ffdd00',
          fontFamily: 'monospace',
          stroke: '#000000',
          strokeThickness: 4,
        }
      );
      bonusText.setOrigin(0.5);
      bonusText.setScrollFactor(0);
      bonusText.setDepth(100);

      this.tweens.add({
        targets: bonusText,
        y: GAME_HEIGHT / 2 - 100,
        alpha: 0,
        duration: 1500,
        ease: 'Power2',
      });
    }

    // Fade out and go to card selection
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Update game state for next level
      this.gameState.currentLevel++;
      this.gameState.playerStats = { ...this.player.stats };

      // Check if game is complete
      if (this.gameState.currentLevel > getTotalLevels()) {
        this.scene.start('VictoryScene', { gameState: this.gameState });
      } else {
        this.scene.start('CardSelectScene', { gameState: this.gameState });
      }
    });
  }

  private addScore(points: number, x: number, y: number): void {
    this.gameState.score += points;
    this.hud.showScorePopup(x, y, points);
  }

  private handlePlayerDeath(): void {
    if (this.levelComplete) return;
    this.levelComplete = true;

    // Big screen shake
    this.screenShake(8, 400);

    // Emit explosion at player position
    this.emitExplosion(this.player.x, this.player.y, 30);

    // Transition to Game Over scene after short delay
    this.time.delayedCall(1000, () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameOverScene', { gameState: this.gameState });
      });
    });
  }

  private showLevelName(): void {
    const levelText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      `Kenttä ${this.levelData.id}: ${this.levelData.name}`,
      {
        fontSize: '48px',
        color: '#ffffff',
        fontFamily: 'monospace',
      }
    );
    levelText.setOrigin(0.5);
    levelText.setScrollFactor(0);
    levelText.setDepth(100);
    levelText.setAlpha(0);

    this.tweens.add({
      targets: levelText,
      alpha: 1,
      duration: 500,
      yoyo: true,
      hold: 1500,
      onComplete: () => {
        levelText.destroy();
      },
    });
  }

  private setupPauseInput(): void {
    // ESC key to pause
    this.input.keyboard?.on('keydown-ESC', () => {
      if (!this.levelComplete && !this.isPaused) {
        this.pauseGame();
      }
    });

    // Listen for visibility change (app backgrounded)
    this.game.events.on('hidden', () => {
      if (!this.levelComplete && !this.isPaused) {
        this.pauseGame();
      }
    });

    // Resume when coming back from pause scene
    this.events.on('resume', () => {
      this.isPaused = false;
      // Resume physics and tweens
      this.physics.resume();
      this.tweens.resumeAll();
      // Reset touch pause state
      if (this.touchControls.isActive()) {
        this.touchControls.clearPause();
      }
    });
  }

  private pauseGame(): void {
    if (this.isPaused) return;
    this.isPaused = true;

    // Pause physics and tweens
    this.physics.pause();
    this.tweens.pauseAll();

    // Launch pause scene on top
    this.scene.launch('PauseScene', { returnScene: 'GameScene' });
    this.scene.pause();
  }

}
