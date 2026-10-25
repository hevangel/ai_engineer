# EDA tools track

HDL Workbench is already working, as confirmed by the owner. This track records that baseline and manages dependency compatibility, reproducibility and future upgrades. It does not schedule the existing integrated application as a fresh implementation.

| Component | Role | Recorded source baseline | Roadmap |
| --- | --- | --- | --- |
| Xezim | Actual SystemVerilog simulation, including the browser WASM Worker | 0.11.2; Xezim 22faa127a9cc0156bd23e0ab117f400c64231913; core/parser d15cdc39e27a4c0a8a55f7e1d46369181307ead9 | [#110](https://github.com/hevangel/ai_engineer/issues/110) |
| Surfer | Waveform viewing through SurferAdapter | v0.7.0; bd749b1f786c1c62cd67893ca71346cbe6983915 | [#111](https://github.com/hevangel/ai_engineer/issues/111) |
| HDL Workbench | Integrated HDL workspace, simulation and waveform workflow | Umbrella pin 3fc39e0ba4cc7bf82b48c6947f303d01274c0a3f | [#112](https://github.com/hevangel/ai_engineer/issues/112) |

Evidence: [release readiness](https://github.com/hevangel/hdl-workbench/blob/3fc39e0ba4cc7bf82b48c6947f303d01274c0a3f/docs/v1-release-readiness.md), [WASM report](https://github.com/hevangel/hdl-workbench/blob/3fc39e0ba4cc7bf82b48c6947f303d01274c0a3f/docs/luna-03-wasm-report.md), [Surfer report](https://github.com/hevangel/hdl-workbench/blob/3fc39e0ba4cc7bf82b48c6947f303d01274c0a3f/docs/surfer-integration-report.md). These are historical recorded results; this planning change does not run new tool verification. Consult later reports before repeating limitations from an earlier feasibility phase.

## Dependency flow

~~~mermaid
flowchart LR
  Xezim --> Workbench[HDL Workbench]
  Surfer --> Workbench
  Workbench --> Demos[Historical-system public demos]
~~~

The native blockers are Xezim and Surfer qualification into Workbench, and Workbench into [public-system integration #55](https://github.com/hevangel/ai_engineer/issues/55). That issue already feeds the website publication tracker. Dependency edges describe continuing acceptance and upgrade gates; current working functionality is recorded separately.

## Project manager rules

Use the existing Tooling Workstream for EDA tools, keeping it separate from Rust/LLVM Toolchains. Maintain one canonical tracker per EDA component. Record working baseline, exact source/asset versions, supported environments, license/patch provenance and remaining qualification independently. Planned refers to the remaining maintenance/qualification scope, not to whether the tool exists. Do not mark future upgrades or new environments tested on the strength of old reports.

Preserve actual Xezim Worker execution in browser-only mode. Keep Surfer's unstable internal messages inside its adapter. Follow hdl-workbench/AGENTS.md before implementation changes. Hardware lint, formal and synthesis tools, and FPGA build tools can extend this track once their owning workflows and exact dependencies are inventoried; do not assume every chip or simulator workflow depends on Workbench.

## Hardware tool and image qualification

- [EQY](https://github.com/hevangel/ai_engineer/issues/300) — [hardware guides](https://github.com/hevangel/ai_hw_engineer/tree/codex/chip-family-roadmap/docs/eqy).
- [Icarus Verilog](https://github.com/hevangel/ai_engineer/issues/301) — [hardware guides](https://github.com/hevangel/ai_hw_engineer/tree/codex/chip-family-roadmap/docs/iverilog).
- [Verible](https://github.com/hevangel/ai_engineer/issues/302) — [hardware guides](https://github.com/hevangel/ai_hw_engineer/tree/codex/chip-family-roadmap/docs/verible).
- [Verilator](https://github.com/hevangel/ai_engineer/issues/303) — [hardware guides](https://github.com/hevangel/ai_hw_engineer/tree/codex/chip-family-roadmap/docs/verilator).
- [UVM reference libraries](https://github.com/hevangel/ai_engineer/issues/304) — [hardware guides](https://github.com/hevangel/ai_hw_engineer/tree/codex/chip-family-roadmap/docs/uvm).
- [Yosys](https://github.com/hevangel/ai_engineer/issues/305) — [hardware guides](https://github.com/hevangel/ai_hw_engineer/tree/codex/chip-family-roadmap/docs/yosys-symbiyosys).
- [SymbiYosys](https://github.com/hevangel/ai_engineer/issues/306) — [hardware guides](https://github.com/hevangel/ai_hw_engineer/tree/codex/chip-family-roadmap/docs/yosys-symbiyosys).

[EDA Docker environment](https://github.com/hevangel/ai_engineer/issues/307) is blocked by Xezim #110, Surfer #111 and all seven trackers above. Icarus is currently documented in the Apple II overlay; it is not claimed to be present in the base image. The image also needs a headless JDK to compile the Am2901 independent oracle.

All new trackers start Planned, with no Agent or Sprint assignment. See [GitHub issue management](github_issues.md); current coding ownership and Scrum iteration are distinct from status and workstream.
