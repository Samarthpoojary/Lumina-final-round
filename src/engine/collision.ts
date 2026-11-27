import type { GridPosition, TileRect, WorldBounds } from './world';

export function canOccupyTile(
  position: GridPosition,
  bounds: WorldBounds,
  obstacles: readonly TileRect[],
  edgeMargin = 0,
): boolean {
  if (
    position.x < edgeMargin ||
    position.x >= bounds.widthTiles - edgeMargin ||
    position.y < edgeMargin ||
    position.y >= bounds.heightTiles - edgeMargin
  ) {
    return false;
  }

  return !obstacles.some((obstacle) =>
    position.x >= obstacle.x &&
    position.x < obstacle.x + obstacle.w &&
    position.y >= obstacle.y &&
    position.y < obstacle.y + obstacle.h,
  );
}
