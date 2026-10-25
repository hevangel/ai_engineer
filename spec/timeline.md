# Public hardware timeline

The root `index.html` is a buildless static site. It presents the canonical chip-family, computer-system and concrete expansion-card issues as a chronological archive. It does not publish the private board or arbitrary issue bodies. Browser requests are local static files only; GitHub credentials stay with the synchronization process.

## Files and preview

- `assets/timeline.css` and `assets/timeline.js`: presentation, filtering, year navigation, connection drawing and photo credits.
- `data/catalog.json`: hardware, issue references, company colors, historical dates/sources, era chapters, and image paths. Add new roadmap items here after curating their history and photo. A future-board placeholder without a named model has no fabricated introduction date.
- `data/status.json`: generated GitHub snapshot. Never hand-code build stages into HTML.
- `data/connections.json`: generated required chip/card prerequisites and separately labeled planned expansion configurations.
- `data/system-options.json`: curated optional chip/card-to-computer profiles, evidence and qualifications.
- `data/component-profiles.json`: explicit CPU variants for shared canonical issues and qualified later reconstruction components; each must match a native completion dependency.
- `data/stages.json`: public legend, labels, symbols and colors. Labels are rendered from this file.
- `images/`: local photographs and per-image Commons attribution in `credits.json`.
- `scripts/`: status synchronization, photo import, preview server and verification.

Run `node scripts/serve.mjs`, then open `http://127.0.0.1:4173`. A static HTTP server is required because browsers restrict JSON fetches from `file:` URLs. Deployment consists of `index.html`, `assets/`, `data/`, and `images/`; do not copy submodule checkouts, `.git`, scripts, scratch files or credentials into a public deployment directory.

Card descriptions may remain in the catalog as metadata, but the public cards do not render descriptive subtitles beneath their titles. Preserve dates, status badges and sourced photo qualifications.

## Status synchronization

Run `node scripts/sync-timeline.mjs --project 1 --owner hevangel` with an authenticated GitHub CLI. The optional project flag maps `In progress` to Building only when no explicit stage is supplied. Omitting it uses public issue metadata alone and does not require private-project access. The repository issue list is paginated; pull requests are ignored. Errors leave the previous status snapshot intact. Commit and review the resulting JSON when publishing an updated snapshot.

### Issue metadata

An issue can contain one fenced JSON block with language `timeline-status`:

~~~timeline-status
{
  "stage": "researching",
  "sources": { "collected": 8, "cleaned": 3, "total": 10 },
  "build": { "status": "unknown" }
}
~~~

The allowed stages are `planned`, `researching`, `sources_ready`, `building`, `ai_verified`, and `human_verified`. A single corresponding label such as `timeline:researching` may supply the stage instead. A label and a block must agree. Without either, the default is Planned, except for the explicitly mapped project state. Closing an issue, marking a project item Done, or checking an unrelated task list never supplies verification evidence or a data percentage.

Source coverage is `cleaned / total`, rounded to a percentage. The counts must satisfy `0 <= cleaned <= collected <= total`, with a positive total. Unknown counts display as an em dash. Sources Ready requires explicitly defined, 100% cleaned source coverage. The source inventory should link the actual requirements, datasheets, manuals, provenance, transcription and cleaning work in the issue; the count is not an invented fraction of all possible historical data.

For verified stages, add evidence:

~~~json
{
  "stage": "human_verified",
  "sources": { "collected": 10, "cleaned": 10, "total": 10 },
  "build": {
    "status": "passing",
    "evidence": "https://github.com/OWNER/REPO/actions/runs/RUN_ID"
  },
  "verification": {
    "ai": {
      "evidence": "https://github.com/OWNER/REPO/blob/COMMIT/report/final_report.md",
      "at": "2026-10-23T18:00:00Z"
    },
    "human": {
      "reviewer": "GITHUB_LOGIN",
      "evidence": "https://github.com/OWNER/REPO/pull/NUMBER#pullrequestreview-ID",
      "at": "2026-10-23T19:00:00Z"
    }
  }
}
~~~

These are schema examples, not evidence that any current device has passed. AI Verified requires an AI evidence URL and timestamp. Human Verified requires a reviewer, evidence URL and timestamp. Passing or failing build health requires its own evidence URL. The sync script validates presence and shape; the project manager remains responsible for checking that evidence is accurate, relevant, current, and actually supplied by the named reviewer. Never attach verification labels merely to change a website icon.

The public snapshot exports only stage, source counts, build evidence, verification records, issue state/URL, selected project state, and update timestamps. Do not put private information into this public metadata block.

## Historical and image curation

Era bands use 4-bit, 8-bit, 16-bit and 32-bit chapters, with explicit boundaries in the catalog. These are narrative periods, not a claim that every component in a chapter has that bus width. Historical architectures overlap. Source-qualified date bounds such as “Documented by” stay qualified. Items without an established date are listed in the research section rather than assigned a guessed year. The [historical date audit](timeline_dates.md) records the sourced placements for the former research queue and corrections to late manual-printing bounds. All current entries now have a supported year or qualified bound.

Optional `dateBasis` values are `introduced`, `documented`, `preview`, `reported` and `system`. `dateLabel` exposes the qualification beside the source link; `dateNote` appears in an expandable Date evidence section. `historySources` retains corroborating references. A system-profile anchor means those original parts existed by that host’s release; it does not date every later family member. Never equate a reprint date with launch. Keep original required chips no later than their computers, with chips above computers in a shared year. Optional later expansion cards can follow earlier hosts. The renderer sorts year groups numerically even if the catalog is accidentally out of order.

Company lines connect visible chip-family entries from the same maker. Route maker lineage through the right gutter and chip-to-computer dependencies through the left gutter and shared expansion buses outside the maker lanes on the far right, using straight horizontal/vertical segments and 45-degree chamfered bends. Each chip/maker connection exits a hollow bottom pad and enters the next card through a hollow top pad; keep traces clear of photographs and text. Allocate distinct horizontal tracks per row and reuse a vertical lane only when its spans do not overlap. Give separate chip fan-out/fan-in wires separate pads; independent chip/maker paths never share a segment. Expansion cards share a family rail and row runs as specified below. Preserve gutters and pad alignment across responsive layouts. The archive uses the available window width. Card columns are chosen from space remaining after wire gutters, chapter padding and column gaps; reduce from three columns to two or one before requiring horizontal scrolling. Narrow circuits may scroll when one readable card plus its wire gutters cannot fit. Selecting one computer reduces the wiring. Intel is blue and AMD red; other colors are brand-inspired. A platform owner may represent a mixed-vendor support family; the catalog must not imply it manufactured every physical component pictured.

Use `node scripts/fetch-images.mjs` to import licensed Commons photographs for catalog entries without one. The importer is a curation aid, not a visual identity oracle: inspect the actual photo and original source page, especially near-identical Mac models, card revisions and rare chips. Do not substitute an unrelated person, book, logo, controller or machine. Mark any representative family photo explicitly; its alt text names what is actually pictured. Keep the creator, source, individual license and modification information in `images/credits.json`. Images retain their original licenses.

## Verification

Run `node scripts/check-site.mjs`, `node --test scripts/status.test.mjs` and `node scripts/sync-timeline.mjs --check`. Inspect desktop and narrow layouts, filters, keyboard access, legend, photo attribution, year navigation and connection lines in a browser. Check every catalog image path and ensure each entry has a status record and attribution. Do not change live issue statuses merely to demonstrate colorful badges; use isolated test fixtures for status-rule checks.

## Computer connection data

Run `node scripts/sync-connections.mjs` with authenticated GitHub CLI access to refresh `data/connections.json`. The script fetches every catalog computer's native blocked-by relationships with `per_page=100` and pagination, maps catalog chip/card issue references to stable entry IDs, then merges the curated planned configurations from `data/system-options.json`. It reads relationships and does not create optional-card GitHub blockers. Errors preserve the previous snapshot.

Each link has `source` and `target` catalog IDs, `type` (`required` or `optional`), an `evidence` URL and a qualifying `note`. A native completion prerequisite is a recorded project gate, not a complete physical BOM or a claim that every member of a chip family is fitted. Planned options are candidate expansion configurations, not factory-installed parts, mutually simultaneous requirements, verified compatibility or base-machine POST gates. Add actual revision/firmware/driver evidence before qualification.

The page renders maker lineage on the right and chip-to-computer relationships on the left and shared card buses on the far right, using straight runs and 45-degree chamfers. Chip/maker wires use separate bottom/top pads; expansion cards use bottom pads and computers receive bus connections through top pads. It allocates individual row tracks and vertical lanes whose occupied spans cannot overlap. Each year groups chips first, expansion cards next and computer systems last, with computers always starting below the chip/card rows. Solid lines show maker lineage; dashed lines show recorded required components; dotted lines show planned chip/card options. The Show wires master toggle hides all connection layers and collapses their routing space; the layer controls can toggle either layer separately. The computer selector and each machine's trace button filter the archive to that computer and its linked parts. Other filters still apply, and connections disappear when either endpoint is hidden. All relationships stay in JSON, not hard-coded device wiring in HTML or browser code.

The stable catalog ID `system_pc_386sx` and #148 now select IBM PS/2 Model 25 SX, replacing the Compaq 386s SX target at the owner’s request. Model 35 SX, Model 70 386 and Model 56 SLC are separate sourced profiles. See [the IBM/AMD scope](ibm_386_amd_scope.md).

## Company colors

Keep company colors in `data/catalog.json`. User-selected colors are Intel blue, AMD red, Motorola indigo (`#4B3F8F`), Apple black (`#111111`, for contrast on the off-white page), MOS/Commodore green (`#2E8B57`), TI `#CC0000`, Nintendo `#E60012` and Atari `#E41B23`. Labels, card strokes and wires must use the same catalog values.

## Historical predecessors and reconstruction components

The [PDP-1 plan](pdp1_am29xx.md) adds a 1959 discrete-logic 18-bit prelude before the microprocessor chapters. Historical placement describes the original machine. An Am29xx-based rebuild is a later implementation: its component profile uses `basis: reconstruction`, a distinct left-wire pattern/title and a separate legend/count. Such a link may run toward an older machine; do not falsify the machine or chip year to force chronological wire direction. Original fitted components still precede their original hosts.

`sync-connections.mjs` groups all catalog entries sharing a canonical issue. When a blocked-by issue maps to multiple variants, `component-profiles.json` must select exactly one for that target. A missing or ambiguous selection fails the refresh and preserves the old snapshot. Every curated profile must be consumed by a matching native dependency; it cannot invent a GitHub blocker. This keeps Intel DX/SX and future vendor variants distinct while retaining one issue per coherent family. `basis: original` selects an original profile; `basis: reconstruction` explicitly identifies a later implementation part. Optional card profiles remain separate.

Photograph `caption` is optional. It is shown below the image and in attribution when present; a representative image must identify the hardware actually pictured. Native-status snapshots retain one record per stable catalog ID even when two entries share a canonical issue. The public page never embeds device states or dependency lists in HTML.


## Following wires

Paired maker, chip-prerequisite and reconstruction wires support navigation in both directions. Shared card-bus navigation is described below. Clicking the half nearest one card, or that card's hollow pad, follows the wire to the opposite card. The tooltip names the destination. Previous/next follows displayed card order, including same-year chips and the older PDP-1 reconstruction exception. Filters stay unchanged, so only visible connected entries are destinations.

Wire links are real fragment anchors to stable `hardware-<catalog-id>` card IDs. Tab reaches each wire half, Enter follows its named destination, and Arrow Up / Arrow Down jumps to the earlier / later endpoint in displayed order. Jumps focus and outline the destination card, keep it clear of the sticky toolbar and reveal it horizontally when necessary. Reduced-motion preferences disable smooth scrolling. Decorative SVG paths do not receive pointer input; narrow transparent stroke hit areas and hollow pads do, leaving card links and controls usable. Hiding wires removes the wire links, pads and help text from interaction.


## Shared expansion-card buses

Use **one far-right rail per bus family**, with unique endpoint taps and one horizontal run per family on a row. Expansion-card paths leave from the bottom and run below their complete row; computer paths arrive from above the row into top pads. Left-hand cards turn into the shared run without crossing a neighboring card. Family/endpoint choosers preserve the exact recorded card-to-computer relationships and qualifications. A shared family rail is a diagram summary, not an electrical connection between machines or universal compatibility. Read [expansion_buses.md](expansion_buses.md) for data grouping, geometry, navigation and checks.


## Compatible CPU alternatives

Read [compatible_chips.md](compatible_chips.md). `data/compatible-chips.json` defines source-qualified pin/function-compatible choices. The connection sync derives `type: compatible` links from each existing native primary-CPU gate without adding extra AMD blockers. Group members share one left-side CPU-role trunk and one host pad; colors on member taps still identify their makers. The chooser distinguishes the original CPU from a qualified alternative and exposes package/clock/source notes. Original dates and factory-BOM claims do not change. Filters and wire visibility apply to all choices.

## Optional coprocessors

See [the 287/387 profiles](coprocessors_287_387.md) for canonical issues, sourced DX/SX history, machine options and dotted left-side chip links. Optional chip links do not enter expansion-card buses or add native completion blockers.

## Grouped support chipsets

See [chipset cards](chipsets.md) for one-card member lists, canonical family issues, date/photo qualifications and exact-board dependency selection. The member list is data-driven and searchable; each chipset retains one status and one set of wire endpoints.

## Focused wire overview

The page starts with maker lineage only. Selecting a computer enables its component wires and hides maker lineage; returning to All computers restores the overview. **All computer links** explicitly restores the full diagram. Show wires remains the master. See [focused wire behavior](focused_wires.md).

## Window-fit layout

`assets/timeline-layout.js` computes minimum board widths including card minimums, actual gaps and chapter padding. Wire drawing starts with up to three columns, allocates lanes and reruns with fewer columns if the complete board would overflow; at most three passes, decreasing within a draw. The archive has no 1,440px cap. Keep `overflow-x: auto` for genuinely narrow diagrams; do not hide or clip off-screen wires. All paths, ports and under-row card stubs are recalculated after columns change. Empty results reserve no board width. Verify wide full-wire and focused views, threshold resizing, narrow screens and Show wires. Run `node --test scripts/timeline-layout.test.mjs` with the existing suite.
