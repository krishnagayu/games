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
    name: 'Laser Turret',
    cost: 100,
    range: 120,
    damage: 15,
    fireRate: 2.5,
    color: '#00f0ff',
    description: 'Rapid single-target energy laser beam.',
    icon: '⚡'
  },
  cryo: {
    type: 'cryo',
    name: 'Frost Emitter',
    cost: 150,
    range: 100,
    damage: 5,
    fireRate: 1.0,
    color: '#00ffaa',
    description: 'Slows down groups of alien invaders in range.',
    icon: '🧊'
  },
  plasma: {
    type: 'plasma',
    name: 'Plasma Blaster',
    cost: 200,
    range: 160,
    damage: 45,
    fireRate: 0.8,
    color: '#ff0055',
    description: 'Fires heavy plasma rockets dealing area splash damage.',
    icon: '🚀'
  },
  magnet: {
    type: 'magnet',
    name: 'Pulse Disruptor',
    cost: 175,
    range: 110,
    damage: 25,
    fireRate: 1.2,
    color: '#bf00ff',
    description: 'Stuns and strips robotic shields from alien foes.',
    icon: '🧲'
  }
};
