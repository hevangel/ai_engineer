# Public hardware timeline

The root `index.html` is a buildless static site. It presents the canonical chip-family, computer-system and concrete expansion-card issues as a chronological archive. It does not publish the private board or arbitrary issue bodies. Browser requests are local static files only; GitHub credentials stay with the synchronization process.

## Files and preview

- `assets/timeline.css` and `assets/timeline.js`: presentation, filtering, year navigation, connection drawing and photo credits.
- `data/catalog.json`: hardware, issue references, company colors, historical dates/sources, era chapters, and image paths. Add new roadmap items here after curating their history and photo. A future-board placeholder without a named model has no fabricated introduction date.
- `data/status.json`: generated GitHub snapshot. Never hand-code build stages into HTML.
- `data/stages.json`: public legend, labels, symbols and colors. Labels are rendered from this file.
- `images/`: local photographs and per-image Commons attribution in `credits.json`.
- `scripts/`: status synchronization, photo import, preview server and verification.

Run `node scripts/serve.mjs`, then open `http://127.0.0.1:4173`. A static HTTP server is required because browsers restrict JSON fetches from `file:` URLs. Deployment consists of `index.html`, `assets/`, `data/`, and `images/`; do not copy submodule checkouts, `.git`, scripts, scratch files or credentials into a public deployment directory.

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

Era bands use 4-bit, 8-bit, 16-bit and 32-bit chapters, with explicit boundaries in the catalog. These are narrative periods, not a claim that every component in a chapter has that bus width. Historical architectures overlap. Source-qualified date bounds such as “Documented by” stay qualified. Items without an established date are listed in the research section rather than assigned a guessed year.

Company lines connect visible chip-family entries from the same maker. Intel is blue and AMD red; other colors are brand-inspired. A platform owner may represent a mixed-vendor support family; the catalog must not imply it manufactured every physical component pictured.

Use `node scripts/fetch-images.mjs` to import licensed Commons photographs for catalog entries without one. The importer is a curation aid, not a visual identity oracle: inspect the actual photo and original source page, especially near-identical Mac models, card revisions and rare chips. Do not substitute an unrelated person, book, logo, controller or machine. Mark any representative family photo explicitly; its alt text names what is actually pictured. Keep the creator, source, individual license and modification information in `images/credits.json`. Images retain their original licenses.

## Verification

Run `node scripts/check-site.mjs`, `node --test scripts/status.test.mjs` and `node scripts/sync-timeline.mjs --check`. Inspect desktop and narrow layouts, filters, keyboard access, legend, photo attribution, year navigation and connection lines in a browser. Check every catalog image path and ensure each entry has a status record and attribution. Do not change live issue statuses merely to demonstrate colorful badges; use isolated test fixtures for status-rule checks.
