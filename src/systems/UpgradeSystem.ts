import type { UpgradeCard, PlayerStats } from '../types';

export const ALL_CARDS: UpgradeCard[] = [
  {
    id: 'jump_boost',
    name: 'Korkea hyppy',
    description: '+20% hyppykorkeus',
    effect: (stats: PlayerStats) => {
      stats.jumpPower *= 1.2;
    },
  },
  {
    id: 'speed_boost',
    name: 'Nopeus',
    description: '+15% liikkumisnopeus',
    effect: (stats: PlayerStats) => {
      stats.speed *= 1.15;
    },
  },
  {
    id: 'damage_up',
    name: 'Voima',
    description: '+30% tulipallodamage',
    effect: (stats: PlayerStats) => {
      stats.damage *= 1.3;
    },
  },
  {
    id: 'max_energy',
    name: 'Energia+',
    description: '+30 max energiaa',
    effect: (stats: PlayerStats) => {
      stats.maxEnergy += 30;
      stats.energy = Math.min(stats.energy + 30, stats.maxEnergy);
    },
  },
  {
    id: 'energy_regen',
    name: 'Regeneraatio',
    description: '+5 energiaa/sekunti',
    effect: (stats: PlayerStats) => {
      stats.energyRegen += 5;
    },
  },
  {
    id: 'max_health',
    name: 'Kestävyys',
    description: '+25 max HP',
    effect: (stats: PlayerStats) => {
      stats.maxHealth += 25;
      stats.health = Math.min(stats.health + 25, stats.maxHealth);
    },
  },
  {
    id: 'heal',
    name: 'Parantuminen',
    description: 'Palauta täydet HP',
    effect: (stats: PlayerStats) => {
      stats.health = stats.maxHealth;
    },
  },
  {
    id: 'energy_refill',
    name: 'Energiatäyttö',
    description: 'Palauta täysi energia',
    effect: (stats: PlayerStats) => {
      stats.energy = stats.maxEnergy;
    },
  },
  {
    id: 'glass_cannon',
    name: 'Lasitykki',
    description: '+100% damage, -20% max HP',
    effect: (stats: PlayerStats) => {
      stats.damage *= 2;
      stats.maxHealth = Math.floor(stats.maxHealth * 0.8);
      stats.health = Math.min(stats.health, stats.maxHealth);
    },
  },
  {
    id: 'tank',
    name: 'Tankki',
    description: '+50% max HP, -10% nopeus',
    effect: (stats: PlayerStats) => {
      stats.maxHealth = Math.floor(stats.maxHealth * 1.5);
      stats.health += 25;
      stats.speed *= 0.9;
    },
  },
];

export function getRandomCards(count: number, excludeIds: string[] = []): UpgradeCard[] {
  const availableCards = ALL_CARDS.filter(
    (card) => !excludeIds.includes(card.id)
  );

  // Shuffle and take first N
  const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
