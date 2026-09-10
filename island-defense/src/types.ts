export interface Position {
  x: number;
  y: number;
}

export type TowerType = 'laser' | 'cryo' | 'plasma' | 'magnet';

export interface TowerConfig {
  type: TowerType;
  name: string;
  cost: number;
  range: number;
  damage: number;
  fireRate: number; // attacks per second
  color: string;
  description: string;
  icon: string;
}

export interface Tower {
  id: string;
  type: TowerType;
  x: number;
  y: number;
  level: number;
  lastFired: number;
  range: number;
  damage: number;
  fireRate: number;
  targetId: string | null;
  angle: number;
}

export type EnemyType = 'blobbot' | 'slime' | 'saucer' | 'boss';

export interface Enemy {
  id: string;
  type: EnemyType;
  name: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  baseSpeed: number;
  reward: number;
  color: string;
  size: number;
  pathIndex: number;
  slowTimer: number;
  stunTimer: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetEnemyId: string;
  speed: number;
  damage: number;
  towerType: TowerType;
  color: string;
  splashRadius?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface MapData {
  id: string;
  name: string;
  themeColor: string;
  path: Position[];
  buildableGrid: boolean[][]; // true if cell is buildable
}

export interface CustomChallenge {
  creatorName: string;
  path: Position[];
  startingCredits: number;
  maxTowers: number;
  allowedTowers: Record<TowerType, boolean>;
  enemyWave: Record<EnemyType, number>;
}

export const TOWER_CONFIGS: Record<TowerType, TowerConfig> = {
  laser: {
    type: 'laser',
    name: 'Sunfire Launcher',
    cost: 100,
    range: 120,
    damage: 15,
    fireRate: 2.5,
    color: '#f59e0b',
    description: 'Rapid solar beam launcher powered by island sun rays.',
    icon: '☀️'
  },
  cryo: {
    type: 'cryo',
    name: 'Coconut Frost Cannon',
    cost: 150,
    range: 100,
    damage: 5,
    fireRate: 1.0,
    color: '#06b6d4',
    description: 'Launches chilled coconut ice blasts that freeze invaders.',
    icon: '🥥'
  },
  plasma: {
    type: 'plasma',
    name: 'Volcano Blast Mortar',
    cost: 200,
    range: 160,
    damage: 45,
    fireRate: 0.8,
    color: '#ef4444',
    description: 'Fires heavy lava explosive mortar shells dealing area splash damage.',
    icon: '🌋'
  },
  magnet: {
    type: 'magnet',
    name: 'Tiki Thunder Totem',
    cost: 175,
    range: 110,
    damage: 25,
    fireRate: 1.2,
    color: '#8b5cf6',
    description: 'Unleashes tropical lightning shocks that stun enemy hordes.',
    icon: '🗿'
  }
};
