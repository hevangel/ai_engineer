# EDA tools track

HDL Workbench is already working, as confirmed by the owner. This track records that baseline and manages dependency compatibility, reproducibility and future upgrades. It does not schedule the existing integrated application as a fresh implementation.

| Component | Role | Recorded source baseline | Roadmap |
| --- | --- | --- | --- |
| Xezim | Actual SystemVerilog simulation, including the browser WASM Worker | 0.11.2; Xezim 22faa127a9cc0156bd23e0ab117f400c64231913; core/parser d15cdc39e27a4c0a8a55f7e1d46369181307ead9 | [ai_hw_engineer#69](https://github.com/hevangel/ai_hw_engineer/issues/69) |
| Surfer | Waveform viewing through SurferAdapter | v0.7.0; bd749b1f786c1c62cd67893ca71346cbe6983915 | [ai_hw_engineer#68](https://github.com/hevangel/ai_hw_engineer/issues/68) |
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

The current hardware environment's owning issues have been transferred to `ai_hw_engineer`. Project Path records the actual `<repo>/<path>`; the first Start date is retained. The current native/tool UI baseline was inspected with positive/negative probes and a real built-in-browser Surfer run. **AI verified** is scoped to that evidence; issues stay Open for source/PR review and broader maintenance acceptance. This is not Human verified and does not verify every future upgrade or HDL Workbench feature.

| Tool | Canonical owning issue | Project Path |
| --- | --- | --- |
| Surfer | [ai_hw_engineer#68](https://github.com/hevangel/ai_hw_engineer/issues/68) | `ai_hw_engineer/docs/surfer` |
| Xezim | [ai_hw_engineer#69](https://github.com/hevangel/ai_hw_engineer/issues/69) | `ai_hw_engineer/docs/xezim` |
| EQY | [ai_hw_engineer#70](https://github.com/hevangel/ai_hw_engineer/issues/70) | `ai_hw_engineer/docs/eqy` |
| Icarus Verilog | [ai_hw_engineer#71](https://github.com/hevangel/ai_hw_engineer/issues/71) | `ai_hw_engineer/docs/iverilog` |
| Verible | [ai_hw_engineer#72](https://github.com/hevangel/ai_hw_engineer/issues/72) | `ai_hw_engineer/docs/verible` |
| Verilator | [ai_hw_engineer#73](https://github.com/hevangel/ai_hw_engineer/issues/73) | `ai_hw_engineer/docs/verilator` |
| UVM reference libraries | [ai_hw_engineer#74](https://github.com/hevangel/ai_hw_engineer/issues/74) | `ai_hw_engineer/docs/uvm` |
| Yosys | [ai_hw_engineer#75](https://github.com/hevangel/ai_hw_engineer/issues/75) | `ai_hw_engineer/docs/yosys-symbiyosys` |
| SymbiYosys | [ai_hw_engineer#76](https://github.com/hevangel/ai_hw_engineer/issues/76) | `ai_hw_engineer/docs/yosys-symbiyosys` |

[Docker environment ai_hw_engineer#77](https://github.com/hevangel/ai_hw_engineer/issues/77) retains native blockers for all nine tool issues. Its Path is `ai_hw_engineer/Dockerfile`; the Icarus implementation fix is in the documented Apple II overlay. The base and overlay remain separate image profiles.

[Qualification report](https://github.com/hevangel/ai_hw_engineer/blob/codex/eda-tool-fix-main/docs/eda-tool-qualification.md) · [Icarus fix and built-in-browser evidence PR](https://github.com/hevangel/ai_hw_engineer/pull/79)

The fixed overlay removes only the pinned package helper's malformed standalone `0-3` C/C++ flag token and requires actual C/C++ VPI build/load checks at image build time. Surfer was verified by loading a generated VCD in the built-in browser, selecting signals, inspecting two cursor samples and zooming. Other tool probes cover simulation, UVM report handling, synthesis, equivalence, formal proof/cover and deliberate failure paths. All 29 CLI probes pass.

Follow [GitHub issue management](github_issues.md): transfer work to its owner, update active Status, record Path/first Start date, register the current Agent, and clear Agent on finish/stop. Sprint is a deliberate Scrum commitment. Unstarted backlog remains Planned.
