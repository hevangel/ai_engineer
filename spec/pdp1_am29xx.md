# PDP-1 reconstruction using Am29xx

## Historical machine and implementation

The [Computer History Museum restoration exhibit](https://www.computerhistory.org/pdp-1/) dates the original PDP-1 introduction to **1959**. DEC’s [1961 handbook](https://bitsavers.trailing-edge.com/pdf/dec/pdp1/F15B_PDP1_Handbook_1961.pdf), printed pages 4–8, describes an 18-bit architecture, 4096-word base memory, one’s-complement arithmetic and console/I/O behavior. The original used DEC transistor modules. It did not contain the Am2900 chips introduced much later.

The owner selected **a new Am29xx implementation of the PDP-1 architecture**. This is planned scope, with no claim that a PDP-1 bit-slice implementation currently exists. The canonical component tracker remains [AMD Am29xx #7](https://github.com/hevangel/ai_engineer/issues/7).

## Proposed datapath and control

- Five Am2901 four-bit slices provide a 20-bit physical datapath; specify the exact 18-bit architectural boundary. The extra two bits must not corrupt end-around carry, overflow, shifts, sign or the two signed-zero representations. Do not use a 20-bit carry output as an unexamined substitute for the 18-bit carry boundary.
- Use an Am2910 sequencer, reviewed control-store format, instruction dispatch and reproducible microcode assembler/loader. Qualify Am2902 carry/glue components where selected.
- Pin actual AMD device revisions using the [1978 Am2900 Family Data Book](https://bitsavers.trailing-edge.com/components/amd/bitslice/1978_The_Am2900_Family_Data_Book.pdf) and owning-repository reports. Existing slice results do not verify a new integrated CPU.
- Execute real slice/sequencer RTL. A behavioral PDP-1 emulator can be an independent oracle, not a hidden replacement for the requested hardware.

## Delivery tracks

| Track | Canonical issue | Acceptance gates |
| --- | --- | --- |
| System, SV backend and web front panel | [#184](https://github.com/hevangel/ai_engineer/issues/184) | Am29xx qualification #7 |
| Exact 18-bit Rust/LLVM feasibility | [#185](https://github.com/hevangel/ai_engineer/issues/185) | Independent research; do not presume a native Rust target exists |
| Software catalog and Rust reconstruction | [#186](https://github.com/hevangel/ai_engineer/issues/186) | #184 and #185 for complete native-target acceptance; host tools can proceed |
| Physical FPGA realization | [#187](https://github.com/hevangel/ai_engineer/issues/187) | #184 and future FPGA-repository/board handoff #53 |

Planned owning paths are `ai_hw_engineer/system/pdp1_am29xx/` and an `ai_sw_engineer` per-machine catalog. The future `ai_fpga_engineer` repository and board remain unselected. This plan does not create or claim implemented RTL in those paths.

## Machine and software contract

Select an exact DEC handbook revision and installed option profile. Cover instruction/indirection/skip/shift/operate/IOT semantics, AC/IO, console controls, paper tape, typewriter and the display/input profile required by the selected Spacewar! revision. Extended memory, sequence-break options and hardware multiply/divide need explicit configurations. Distinguish internal microcycles from the original machine’s externally visible memory and peripheral timing.

Use independent external instruction/state evidence and authentic software. Initial catalog candidates are RIM/tape loaders, MACRO, DDT, Expensive Desk Calculator and Spacewar!; source exact versions and lawful acquisition before creating title-level children. Do not presume the baseline machine has a general-purpose OS. Rust host tools, rewrites of program behavior and programs compiled to execute on the PDP-1 are separate deliverables. The toolchain track must resolve 8-bit-byte assumptions, 18-bit words, pointer/address layout and one’s-complement arithmetic before native-support claims.

## Public history page

The timeline starts with a discrete-logic **18-bit prelude**, dated 1959 for the original machine. Matthew Hutchinson’s [CC BY 2.0 photo](https://commons.wikimedia.org/wiki/File:PDP-1.jpg) depicts an original PDP-1, not a finished bit-slice replica.

`data/component-profiles.json` qualifies Am29xx → PDP-1 as `basis: reconstruction`, and the sync script requires the matching native completion dependency. The left wire uses a distinct pattern and label. It can run back toward an older historical system: this describes the new implementation’s prerequisites, not the original BOM. Keep both historical dates correct.
