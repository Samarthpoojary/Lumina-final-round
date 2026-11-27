# LUMINA Round 4 — Agent Quick Start

## Project identity

This repository is for Round 4, **The Final Boss**, of the four-round LUMINA project. The canonical shared product context is [LUMINA `docs/PROJECT_CONTEXT.md`](https://github.com/Samarthpoojary/Lumina/blob/main/docs/PROJECT_CONTEXT.md). The existing Round 4 prototype in the main LUMINA repository is reference-only; do not edit that earlier-round repository. The first playable version here is a pre-wired Diya chaser with pin configuration only: D2→LED 1, D3→LED 2, D4→LED 3, D5→LED 4. A valid setup runs D2→D3→D4→D5 repeatedly. The first playable implementation is merged; new work still requires a scoped GitHub issue and user-approved initial assignment.

## Selected agent tools and roles

- **Claude CLI with freeLLMAPI:** Technical lead for implementation and major technical decisions, within the approved scope.
- **GitHub Copilot in Visual Studio / VS Code:** Coding support for scoped tasks.
- **Antigravity:** Suitable UI work and testing.
- **ChatGPT:** Prepares tasks, coordinates handovers, and reviews work.
- **User:** Project Director; approves initial task assignments and product decisions.

Use the tool and application that is actually installed and configured on your machine. Keep provider credentials in the CLI's local configuration or an approved secret store. Never commit API keys, Discord webhook URLs, or other credentials to this repository.

## Start a task

1. Open this repository in the selected agent application. Do not let multiple agents edit the same working directory at once; use separate branches or work areas for parallel work.
2. Read the repository-root `AGENTS.md` and the canonical LUMINA project context linked above.
3. Read the GitHub issue and inspect the referenced files, branches, pull requests, and handover notes.
4. Wait for the user to approve the initial task and owner. Then give the selected agent the exact issue link, approved scope, and acceptance criteria.
5. Ask the agent to keep progress, decisions, blockers, and handover context on the GitHub issue. Proposed code changes should be submitted on a branch through a pull request.
6. ChatGPT reviews the proposal; do not merge or release without the required approval.

## Dispatch and failover

GitHub issue assignments and Discord notifications do **not** start a local Claude CLI, Copilot, or Antigravity session. Automatic dispatch is available only when a supported integration can actually reach that tool. Until such an integration is configured, pass the approved issue link into the selected application manually.

Automatic backup assignment is the agreed recovery policy for eligible, already-approved tasks. When an unavailable agent is detected, preserve its committed work and handover in GitHub, mark the task blocked, choose a capable backup, and reassign within the approved scope. The backup must inspect existing work and avoid conflicting edits. Major architecture, security, database, and critical gameplay decisions remain with Claude or user-approved rules. If no suitable backup is available, keep the task queued and notify Discord. No always-on agent availability monitor or local CLI launcher is currently configured.

Use the issue labels `blocked`, `queued`, `agent-unavailable`, or `failover` as applicable so the Discord workflow can route blocker updates to `#bugs-and-blockers`.

## Discord channels

- `#task-assignments` — issue activity and assignments
- `#agent-reports` — issue comments and pull requests
- `#agent-discussions` — team coordination
- `#bugs-and-blockers` — failure and blocked/queued task alerts
- `#release-updates` — published releases

GitHub remains the durable source of truth. Do not post webhook URLs or secret values in Discord messages, issues, commits, or this repository.
