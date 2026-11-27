# Agent Instructions — LUMINA Round 4

## Project context

This repository contains the game for **Round 4** of the larger four-round LUMINA project. Round 1 is nearly complete, while Rounds 2 and 3 are in progress. Do not assume this repository owns or implements the other rounds.

Round 4 is **The Final Boss**: a free-build virtual breadboard circuit challenge. The current target documented in the shared project context is a four-LED sequential Diya chaser using an Arduino-style microcontroller module. The existing prototype uses simplified graph checking and simulated output; it is not a production electrical solver or physical-hardware connection. The canonical project context is [here](`https://github.com/Samarthpoojary/Lumina/blob/main/docs/PROJECT_CONTEXT.md`).

The relationship between this dedicated Round 4 repository and the existing LUMINA prototype has not yet been decided. Before implementation, inspect the existing Round 4 prototype and follow the approved reuse/extraction plan. This repository context does not authorize starting game implementation.

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

1. Mark the task **Blocked** in GitHub and record the cause.
2. Preserve committed work, branch/PR links, progress, open questions, risks, and a concise handover in GitHub. Save unfinished changes to the assigned branch when possible.
3. The coordinator finds an available backup whose capability and authority fit the task.
4. For an eligible task, automatically reassign it without asking the user for a second approval. Notify the dedicated LUMINA Discord channel and record the reassignment in GitHub.
5. The backup inspects all existing work and handover context before editing, preserves previous work, and avoids conflicting edits.
6. If no suitable backup is available, leave the task **Queued** and notify the dedicated LUMINA Discord channel. Do not broaden scope or bypass technical authority.

## Communication and review

GitHub is the durable source of truth for tasks, decisions, code, and handovers. Discord is for notifications and coordination; notifications should link to the authoritative GitHub issue or pull request. Existing CLIs and applications are used for agent work. Automatic dispatch is only expected where an integration supports it.

Use the task and handover templates under `docs/templates/`. Pull requests should explain the change, link the issue, list checks performed, and disclose risks or unfinished items.
