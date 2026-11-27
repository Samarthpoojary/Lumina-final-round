# Round 4 — The Final Boss

## Canonical source

This summary follows the shared LUMINA project context in [`Samarthpoojary/Lumina/docs/PROJECT_CONTEXT.md`](https://github.com/Samarthpoojary/Lumina/blob/main/docs/PROJECT_CONTEXT.md). That document is the source of truth for product context. This dedicated repository must stay limited to Round 4.

## Approved Round 4 concept

Round 4 is **The Final Boss**, a free-build virtual breadboard circuit challenge. The player builds a four-LED sequential Diya chaser using an Arduino-style microcontroller module.

The current prototype target path is four outputs:
- Arduino digital pin D2, D3, D4, or D5
- A distinct 220 Ω resistor for that output
- One LED
- Ground (GND)

All four paths are required. The current prototype needs no code entry; its virtual microcontroller runs the Diya chaser firmware. Players can place components freely and connect pins.

## Existing prototype and limitations

The current prototype lives in `lumina-final-boss.html` in the main LUMINA repository. It is an HTML/CSS/JavaScript browser page with inline styling and simulation logic. The circuit checker validates simplified graph connectivity; it is not an electrical solver or physical hardware connection. On success, the main prototype records a demo score and result in browser `localStorage`. The current product context describes the app as a one-browser prototype without a shared backend or authoritative cross-device scoring.

## Unresolved repository decision

The relationship between the existing prototype and this repository is not yet approved. Decide whether to reuse or extract the existing prototype, or build separately, before implementation is assigned. Preserve the existing LUMINA context and keep Rounds 1–3 out of scope. Do not invent scoring, electrical behavior, security rules, or architecture decisions where the canonical context is silent.

## Authority

Major architecture, security, database, and critical gameplay decisions require Claude's technical authority or explicit user-approved rules. Record unresolved questions in GitHub and keep dependent work unassigned.
