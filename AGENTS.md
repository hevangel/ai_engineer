# AI Agent Guidelines — AI Engineer

## Mission

This repository is the public-facing static website and integrated presentation for the AI engineering projects. It is the superset of the `ai_*` projects and HDL Workbench: visitors should be able to understand the work as one connected effort across hardware, software, and HDL tooling.

The website and its shared presentation belong at this repository root. The three projects remain independent Git repositories, pinned as submodules. Their code, detailed project documentation, engineering history, and reports remain owned by their respective repositories.

## Repository map

| Path | Responsibility |
| --- | --- |
| `README.md` | Human overview of the combined project and source checkout instructions |
| `AGENTS.md` | These instructions for work in the umbrella repository |
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

The [386/68030 scope](spec/era_386_scope.md) sets the classic PC and Macintosh coverage endpoints and explicitly includes AdLib and Sound Blaster. Use its complete-stack inventory before declaring a machine or program complete.
