# LUMINA — Round 4

This repository is for the **fourth round/game** of the larger four-round LUMINA project. Round 1 is nearly complete; Rounds 2 and 3 are in progress. Keep this repository focused on Round 4, and link to shared work in other rounds rather than copying or changing it without coordination.

## Project status

The first playable version of Round 4 is merged to `main`: a pre-wired four-LED Diya chaser. Players configure each fixed LED path to its matching pin (D2→LED 1, D3→LED 2, D4→LED 3, D5→LED 4); a valid configuration starts the repeating sequence. The board uses four distinct 220 Ω resistor/LED paths to shared GND. Validation is a simplified configuration/connectivity check, not electrical simulation or a hardware connection. Scoring, timers, hints, accounts, saved results, and backend work are deferred. See the canonical [LUMINA project context](https://github.com/Samarthpoojary/Lumina/blob/main/docs/PROJECT_CONTEXT.md) for shared context; its Round 4 prototype remains reference-only.

This repository is the standalone home for Round 4. Do not edit the earlier-round repository as part of Round 4 work. Any selected prototype material may be ported through reviewed pull requests. See [the approved first-milestone rules](https://github.com/Samarthpoojary/Lumina-final-round/issues/7) and [the backlog](https://github.com/Samarthpoojary/Lumina-final-round/issues/6).

## Working here

1. Read [AGENTS.md](AGENTS.md) before taking a task.
2. Use GitHub Issues for scoped tasks and pull requests for proposed changes.
3. Work in a separate branch or explicitly assigned area. Inspect existing work before editing.
4. Record decisions, progress, blockers, and handover context in GitHub.
5. Do not start work outside the approved task scope. Major architecture, security, database, and critical gameplay decisions require Claude's technical authority or explicit user-approved rules.
6. Do not merge or release without the required review and approval.

## Project documents

- [Round 4 scope](docs/round-4-scope.md)
- [Agent Coordination Architecture](docs/agent-coordination-architecture.md)
- [Agent Quick Start](docs/agent-quickstart.md)
- [Task template](docs/templates/task.md)
- [Handover template](docs/templates/handover.md)
- [Canonical shared LUMINA project context](https://github.com/Samarthpoojary/Lumina/blob/main/docs/PROJECT_CONTEXT.md)

## Scope note

LUMINA is planned as four rounds. This repository represents Round 4 only; it does not establish ownership or status for Rounds 1–3.
