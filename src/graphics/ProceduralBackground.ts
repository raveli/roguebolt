import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

// 8-bit color palette for the abyss theme
const PALETTE = {
  // Sky/background gradients (darkest to lightest)
  sky: [0x0a0a1a, 0x101028, 0x181838, 0x202048],
  // Mountain/rock colors
  mountains: [0x1a1a2e, 0x252540, 0x2f2f52, 0x3a3a64],
  // Crystal/accent colors
  crystals: [0x4a2c82, 0x6b3fa0, 0x8b5fbf, 0xab7fdf],
  // Fog/mist
  fog: [0x2a2a4a, 0x3a3a5a],
  // Stars
  stars: [0xffffff, 0xccccff, 0xaaaaff],
};

interface ParallaxLayer {
  tileSprite: Phaser.GameObjects.TileSprite;
  scrollFactor: number;
}

export class ProceduralBackground {
  private scene: Phaser.Scene;
  private layers: ParallaxLayer[] = [];
  private seed: number;
  private textureKeys: string[] = [];

  constructor(scene: Phaser.Scene, _levelWidth: number, seed: number = 12345) {
    this.scene = scene;
    // levelWidth could be used for future non-tiling backgrounds
    void _levelWidth;
    this.seed = seed;

    this.createLayers();
  }

  // Simple seeded random for consistent generation
  private seededRandom(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  private resetSeed(baseSeed: number): void {
    this.seed = baseSeed;
  }

  private createLayers(): void {
    // Layer 0: Deep background with stars (slowest)
    this.createStarfield(0.05);

    // Layer 1: Far mountains (slow)
    this.createMountainLayer(0, 0.15, PALETTE.mountains[0], 0.6);

    // Layer 2: Mid mountains
    this.createMountainLayer(1, 0.25, PALETTE.mountains[1], 0.7);

    // Layer 3: Near mountains with crystals
    this.createCrystalMountainLayer(0.4);

    // Layer 4: Foreground fog (fastest, subtle)
    this.createFogLayer(0.6);
  }

  private safeGenerateTexture(graphics: Phaser.GameObjects.Graphics, key: string, width: number, height: number): void {
    // Remove existing texture if it exists to prevent crashes on restart
    if (this.scene.textures.exists(key)) {
      this.scene.textures.remove(key);
    }
    graphics.generateTexture(key, width, height);
  }

  private createStarfield(scrollFactor: number): void {
    const textureKey = 'proc_bg_starfield';
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });

    // Draw gradient background
    for (let y = 0; y < GAME_HEIGHT; y++) {
      const t = y / GAME_HEIGHT;
      const colorIndex = Math.min(3, Math.floor(t * 4));
      graphics.fillStyle(PALETTE.sky[colorIndex], 1);
      graphics.fillRect(0, y, GAME_WIDTH, 1);
    }

    // Draw stars
    this.resetSeed(this.seed);
    for (let i = 0; i < 100; i++) {
      const x = Math.floor(this.seededRandom() * GAME_WIDTH);
      const y = Math.floor(this.seededRandom() * GAME_HEIGHT * 0.6);
      const size = this.seededRandom() < 0.8 ? 1 : 2;
      const colorIndex = Math.floor(this.seededRandom() * PALETTE.stars.length);
      const alpha = 0.3 + this.seededRandom() * 0.7;

      graphics.fillStyle(PALETTE.stars[colorIndex], alpha);
      graphics.fillRect(x, y, size, size);
    }

    this.safeGenerateTexture(graphics, textureKey, GAME_WIDTH, GAME_HEIGHT);
    graphics.destroy();
    this.textureKeys.push(textureKey);

    const tileSprite = this.scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, textureKey);
    tileSprite.setOrigin(0, 0);
    tileSprite.setScrollFactor(0);
    tileSprite.setDepth(-100);

    this.layers.push({ tileSprite, scrollFactor });
  }

  private createMountainLayer(layerIndex: number, scrollFactor: number, color: number, heightFactor: number): void {
    const textureKey = `proc_bg_mountain_${layerIndex}`;
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });

    // Generate mountain silhouette using simple 8-bit style peaks
    this.resetSeed(this.seed + layerIndex * 1000);

    const baseY = GAME_HEIGHT * (1 - heightFactor * 0.4);
    const peakHeight = GAME_HEIGHT * heightFactor * 0.3;

    graphics.fillStyle(color, 1);

    let currentY = baseY;
    const segmentWidth = 8;

    for (let x = 0; x < GAME_WIDTH; x += segmentWidth) {
      const change = (this.seededRandom() - 0.5) * 40;
      currentY = Math.max(baseY - peakHeight, Math.min(baseY + 20, currentY + change));

      if (this.seededRandom() < 0.08) {
        const peakY = currentY - 30 - this.seededRandom() * 40;
        for (let py = peakY; py < currentY; py += 4) {
          const width = ((currentY - py) / (currentY - peakY)) * segmentWidth * 2;
          graphics.fillRect(x + segmentWidth / 2 - width / 2, py, width, 4);
        }
      }

      graphics.fillRect(x, currentY, segmentWidth, GAME_HEIGHT - currentY);
    }

    this.safeGenerateTexture(graphics, textureKey, GAME_WIDTH, GAME_HEIGHT);
    graphics.destroy();
    this.textureKeys.push(textureKey);

    const tileSprite = this.scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, textureKey);
    tileSprite.setOrigin(0, 0);
    tileSprite.setScrollFactor(0);
    tileSprite.setDepth(-90 + layerIndex * 5);

    this.layers.push({ tileSprite, scrollFactor });
  }

  private createCrystalMountainLayer(scrollFactor: number): void {
    const textureKey = 'proc_bg_crystal';
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });

    this.resetSeed(this.seed + 3000);

    const baseY = GAME_HEIGHT * 0.65;
    const peakHeight = GAME_HEIGHT * 0.25;

    graphics.fillStyle(PALETTE.mountains[2], 1);

    let currentY = baseY;
    const segmentWidth = 6;

    for (let x = 0; x < GAME_WIDTH; x += segmentWidth) {
      const change = (this.seededRandom() - 0.5) * 30;
      currentY = Math.max(baseY - peakHeight, Math.min(baseY + 10, currentY + change));
      graphics.fillRect(x, currentY, segmentWidth, GAME_HEIGHT - currentY);
    }

    // Add glowing crystals
    this.resetSeed(this.seed + 4000);
    for (let i = 0; i < 15; i++) {
      const x = Math.floor(this.seededRandom() * GAME_WIDTH);
      const crystalHeight = 12 + Math.floor(this.seededRandom() * 20);
      const crystalWidth = 4 + Math.floor(this.seededRandom() * 4);
      const y = baseY + 20 + this.seededRandom() * (GAME_HEIGHT - baseY - 60);

      const colorIndex = Math.floor(this.seededRandom() * PALETTE.crystals.length);
      graphics.fillStyle(PALETTE.crystals[colorIndex], 0.8);

      for (let cy = 0; cy < crystalHeight; cy += 2) {
        const widthAtY = Math.floor(crystalWidth * (1 - cy / crystalHeight));
        if (widthAtY > 0) {
          graphics.fillRect(x - widthAtY / 2, y - cy, widthAtY, 2);
        }
      }

      graphics.fillStyle(PALETTE.crystals[colorIndex], 0.2);
      graphics.fillRect(x - crystalWidth, y - crystalHeight - 2, crystalWidth * 2, 2);
    }

    // Add rocky details
    this.resetSeed(this.seed + 5000);
    graphics.fillStyle(PALETTE.mountains[3], 0.6);
    for (let i = 0; i < 30; i++) {
      const x = Math.floor(this.seededRandom() * GAME_WIDTH);
      const y = baseY + this.seededRandom() * (GAME_HEIGHT - baseY - 20);
      const size = 2 + Math.floor(this.seededRandom() * 4);
      graphics.fillRect(x, y, size, size);
    }

    this.safeGenerateTexture(graphics, textureKey, GAME_WIDTH, GAME_HEIGHT);
    graphics.destroy();
    this.textureKeys.push(textureKey);

    const tileSprite = this.scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, textureKey);
    tileSprite.setOrigin(0, 0);
    tileSprite.setScrollFactor(0);
    tileSprite.setDepth(-70);

    this.layers.push({ tileSprite, scrollFactor });
  }

  private createFogLayer(scrollFactor: number): void {
    const textureKey = 'proc_bg_fog';
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });

    this.resetSeed(this.seed + 6000);

    // Draw wispy fog patches
    for (let i = 0; i < 8; i++) {
      const x = Math.floor(this.seededRandom() * GAME_WIDTH);
      const y = GAME_HEIGHT - 100 - this.seededRandom() * 150;
      const width = 60 + Math.floor(this.seededRandom() * 100);
      const height = 8 + Math.floor(this.seededRandom() * 16);

      for (let j = 0; j < 5; j++) {
        const ox = (this.seededRandom() - 0.5) * width * 0.5;
        const oy = (this.seededRandom() - 0.5) * height;
        const ow = width * (0.3 + this.seededRandom() * 0.4);
        const oh = height * (0.5 + this.seededRandom() * 0.5);

        graphics.fillStyle(PALETTE.fog[j % 2], 0.15);
        graphics.fillRect(x + ox - ow / 2, y + oy, ow, oh);
      }
    }

    this.safeGenerateTexture(graphics, textureKey, GAME_WIDTH, GAME_HEIGHT);
    graphics.destroy();
    this.textureKeys.push(textureKey);

    const tileSprite = this.scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, textureKey);
    tileSprite.setOrigin(0, 0);
    tileSprite.setScrollFactor(0);
    tileSprite.setDepth(-50);

    this.layers.push({ tileSprite, scrollFactor });
  }

  public update(cameraX: number): void {
    // Update each layer's tile position based on camera and scroll factor
    for (const layer of this.layers) {
      layer.tileSprite.tilePositionX = cameraX * layer.scrollFactor;
    }
  }

  public destroy(): void {
    for (const layer of this.layers) {
      layer.tileSprite.destroy();
    }
    // Remove generated textures from texture manager
    for (const key of this.textureKeys) {
      if (this.scene.textures.exists(key)) {
        this.scene.textures.remove(key);
      }
    }
    this.layers = [];
    this.textureKeys = [];
  }
}
