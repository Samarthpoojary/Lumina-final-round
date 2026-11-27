import type { GridPosition, WorldBounds } from './world';

export interface PixelSize {
  width: number;
  height: number;
}

export interface CameraPosition {
  x: number;
  y: number;
}

export function followCamera(
  player: GridPosition,
  viewport: PixelSize,
  world: WorldBounds,
  tileSize: number,
): CameraPosition {
  const worldWidth = world.widthTiles * tileSize;
  const worldHeight = world.heightTiles * tileSize;
  const playerCenterX = player.x * tileSize + tileSize / 2;
  const playerCenterY = player.y * tileSize + tileSize / 2;

  return {
    x: Math.max(0, Math.min(worldWidth - viewport.width, playerCenterX - viewport.width / 2)),
    y: Math.max(0, Math.min(worldHeight - viewport.height, playerCenterY - viewport.height / 2)),
  };
}
