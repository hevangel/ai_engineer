# JSON content ownership and hard-coded-content audit

All editable public content and curation/configuration data live in JSON under `data/`. Presentation and scripts consume those files. This extends the existing UI JSON work; it keeps the latest info dialog, SVG badges, compact summaries, trace toggle and keyboard navigation.

| Data | Canonical source |
| --- | --- |
| Hardware names, summaries, history, dates, company colors, bus families and images | `data/catalog.json` |
| Shared wording, representative-photo warning, accessibility labels, page copy, source URL, metadata and load-error/no-script text | `data/ui.json` |
| Stage/build icons, labels and colors | `data/stages.json` (fallback status in `ui.json`) |
| Software-view computers, layers, categories, titles, links and issue references | `data/software.json` |
| Build/source/verification state | `data/status.json`, refreshed from GitHub |
| Component dependencies, optional profiles and CPU alternatives | `data/connections.json` and its curated input JSON files |
| Per-photo creator, license, source and modifications | `data/photo-credits.json` |
| Per-device photo queries, title patterns, exclusions, representative flags, fallbacks and attribution defaults | `data/image-import.json` |
| GitHub owner, project-state mapping and exported dependency/status metadata | `data/sync.json` |

The representative warning already used `info.representative` after the latest main merge. The remaining audit found literal page-shell wording and fixed 1959/1992 limits in HTML, a few runtime badge/link symbols and load-error messages, photo curation maps in the importer, exported metadata strings in sync scripts, and credits stored outside `data/`. These now read JSON; rail limits and the archive eyebrow derive from catalog dates.

## Static page generation

`templates/index.html` owns structural markup, stable DOM IDs, classes and links to local assets/data. Editorial values use escaped `{{path}}` placeholders resolved against `data/ui.json`. `node scripts/render-site.mjs` generates the tracked root `index.html`; `--check` and `check-site.mjs` reject a stale result. No package install or runtime build is needed to serve the checked-in page. Generation retains SEO metadata, introductory text, no-JavaScript links and load-error wording before any JSON fetch succeeds.

The browser uses `formatText` through `text(path, vars)` for runtime messages, with strict missing-key/variable checks and DOM text APIs. Never insert raw HTML from JSON. Generated HTML escapes both text and attribute values. Generated fallback attributes let the load-error handler work even when `ui.json` itself cannot load.

## Code boundary and checks

DOM IDs/classes, machine-readable enum/protocol identifiers, keyboard behavior, status-evidence validation policy, routing algorithms, pixel clearances, image limits, generic punctuation/decorative glyphs and technical diagnostics remain code. These are implementation rules, not device facts or editable editorial content. Test fixture names may identify real chips to verify their relationships.

Run `node scripts/render-site.mjs`, `node scripts/check-site.mjs`, `node scripts/sync-timeline.mjs --check`, and `node --test scripts/*.test.mjs`. Browser checks cover attribution expansion, SVG badges, info dialogs, filters, trace toggling, keyboard links and desktop/narrow layouts. No online photo import or GitHub status refresh is necessary for this content-source refactor.
