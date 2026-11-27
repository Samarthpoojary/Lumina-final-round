import type { GridPosition } from './world';

const MOVEMENT_KEYS: Readonly<Record<string, GridPosition>> = {
  ArrowLeft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  A: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
  D: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  W: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  S: { x: 0, y: 1 },
};

export function movementDeltaForKey(key: string): GridPosition | null {
  return MOVEMENT_KEYS[key] ?? null;
}
