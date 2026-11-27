# Round 4 — The Final Boss

## Canonical source

This summary follows the shared LUMINA project context in [`Samarthpoojary/Lumina/docs/PROJECT_CONTEXT.md`](https://github.com/Samarthpoojary/Lumina/blob/main/docs/PROJECT_CONTEXT.md). That document is the source of truth for product context. This dedicated repository must stay limited to Round 4.

## Approved Round 4 direction

Round 4 is **The Final Boss** within LUMINA. The Project Director has approved building a first playable top-down Diwali village slice in this repository. It uses a warm 16-bit pixel-art visual language and an 84×64-tile world (12× the original map area) with a player-following camera, four visually distinct neighborhood/base areas, connecting paths, distributed materials and festival landmarks, a HUD/inventory, and one starter crafting interaction. The user's Gemini demo is visual guidance only; do not copy it as a complete specification or reuse its exact art, names, UI, or recipes.

The starter slice is scoped by [GitHub issue #29](https://github.com/Samarthpoojary/Lumina-final-round/issues/29). Its initial recipe is provisional and local to the demo. This is not the complete game specification: multiplayer/team competition, combat, accounts, backend, scoring, progression systems, chat/trading, spectator/admin tools, and persistent inventory are not implemented or approved by this task.

The four-LED Diya Chaser remains the existing circuit prototype/feature in this repository. Its current target path is four outputs:
- Arduino digital pin D2, D3, D4, or D5
- A distinct 220 Ω resistor for that output
- One LED
- Ground (GND)

All four paths are required. The prototype uses simplified graph checking and simulated output; it is not an electrical solver or physical-hardware connection.

## Existing prototype and limitations

The legacy circuit prototype lives in `lumina-final-boss.html` in the main LUMINA repository. It is an HTML/CSS/JavaScript browser page with inline styling and simulation logic. On success, it records a demo score and result in browser `localStorage`. It is reference-only; do not change the main LUMINA repository during Round 4 work.

## Approved repository relationship

The user approved this repository as the standalone home for Round 4. The main LUMINA repository remains the canonical source for shared project context, and its Final Boss prototype is reference-only. Do not edit the earlier-round repository as part of Round 4 work. Any selected prototype parts may be ported selectively into this repository later through reviewed pull requests.

The shared project-context document still describes the older circuit-only Round 4 direction. This local scope records the Project Director's approved playable village slice; coordinate any canonical context update separately in the main LUMINA repository. Keep implementation in this repository's existing TypeScript/Vite app and do not make major architecture, security, database, scoring, or persistence decisions without the required approval.

## Authority

Major architecture, security, database, and critical gameplay decisions require Claude's technical authority or explicit user-approved rules. Record unresolved questions in GitHub and keep dependent work unassigned.
