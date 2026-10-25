# AI Engineer project manager instructions

## Mission and authority

Manage [AI Engineer](https://github.com/users/hevangel/projects/1) as the cross-repository reconstruction roadmap: classic chips in SystemVerilog; classic systems with web frontends and actual SV simulator backends; FPGA realizations; and historical firmware, operating systems and software rewritten in Rust. This file governs planning and triage. Implementation follows each owning repository's AGENTS.md.

## Ownership

- ai_engineer owns coordination issues, dependencies, the public static website and this specification.
- ai_hw_engineer owns design/<chip>/, system/<system>/ and the planned cards/<bus>/<card>/ structure. The cards directory is a planned convention, not an existing implementation.
- ai_sw_engineer owns Rust software, platform runtimes and LLVM/Rust target work. Reuse existing compiler backends where they satisfy the exact historical ISA.
- hdl-workbench owns HDL editing, browser execution and waveform tooling. Respect its worker/WASM contracts.
- ai_fpga_engineer is planned; do not claim it exists or add its submodule until it is created. FPGA issues need an exact board, device, constraints, timing and physical acceptance criteria.

## Issue granularity

One canonical issue per chip or coherent series: one 74-series issue, one AMD Am29xx issue, one MCS-4 issue, one MCS-8 issue. Maintain a member checklist rather than duplicate chip trackers. Add one issue per whole computer/system. Track bus/card infrastructure separately and create individual card issues only after identifying the original board and revision. Software starts with a per-machine catalog issue; expand to one child issue per selected firmware, OS or application. A compiler target is shared across every compatible machine. Use parent/sub-issue relationships for decomposition, and native blocked-by relationships only for real completion prerequisites.

## Dependencies and scheduling

Chip contracts and required card/bus support precede complete system acceptance. Systems plus exact-ISA compiler/runtime support precede compiled Rust target acceptance; host work and compiler research can proceed in parallel. FPGA realization requires qualified RTL, an exact machine contract, and board/toolchain constraints. Website tooling and content can proceed in parallel with engineering. A blocked issue may still contain ready subtasks: an edge describes its completion gate, not a ban on research. Keep the graph acyclic. Distinguish a related-component link from an actual blocker.

Start with the Busicom/MCS-4 vertical slice and the existing llvm-i4004 work; then Micral/MCS-8 and Altair/8080; then Apple and IBM machines while MOS and later systems proceed through their prerequisite chips. Preserve the requested Atari 2600, C64, NES, SNES acceptance order from the MOS ledger without blocking useful independent research. Do not invent dates, assignees or delivery estimates.

## Board operations

Use gh project list --owner hevangel, gh project item-list 1 --owner hevangel --limit 200 --format json, and gh project field-list 1 --owner hevangel --format json to inspect state. Authentication needs the project scope plus repository issue access. Search existing issues and board items before creating anything; retain canonical URLs in initial_project_plan.md. Add coordination issues in hevangel/ai_engineer and add them to project 1. Native dependency REST endpoints are repos/{owner}/{repo}/issues/{number}/dependencies/blocked_by: GET lists blockers; POST with issue_id adds a blocker. Inspect endpoints and existing edges before mutations; never expose credentials.

The first roadmap uses existing Todo/In progress/Done status values. Todo means acceptance has not been audited, not that no code exists. Move to In progress only when active work is established. Done requires linked reports and all scoped acceptance gates, including explicit limitations. Track partial implementation in the issue body. Record verification failures and evidence, and follow the owning repository's escaped-defect process. Never mark hardware verified solely because simulation passes.

## Routine management

1. Read the source indices, series ledgers, specifications and reports; compare local work with pinned and upstream revisions.
2. Reconcile inventory and issue scope; exclude scratch/corrupt folders and disclose local-only candidates.
3. Update member checklists, dependencies and title-level software/card inventories with source evidence.
4. Select ready work, record concrete acceptance criteria and link implementation PRs and results.
5. Reconcile board status with evidence and update the tracked plan. Do not close legacy duplicates or erase user dates without explicit triage.

## Historical fidelity and publication

Do not assume every machine has an OS or that every software title is legally redistributable. ISA and electrical/bus variants need explicit qualification. S-100 is the initial Altair expansion scope; PC/XT ISA, AT ISA and PS/2 Micro Channel are distinct. The original PS/2 Model 30 is ISA-based; it must not depend on MCA. Cards from other bus families are added as sourced machine requirements emerge. Each candidate catalog expands as research reveals additional parts, machines and software; this first plan is not a claim to cover every famous device. Keep the existing private board private and publish only intentionally public content through the website.

## Workstream field and canonical family scope

Use the Workstream field to group Chips, Systems, Cards, Toolchains, Software, FPGA, Tooling and Website. Keep Status independent of workstream. Series issues represent the full sourced family catalog, not only the folders already implemented. Extend their member checklists as catalog research identifies missing parts and variants. Native dependency calls require the prerequisite issue numeric REST id, not its number or GraphQL node id.

## EDA tools

Manage the [EDA tools track](eda_tools.md) in the Tooling Workstream, separately from Rust/LLVM Toolchains. HDL Workbench is working and depends on Xezim for SV execution and Surfer for waveform viewing. Record its working baseline and future maintenance/upgrade gates separately. Qualify dependency changes before integrating public historical-system demos.

## 386 and Macintosh coverage

The owner set the PC endpoint to 386DX/SX and the corresponding classic Macintosh endpoint to 68030, including the 68020 transition. Follow [era_386_scope.md](era_386_scope.md). Include AdLib and Sound Blaster as explicit card/software deliverables. Keep a complete BOM and firmware/OS/application coverage ledger per selected machine, expanding issues as sources reveal missing parts. The CPU-generation endpoint does not forbid later ISA peripheral profiles useful on these hosts.

When reconciling issues or project items, fetch all pages or raise the CLI limit to cover the inventory. GitHub dependency GET responses default to 30 entries; request per_page=100 and paginate when required before declaring a blocker missing.

## PDP-1 and expanded x86 profiles

Read [pdp1_am29xx.md](pdp1_am29xx.md) and [ibm_386_amd_scope.md](ibm_386_amd_scope.md) for the owner’s additions. Keep AMD Am29xx in #7 and the original Intel DX/SX family in #116; separate history photographs/device profiles do not require duplicate canonical family issues. Keep IBM 386SLC distinct from Intel 386SL and later 486 variants. The Model 25 SX selection supersedes Compaq 386s SX in #148/#149/#150, while Model 35 SX, Model 70 and Model 56 SLC have separate system/software/FPGA tracks.

The PDP-1’s Am29xx gate is a new implementation dependency, explicitly qualified in `data/component-profiles.json`; it is not an assertion about DEC’s original 1959 BOM. A shared chip issue can map to multiple public variants: curate exact target selection and preserve the native gate. AMD histories do not create unsourced AMD-to-IBM factory-component links. ISA and MCA options must remain separate; board/ROM and physical card-fit qualification precede sign-off.


## Compatible processor alternatives

Use [compatible_chips.md](compatible_chips.md) for qualified Intel/AMD choices. Native blocked-by edges remain the selected original CPU gate. Compatible choices exported for the website are OR alternatives, not additional AMD completion blockers or factory-installation claims. One shared CPU-role trunk per computer selects the matching package/pinout; the canonical #22 family keeps separate 8086 and 8088 external-bus profiles. Never merge based solely on a shared ISA or execution-unit implementation.

## Intel numeric coprocessors

[287 and 387 profiles](coprocessors_287_387.md) retain canonical #113/#115, distinguish 387DX/SX history and host interfaces, and record optional machine configurations without adding base-machine blockers. The 387SX has a separate photograph and a November 1988 manufacturer-document bound.

## Grouped support chipsets

See [chipset cards](chipsets.md) for one-card member lists, canonical family issues, date/photo qualifications and exact-board dependency selection. The member list is data-driven and searchable; each chipset retains one status and one set of wire endpoints.
