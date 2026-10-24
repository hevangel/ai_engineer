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