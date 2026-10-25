# Timeline utilities

All commands run from the repository root with Node.js 22 or newer. No packages are required.

| Command | Purpose |
| --- | --- |
| `node scripts/publish-pages.mjs --ref HEAD` | Preview the committed static snapshot; add `--publish` only for an authorized release to `gh-pages`. |
| `node scripts/serve.mjs` | Serve only the website files on `127.0.0.1:4173`; set `PORT` to choose another port. |
| `node scripts/sync-timeline.mjs` | Refresh status JSON from public GitHub issues using authenticated `gh`. |
| `node scripts/sync-timeline.mjs --project 1 --owner hevangel` | Also read the selected project's activity state; needs project access. |
| `node scripts/sync-connections.mjs` | Refresh native component gates, select exact CPU variants, derive qualified compatible alternatives, and merge curated planned chip/card options. |
| `node scripts/sync-timeline.mjs --check` | Validate the checked-in catalog/status snapshot without network access. |
| `node scripts/check-site.mjs` | Check local photo files, attribution, dated sources and catalog/status coverage. |
| `node --test scripts/bus-layout.test.mjs` | Check shared-bus membership, independent host lanes and under-row geometry. |
| `node --test scripts/status.test.mjs` | Verify stage, evidence and percentage rules. |
| `node scripts/fetch-images.mjs` | Import missing licensed Commons photos with attribution; inspect and curate results. |

See [the timeline specification](../spec/timeline.md) for the GitHub issue metadata format. The synchronization process never embeds a token in website files or calls GitHub from a visitor's browser. A failed refresh keeps the prior JSON snapshot. The site is not automatically deployed by any of these commands.

`data/component-profiles.json` selects a single catalog variant when one native prerequisite issue covers multiple public profiles (for example, Intel DX versus SX). It also qualifies later reconstruction components such as Am29xx for PDP-1. Each profile must match an existing native gate; missing/ambiguous profiles fail without replacing the prior connection snapshot. See [the timeline contract](../spec/timeline.md).

GitHub Pages serves [the public history](https://hevangel.github.io/ai_engineer/) from the generated `gh-pages` branch. See [publication instructions](../spec/website.md#github-pages-publication). Source pushes and JSON refresh commands do not publish automatically.

Run `node --test scripts/compatible-layout.test.mjs` when changing compatible processor grouping. Definitions and their package/source qualifications live in `data/compatible-chips.json`.

## Optional coprocessors

See [the 287/387 profiles](../spec/coprocessors_287_387.md) for canonical issues, sourced DX/SX history, machine options and dotted left-side chip links. Optional chip links do not enter expansion-card buses or add native completion blockers.
