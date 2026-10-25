# AI Agent Guidelines — AI Engineer

## Role

You are the sole author of all code, documentation, data and configuration in this repository. Humans never edit files by hand; they direct the work and review, approve or reject pull requests. Follow [CONTRIBUTING.md](CONTRIBUTING.md) for branches, verification and pull requests.

This repository is the public static website and integrated presentation for the `ai_*` projects and HDL Workbench. The three projects are independent Git repositories pinned as submodules; before editing one, read and follow its own `AGENTS.md`.

## Required reading

Read the specification that covers your task before changing anything:

| Task | Read |
| --- | --- |
| Any change: mission, repository map, submodule ownership and pins, public-content accuracy, branch workflow | [spec/repository.md](spec/repository.md) |
| Website pages, rendering, styles, data flow, status refresh, timeline content, checks and GitHub Pages publication | [spec/website.md](spec/website.md) |
| Page wording, labels, tooltips, help text, filter tabs, wire legend, stage/build badge icons and colors (all JSON-driven) | [spec/website.md](spec/website.md) (data table, rendering and navigation), `data/ui.json`, `data/stages.json` |
| Keyboard navigation (wires and selected cards), trace toggle and wire visibility | [spec/website.md](spec/website.md#following-wires), [spec/focused_wires.md](spec/focused_wires.md) |
| Timeline data contracts, issue-status schema, source coverage and photo curation | [spec/timeline.md](spec/timeline.md) |
| Intel 287/387 scope, optional coprocessor wires and DX/SX variants | [spec/coprocessors_287_387.md](spec/coprocessors_287_387.md) |
| Grouped motherboard chipsets and member-chip cards | [spec/chipsets.md](spec/chipsets.md) |
| Direct same-row maker links and short chip-to-computer row-gap links | [spec/maker_row_links.md](spec/maker_row_links.md), [spec/website.md](spec/website.md#direct-chip-links-between-consecutive-rows) |
| Historical dates and placement | [spec/timeline_dates.md](spec/timeline_dates.md) |
| GitHub issue lifecycle, read-only committed-progress audits, historical first-commit Start dates, owning-repo transfer, Status/Path, Agent register/clear, Scrum Sprint and chip sub-issues | [spec/github_issues.md](spec/github_issues.md) |
| Roadmap issues, dependencies and the GitHub Project | [spec/project_manager.md](spec/project_manager.md), [spec/initial_project_plan.md](spec/initial_project_plan.md) |
| HDL Workbench, Xezim and Surfer maintenance | [spec/eda_tools.md](spec/eda_tools.md) |
| 386/68030 coverage and complete-stack inventory | [spec/era_386_scope.md](spec/era_386_scope.md) |
| Command reference | [scripts/README.md](scripts/README.md) |

## Essential rules

- Work in a feature branch and merge through a reviewed pull request; never push directly to `main`.
- Keep the site static: no server runtime, credentials, analytics or visitor-tracking scripts.
- Keep statuses, connections, colors and percentages in the JSON data files, never hard-coded in HTML or presentation code. Verification requires inspected, linked evidence.
- Keep user-visible wording in JSON too. Labels, tooltips, dialog and help text, counts, filter tabs, the wire legend and the status-guide footnote live in `data/ui.json` and are read with `text('<path>')` in `assets/timeline.js`; stage and build icons (SVG shape lists) and colors live in `data/stages.json`. Add new wording or icons there, never inline in `timeline.js` or `index.html`. Build SVG with DOM calls from the shape allowlist, never by inserting markup strings. All editable facts, wording and curation/configuration data must come from JSON under `data/`. `index.html` is generated from the structural `templates/index.html` and `data/ui.json` by `node scripts/render-site.mjs`; edit the JSON/template and regenerate, never hand-edit its text. The generated HTML also carries no-JavaScript and load-error wording so those work if JSON loading fails. Photo attribution is `data/photo-credits.json`; photo-search curation is `data/image-import.json`; sync metadata is `data/sync.json`. Layout measurements, DOM identifiers, protocol/state identifiers and technical diagnostics remain code. See [spec/content_data.md](spec/content_data.md).
- Wires are always drawn; there is no master Show wires switch. The Maker lineage and All computer links toggles choose the layers. Keep keyboard navigation working: Tab and Enter on wires; ←/`h`, →/`l`, ↑/`k`, ↓/`j` on wires and on a selected card; and the per-computer trace button stays a toggle.
- Do not update submodule pins as routine cleanup, and do not copy submodule content into the root.
- Report exactly which checks you ran. Do not claim a check passed unless it did. For page changes run `node scripts/check-site.mjs` (it also verifies every `text('…')` key and icon shape), `node scripts/sync-timeline.mjs --check` and `node --test scripts/*.test.mjs`, then inspect the page in a browser at desktop and narrow widths.
- Do not publish or deploy the site unless explicitly asked. When asked, run the `publish-pages.mjs` dry run, then `--publish`, and confirm the public URL serves the new files before reporting it live ([spec/website.md](spec/website.md#github-pages-publication)).

The qualification issue registry is `data/option-issues.json`. For compatible CPU and optional chip/card tracking, follow the native-edge rules in [project_manager.md](spec/project_manager.md#optional-configuration-and-cpu-alternative-tracking) and run `node scripts/sync-option-issues.mjs` to check live blockers/project membership; `--apply` mutates GitHub and requires task authorization.
