# Read-only timeline dependency comparison

Run `node scripts/check-timeline-dependencies.mjs` to compare checked-in timeline connections with live GitHub native blocked-by relationships. Or run `node scripts/check-timeline-issues.mjs --dependencies` for both issue coverage and dependency checks. Both commands accept `--json` for structured results and exit nonzero on drift or incomplete/failed API reads. Neither modifies GitHub, data files, snapshots, source code or deployment output.

## Scope

The checker fetches every page of blockers for catalog computers, software-title cards and registered optional/compatible qualification trackers. It keys issues by repository plus number, including cross-repository dependencies. Shared target issue profiles are fetched once. It reads `catalog.json`, `software.json`, `github-issues.json`, `connections.json`, `component-profiles.json`, `system-options.json`, `compatible-chips.json`, `option-issues.json` and the coverage exclusion policy.

- **Required hardware:** derive the expected chip/card-to-computer wires from native blockers. Registered physical-chip members can resolve to their family card; this does not imply all family members are fitted. Explicit component profiles must disambiguate shared issue variants and distinguish original components from later reconstructions. Missing, extra, duplicate or stale-profile wires fail; unused or ambiguous profiles also fail.
- **Optional hardware:** compare curated planned configurations without inventing mandatory card-to-host completion blockers. A native required gate takes precedence over a planned optional link for the same endpoints, matching the connection generator.
- **Compatible CPUs:** derive alternative wires from the original CPU's native host gate and qualified compatibility groups. Alternatives are OR choices, not extra required CPU gates. Check compatibility-group and original-source metadata as well as endpoints/types.
- **Software:** compare `software.json` `dependsOn` with native blockers that refer to timeline software titles, in both directions. Missing native edges and missing local dependencies fail. `derivedFrom` is historical lineage; it never substitutes for `dependsOn` or creates a native prerequisite by itself.
- **Qualification trackers:** require optional chip/card qualification to be blocked by its host computer, and compatible-CPU qualification by the original CPU. Additional qualification prerequisites remain separate from the host/CPU-role projection; they do not automatically create timeline wires.

Non-rendered compiler, tooling and explicitly excluded coordination blockers are listed under `omitted` in JSON output. They remain real GitHub completion gates; this list is not a recommendation to remove them. Typed hardware/software blockers without a usable catalog/group representation are failures unless explicitly excluded by policy. Run the coverage check as well to discover missing typed issues across the repositories.

This compares the timeline's hardware/software prerequisite projection, not every edge in the whole GitHub Project. It does not compare notes/evidence prose byte-for-byte, infer whether a blocker has actually completed, verify current project Status/Agent ownership, or establish implementation/verification. Keep those audits separate. It does not fix drift automatically; use the existing refresh scripts or reviewed native-edge changes only when authorized. A passing comparison does not publish the website.

## Offline replay

`node scripts/check-timeline-dependencies.mjs --blocked-by COMPLETE_BLOCKERS.json` uses a saved inventory rather than the network. It must contain `complete: true` and a `blockedBy` object whose keys are canonical target issue URLs and whose values are complete arrays of REST blocker issue records (`html_url`, `number`, `title`, etc.). Every relevant target must have an explicit array, including an empty array for no blockers; missing lists fail instead of being assumed empty. The caller must capture all pages; the completeness flag is an assertion, not proof.

For a fully offline combined run, use `node scripts/check-timeline-issues.mjs --issues COMPLETE_ISSUES.json --dependencies --blocked-by COMPLETE_BLOCKERS.json`. `--issues` alone remains the coverage replay; adding `--dependencies` without a blocker file intentionally reads live blockers. Keep captured issue bodies and inventories in ignored scratch space, not public website data.

Tests: `node --test scripts/timeline-dependencies.test.mjs`. They cover drift in both directions, cross-repository number collisions, profile selection/reconstruction, grouped chips, optional/compatible semantics, software lineage, qualification gate direction, pagination and incomplete inventories.
