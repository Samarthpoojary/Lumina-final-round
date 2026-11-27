# Round 4 — The Final Boss

## Canonical source

This summary follows the shared LUMINA project context in [`Samarthpoojary/Lumina/docs/PROJECT_CONTEXT.md`](https://github.com/Samarthpoojary/Lumina/blob/main/docs/PROJECT_CONTEXT.md). That document is the source of truth for product context. This dedicated repository must stay limited to Round 4.

## Approved first playable scope

Round 4 is **The Final Boss**. The first playable version is a four-LED sequential Diya chaser on a pre-wired virtual breadboard. The player configures pins only; component placement and manual wiring are not part of this scope.

The fixed reference circuit has four distinct paths:
- D2 → 220 Ω resistor → LED 1 → shared GND
- D3 → 220 Ω resistor → LED 2 → shared GND
- D4 → 220 Ω resistor → LED 3 → shared GND
- D5 → 220 Ω resistor → LED 4 → shared GND

Each LED is correctly oriented. The breadboard display shows five connected holes per row segment, a center gap, and one shared GND rail. Crossed paths connect only where a visible junction is shown. The player assigns D2–D5 once each to the matching fixed LED path; duplicate, missing, or mismatched assignments are rejected. A valid setup runs the simulated D2 → D3 → D4 → D5 sequence repeatedly. No code entry is required.

The target is desktop browsers. The circuit/configuration validator is simplified and must not be described as electrical simulation or a hardware connection.

Scoring, timers, hints, accounts, saved results, and a backend are deferred. Do not add them without an approved task and product decision.

## Existing prototype and limitations

The existing `lumina-final-boss.html` prototype lives in the main LUMINA repository and is **reference-only**. It is a monolithic HTML/CSS/JavaScript page with simplified graph checking and simulated output, not an electrical solver or hardware connection. Its demo score/localStorage behavior is not part of the approved first playable scope here.

## Approved repository relationship

The user approved this repository as the standalone home for Round 4. The main LUMINA repository remains the canonical source for shared project context, and its Final Boss prototype is reference-only. Do not edit the earlier-round repository as part of Round 4 work. Any selected prototype parts may be ported selectively into this repository later through reviewed pull requests.

The first playable app foundation, fixed board, pin validator, and repeating sequence have been implemented in this repository and merged through reviewed pull requests. Future work remains issue-scoped. Claude must review major architecture and simulation changes; user-approved rules govern product and gameplay decisions. Do not invent scoring, electrical behavior, security rules, or architecture decisions where the canonical context is silent.

## Authority

Major architecture, security, database, and critical gameplay decisions require Claude's technical authority or explicit user-approved rules. Record unresolved questions in GitHub and keep dependent work unassigned.
