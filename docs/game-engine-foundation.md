# Game engine foundation

This note describes the small, local engine helpers introduced for the village slice. The app remains a TypeScript/Vite browser app, and the current screen remains the coordinator for village rendering, inventory, crafting, and DOM events.

## Module boundaries

- `src/engine/world.ts` owns the current tile size, world bounds, viewport tile dimensions, and shared grid/rectangle types.
- `src/engine/input.ts` translates the existing WASD and arrow-key inputs into a one-tile movement delta. It does not register DOM listeners.
- `src/engine/collision.ts` checks a proposed tile against world edges and caller-supplied blocked rectangles. It does not model physical or electrical behavior.
- `src/engine/camera.ts` computes a player-following camera position clamped to the current world and viewport sizes.
- `src/engine/assets.ts` creates browser image objects from app-local asset paths. Rendering and fallback behavior remain with the village screen.
- `src/village-game.ts` remains the integration point for these helpers and owns current rendering, interaction, and local slice state.

## Current limitations

Movement is tile-based and the obstacle list is static. The world model is specific to the current local 84×64 slice; it does not define a general entity system, simulation loop, save format, multiplayer model, or content pipeline. Assets load through browser image elements and use the current screen's fallback drawing. This foundation does not add persistence, backend services, scoring, combat, or new gameplay rules.

## Next safe integration point

Future gameplay work can call the pure input, collision, and camera helpers while keeping presentation in its own task. A later task can replace static obstacle rectangles with approved map collision data without changing these helper contracts. Any broader engine architecture, persistence, networking, or new gameplay rules require the approvals recorded in `AGENTS.md` and the Round 4 scope.
