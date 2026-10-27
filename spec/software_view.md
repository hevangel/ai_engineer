# Software view

The masthead **Hardware / Software** switch (right of Timeline and Source, before the status guide) toggles between the hardware timeline and the software view; `#software` in the URL opens the latter. The software view is the plan for rewriting 42 historical software titles in Rust and proving them identical to the originals. It shows only computers, then the software built for each.

## Data

| File | Content |
| --- | --- |
| `data/software.json` | `layers`, `categories` (id, label, colour, SVG icon), `systems` and the 42 `entries` |
| `data/ui.json` (`software.*`) | All wording: tabs, search, counts, wire legend, help, info-dialog headings and the eight rewrite steps |
| `data/status.json` | Stage/build status for each `sw_*` id, synced from the `ai_sw_engineer` issues |
| `data/photo-credits.json` | Credits for software-only computer photos, keyed `software_system_<id>`, and for every title photo, keyed by the `sw_*` id |

Every computer in the view is a hardware-timeline system card: a `systems` entry names it with `catalog` and reuses that card's title, summary, photo, maker colour and info dialog. A computer needed by a title must therefore exist in `catalog.json` first, with its own system issue in `ai_engineer`, native chip prerequisites, status and photo credit. (`check-site` still accepts a system without `catalog` if it carries its own `color`, `summary`, photo and `software_system_<id>` credit, but none is used today.) Each software entry has `system`, `layer` (`os`, `driver`, `firmware`, `software`), `category`, `year`, `difficulty`, `sourceMaterial`, a one-line `summary` (100 characters or fewer), optional `sources`, `alsoOn`, `dependsOn` and `derivedFrom`, and its `issue` in `hevangel/ai_sw_engineer`. The Z-machine and Microsoft 6502 BASIC list their other machines in `alsoOn`; each title has exactly one home computer.

## Layout and links

- The left year rail (scrubber, 5-year markers, back-to-top) mirrors the hardware timeline and jumps between the year dividers; a divider with the year precedes the first computer of each year and the rail shows the divider nearest the top of the window (`assets/software-view.js`, `buildRail`, `goYear`, `updateYear`).
- One row per computer, ordered by year, then by the optional `month` (1-12) on its `systems` entry, then by title. Months are set only where computers share a year (Apple II June, TRS-80 August and Atari 2600 September 1977; Commodore 64 August and Atari 5200 November 1982); a computer without one sorts first within its year. The computer card is leftmost; its titles follow in columns **Firmware, Operating system, Drivers, Software** (`assets/software-layout.js`, `layoutRows`). The Drivers column appears only when a computer has a driver title.
- Inside a column titles sort by year; the Software column sorts by category (category order in `software.json`, then year).
- Categories mirror the `category:*` labels on the issues. A multi-select **computer** dropdown (left of the stage select; tick any number, none means all, with a Clear button) filters the rows. The tabs filter by category; search matches title, summary, computer, category, layer and source material; the stage select filters by status.
- `dependsOn` is a runtime prerequisite (OS before application) and is drawn solid; `derivedFrom` is lineage (predecessor, port or ancestor) and is drawn dashed. Both are drawn as orthogonal wires between hollow pads on the card edges (like the hardware cards), from the earlier title to the later one, routed through the gaps between cards (`assets/software-routing.js`). Clicking or focusing a card (hovering does nothing) dims everything except its transitive prerequisites and dependents (`chainIds`).
- `dependsOn` is mirrored by native GitHub blocked-by edges. The graph must stay acyclic (`check-site` runs `findCycle`).

## Cards and dialog

A software card shows its photo first (`image` on the entry: `src` under `images/software_*`, `alt`, `source` and an optional `caption`; `representative: true` marks a screenshot, box, medium or machine that stands in for the exact title), then the category icon and `layer · category` tag, title (linked to the issue), summary, year and difficulty, build and stage badges (same icons as hardware) and the issue number. The **i** button opens the shared dialog with facts, needs / required by / derived from / leads to (each a jump button), source links, the eight rewrite steps and the issue link. A catalog computer's **i** opens its hardware dialog; a software-only computer opens a dialog with its titles and photo credit.

Keyboard: Tab reaches each card; ←/`h` and →/`l` move along the row (including to the computer card), ↑/`k` and ↓/`j` move to the neighbouring computer row (`softwareDestination`).

## Issues

Each title has one `[Software] <title> — <computer>` issue in `ai_sw_engineer` labelled `software`, `layer:*`, `category:*` and `system:*`. The body carries the lifecycle that governs the work:

1. Download the original binary, ROM or disk image with provenance and license.
2. Run the original on **both** an independent open-source emulator and the project's Rust emulator; capture the oracle.
3. Download source code if it exists.
4. Download every document and clean each into Markdown.
5. Reverse engineer with REA (`ai_sw_engineer/external/rea`) and write the specification.
6. Rewrite in Rust.
7. Run the rewrite on both emulators: the original and the rewrite on each emulator make four combinations.
8. Loop until all four are identical, proven by test cases using timed, keyboard, mouse or other inputs.

Create the issue before adding a title: add the entry to `software.json` with its issue number, set native blocked-by edges for `dependsOn`, then run `node scripts/sync-timeline.mjs --software-only` to add its status without touching hardware statuses. The Path, Status and Agent project fields follow [github_issues.md](github_issues.md); they need project (GraphQL) access.

## Checks

`node scripts/check-site.mjs` validates references, layers, categories, icons, one-line summaries, photos and credits, the issue URL form, statuses, the eight steps and acyclicity. `node --test scripts/*.test.mjs` covers ordering, links, chains, cycles and keyboard moves. Inspect the view in a browser at desktop and narrow widths.

Title photos are Wikimedia Commons images with credits. Exception, accepted by the project owner: the Food Fight arcade screenshot is a non-free fair-use image hosted on English Wikipedia (the Super Breakout 2600 screenshot is tagged public domain there); both are credited in `photo-credits.json`, and the Food Fight license line records the fair-use status. Replace it with a licensed image if one becomes available.
