# AI Engineer

AI Engineer is the public-facing static website and the integrated home for the AI engineering projects. It brings the hardware, software, and HDL workbench work together as one public project, with a shared story, project guides, demonstrations, and engineering results.

This repository is the superset at the presentation level. The projects remain independent repositories, included here as pinned Git submodules. The site should present their work as parts of one AI engineering effort while preserving each project's history, ownership, and instructions.

## Projects

| Project | What it covers | Source |
| --- | --- | --- |
| AI Hardware Engineer | Historical chips, RTL, simulation, formal verification, and virtual systems | [GitHub repository](https://github.com/hevangel/ai_hw_engineer) · [`ai_hw_engineer/`](ai_hw_engineer/) |
| AI Software Engineer | Historical software reimplementations, Rust, LLVM backends, and target systems | [GitHub repository](https://github.com/hevangel/ai_sw_engineer) · [`ai_sw_engineer/`](ai_sw_engineer/) |
| HDL Workbench | Browser-based HDL editing, simulation, and waveform workflows | [GitHub repository](https://github.com/hevangel/hdl-workbench) · [`hdl-workbench/`](hdl-workbench/) |

The public site belongs to this root repository. Its pages and navigation provide the shared entry point; the submodules remain the source of truth for each project's code, detailed documentation, and engineering reports. The root records the exact project revisions used by the site.

## Get the source

Clone the website and initialize its three project repositories:

```sh
git clone https://github.com/hevangel/ai_engineer.git
cd ai_engineer
git submodule update --init
```

For project development that needs nested dependencies such as UVM libraries, emulators, or LLVM sources, initialize those as well:

```sh
git submodule update --init --recursive
```

Nested dependencies can be large. The root submodule pointers pin the revisions presented by the site; update them deliberately and review the resulting changes.

## For contributors

Read [AGENTS.md](AGENTS.md) before changing this repository. For work inside a project submodule, read and follow that project's own `AGENTS.md`. Each project has its own license; check it before reusing code, images, or other assets in the public site.

## Roadmap

The [AI Engineer GitHub Project](https://github.com/users/hevangel/projects/1) coordinates chip families, complete systems, bus-organized expansion cards, Rust/LLVM targets, software reconstruction and future FPGA implementations. Access to the board follows its GitHub visibility settings.

See the [initial project plan](spec/initial_project_plan.md) for the canonical issue inventory and dependencies, and the [project manager instructions](spec/project_manager.md) for how that roadmap is maintained. The planned `ai_fpga_engineer` repository has not been created yet.

The [EDA tools track](spec/eda_tools.md) records the working HDL Workbench integration with Xezim simulation and Surfer waveform viewing, plus dependency and upgrade qualification.

The reconstruction scope extends through Intel 386DX/SX PCs and Motorola 68030 Macintosh systems, including the 68020 transition, AdLib and Sound Blaster. See the [386-era scope and roadmap](spec/era_386_scope.md).

## Timeline website

The root [index.html](index.html) presents the chip families, computers and expansion cards as a scrolling photographic timeline. Maker connections, architecture-era bands and a year rail show their historical relationships. Search and filters narrow the archive; the status guide explains the photo badges.

Preview locally:

```sh
node scripts/serve.mjs
```

Open [the local preview](http://127.0.0.1:4173). Refresh the JSON status snapshot with:

```sh
node scripts/sync-timeline.mjs --project 1 --owner hevangel
node scripts/sync-connections.mjs
```

Statuses come from GitHub issue metadata and the selected project. Computer links come from recorded chip/card dependencies and clearly labeled planned card options; choose a computer to trace its components. Verification badges require evidence; unknown source coverage stays unknown. Representative photographs and uncertain dates are labeled. Each image has its own attribution and license.

See [the timeline specification](spec/timeline.md) for the metadata format and publishing file list, and [scripts/README.md](scripts/README.md) for commands. This implementation supplies static files; publishing remains a separate step.
