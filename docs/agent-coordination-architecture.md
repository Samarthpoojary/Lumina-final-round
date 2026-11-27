# LUMINA Agent Coordination Architecture

## Scope

This architecture governs collaboration for the **Round 4 game repository** within the larger four-round LUMINA project. Round 1 is nearly complete; Rounds 2 and 3 are underway. This document does not assign ownership of the other rounds.

## Confirmed decisions

| Area | Decision |
|---|---|
| Task preparation | ChatGPT prepares tasks with requirements and acceptance criteria. |
| Initial task approval | The user approves the task and its initial assignment. |
| Dispatch | Approved tasks are dispatched automatically where existing integrations allow. |
| Agent integration | Use existing CLIs and applications; no custom orchestration server is initially required. |
| Shared record | GitHub issues/projects, branches, pull requests, code, and project documents. |
| Notifications | Dedicated LUMINA Discord channel(s). |
| Failover | Automatic backup assignment for eligible tasks, without asking for user approval again. |
| Technical authority | Claude is the technical architect for major technical decisions. |
| Release approval | The user and ChatGPT together approve final release. |

GitHub assignment alone cannot launch every local agent. Dispatch and reassignment depend on available integrations.

## Roles

- **User — Project Director:** Requirements, priorities, initial task approval, product decisions, and release approval with ChatGPT.
- **ChatGPT — Project Manager:** Task preparation, coordination, and review. It can route an already approved task to a suitable backup under the failover policy.
- **Claude — Technical Architect and lead agent:** Technical architecture and major technical decisions; primary implementation as assigned.
- **GitHub Copilot — Coding support:** Suitable coding assistance within capability and approved scope.
- **Antigravity — UI and testing:** Suitable UI, frontend, and testing tasks within capability and approved scope.
- **GitHub — Coordination hub:** Durable tasks, branches, commits, PRs, decisions, and handovers.
- **Discord — Notifications:** Assignment, progress, blocker, failover, review, and release notifications linked to GitHub.

Use separate branches or clearly assigned work areas. Coordinate before touching files another agent may be changing. Only the designated lead agent modifies shared work.

## Standard task workflow

1. ChatGPT drafts a GitHub issue with scope, requirements, acceptance criteria, dependencies, required capabilities, and authority constraints.
2. The user approves the task and initial assignment.
3. GitHub records the assignment; existing integrations dispatch the approved task where supported. Notify Discord.
4. The assigned agent inspects current work, then implements in its assigned branch or work area. It commits progress and updates the issue with decisions, remaining work, and blockers.
5. ChatGPT and another AI agent review changes before merge. Final release requires the user and ChatGPT.

## Automatic backup assignment and recovery

### Trigger and preserve

When an assigned agent becomes unavailable because of a usage limit, offline status, service outage, repeated errors, or another operational issue:

- Mark the task **Blocked** in GitHub and record the reason.
- Preserve committed work and store the status, approved scope, branch/PR links, progress, open questions, known risks, and handover notes in GitHub.
- Save unfinished changes to the existing branch when possible. Never discard or overwrite them.

### Reassign eligible work automatically

The coordinator identifies an available backup with the capabilities and authority needed. If the task is eligible, assign the backup automatically without asking the user to approve the same task again. Preserve the approved scope, record the reason and ownership/status change in GitHub, and notify the dedicated LUMINA Discord channel.

Before editing, the backup must inspect the issue, existing files, branch, commits, pull requests, relevant documentation, and handover. It must preserve prior work, use an isolated or clearly designated area, and coordinate to prevent overlapping edits. If the original agent returns, the coordinator records the ownership and work boundaries before parallel work resumes.

A backup must work within its demonstrated capability and the approved task scope. It must not make major architecture, security, database, or critical gameplay decisions unless Claude authorizes the decision or the user has approved the applicable rules. If the needed authority is unavailable, document the unresolved decision and stop only the work that depends on it; independent authorized work may continue.

### If no suitable backup is available

Leave the task **Queued** in GitHub with the blocker, preserved work, and handover context. Notify the dedicated LUMINA Discord channel. Do not silently expand the task or bypass its authority constraints.

### Reassignment eligibility

Automatic reassignment is allowed only if:

- the initial task was approved and its scope is unchanged;
- a suitable backup is available and capable;
- the backup can inspect and preserve existing work without conflicting edits; and
- no unauthorized decision reserved to Claude or the user is required.

Otherwise keep the task queued or the affected decision blocked, and notify Discord.

## Status flow

Normal: `Draft → Awaiting approval → Approved/Assigned → In progress → Review → Complete`

Failover: `In progress → Blocked → Reassigned/In progress` when eligible, or `Blocked → Queued` when no suitable backup is available.

Keep the blocker and handover visible in GitHub through recovery and review.
