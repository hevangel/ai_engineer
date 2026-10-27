# Timeline issue coverage check

Run `node scripts/check-timeline-issues.mjs` from ai_engineer. It reads live GitHub issues using authenticated `gh`, checks all REST pages including closed issues, ignores pull requests, and exits nonzero on a coverage problem or a fetch/parse failure. It never writes catalogs, issue bodies, project fields, connections or deployment output. It needs repository read access, not the GitHub Project GraphQL scope.

Use `--json` for a machine-readable report containing the summary, findings, represented issues and exclusions. Reports expose issue URLs and relevant titles, never issue bodies or credentials. Redirect output to ignored scratch space when needed. A GitHub/network failure is a failed check, not an empty successful inventory.

## Coverage policy and representations

`data/timeline-coverage.json` defines scanned repositories, type rules and exact issue exclusions with reasons. Recognize chip, system, expansion-card and software issues by maintained title prefixes or labels. New matching issues must be represented or reviewed explicitly; do not add a broad exclusion merely to make the check green. Issues without a matching prefix/label are outside discovery scope unless already referenced by a catalog/registry. Add a type rule or label when introducing another issue convention. Untracked implementation branches still require a source inventory audit: this checker cannot discover code that has no issue.

- Hardware cards come from `catalog.json`; software cards from `software.json`. Every card must resolve to a live, repository-qualified issue, have a status record with the same issue URL and open/closed state, and agree with a recognized issue type. Multiple sourced profiles can share one canonical issue; duplicate card IDs are invalid. Curated card titles and issue titles need not be identical.
- Physical chip members from `github-issues.json` are represented through their chip-family card. This is grouped coverage, not a claim that the UI individually links each sub-issue. Missing members, duplicate/circular mappings or absent parent cards fail.
- Optional/compatible qualification trackers from `option-issues.json` need live issues, valid catalog endpoints and corresponding connection data. This is configuration coverage, not an independent historical card or a direct UI link to the qualification issue.
- Bus/workflow/program coordination and per-system software catalogs have exact exclusions with written reasons. Individual software titles still need cards. An excluded issue cannot simultaneously have a card; missing/transferred exclusions fail for review. Future coordination issues require their own explicit decisions.

Repository and number together identify an issue. A transferred issue is reported as stale until its catalog/registry references are updated to the new canonical URL; a GitHub redirect does not silently excuse a stale record. Keep configured repositories aligned with the actual issue owners.

## What this does not verify

This is a card/issue coverage and identity check. It does not compare curated historical dates/photos with issue prose, establish implementation/verification, infer project Status from Open/Closed, inspect current Agent ownership, or validate every live dependency edge. Run `sync-timeline.mjs` for stage/evidence refresh, `sync-connections.mjs` for native component links, `check-github-issues.mjs` for registered hierarchy/project fields, and `sync-option-issues.mjs` for live qualification dependencies. `check-site.mjs` validates the full local presentation contracts. Publication remains separate and requires owner authorization.

## Offline replay and tests

`node scripts/check-timeline-issues.mjs --issues COMPLETE_SNAPSHOT.json [--json]` replays a complete saved issue inventory without network access. The envelope must contain `complete: true`, the exact configured `repositories` list, and a flat `issues` array of REST issue records. The caller is responsible for capturing all pages; the flag is an assertion, not independent proof of completeness. Store public/private issue snapshots outside tracked website data. A replay checks that snapshot, not current GitHub state.

Run `node --test scripts/timeline-coverage.test.mjs`. Regressions cover new unrepresented issues, repository-local number collisions, transfers, missing family cards/configuration wires, software labels/types/states, explicit exclusions, duplicate IDs and multi-page/closed issue inventories.


## Native blocked-by comparison

Add `--dependencies` to this command to include [read-only dependency drift checks](timeline_dependencies.md), or run `node scripts/check-timeline-dependencies.mjs` separately. The combined result fails if either coverage or dependency comparison fails. This extends the default coverage check; stage/evidence refresh and full project lifecycle auditing remain separate.
