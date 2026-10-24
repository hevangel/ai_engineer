# AI Agent Guidelines — AI Engineer

## Mission

This repository is the public-facing static website and integrated presentation for the AI engineering projects. It is the superset of the `ai_*` projects and HDL Workbench: visitors should be able to understand the work as one connected effort across hardware, software, and HDL tooling.

The website and its shared presentation belong at this repository root. The three projects remain independent Git repositories, pinned as submodules. Their code, detailed project documentation, engineering history, and reports remain owned by their respective repositories.

## Repository map

| Path | Responsibility |
| --- | --- |
| `README.md` | Human overview of the combined project and source checkout instructions |
| `AGENTS.md` | These instructions for work in the umbrella repository |
| `index.html` | Static timeline page shell and navigation |
| `assets/` | Browser rendering code and responsive styles |
| `data/` | Curated timeline catalog, stage vocabulary and generated GitHub status snapshot |
| `images/` | Local photographs and their attribution records |
| `scripts/` | Local preview, GitHub status synchronization, photo import and offline checks |
| `ai_hw_engineer/` | Hardware designs, RTL, verification, and virtual systems |
| `ai_sw_engineer/` | Software reimplementations, Rust, LLVM backends, and target systems |
| `hdl-workbench/` | Browser-based HDL workbench and its implementation |
| `spec/` | Cross-project roadmap, project manager instructions and dependency inventory |
| `.gitmodules` | Canonical submodule URLs; the root Git tree pins each submodule commit |

## Scope and ownership

- Use the root repository for the public site's shared pages, navigation, visual identity, cross-project explanations, and static-site build or deployment configuration.
- Keep project-specific implementation and documentation in the owning submodule. Before editing a submodule, read and follow its `AGENTS.md` and other local instructions.
- Do not flatten, replace, or copy an entire submodule into the root. Link to project sources or incorporate specific material only when its license permits.
- Treat submodule commit pointers as the versions represented by the site. Do not update them to remote heads as routine cleanup; update them intentionally and review the source changes represented by the new pins.
- A project-specific change and a root site change may need separate Git commits because each submodule has its own history. Keep the root's pin aligned with the reviewed project revision.

## Static-site requirements

- Keep the public site buildable as static files. Do not add a server runtime, private credentials, or secret configuration to deliver public content.
- Inspect the existing site files and documented commands before choosing or changing a framework. Prefer the smallest approach that fits the established project.
- Make pages semantic, keyboard accessible, responsive, and understandable without relying on client-side code for essential content.
- Do not add analytics, tracking, or external scripts that disclose visitor data unless explicitly requested.
- Keep generated output out of source control unless the repository's chosen publishing workflow requires it.
- Build site content from tracked files and the pinned submodule revisions so a checkout can reproduce the same presentation.

## How the static website works

Read [spec/timeline.md](spec/timeline.md) for the data contracts and [scripts/README.md](scripts/README.md) for command details before changing the site.

### Architecture and data flow

The site is plain HTML, CSS and browser JavaScript, with no package installation or build step. `index.html` supplies the semantic page shell and controls; `assets/timeline.css` supplies the responsive layout; `assets/timeline.js` fetches the following tracked JSON files and renders the archive in the browser:

| File | Responsibility |
| --- | --- |
| `data/catalog.json` | Curated chip families, systems and cards; stable entry IDs, canonical issue references, company colors, dated sources, era chapters and local image paths |
| `data/status.json` | Generated snapshot of public issue metadata and optionally selected GitHub Project states |
| `data/stages.json` | Stage/build labels, icons, colors and legend explanations |
| `images/credits.json` | Attribution, source, license and representative-image information keyed by catalog entry ID |

The flow is: GitHub issues/project -> local synchronization script -> reviewed `data/status.json` -> browser-rendered badges. Visitors read static files; their browsers do not call GitHub or receive authentication credentials. The checked-in snapshot is intentionally tracked public website content. Synchronization and publication are separate operations; there is no automatic refresh or deployment workflow currently configured.

This page presents the roadmap and evidence snapshot. Actual SV simulation, HDL editing and system implementations belong to their owning repositories and are not executed by the timeline page.

### Rendering and navigation

- Group entries into the catalog's 4-bit, 8-bit, 16-bit and 32-bit era chapters, then by year. Maintain chronological order in the catalog. Eras overlap historically and do not assert the word width of every pictured component.
- Keep uncertain dates qualified with their sources. Use `year: null` and the `undated` era when a date has not been established.
- The left year rail scrolls to visible year groups and follows the page position. Preserve keyboard operation and sufficient scroll clearance beneath sticky controls on narrow screens.
- Search, category, company and stage filters operate on the loaded JSON. SVG lines connect visible chip-family entries from the same company and redraw after filters or layout changes. Intel is blue and AMD red; maintain other brand-inspired colors in the catalog.
- Render the stage, source-coverage and build-health badges at the lower right of each photograph. Populate the status guide from `data/stages.json`; never hard-code per-device statuses or percentages into HTML or presentation code.
- Preserve per-photo attribution dialogs, descriptive alt text, reduced-motion behavior, visible keyboard focus, empty results, loading/error messages and the no-JavaScript links to the JSON files. Use text DOM APIs for external content rather than inserting untrusted HTML.

### Local preview

Run commands from the repository root with Node.js 22 or newer:

```sh
node scripts/serve.mjs
```

Open `http://127.0.0.1:4173`. The loopback server is a development utility; the published page needs only ordinary static HTTP hosting. Opening `index.html` through `file:` does not reliably permit JSON fetches. The preview server serves only the website paths and excludes `.git` and submodule checkouts.

### Refreshing GitHub status

```sh
node scripts/sync-timeline.mjs --project 1 --owner hevangel
```

Use authenticated `gh` with repository issue access and the `project` scope for the selected project. Omit the project arguments to read public issues alone. Review the generated `data/status.json` before committing it; a failed refresh preserves the previous snapshot. Keep the project itself private according to its existing settings.

- Read an issue's single fenced `timeline-status` JSON block and/or its matching `timeline:<stage>` label. Follow the schema and examples in `spec/timeline.md`.
- An explicit issue stage takes precedence; otherwise project `In progress` maps to Building and the default is Planned. Todo is pending acceptance review, not proof that no implementation exists. Closed/Done never establishes verification.
- Source coverage is rounded `cleaned / total`, with `0 <= cleaned <= collected <= total` and positive total. Unknown counts remain unknown. Sources Ready requires every defined item cleaned, even if an incomplete fraction rounds to 100%.
- AI verification needs linked evidence and a timestamp; human verification also needs a named reviewer. Passing/failing build health requires its own evidence link. Agents must inspect the evidence rather than treating syntactically valid metadata as proof of correctness.
- Export only the public metadata allowlist. Never export full issue bodies, arbitrary verification fields, tokens or private project content.

### Adding or updating timeline content

1. Follow the project manager instructions to identify or create the canonical issue and its dependencies. Creating an issue does not automatically add a timeline entry.
2. Curate its `data/catalog.json` entry with a unique, stable ID, correct kind/company, historical source, qualified year/era and canonical issue reference. Keep the ID aligned across catalog, status snapshot and photo credits.
3. Put the licensed photograph in `images/` and record its individual attribution in `images/credits.json`. The photo importer is a curation aid: inspect the actual model/revision and source license. Explicitly flag representative photos and describe what is actually pictured; do not substitute unrelated hardware.
4. Refresh the status snapshot so the new ID receives a record. Do not invent verification or source percentages to make badges look complete.
5. Keep this guide, the timeline specification and script documentation aligned when file contracts or commands change. Changing the stage vocabulary also requires updating the synchronization rules and their verification fixtures.

### Checks and publication

For requested implementation verification, the available offline checks are:

```sh
node scripts/check-site.mjs
node scripts/sync-timeline.mjs --check
node --test scripts/status.test.mjs
```

The checks cover catalog/status consistency, local photo files and attribution, and status/evidence rules. For UI verification, inspect desktop and narrow layouts, filters, year navigation, company lines, keyboard controls, badges and photo credits. Report exactly which checks were run; documentation-only edits do not require running implementation tests.

When publication is explicitly authorized, publish only `index.html`, `assets/`, `data/` and `images/`. Preserve relative paths and photo licensing information. Exclude `.git`, submodule checkouts, `scripts/`, scratch files and credentials. Committing/pushing a feature branch does not itself establish that the website is deployed.

## Accuracy and public content

- Present hardware, software, and HDL Workbench as connected parts of AI Engineer; do not imply that the umbrella repository owns their independent histories.
- Base claims about implementation status and verification on the relevant project specifications, reports, and recorded results. Label proposals and plans as such; do not describe them as completed work.
- Link historical and technical claims to their sources. Preserve uncertainty where source material disagrees or is incomplete.
- Check each source repository's license and asset provenance before reusing material. Do not publish copyrighted binaries, private data, credentials, or unreviewed local files.

## Workflow

- Make root-level website changes in a feature branch. Do not push directly to `main`.
- Use the build, lint, or link-check commands documented by the site once they exist. Report the exact checks run and any limitations; do not claim a check passed unless it did.
- Do not publish or deploy the site unless the user explicitly asks for that action.

## Project management

Read [spec/project_manager.md](spec/project_manager.md) before creating, triaging, scheduling or updating roadmap issues and dependencies. The initial inventory and canonical issue links are in [spec/initial_project_plan.md](spec/initial_project_plan.md). Manage the AI Engineer GitHub Project across chips, systems, bus-organized cards, Rust toolchains/software, HDL Workbench and the planned ai_fpga_engineer repository.

The [EDA tools track](spec/eda_tools.md) records the working HDL Workbench baseline and its Xezim/Surfer dependencies. Treat its maintenance and upgrade qualification separately from creating new tools.

The [386/68030 scope](spec/era_386_scope.md) sets the classic PC and Macintosh coverage endpoints and explicitly includes AdLib, Sound Blaster and the Roland LAPC-I audio profile. Use its complete-stack inventory before declaring a machine or program complete.

Read [spec/timeline.md](spec/timeline.md) before changing the public timeline, status synchronization or photo catalog. Statuses belong in JSON; verification requires explicit linked evidence. Inspect photographs for model identity and retain their own license attribution.
