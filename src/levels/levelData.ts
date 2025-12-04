import type { LevelData } from '../types';

// Define locally to avoid circular dependency with config.ts
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

export const LEVELS: LevelData[] = [
  // Level 1 - Tutorial level
  {
    id: 1,
    name: 'Aloitus',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    platforms: [
      // Ground
      { x: 0, y: GAME_HEIGHT - 32, width: GAME_WIDTH, height: 32 },
      // Stepping platforms
      { x: 200, y: 550, width: 150, height: 20 },
      { x: 450, y: 450, width: 150, height: 20 },
      { x: 700, y: 350, width: 150, height: 20 },
      { x: 950, y: 450, width: 150, height: 20 },
      // Upper platform with exit
      { x: 1050, y: 250, width: 200, height: 20 },
    ],
    enemies: [
      { type: 'basic', x: 500, y: 400, patrolDistance: 60 },
      { type: 'basic', x: 800, y: 300, patrolDistance: 50 },
    ],
    lightnings: [
      { x: 275, y: 500 },
      { x: 525, y: 400 },
      { x: 775, y: 300 },
      { x: 1025, y: 400 },
    ],
    playerStart: { x: 100, y: GAME_HEIGHT - 100 },
    exit: { x: 1150, y: 186 },
  },

  // Level 2 - More challenging
  {
    id: 2,
    name: 'Nousu',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    platforms: [
      // Ground with gaps
      { x: 0, y: GAME_HEIGHT - 32, width: 300, height: 32 },
      { x: 400, y: GAME_HEIGHT - 32, width: 200, height: 32 },
      { x: 700, y: GAME_HEIGHT - 32, width: 580, height: 32 },
      // Vertical climb section
      { x: 100, y: 550, width: 120, height: 20 },
      { x: 280, y: 450, width: 120, height: 20 },
      { x: 100, y: 350, width: 120, height: 20 },
      { x: 280, y: 250, width: 120, height: 20 },
      // Middle section
      { x: 500, y: 400, width: 150, height: 20 },
      { x: 700, y: 300, width: 150, height: 20 },
      // High platforms
      { x: 900, y: 200, width: 150, height: 20 },
      { x: 1100, y: 300, width: 150, height: 20 },
      // Exit platform
      { x: 1100, y: 150, width: 150, height: 20 },
    ],
    enemies: [
      { type: 'basic', x: 150, y: 500, patrolDistance: 40 },
      { type: 'basic', x: 330, y: 400, patrolDistance: 40 },
      { type: 'basic', x: 575, y: 350, patrolDistance: 50 },
      { type: 'basic', x: 775, y: 250, patrolDistance: 50 },
      { type: 'basic', x: 950, y: 150, patrolDistance: 40 },
    ],
    lightnings: [
      { x: 160, y: 500 },
      { x: 340, y: 300 },
      { x: 160, y: 300 },
      { x: 575, y: 350 },
      { x: 775, y: 250 },
      { x: 975, y: 150 },
    ],
    playerStart: { x: 100, y: GAME_HEIGHT - 100 },
    exit: { x: 1175, y: 86 },
  },

  // Level 3 - Final challenge
  {
    id: 3,
    name: 'Huippu',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    platforms: [
      // Starting area
      { x: 0, y: GAME_HEIGHT - 32, width: 200, height: 32 },
      // Floating platforms zigzag
      { x: 250, y: 600, width: 100, height: 20 },
      { x: 100, y: 500, width: 100, height: 20 },
      { x: 250, y: 400, width: 100, height: 20 },
      { x: 100, y: 300, width: 100, height: 20 },
      { x: 250, y: 200, width: 100, height: 20 },
      // Middle gauntlet
      { x: 400, y: 300, width: 80, height: 20 },
      { x: 530, y: 250, width: 80, height: 20 },
      { x: 660, y: 200, width: 80, height: 20 },
      // High enemy platforms
      { x: 800, y: 350, width: 120, height: 20 },
      { x: 950, y: 250, width: 120, height: 20 },
      // Final climb
      { x: 1100, y: 400, width: 100, height: 20 },
      { x: 1100, y: 250, width: 100, height: 20 },
      // Exit platform
      { x: 1100, y: 100, width: 150, height: 20 },
    ],
    enemies: [
      { type: 'basic', x: 150, y: 250, patrolDistance: 30 },
      { type: 'basic', x: 300, y: 150, patrolDistance: 30 },
      { type: 'basic', x: 440, y: 250, patrolDistance: 25 },
      { type: 'basic', x: 570, y: 200, patrolDistance: 25 },
      { type: 'basic', x: 700, y: 150, patrolDistance: 25 },
      { type: 'basic', x: 860, y: 300, patrolDistance: 40 },
      { type: 'basic', x: 1010, y: 200, patrolDistance: 40 },
    ],
    lightnings: [
      { x: 300, y: 550 },
      { x: 150, y: 450 },
      { x: 300, y: 350 },
      { x: 150, y: 250 },
      { x: 440, y: 250 },
      { x: 570, y: 200 },
      { x: 700, y: 150 },
      { x: 860, y: 300 },
      { x: 1010, y: 200 },
      { x: 1150, y: 350 },
    ],
    playerStart: { x: 100, y: GAME_HEIGHT - 100 },
    exit: { x: 1175, y: 36 },
  },

  // Level 4 - Long scrolling level "The Journey"
  {
    id: 4,
    name: 'Matka',
    width: 3840, // Triple width - 3 screens
    height: GAME_HEIGHT,
    platforms: [
      // === START ZONE (0-500px) ===
      // Ground
      { x: 0, y: GAME_HEIGHT - 32, width: 400, height: 32 },
      // Easy stepping stones
      { x: 300, y: 550, width: 120, height: 20 },
      { x: 480, y: 480, width: 120, height: 20 },

      // === EARLY ZONE (500-1500px) ===
      // Platforming section
      { x: 650, y: GAME_HEIGHT - 32, width: 200, height: 32 },
      { x: 700, y: 400, width: 100, height: 20 },
      { x: 880, y: 320, width: 100, height: 20 },
      { x: 1050, y: 400, width: 120, height: 20 },
      { x: 1200, y: 500, width: 150, height: 20 },
      { x: 1380, y: 420, width: 100, height: 20 },

      // === MIDDLE ZONE (1500-2500px) ===
      // Vertical climbing section
      { x: 1550, y: 600, width: 100, height: 20 },
      { x: 1700, y: 500, width: 100, height: 20 },
      { x: 1550, y: 400, width: 100, height: 20 },
      { x: 1700, y: 300, width: 100, height: 20 },
      { x: 1850, y: 380, width: 120, height: 20 },
      // Bridge section
      { x: 2000, y: GAME_HEIGHT - 32, width: 300, height: 32 },
      { x: 2100, y: 450, width: 150, height: 20 },
      { x: 2300, y: 350, width: 100, height: 20 },

      // === LATE ZONE (2500-3400px) ===
      // Harder platforming
      { x: 2500, y: 500, width: 80, height: 20 },
      { x: 2650, y: 420, width: 80, height: 20 },
      { x: 2800, y: 340, width: 80, height: 20 },
      { x: 2950, y: 420, width: 100, height: 20 },
      { x: 3100, y: 520, width: 100, height: 20 },
      { x: 3250, y: 400, width: 100, height: 20 },

      // === END ZONE (3400-3840px) ===
      // Final approach
      { x: 3400, y: GAME_HEIGHT - 32, width: 200, height: 32 },
      { x: 3500, y: 500, width: 120, height: 20 },
      { x: 3650, y: 350, width: 150, height: 20 },
    ],
    enemies: [
      // Early zone
      { type: 'basic', x: 750, y: 350, patrolDistance: 40 },
      { type: 'basic', x: 1250, y: 450, patrolDistance: 60 },
      // Middle zone
      { type: 'basic', x: 1600, y: 350, patrolDistance: 40 },
      { type: 'basic', x: 1750, y: 250, patrolDistance: 40 },
      { type: 'basic', x: 2150, y: 400, patrolDistance: 60 },
      // Late zone
      { type: 'basic', x: 2700, y: 370, patrolDistance: 30 },
      { type: 'basic', x: 3000, y: 370, patrolDistance: 40 },
      { type: 'basic', x: 3300, y: 350, patrolDistance: 40 },
    ],
    lightnings: [
      // Start zone
      { x: 360, y: 500 },
      { x: 540, y: 430 },
      // Early zone
      { x: 750, y: 350 },
      { x: 930, y: 270 },
      { x: 1110, y: 350 },
      { x: 1275, y: 450 },
      { x: 1430, y: 370 },
      // Middle zone
      { x: 1600, y: 550 },
      { x: 1750, y: 450 },
      { x: 1600, y: 350 },
      { x: 2150, y: 400 },
      { x: 2350, y: 300 },
      // Late zone
      { x: 2550, y: 450 },
      { x: 2850, y: 290 },
      { x: 3150, y: 470 },
      // End zone
      { x: 3550, y: 450 },
      { x: 3700, y: 300 },
    ],
    playerStart: { x: 100, y: GAME_HEIGHT - 100 },
    exit: { x: 3725, y: 286 },
  },

  // Level 5 - "The Abyss" - Long scrolling level with procedural parallax
  {
    id: 5,
    name: 'Syvyys',
    width: 4800, // 4 screens wide
    height: GAME_HEIGHT,
    platforms: [
      // === START ZONE (0-600px) ===
      { x: 0, y: GAME_HEIGHT - 32, width: 350, height: 32 },
      { x: 200, y: 550, width: 100, height: 20 },
      { x: 400, y: 480, width: 100, height: 20 },

      // === DESCENT ZONE (600-1400px) ===
      { x: 550, y: 580, width: 120, height: 20 },
      { x: 720, y: GAME_HEIGHT - 32, width: 200, height: 32 },
      { x: 750, y: 450, width: 100, height: 20 },
      { x: 920, y: 380, width: 100, height: 20 },
      { x: 1100, y: 320, width: 120, height: 20 },
      { x: 1280, y: 400, width: 100, height: 20 },

      // === CRYSTAL CAVE ZONE (1400-2200px) ===
      { x: 1450, y: 520, width: 80, height: 20 },
      { x: 1580, y: 440, width: 80, height: 20 },
      { x: 1720, y: 360, width: 100, height: 20 },
      { x: 1880, y: 280, width: 100, height: 20 },
      { x: 2050, y: 360, width: 120, height: 20 },

      // === UNDERGROUND LAKE ZONE (2200-3000px) ===
      { x: 2200, y: GAME_HEIGHT - 32, width: 250, height: 32 },
      { x: 2300, y: 480, width: 100, height: 20 },
      { x: 2480, y: 400, width: 100, height: 20 },
      { x: 2650, y: 320, width: 80, height: 20 },
      { x: 2800, y: 400, width: 100, height: 20 },
      { x: 2950, y: 500, width: 120, height: 20 },

      // === ASCENT ZONE (3000-3800px) ===
      { x: 3100, y: 580, width: 100, height: 20 },
      { x: 3250, y: 500, width: 100, height: 20 },
      { x: 3400, y: 420, width: 100, height: 20 },
      { x: 3550, y: 340, width: 100, height: 20 },
      { x: 3700, y: 260, width: 120, height: 20 },

      // === FINAL ZONE (3800-4800px) ===
      { x: 3900, y: 350, width: 150, height: 20 },
      { x: 4100, y: GAME_HEIGHT - 32, width: 200, height: 32 },
      { x: 4150, y: 450, width: 100, height: 20 },
      { x: 4320, y: 350, width: 100, height: 20 },
      { x: 4500, y: 250, width: 120, height: 20 },
      { x: 4650, y: 180, width: 150, height: 20 },
    ],
    enemies: [
      // Descent zone
      { type: 'basic', x: 800, y: 400, patrolDistance: 40 },
      { type: 'basic', x: 1150, y: 270, patrolDistance: 50 },
      // Crystal cave zone
      { type: 'basic', x: 1630, y: 390, patrolDistance: 30 },
      { type: 'basic', x: 1930, y: 230, patrolDistance: 40 },
      // Underground lake zone
      { type: 'basic', x: 2350, y: 430, patrolDistance: 40 },
      { type: 'basic', x: 2700, y: 270, patrolDistance: 30 },
      { type: 'basic', x: 3000, y: 450, patrolDistance: 50 },
      // Ascent zone
      { type: 'basic', x: 3450, y: 370, patrolDistance: 40 },
      { type: 'basic', x: 3750, y: 210, patrolDistance: 50 },
      // Final zone
      { type: 'basic', x: 4370, y: 300, patrolDistance: 40 },
      { type: 'basic', x: 4550, y: 200, patrolDistance: 50 },
    ],
    lightnings: [
      // Start zone
      { x: 250, y: 500 },
      { x: 450, y: 430 },
      // Descent zone
      { x: 600, y: 530 },
      { x: 800, y: 400 },
      { x: 970, y: 330 },
      { x: 1160, y: 270 },
      { x: 1330, y: 350 },
      // Crystal cave zone
      { x: 1500, y: 470 },
      { x: 1770, y: 310 },
      { x: 1930, y: 230 },
      { x: 2100, y: 310 },
      // Underground lake zone
      { x: 2350, y: 430 },
      { x: 2530, y: 350 },
      { x: 2700, y: 270 },
      { x: 2850, y: 350 },
      { x: 3000, y: 450 },
      // Ascent zone
      { x: 3150, y: 530 },
      { x: 3300, y: 450 },
      { x: 3600, y: 290 },
      { x: 3750, y: 210 },
      // Final zone
      { x: 3950, y: 300 },
      { x: 4200, y: 400 },
      { x: 4370, y: 300 },
      { x: 4550, y: 200 },
      { x: 4700, y: 130 },
    ],
    playerStart: { x: 100, y: GAME_HEIGHT - 100 },
    exit: { x: 4720, y: 116 },
  },
];

export function getLevelData(levelNumber: number): LevelData | null {
  return LEVELS[levelNumber - 1] || null;
}

export function getTotalLevels(): number {
  return LEVELS.length;
}
