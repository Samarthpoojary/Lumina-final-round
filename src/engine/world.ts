export interface GridPosition {
  x: number;
  y: number;
}

export interface WorldBounds {
  widthTiles: number;
  heightTiles: number;
}

export interface TileRect extends GridPosition {
  w: number;
  h: number;
}

export const TILE_SIZE = 24;
export const WORLD_BOUNDS: WorldBounds = { widthTiles: 84, heightTiles: 64 };
export const VIEW_TILES = { width: 28, height: 16 };
