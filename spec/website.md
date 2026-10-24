# Static website maintenance

Read [timeline.md](timeline.md) for the data contracts and [scripts/README.md](../scripts/README.md) for command details before changing the site.

## Static-site requirements

- Keep the public site buildable as static files. Do not add a server runtime, private credentials, or secret configuration to deliver public content.
- Inspect the existing site files and documented commands before choosing or changing a framework. Prefer the smallest approach that fits the established project.
- Make pages semantic, keyboard accessible, responsive, and understandable without relying on client-side code for essential content.
- Do not add analytics, tracking, or external scripts that disclose visitor data unless explicitly requested.
- Keep generated output out of source control unless the repository's chosen publishing workflow requires it.
- Build site content from tracked files and the pinned submodule revisions so a checkout can reproduce the same presentation.

## Architecture and data flow

The site is plain HTML, CSS and browser JavaScript, with no package installation or build step. `index.html` supplies the semantic page shell and controls; `assets/timeline.css` supplies the responsive layout; `assets/timeline.js` fetches the following tracked JSON files and renders the archive in the browser:

| File | Responsibility |
| --- | --- |
| `data/catalog.json` | Curated chip families, systems and cards; stable entry IDs, canonical issue references, company colors, dated sources, era chapters and local image paths |
| `data/status.json` | Generated snapshot of public issue metadata and optionally selected GitHub Project states |
| `data/connections.json` | Generated chip/card-to-computer links from native GitHub prerequisites and curated options |
| `data/component-profiles.json` | Explicit device variants for shared canonical issues and later reconstruction components; consumed during connection sync |
| `data/system-options.json` | Curated planned expansion-card configurations, separate from required hardware |
| `data/stages.json` | Stage/build labels, icons, colors and legend explanations |
| `images/credits.json` | Attribution, source, license and representative-image information keyed by catalog entry ID |

The flow is: GitHub issues/project -> local synchronization script -> reviewed `data/status.json` -> browser-rendered badges. Visitors read static files; their browsers do not call GitHub or receive authentication credentials. The checked-in snapshot is intentionally tracked public website content. Synchronization and publication are separate operations. GitHub Pages deploys when the `gh-pages` publishing branch changes; source-branch pushes do not release the site or refresh GitHub snapshots automatically.

This page presents the roadmap and evidence snapshot. Actual SV simulation, HDL editing and system implementations belong to their owning repositories and are not executed by the timeline page.

## Rendering and navigation

- Group entries into the catalog's 18-bit historical prelude and 4-bit, 8-bit, 16-bit and 32-bit era chapters, then by year. Maintain chronological order in the catalog; within a year render separate chip, expansion-card and computer sections in that order, so chips are physically above computers. Eras overlap historically and do not assert the word width of every pictured component.
- Keep uncertain dates qualified with their sources. Read [timeline_dates.md](timeline_dates.md) before changing historical placement. `dateBasis` identifies an introduction, documented bound, preview, reported introduction or original system profile; `dateNote` supplies the expandable public qualification. A later manual printing is not a chip introduction date. For mixed families, anchor the earliest supported profile and identify later members explicitly. Use `year: null` and the `undated` era only when a supported date or bound has not been established. Check required chip-to-computer chronology; chips must precede their original hosts, with chips rendered above computers when years match. Later optional cards may legitimately follow an older host.
- The left year rail scrolls to visible year groups and follows the page position. Preserve keyboard operation and sufficient scroll clearance beneath sticky controls on narrow screens.
- Search, category, company and stage filters operate on the loaded JSON. SVG lines connect visible chip-family entries from the same company and connect chips/cards to computers using `data/connections.json`; redraw after filters or layout changes. Route maker lineage through the right gutter and chip-to-computer dependencies through the left gutter and shared expansion buses outside the maker lanes on the far right, using straight horizontal/vertical segments and 45-degree chamfered bends. Each chip/maker connection exits a hollow bottom pad and enters the next card through a hollow top pad; keep traces clear of photographs and text. Allocate distinct horizontal tracks per row and reuse a vertical lane only when its spans do not overlap. Give separate chip fan-out/fan-in wires separate pads; independent chip/maker paths never share a segment. Expansion cards intentionally share a per-computer bus trunk as specified below. Preserve gutters and pad alignment across responsive layouts. Wide all-system circuits may scroll horizontally within the diagram; selecting one computer reduces the wiring.
- The Show wires master toggle hides all traces and pads and collapses their routing space. The connection controls also independently toggle maker and computer links. Solid traces mean maker lineage, dashed traces mean recorded required components and dotted traces mean planned card options. The computer selector and per-computer trace button isolate a machine and its linked hardware. Draw a link only when both endpoints are visible. Never treat a planned card option as a factory-installed part or a POST prerequisite.
- Render the stage, source-coverage and build-health badges at the lower right of each photograph. Populate the status guide from `data/stages.json`; never hard-code per-device statuses or percentages into HTML or presentation code.
- Preserve per-photo attribution dialogs, descriptive alt text, reduced-motion behavior, visible keyboard focus, empty results, loading/error messages and the no-JavaScript links to the JSON files. Use text DOM APIs for external content rather than inserting untrusted HTML.

## Company colors

Keep company colors in `data/catalog.json`. User-selected colors are Intel blue, AMD red, Motorola indigo (`#4B3F8F`), Apple black (`#111111`, for contrast on the off-white page), MOS/Commodore green (`#2E8B57`), TI `#CC0000`, Nintendo `#E60012` and Atari `#E41B23`. Maintain other brand-inspired colors in the catalog. Labels, card strokes and wires must use the same catalog values.

## Local preview

Run commands from the repository root with Node.js 22 or newer:

```sh
node scripts/serve.mjs
```

Open `http://127.0.0.1:4173`. The loopback server is a development utility; the published page needs only ordinary static HTTP hosting. Opening `index.html` through `file:` does not reliably permit JSON fetches. The preview server serves only the website paths and excludes `.git` and submodule checkouts.

## Refreshing GitHub status

```sh
node scripts/sync-timeline.mjs --project 1 --owner hevangel
node scripts/sync-connections.mjs
```

Use authenticated `gh` with repository issue access and the `project` scope for the selected project. Omit the project arguments to read public issues alone. Review the generated `data/status.json` before committing it; a failed refresh preserves the previous snapshot. Keep the project itself private according to its existing settings. `sync-connections.mjs` paginates native blocked-by lists for catalog computers and exports only catalog chip/card endpoints, then merges `data/system-options.json`. A failed refresh preserves the previous connection snapshot. Curate optional profiles with evidence and clear qualifications; they do not create GitHub blockers.

- Read an issue's single fenced `timeline-status` JSON block and/or its matching `timeline:<stage>` label. Follow the schema and examples in [timeline.md](timeline.md).
- An explicit issue stage takes precedence; otherwise project `In progress` maps to Building and the default is Planned. Todo is pending acceptance review, not proof that no implementation exists. Closed/Done never establishes verification.
- Source coverage is rounded `cleaned / total`, with `0 <= cleaned <= collected <= total` and positive total. Unknown counts remain unknown. Sources Ready requires every defined item cleaned, even if an incomplete fraction rounds to 100%.
- AI verification needs linked evidence and a timestamp; human verification also needs a named reviewer. Passing/failing build health requires its own evidence link. Agents must inspect the evidence rather than treating syntactically valid metadata as proof of correctness.
- Export only the public metadata allowlist. Never export full issue bodies, arbitrary verification fields, tokens or private project content.

## Adding or updating timeline content

1. Follow the [project manager instructions](project_manager.md) to identify or create the canonical issue and its dependencies. Creating an issue does not automatically add a timeline entry.
2. Curate its `data/catalog.json` entry with a unique, stable ID, correct kind/company, historical source, qualified year/era and canonical issue reference. Keep the ID aligned across catalog, status snapshot and photo credits.
3. Put the licensed photograph in `images/` and record its individual attribution in `images/credits.json`. The photo importer is a curation aid: inspect the actual model/revision and source license. Explicitly flag representative photos and describe what is actually pictured; do not substitute unrelated hardware.
4. Refresh the status and connection snapshots so the new ID receives a status record and recorded relationships. Do not invent verification or source percentages to make badges look complete.
5. Keep this guide, the timeline specification and script documentation aligned when file contracts or commands change. Changing the stage vocabulary also requires updating the synchronization rules and their verification fixtures.

## Checks and publication

For requested implementation verification, the available offline checks are:

```sh
node scripts/check-site.mjs
node scripts/sync-timeline.mjs --check
node --test scripts/status.test.mjs
```

The checks cover catalog/status consistency, local photo files and attribution, and status/evidence rules. For UI verification, inspect desktop and narrow layouts, filters, year navigation, company lines, keyboard controls, badges and photo credits. Report exactly which checks were run; documentation-only edits do not require running implementation tests.

When publication is explicitly authorized, publish only `index.html`, `assets/`, `data/` and `images/`. Preserve relative paths and photo licensing information. Exclude `.git`, submodule checkouts, `scripts/`, scratch files and credentials. Committing/pushing a feature branch does not itself establish that the website is deployed.


## GitHub Pages publication

The public URL is **https://hevangel.github.io/ai_engineer/**. GitHub Pages uses **Deploy from a branch**, `gh-pages`, root (`/`), with HTTPS enforced. This is a project site; keep asset and JSON URLs relative so they work below `/ai_engineer/`.

Only an explicitly authorized release publishes the site. After committing/pushing the intended source revision and running the documented checks:

```sh
node scripts/publish-pages.mjs --ref HEAD
node scripts/publish-pages.mjs --ref HEAD --publish
```

Without `--publish`, the script only inspects the committed snapshot. It exports `index.html`, `assets/`, `data/` and `images/`, and adds an empty `.nojekyll` marker. It rejects symlinks and gitlinks, publishes no uncommitted files, and does not check out a branch or modify the index, source checkout or submodule pins. The publishing commit records the source commit; later releases preserve the previous publishing commit as parent and use a normal fast-forward push. A simultaneous publisher can cause a rejected push; inspect and rerun rather than force-push.

`gh-pages` is generated deployment output, not an implementation branch. Source work still uses a reviewed pull request; an owner-authorized release can select a specific feature-branch commit without merging it into `main`. Do not edit publishing output by hand. Keep `.git`, project checkouts, documentation, scripts, local scratch files and credentials out of the hosted tree.

For initial setup, create `gh-pages` with the publisher, then configure the repository Pages source to that branch/root. GitHub automatically performs the Pages deployment on publishing-branch pushes. Inspect `gh api repos/hevangel/ai_engineer/pages` and the latest Pages build/Actions run. Confirm the build commit matches the publishing commit, then verify the public HTML, JSON and representative photographs load below the project URL. A pushed commit or queued build alone does not confirm a live release.

Official references: [publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Pages REST API](https://docs.github.com/en/rest/pages/pages).


## Following wires

Paired maker, chip-prerequisite and reconstruction wires support navigation in both directions. Shared card-bus navigation is described below. Clicking the half nearest one card, or that card's hollow pad, follows the wire to the opposite card. The tooltip names the destination. Previous/next follows displayed card order, including same-year chips and the older PDP-1 reconstruction exception. Filters stay unchanged, so only visible connected entries are destinations.

Wire links are real fragment anchors to stable `hardware-<catalog-id>` card IDs. Tab reaches each wire half, Enter follows its named destination, and Arrow Up / Arrow Down jumps to the earlier / later endpoint in displayed order. Jumps focus and outline the destination card, keep it clear of the sticky toolbar and reveal it horizontally when necessary. Reduced-motion preferences disable smooth scrolling. Decorative SVG paths do not receive pointer input; narrow transparent stroke hit areas and hollow pads do, leaving card links and controls usable. Hiding wires removes the wire links, pads and help text from interaction.


## Shared expansion-card buses

`catalog.buses` supplies bus labels/colors, and every expansion-card entry has a `bus` family ID. The existing card-to-system links in `data/connections.json` remain the authoritative membership and retain their evidence and required/optional distinctions. Rendering groups visible card links by **computer plus bus family**; it never joins independent computers or adds a compatible-looking card without a recorded link.

Card links no longer use individual left-side paths. One shared vertical bus trunk sits on the far right, beyond all company lines, with a single system tap and taps for its cards. A hollow dot on each card/computer's right edge leaves horizontally. A rightmost card joins directly. When another card occupies the same row to its right, the stub turns in the column gap and runs below the complete row before joining the bus. Reserve distinct under-row tracks, with rightmost inner-card stubs above leftmost ones and vertically ordered ports, so stubs do not overlap each other or pass through cards. Filled trunk junction dots identify actual joins; crossings with unrelated nets are not junctions. Disjoint row spans can reuse bus lanes; overlapping trunks cannot.

Bus colors and short labels are separate from manufacturer lineage. Required card taps stay dashed, planned options dotted, and the shared trunk solid. Grouping is a diagram of recorded configurations, not proof of simultaneous card fit or verified compatibility. The computer-link toggle controls chip links and buses; Show wires removes all buses, stubs, dots and navigation targets.

Click a card's bus tap to jump to its computer. Click the bus trunk or the system tap to open the accessible connected-member chooser; each entry names the computer, required card or planned option and jumps to that card. Existing chip/maker wire navigation remains bidirectional. The bus chooser supports keyboard activation, Escape/close and destination focus. Layout and membership are recomputed after filters and viewport changes.

Pure grouping, row-interval lane allocation and under-row geometry live in `assets/bus-layout.js`; run `node --test scripts/bus-layout.test.mjs` alongside the existing checks when changing bus routing.


## Compatible CPU alternatives

Read [compatible_chips.md](compatible_chips.md). `data/compatible-chips.json` defines source-qualified pin/function-compatible choices. The connection sync derives `type: compatible` links from each existing native primary-CPU gate without adding extra AMD blockers. Group members share one left-side CPU-role trunk and one host pad; colors on member taps still identify their makers. The chooser distinguishes the original CPU from a qualified alternative and exposes package/clock/source notes. Original dates and factory-BOM claims do not change. Filters and wire visibility apply to all choices.
