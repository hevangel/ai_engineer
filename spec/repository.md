# Repository scope and governance

## Mission

This repository is the public-facing static website and integrated presentation for the AI engineering projects. It is the superset of the `ai_*` projects and HDL Workbench: visitors should be able to understand the work as one connected effort across hardware, software, and HDL tooling.

The website and its shared presentation belong at this repository root. The component projects remain independent Git repositories, pinned as submodules. Their code, detailed project documentation, engineering history, and reports remain owned by their respective repositories.

## Authorship

All changes to this repository are made by AI coding agents. Humans do not edit files by hand; they direct the work, file issues, and review, approve or reject pull requests. See [CONTRIBUTING.md](../CONTRIBUTING.md) for the pull request procedure.

## Repository map

| Path | Responsibility |
| --- | --- |
| `README.md` | Human overview of the combined project and source checkout instructions |
| `AGENTS.md` | Entry point for AI agents working in the umbrella repository |
| `CONTRIBUTING.md` | AI-only authorship rule and pull request procedure |
| `index.html` | Static timeline page shell and navigation |
| `assets/` | Browser rendering code and responsive styles |
| `data/` | Curated timeline catalog, stage vocabulary and generated GitHub status snapshot |
| `images/` | Local photographs and their attribution records |
| `scripts/` | Local preview, GitHub status synchronization, photo import and offline checks |
| `ai_hw_engineer/` | Hardware designs, RTL, verification, and virtual systems |
| `ai_sw_engineer/` | Software reimplementations, Rust, LLVM backends, and target systems |
| `ai_fpga_engineer/` | FPGA designs, implementation, and verification |
| `hdl-workbench/` | Browser-based HDL workbench and its implementation |
| `e1647-rs/` | Experimental IEEE 1647 e-language Rust tooling, tokenizer and future language/simulator integration |
| `spec/` | Repository governance, website maintenance, cross-project roadmap, project manager instructions and dependency inventory |
| `.gitmodules` | Canonical submodule URLs; the root Git tree pins each submodule commit |

## Scope and ownership

- Use the root repository for the public site's shared pages, navigation, visual identity, cross-project explanations, and static-site build or deployment configuration.
- Keep project-specific implementation and documentation in the owning submodule. Before editing a submodule, read and follow its `AGENTS.md` and other local instructions.
- Do not flatten, replace, or copy an entire submodule into the root. Link to project sources or incorporate specific material only when its license permits.
- Treat submodule commit pointers as the versions represented by the site. Do not update them to remote heads as routine cleanup; update them intentionally and review the source changes represented by the new pins.
- A project-specific change and a root site change may need separate Git commits because each submodule has its own history. Keep the root's pin aligned with the reviewed project revision.

## Accuracy and public content

- Present hardware, software, and HDL Workbench as connected parts of AI Engineer; do not imply that the umbrella repository owns their independent histories.
- Base claims about implementation status and verification on the relevant project specifications, reports, and recorded results. Label proposals and plans as such; do not describe them as completed work.
- Link historical and technical claims to their sources. Preserve uncertainty where source material disagrees or is incomplete.
- Check each source repository's license and asset provenance before reusing material. Do not publish copyrighted binaries, private data, credentials, or unreviewed local files.

## Workflow

- Make root-level website changes in a feature branch and merge them through a reviewed pull request. Do not push directly to `main`.
- Use the build, lint, or link-check commands documented by the site. Report the exact checks run and any limitations; do not claim a check passed unless it did.
- Do not publish or deploy the site unless the user explicitly asks for that action.

## Project management

Read [project_manager.md](project_manager.md) before creating, triaging, scheduling or updating roadmap issues and dependencies. The initial inventory and canonical issue links are in [initial_project_plan.md](initial_project_plan.md). Manage the AI Engineer GitHub Project across chips, systems, bus-organized cards, Rust toolchains/software, HDL Workbench and the planned ai_fpga_engineer repository.

The [EDA tools track](eda_tools.md) records the working HDL Workbench baseline and its Xezim/Surfer dependencies. Treat its maintenance and upgrade qualification separately from creating new tools.

The [386/68030 scope](era_386_scope.md) sets the classic PC and Macintosh coverage endpoints and explicitly includes AdLib, Sound Blaster and the Roland LAPC-I audio profile. Use its complete-stack inventory before declaring a machine or program complete.
