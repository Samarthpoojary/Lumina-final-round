# LUMINA — Round 4: The Final Boss

This repository contains the fourth round of the larger four-round LUMINA project. Round 1 is nearly complete; Rounds 2 and 3 are in progress. Keep this repository focused on Round 4 and coordinate shared-context changes with the main LUMINA repository.

## Current playable slice

The Project Director approved a compact top-down Diwali village game slice: move around a small festival map, collect crafting materials, and make one starter Diya Charm at a nearby stall. The UI uses a warm 16-bit pixel-art direction. The user's Gemini demo is a visual reference, not a full game specification to reproduce.

The village prototype is scoped by [issue #29](https://github.com/Samarthpoojary/Lumina-final-round/issues/29). The first recipe is provisional and stored locally in the browser. Multiplayer, combat, backend, accounts, scoring, progression, and persistent inventory are outside this slice.

## Existing circuit prototype

The four-LED Diya Chaser remains available as a separate circuit activity. It validates a simplified connection graph and simulates the output; it is not an electrical solver or physical-hardware connection. The legacy reference is in the main LUMINA repository, which is not to be modified during this task.

## Working here

1. Read [AGENTS.md](AGENTS.md) and [Round 4 scope](docs/round-4-scope.md).
2. Use GitHub issues for scoped tasks and pull requests for proposed changes.
3. Work in a separate branch or assigned area. Inspect existing work before editing.
4. Record decisions, progress, blockers, and handover context in GitHub.
5. Major architecture, security, and database decisions require Claude's technical authority or explicit user approval.
6. Do not merge or release without required review and approval.

## Project documents

- [Round 4 scope](docs/round-4-scope.md)
- [Agent Coordination Architecture](docs/agent-coordination-architecture.md)
- [Agent Quick Start](docs/agent-quickstart.md)
- [Task template](docs/templates/task.md)
- [Handover template](docs/templates/handover.md)
- [Canonical shared LUMINA project context](https://github.com/Samarthpoojary/Lumina/blob/main/docs/PROJECT_CONTEXT.md)
