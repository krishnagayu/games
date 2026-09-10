import type { MapData, Position } from './types';

export const GRID_COLS = 16;
export const GRID_ROWS = 10;
export const CELL_SIZE = 50;

// Path 1: Neon Alpha Base
const path1: Position[] = [
  { x: 0, y: 2 },
  { x: 4, y: 2 },
  { x: 4, y: 7 },
  { x: 9, y: 7 },
  { x: 9, y: 3 },
  { x: 13, y: 3 },
  { x: 13, y: 8 },
  { x: 15, y: 8 }
];

// Path 2: Crystal Crater
const path2: Position[] = [
  { x: 2, y: 0 },
  { x: 2, y: 4 },
  { x: 7, y: 4 },
  { x: 7, y: 2 },
  { x: 11, y: 2 },
  { x: 11, y: 7 },
  { x: 15, y: 7 }
];

function generateBuildableGrid(path: Position[]): boolean[][] {
  const grid: boolean[][] = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(true));
  
  // Mark path tiles and adjacent buffer tiles as unbuildable
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];

    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    for (let r = minY; r <= maxY; r++) {
      for (let c = minX; c <= maxX; c++) {
        if (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) {
          grid[r][c] = false;
        }
      }
    }
  }

  return grid;
}

export const MAPS: MapData[] = [
  {
    id: 'emerald-lagoon',
    name: 'Emerald Island Lagoon',
    themeColor: '#10b981', // vibrant lush palm grass
    path: path1,
    buildableGrid: generateBuildableGrid(path1)
  },
  {
    id: 'sunken-coral',
    name: 'Sunken Coral Beach',
    themeColor: '#0284c7', // tropical turquoise shore
    path: path2,
    buildableGrid: generateBuildableGrid(path2)
  }
];

