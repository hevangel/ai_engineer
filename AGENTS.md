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
| Timeline data contracts, issue-status schema, source coverage and photo curation | [spec/timeline.md](spec/timeline.md) |
| Intel 287/387 scope, optional coprocessor wires and DX/SX variants | [spec/coprocessors_287_387.md](spec/coprocessors_287_387.md) |
| Grouped motherboard chipsets and member-chip cards | [spec/chipsets.md](spec/chipsets.md) |
| Direct same-row maker links and short chip-to-computer row-gap links | [spec/maker_row_links.md](spec/maker_row_links.md), [spec/website.md](spec/website.md#direct-chip-links-between-consecutive-rows) |
| Historical dates and placement | [spec/timeline_dates.md](spec/timeline_dates.md) |
| Roadmap issues, dependencies and the GitHub Project | [spec/project_manager.md](spec/project_manager.md), [spec/initial_project_plan.md](spec/initial_project_plan.md) |
| HDL Workbench, Xezim and Surfer maintenance | [spec/eda_tools.md](spec/eda_tools.md) |
| 386/68030 coverage and complete-stack inventory | [spec/era_386_scope.md](spec/era_386_scope.md) |
| Command reference | [scripts/README.md](scripts/README.md) |

## Essential rules

- Work in a feature branch and merge through a reviewed pull request; never push directly to `main`.
- Keep the site static: no server runtime, credentials, analytics or visitor-tracking scripts.
- Keep statuses, connections, colors and percentages in the JSON data files, never hard-coded in HTML or presentation code. Verification requires inspected, linked evidence.
- Do not update submodule pins as routine cleanup, and do not copy submodule content into the root.
- Report exactly which checks you ran. Do not claim a check passed unless it did.
- Do not publish or deploy the site unless explicitly asked.
