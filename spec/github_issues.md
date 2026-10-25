# GitHub issue and Scrum project management

Manage coordination in [hevangel/ai_engineer](https://github.com/hevangel/ai_engineer/issues) and the [AI Engineer project](https://github.com/users/hevangel/projects/1). Implementation belongs to its owning repository. Read this document with [project_manager.md](project_manager.md); this document governs issue fields, ownership, hierarchy and source-path reconciliation. The reviewed inventory and field identifiers are in `data/github-issues.json`. Read live field definitions before mutations: identifiers and options can change.

## Status

The live Status options inspected on 2026-10-25 are:

| Status | Meaning and evidence |
| --- | --- |
| Planned | Backlog scope and acceptance are recorded; no current implementation or verification claim. New issues default here. |
| Researching | Active requirements, datasheet, provenance or feasibility work. |
| Sources Ready | Required sources have been collected, cleaned and checked against the selected scope; link that evidence. |
| Building | Active implementation or integration. |
| Blocked | Active work cannot progress until a named dependency or external condition changes. Native blockers can also exist on Planned work. |
| AI verified | An AI agent has inspected reproducible verification evidence and recorded commands, results, scope and limitations. |
| Human verified | A named human has explicitly reviewed the evidence and approved the recorded scope. |

The owner reset all project issue statuses to **Planned**. Preserve that baseline; do not promote an issue just because RTL, a report or a closed legacy tracker exists. Later transitions require actual work/evidence. The project Status field and GitHub's Open/Closed state are separate. Do not reopen historical issues merely to change a project status. Verification of one series member does not verify the whole family. Native prerequisites describe acceptance gates, not a requirement to set the Status to Blocked.

## Agent: current coding ownership

`Agent` records **which coding agent is currently working on an issue**, not authorship history, a GitHub assignee or a permanent team. Current options are Codex, Claude, GLM, Muse, Kiro, Copilot, OpenCode, KiloCode, Cursor and Antigravity. Read the live list rather than adding an alias or silently replacing another agent's claim.

Before substantive coding, inspect Agent and the issue activity. Claim the actual work item with the matching option and record the branch/worktree, scope and intended checks in the issue. Claim a member sub-issue when working on one chip; claim the parent only for active family-wide work. Coordinate an existing claim before taking over. Research/coordination does not imply that every related hardware issue is being coded.

Clear Agent when the agent finishes, stops, pauses, hands off without a replacement, or waits for human review/external input with no active work. **If nobody is currently working on the issue, Agent must be empty**, even if Status is Building or Blocked from earlier work. Leave historical attribution in linked commits, PRs and issue updates. On recovery, inspect the actual task/branch and refresh or clear stale claims; never clear another agent's field simply because it is absent from the current chat. Assign the replacement agent only when that agent really starts. New backlog issues have no Agent.

## Sprint: Agile Scrum iteration

`Sprint` is the project's GitHub iteration field for Agile Scrum delivery. It is not a chip's historical introduction year, a release status or an automatic due date. The inspected configuration is a 14-day cadence: Sprint 1 starts 2026-10-22, Sprint 2 starts 2026-11-05 and Sprint 3 starts 2026-11-19. These are the existing configured iterations, not new commitments made by this change.

Use a sprint goal, selected backlog, explicit acceptance and capacity/dependency checks during planning. Put ready member/integration tasks into a sprint only when selected; leave uncommitted backlog and broad family epics empty. During the sprint, record progress and blockers. Review evidence and unfinished scope at sprint review, then retrospect on process and escaped defects. Carry work forward deliberately, preserving history. Do not assign every Planned issue to the current sprint, invent delivery dates or modify the cadence without direction.

## Workstream and hierarchy

Use Chips, Systems, Cards, Toolchains, Software, FPGA, Tooling and Website independently of Status. EDA utilities and their Docker environment use **Tooling**; Rust/LLVM compiler targets use **Toolchains**.

Keep one canonical parent issue and one public timeline card per coherent chip family. Create **one native GitHub sub-issue per identified physical chip**, with exact part/profile, acceptance, source links and implementation path. A family member checklist links those sub-issues instead of duplicating tracking. Multiple RTL models of the same physical chip share its member issue. A package or speed-grade option needs a separate issue only when it has a genuinely separate contract; never assume every catalog variant is compatible. Add newly identified parts as research establishes their identity. Unknown parts stay an explicit inventory gap, not fabricated chip names. The NES/SNES peripheral and mapper inventory remains open beyond the explicitly named members.

Use one canonical `ai_hw_engineer/design/<issue_slug>/` folder for a standalone chip or family, with chip members below the family folder. The slug matches the issue's named chip/family in normalized form. Keep a family README linking member READMEs and sub-issues. Each member owns its specification, tests and report; intentionally shared RTL (such as the parameterized 8253/8254) stays in the family with separate member profile folders and acceptance. Never duplicate RTL just to satisfy a directory convention. Reserve planned paths in the issue; do not claim a folder or implementation exists before it does.

Am25xx is parent #5, Am29xx is parent #7. The old Am2505 #6 is reactivated **as a child of #5**, not a second family card. This supersedes the earlier instruction to keep #6 archived. MCS-4, MCS-8, 74-series, the Intel 8086/8088 family and MOS 6502 variants use the same parent/member convention. Required system gates continue pointing to the canonical family issues. Hierarchy is not a dependency: add blocked-by edges only for real acceptance prerequisites, and keep the graph acyclic.

Optional card/coprocessor qualification issues are blocked by their host computer; compatible CPU qualification issues are blocked by the original CPU. These integration tasks reference canonical hardware implementation/member issues and never become extra mandatory base-machine gates. The Docker environment issue is blocked by every selected EDA tool qualification issue, including the separately documented Icarus overlay; this does not imply all tools are currently installed in the base image.

## Existing implementation and evidence

Inspect tracked `design/`, `system/`, `docs/`, the Dockerfile and relevant reports at an exact commit. Link README, RTL, specifications and reports from the issue. `data/github-issues.json` records discovered paths and report inventory; a file count proves only that files exist. Distinguish an RTL implementation, scaffold, recorded historical test result, fresh regression and independent physical/human qualification. Empty local directories and scratch files are not built devices. Record absent/planned parts explicitly.

When moving a design, retain RTL, independent oracles, references and history; update source lists, relative paths, system imports, documentation, generated-output ignores and indexes. Run affected verification and explain unavailable tools honestly. Use a feature branch/PR and link a commit or PR branch while paths are pending review; do not publish broken links to a future main path. Keep submodule pins unchanged until an authorized integration update.

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
gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id STATUS_FIELD_ID --single-select-option-id PLANNED_OPTION_ID
gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id AGENT_FIELD_ID --single-select-option-id ACTUAL_AGENT_OPTION_ID
gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id AGENT_FIELD_ID --clear
gh project item-edit --id ITEM_ID --project-id PROJECT_ID --field-id SPRINT_FIELD_ID --iteration-id SELECTED_ITERATION_ID
```

Resolve IDs from live fields and item inventory; do not copy outdated values from a chat. Paginate REST and GraphQL results. Verify issue identity, parent membership, requested blockers, project membership and field values after writes. Retain the private project's visibility. Status refresh and static-site publication are separate authorized operations. The option parity checker is `node scripts/sync-option-issues.mjs`; it does not check every family/member or EDA edge.
