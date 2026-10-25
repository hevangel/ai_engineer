# Timeline utilities

All commands run from the repository root with Node.js 22 or newer. No packages are required.

| Command | Purpose |
| --- | --- |
| `node scripts/render-site.mjs` | Generate the static HTML shell from `templates/index.html` and `data/ui.json`; `--check` detects a stale page. |
| `node scripts/publish-pages.mjs --ref HEAD` | Preview the committed static snapshot; add `--publish` only for an authorized release to `gh-pages`. |
| `node scripts/serve.mjs` | Serve only the website files on `127.0.0.1:4173`; set `PORT` to choose another port. |
| `node scripts/sync-timeline.mjs` | Refresh status JSON from public GitHub issues using authenticated `gh`. |
| `node scripts/sync-timeline.mjs --project 1 --owner hevangel` | Also read the selected project's activity state; needs project access. |
| `node scripts/sync-connections.mjs` | Refresh native component gates, select exact CPU variants, derive qualified compatible alternatives, and merge curated planned chip/card options. |
| `node scripts/sync-timeline.mjs --check` | Validate the checked-in catalog/status snapshot without network access. |
| `node scripts/check-site.mjs` | Check local photo files, attribution, dated sources, catalog/status coverage and that every `text('…')` key used by `assets/timeline.js` exists in `data/ui.json`. |
| `node --test scripts/bus-layout.test.mjs` | Check bus-family rails, exact host membership, shared row runs and bottom/top tap geometry. |
| `node --test scripts/card-navigation.test.mjs` | Check selected-card keyboard navigation along the maker family line and between chips and computers. |
| `node --test scripts/status.test.mjs` | Verify stage, evidence and percentage rules. |
| `node scripts/fetch-images.mjs` | Import missing licensed Commons photos with attribution; inspect and curate results. |

See [the timeline specification](../spec/timeline.md) for the GitHub issue metadata format. The synchronization process never embeds a token in website files or calls GitHub from a visitor's browser. A failed refresh keeps the prior JSON snapshot. The site is not automatically deployed by any of these commands.

`data/component-profiles.json` selects a single catalog variant when one native prerequisite issue covers multiple public profiles (for example, Intel DX versus SX). It also qualifies later reconstruction components such as Am29xx for PDP-1. Each profile must match an existing native gate; missing/ambiguous profiles fail without replacing the prior connection snapshot. See [the timeline contract](../spec/timeline.md).

GitHub Pages serves [the public history](https://hevangel.github.io/ai_engineer/) from the generated `gh-pages` branch. See [publication instructions](../spec/website.md#github-pages-publication). Source pushes and JSON refresh commands do not publish automatically.

Run `node --test scripts/compatible-layout.test.mjs` when changing compatible processor grouping. Definitions and their package/source qualifications live in `data/compatible-chips.json`.

## Optional coprocessors

See [the 287/387 profiles](../spec/coprocessors_287_387.md) for canonical issues, sourced DX/SX history, machine options and dotted left-side chip links. Optional chip links do not enter expansion-card buses or add native completion blockers.

## Content sources

All editable website data and copy belong under `data/`. `ui.json` supplies runtime wording and the generated HTML shell; `photo-credits.json` supplies per-image licensing; `image-import.json` supplies photo-search curation; `sync.json` supplies exported metadata and GitHub project-stage mapping. `check-site.mjs` validates these and compares the generated shell. The image importer reads the JSON rules and writes credits back to `data/photo-credits.json`; do not restore per-device lookup tables in JavaScript. See [the audit and maintenance contract](../spec/content_data.md).

## Qualification issue synchronization

`node scripts/sync-option-issues.mjs` checks the live GitHub issue blockers and project membership for all compatible CPU profiles and optional chip/card configurations. It is read-only by default and exits nonzero on missing trackers, missing blockers, missing project items or stale registry records. `--apply` creates missing qualification issues and blockers and adds them to project 1, initially Planned. It records public issue references in `data/option-issues.json`; repeat runs preserve previously recorded project statuses. It does not edit canonical hardware-family issues or reverse base-system dependencies.

`node scripts/check-github-issues.mjs` reads `data/github-issues.json` and checks native family/member hierarchy, unique chip issue ownership, required project fields and valid statuses/agents, Workstream assignments, and all recorded Docker EDA blockers against live GitHub. It is read-only. It complements the optional-configuration checker; neither infers that an assigned agent is still active without task evidence. Follow [issue operations](../spec/github_issues.md).


The GitHub hierarchy checker uses repository-qualified issue keys after transfers and checks active Status, `<repo>/<path>` Path and the preserved first Start date. The live EDA baseline evidence and remaining review scope are in [the tooling plan](../spec/eda_tools.md). `node --test scripts/issue-refs.test.mjs` covers number collisions across repositories and active lifecycle fields.
