# Agent Instructions — LUMINA Round 4

## Project context

Read the [Round 4 scope summary](docs/round-4-scope.md) and the canonical shared context linked there before taking a game-related task.

This repository contains the game for **Round 4** of the larger four-round LUMINA project. Round 1 is nearly complete, while Rounds 2 and 3 are in progress. Do not assume this repository owns or implements the other rounds.

Round 4 is **The Final Boss**. The approved first playable version in this repository is a four-LED Diya chaser on a **pre-wired** breadboard. The player's task is to configure the pins to match the fixed paths: D2→LED 1, D3→LED 2, D4→LED 3, and D5→LED 4. Each path uses its own 220 Ω resistor and correctly oriented LED to shared GND. The sequence then repeats D2→D3→D4→D5. Validation is a simplified connection/configuration check, not electrical simulation or physical hardware. The canonical shared project context is [here](https://github.com/Samarthpoojary/Lumina/blob/main/docs/PROJECT_CONTEXT.md); its Round 4 prototype is reference-only for this repository.

The user approved this dedicated repository as the standalone home for Round 4. The main LUMINA repository remains canonical for shared project context, and its Final Boss prototype is reference-only. Do not edit the earlier-round repository as part of Round 4 work. Any selected prototype parts may be ported selectively into this repository later through reviewed pull requests. The first playable pin-configuration milestone is implemented and merged. Every new task still needs an issue, approved scope, and appropriate review. Claude must review major technical details and critical gameplay/electrical decisions that are not already covered by user-approved rules before dependent implementation begins.

## Roles and authority

- **User — Project Director:** Sets requirements and priorities, approves initial task assignments, resolves product decisions, and participates in release approval.
- **ChatGPT — Project Manager:** Prepares scoped tasks, coordinates work, and reviews against requirements.
- **Claude — Technical Architect and lead agent:** Has authority over major technical architecture decisions and leads technical implementation as assigned.
- **GitHub Copilot — Coding support:** Assists with suitable coding tasks within capability and approved scope.
- **Antigravity — UI and testing:** Handles suitable interface and testing work within capability and approved scope.

No agent may make major architecture, security, database, or critical gameplay decisions unless Claude authorizes the decision or the user has approved the applicable rules. If that authority is unavailable, document the question and leave that decision unresolved. Continue only with independent work that is already authorized.

## Task and change rules

- Every task needs a GitHub issue with scope, requirements, acceptance criteria, dependencies, capability needs, and constraints.
- The user approves the initial task and assignment. Once approved, an eligible failover reassignment does not require asking the user again; it must preserve the original scope.
- Before editing, inspect the issue, relevant files, branches, pull requests, commits, and handover notes.
- Use a separate branch or clearly assigned work area. Coordinate before editing shared files. Do not overwrite or discard another agent's work.
- Keep changes limited to the approved task. Ask for clarification through the issue when requirements conflict or scope would need to change.
- Commit completed work and keep the issue updated with progress, decisions, blockers, and links.
- Document each major feature and technical decision.
- Do not commit credentials, tokens, private keys, or other secrets. Use approved secret storage and least-privilege access.
- Do not merge or deploy based solely on an agent's own completion claim. Changes require review; final release approval is shared by the user and ChatGPT.

## Unavailability and automatic backup assignment

If an agent reaches a usage limit, goes offline, encounters a service outage, repeatedly errors, or otherwise cannot continue:

1. Mark the task **Blocked** in GitHub and record the cause. Apply the `blocked`, `queued`, `agent-unavailable`, or `failover` issue label as applicable so the Discord workflow routes it to `#bugs-and-blockers`.
2. Preserve committed work, branch/PR links, progress, open questions, risks, and a concise handover in GitHub. Save unfinished changes to the assigned branch when possible.
3. The coordinator finds an available backup whose capability and authority fit the task.
4. For an eligible task, automatically reassign it without asking the user for a second approval. Notify the dedicated LUMINA Discord channel and record the reassignment in GitHub.
5. The backup inspects all existing work and handover context before editing, preserves previous work, and avoids conflicting edits.
6. If no suitable backup is available, leave the task **Queued** and notify the dedicated LUMINA Discord channel. Do not broaden scope or bypass technical authority.

## Communication and review

GitHub is the durable source of truth for tasks, decisions, code, and handovers. Discord is for notifications and coordination; notifications should link to the authoritative GitHub issue or pull request. Existing CLIs and applications are used for agent work. Automatic dispatch is only expected where an integration supports it.

Use the task and handover templates under `docs/templates/`. Pull requests should explain the change, link the issue, list checks performed, and disclose risks or unfinished items.
