# Diwali Village world map art

`diwali-village-world.svg` is a standalone, full-world art layer for the 84 × 64 tile village slice. Its 2688 × 2048 viewBox uses 32 SVG units per map tile, so map tile `(x, y)` aligns at `(x × 32, y × 32)`.

## Layout

- The broad horizontal and vertical roads meet at the shared central festival courtyard.
- The four neighborhood courts align with the current base anchors: Amber `(10, 10)`, Sapphire `(74, 10)`, Jade `(10, 54)`, and Citrine `(74, 54)`.
- Each quadrant gets a distinct landmark silhouette and visual texture: orchard/market, waterside pond/arch, garden/well, or festival market/rangoli.
- Lamps and flower beds punctuate the long connecting routes to make the larger map easier to scan.

## Integration

This is artwork only; it does not change movement, collision, collection, crafting, or other game rules. It can be shown as a zoomable full-map illustration or used as a reference layer while populating the scrolling canvas with separate collision-aware landmarks. Keep the character, interactive objects, and interface above the art layer. The existing pin configuration and circuit activity are unaffected.

For a fully static scene, load `/game-art/diwali-village-world.svg` as an image. For a scrolling canvas, crop a source rectangle using the camera's world-pixel offset and the same 32-unit-per-map-tile scale, then draw dynamic objects in a separate pass.

