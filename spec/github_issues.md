# GitHub issue and Scrum project management

Manage the cross-repository roadmap in the [AI Engineer project](https://github.com/users/hevangel/projects/1). Umbrella coordination belongs in [hevangel/ai_engineer](https://github.com/hevangel/ai_engineer/issues); implementation and maintenance issues belong in the repository that owns the actual work. Read this document with [project_manager.md](project_manager.md); this document governs issue fields, ownership, hierarchy and source-path reconciliation. The reviewed inventory and field identifiers are in `data/github-issues.json`. Read live field definitions before mutations: identifiers and options can change.

## Status

The live Status options inspected on 2026-10-25 are:

| Status | Meaning and evidence |
| --- | --- |
| Planned | Backlog scope and acceptance are recorded; no current implementation or verification claim. New issues default here. |
| Researching | Active requirements, datasheet, provenance or feasibility work. |
| Sources Ready | Required sources have been collected, cleaned and checked against the selected scope; link that evidence. |
| Building | Implementation or integration exists or is underway, with scoped acceptance gaps. Agent may be empty when work is inactive. |
| Blocked | Active work cannot progress until a named dependency or external condition changes. Native blockers can also exist on Planned work. |
| AI verified | An AI agent has inspected reproducible verification evidence and recorded commands, results, scope and limitations. |
| Human verified | A named human has explicitly reviewed the evidence and approved the recorded scope. |

The owner previously reset the backlog to **Planned**. Planned is a backlog state: **when an agent actually starts work, it must update Status**. Use Researching for active requirements/audit work, Building for implementation/integration, Sources Ready after the required source-cleanup gate, and Blocked for an identified condition preventing progress. Move to AI verified only after the scoped evidence has been inspected; Human verified requires explicit human verification. Existing RTL, a report or a merged PR alone does not verify every acceptance gate. The project Status field and GitHub's Open/Closed state are separate. Do not reopen historical issues merely to change a project status. Verification of one series member does not verify the whole family. Native prerequisites describe acceptance gates, not a requirement to set the Status to Blocked.

## Agent: current coding ownership

`Agent` records **which coding agent is currently working on an issue**, not authorship history, a GitHub assignee or a permanent team. Current options are Codex, Claude, GLM, Muse, Kiro, Copilot, OpenCode, KiloCode, Cursor and Antigravity. Read the live list rather than adding an alias or silently replacing another agent's claim.

Before substantive work, follow the mandatory start sequence below: inspect existing ownership, transfer to the owning repository, set Path and the first Start date, update Status, and register Agent. Record the branch/worktree, scope and intended checks in the issue. Claim a member sub-issue when working on one chip; claim the parent only for active family-wide work. Coordinate an existing claim before taking over. Research/coordination does not imply that every related hardware issue is being coded.

Clear Agent when the agent finishes, stops, pauses, hands off without a replacement, or waits for human review/external input with no active work. **If nobody is currently working on the issue, Agent must be empty**, even if Status is Building or Blocked from earlier work. Leave historical attribution in linked commits, PRs and issue updates. On recovery, inspect the actual task/branch and refresh or clear stale claims; never clear another agent's field simply because it is absent from the current chat. Assign the replacement agent only when that agent really starts. New backlog issues have no Agent.

## Mandatory start, progress and finish sequence

1. Read the issue, current Agent, Status, Path, Start date, native relationships and recent activity. Coordinate an existing active claim before taking over. Resolve the repository that owns the implementation, documentation or maintenance work.
2. **Transfer the issue to its owning repository** before doing the work if it is currently misplaced. Hardware, EDA guides and the EDA Docker image belong in `hevangel/ai_hw_engineer`; Rust/software in `hevangel/ai_sw_engineer`; HDL Workbench application code in `hevangel/hdl-workbench`; umbrella website and roadmap policy in `hevangel/ai_engineer`. Retain intentionally cross-project coordination in the umbrella. Transfer the existing issue rather than create a duplicate. Preserve and recheck project membership, fields, labels, hierarchy and native blockers/blocking relationships after transfer.
3. Set the project **Path** field to **`<repo>/<path>`**, using the repository's short name and repository-relative forward-slash path. Examples: `ai_hw_engineer/docs/eqy`, `ai_hw_engineer/Dockerfile`, `ai_engineer/spec/github_issues.md`. Use the actual work location; no host drive/worktree path, GitHub URL or branch name in this field. The issue body can link additional locations, the branch and exact commits. For planned files, name the intended location explicitly as planned; do not claim it already exists.
4. Set **Start date** on the first actual start using the agent's local calendar date (`YYYY-MM-DD`). For existing work being reconciled retrospectively, use the [first-commit procedure](#historical-start-dates) below. Preserve an evidenced actual first-start date; do not reset it on resume/transfer or substitute issue creation, audit or merge dates. Correct demonstrably invalid values only with recorded evidence and the previous value retained in a comment. Leave End date unset until its actual completion rule is met; do not invent estimates or historical dates.
5. **Update Status when work starts**: normally Researching for an audit/investigation or Building for implementation. Do not leave active work Planned. Register the actual coding agent in **Agent** (Codex for this agent) and record scope, work branch/path and intended checks. Registration and Status are separate required updates; neither replaces the other. Sprint is set only through Scrum planning.
6. Keep Status aligned with the work and recorded evidence. Name blockers and their resolution. A successful image build or version command establishes only that gate; an incomplete acceptance checklist must not be called verified/done. Keep the issue Open while required work remains. The current status list has no generic Done value: record the scoped evidence for AI verified or Human verified, then close only when all agreed acceptance gates are satisfied.
7. On finish, stop, pause, inactive blocking, or handoff to human review, **unregister the coding agent by clearing Agent**. Do not replace it with a historical author, text such as “none”, or the next agent before that agent actually starts. Keep Path and the original Start date. Set Status honestly for the handoff: Blocked when blocked, the achieved evidence stage when completed, or Planned for work explicitly returned to backlog. If nobody is currently working, Agent must be empty. Never clear another active agent's claim without coordination.
8. Verify the resulting repository/URL, project item and field values. Repository-local issue numbers can change on transfer. Update the inventory and links to the new canonical `<owner>/<repo>#<number>` reference; retain old URLs only as migration/history redirects. Capture the transfer response and resolve its returned issue URL/IDs; GitHub can replace node IDs, REST IDs and project items as well as change the repository-local number. Re-read the project item and restore all captured fields, including Workstream, when necessary. Do not assume any pre-transfer ID or project field survived. Key scripts by repository plus number, never the bare number.

## Sprint: Agile Scrum iteration

`Sprint` is the project's GitHub iteration field for Agile Scrum delivery. It is not a chip's historical introduction year, a release status or an automatic due date. The inspected configuration is a 14-day cadence: Sprint 1 starts 2026-10-22, Sprint 2 starts 2026-11-05 and Sprint 3 starts 2026-11-19. These are the existing configured iterations, not new commitments made by this change.

Use a sprint goal, selected backlog, explicit acceptance and capacity/dependency checks during planning. Put ready member/integration tasks into a sprint only when selected; leave uncommitted backlog and broad family epics empty. During the sprint, record progress and blockers. Review evidence and unfinished scope at sprint review, then retrospect on process and escaped defects. Carry work forward deliberately, preserving history. Do not assign every Planned issue to the current sprint, invent delivery dates or modify the cadence without direction.

## Workstream and hierarchy

Use Chips, Systems, Cards, Toolchains, Software, FPGA, Tooling and Website independently of Status. EDA utilities and their Docker environment use **Tooling**; Rust/LLVM compiler targets use **Toolchains**.

Keep one canonical parent issue and one public timeline card per coherent chip family. Create **one native GitHub sub-issue per identified physical chip**, with exact part/profile, acceptance, source links and implementation path. A family member checklist links those sub-issues instead of duplicating tracking. Multiple RTL models of the same physical chip share its member issue. A package or speed-grade option needs a separate issue only when it has a genuinely separate contract; never assume every catalog variant is compatible. Add newly identified parts as research establishes their identity. Unknown parts stay an explicit inventory gap, not fabricated chip names. The NES/SNES peripheral and mapper inventory remains open beyond the explicitly named members.

Use one canonical `ai_hw_engineer/design/<issue_slug>/` folder for a standalone chip or family, with chip members below the family folder. The slug matches the issue's named chip/family in normalized form. Keep a family README linking member READMEs and sub-issues. Existing Apple II 74LS models are linked from member profiles under the 74-series parent; other identified package profiles are children of the Apple II support issue. The shared source remains in the board library. Each member owns its specification, tests and report; intentionally shared RTL (such as the parameterized 8253/8254 and Apple II physical-package library) stays in the family with separate member profile folders and acceptance. Never duplicate RTL just to satisfy a directory convention. Reserve planned paths in the issue; do not claim a folder or implementation exists before it does.

Am25xx is parent #5, Am29xx is parent #7. The old Am2505 #6 is reactivated **as a child of #5**, not a second family card. This supersedes the earlier instruction to keep #6 archived. MCS-4, MCS-8, 74-series, the Intel 8086/8088 family and MOS 6502 variants use the same parent/member convention. Required system gates continue pointing to the canonical family issues. Hierarchy is not a dependency: add blocked-by edges only for real acceptance prerequisites, and keep the graph acyclic.

Optional card/coprocessor qualification issues are blocked by their host computer; compatible CPU qualification issues are blocked by the original CPU. These integration tasks reference canonical hardware implementation/member issues and never become extra mandatory base-machine gates. The Docker environment issue is blocked by every selected EDA tool qualification issue, including the separately documented Icarus overlay; this does not imply all tools are currently installed in the base image.

## Existing implementation and evidence

Inspect tracked `design/`, `system/`, `docs/`, the Dockerfile and relevant reports at an exact commit. Link README, RTL, specifications and reports from the issue. `data/github-issues.json` records discovered paths and report inventory; a file count proves only that files exist. Distinguish an RTL implementation, scaffold, recorded historical test result, fresh regression and independent physical/human qualification. Empty local directories and scratch files are not built devices. Record absent/planned parts explicitly.

When moving a design, retain RTL, independent oracles, references and history; update source lists, relative paths, system imports, documentation, generated-output ignores and indexes. Run affected verification and explain unavailable tools honestly. Use a feature branch/PR and link a commit or PR branch while paths are pending review; do not publish broken links to a future main path. Keep submodule pins unchanged until an authorized integration update.

## Read-only committed-progress audits

When the owner asks for an inventory/progress audit without code changes:

1. Resolve the source repository and record an exact commit, branch and upstream relationship. Audit committed Git objects at that baseline; distinguish unmerged branches, worktrees, ignored downloads and generated artifacts. Do not change source files, move designs, run generators or refresh website JSON as part of this audit. Temporary inventories belong in the owning repository's ignored `scratchpad/`.
2. Match existing issues by canonical repository and issue number/URL, including family parents and physical-chip members. Do not create duplicates, transfer issues or rewrite dependency edges merely to refresh metadata. Preserve intentional umbrella coordination; perform ownership transfers when implementation work starts under the lifecycle above.
3. Inspect source, specification, acceptance criteria, verification scripts and reports together. Record what exists, what is scaffolded, which checks were historically reported, any review follow-ups, and what is absent or unverified. A test harness containing a million vectors is not a million passing cases. Allowed oracle mismatches, deliberately failing aggregate gates and normalized/native interface differences must remain visible.
4. Set Path to the actual `<repo>/<path>` at the audited commit. A committed shared source file is a valid precise path. If family members remain in separate folders, use their existing common root and list exact member locations in the comment. Do not publish proposed consolidation paths as existing main paths; an audit does not authorize moving code to satisfy folder conventions.
5. Reconcile Status with the whole issue's scoped acceptance. Use Building for partial implementations even when some regressions pass; keep family status distinct from member status and integrated models distinct from complete standalone chips/cards/systems. AI verified requires inspected reproducible evidence for the stated contract and explicit limits. Never infer Human verified, physical FPGA validation or full silicon compatibility from a report, merge or tool success. Leave unrelated backlog untouched.
6. Add or update a concise audit comment with the immutable commit links, actual paths, observed implementation, recorded commands/results, limitations and missing gates. Explicitly state whether checks were rerun. Updating an existing marked audit comment is preferable to repeated duplicate comments. Retain earlier evidence and qualify superseded claims.
7. Keep Agent empty for implementation issues nobody is coding; a portfolio audit does not claim every related chip. Preserve Status/Path-independent fields, dates, Sprint, issue Open/Closed state, hierarchy and blockers unless the request specifically calls for changing them. Use the historical procedure when Start dates are requested.
8. Re-read live project fields after writes and compare every targeted value with the intended result. Check that unrelated items and preserved fields stayed unchanged, and confirm no tracked code changes occurred. Record a restartable mutation ledger in scratch space. Report the baseline, changed item counts, evidence limits and checks actually performed.

## Historical Start dates

For retrospective Start-date reconciliation requested by the owner:

- Inspect the first issue-specific committed work reachable from the audited baseline. A committed specification/scaffold is work, even before completed RTL. For a series parent use its earliest evidenced member work; for a shared implementation qualify the exact member/variant scope.
- Follow genuine renames so moving a design does not reset its date. Stop at copies or derivations from another design: an Am9517 implementation must not inherit Intel 8237's start, nor an XT build the earlier PC platform's date. Inspect name-status history rather than trusting `git log --follow` alone, which can follow copies under repository configuration.
- Check for shallow/truncated history. Record the immutable first-commit URL, subject, timestamp and the current work path traced through history. Use the commit's **committer timestamp converted to America/Vancouver** for the date field and state that convention. If history is unavailable, document the gap rather than guess.
- A first-commit date is a **proxy for the start of recorded work**, not proof of when uncommitted work began. Prefer an already evidenced actual first-start date. Do not replace valid dates merely because a later imported/squashed commit has a different date, and do not use issue creation, merge, audit, planned sprint or expected finish dates as substitutes.
- When correcting a demonstrably invalid value, such as a future Start date for work already committed, record the old value, new date, commit evidence and reason in the issue comment. Do not silently erase user dates or overwrite a conflicting plausible date without evidence; leave unresolved conflicts for explicit triage.
- Change only Start date and its evidence comment for a date-only request. Preserve Status, Path, Agent, End date, Sprint, issue state and dependency relationships. Re-read the resulting fields to verify the update.

## GitHub CLI operations

Inspect before changing:

```sh
gh project field-list 1 --owner hevangel --format json
gh project item-list 1 --owner hevangel --limit 1000 --format json
gh issue list --repo hevangel/ai_engineer --state all --limit 1000 --json number,title,body,url
gh api 'repos/hevangel/ai_engineer/issues/NUMBER/sub_issues?per_page=100' --paginate
gh api 'repos/hevangel/ai_engineer/issues/NUMBER/dependencies/blocked_by?per_page=100' --paginate
```

Use a native issue's numeric REST `id` for `POST /repos/{owner}/{repo}/issues/{parent}/sub_issues` (`sub_issue_id`) and for `POST .../dependencies/blocked_by` (`issue_id`). Use GraphQL node IDs for project items/fields. Check the existing parent before attaching a child; do not silently reparent another team's issue. Search the full inventory, including closed/superseded issues, before creating. Preserve existing bodies, dates, verification evidence and canonical URLs; manage a marked inventory section so repeat reconciliation is idempotent. Add new issues to project 1 with the correct Workstream and Planned status; leave Agent and Sprint empty.

```sh
gh issue transfer ISSUE_URL OWNER/OWNING_REPO
gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id PATH_FIELD_ID --text 'repo/relative/path'
# Only when no first-start value is already set:
gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id START_DATE_FIELD_ID --date YYYY-MM-DD
gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id STATUS_FIELD_ID --single-select-option-id ACTIVE_STATUS_OPTION_ID
gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id AGENT_FIELD_ID --single-select-option-id ACTUAL_AGENT_OPTION_ID
gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id AGENT_FIELD_ID --clear
gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id SPRINT_FIELD_ID --iteration-id SELECTED_ITERATION_ID
```

Resolve IDs from live fields and item inventory; do not copy outdated values from a chat. Paginate REST and GraphQL results. Verify issue identity, parent membership, requested blockers, project membership and field values after writes. Retain the private project's visibility. Status refresh and static-site publication are separate authorized operations. The option parity checker is `node scripts/sync-option-issues.mjs`; it does not check every family/member or EDA edge.


Run `node scripts/check-github-issues.mjs` to check the recorded family/member hierarchy, project fields/workstreams and Docker tool gates against live GitHub. It validates active Agent option names, but current ownership still requires task evidence and coordination. Read Path and Start date fields as part of every lifecycle transition.


## Browser frontend stage issues

Follow [the functional-first browser frontend workflow](project_manager.md#browser-frontend-delivery-functional-first-polish-second). Retain each computer's existing frontend as a parent and create native functional and UI/UX polish sub-issues. Polish is blocked by accepted functional work. Preserve parent fields and existing prerequisites; new children begin Planned with no fabricated path, agent, dates or Sprint. Register and clear current ownership independently on the stage being worked on. Do not treat usable functionality and visual polish as the same completion gate.
