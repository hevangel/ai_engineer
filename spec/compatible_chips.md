# Compatible processor choices and shared system wires

## Meaning of the shared wire

A per-system CPU-role wire joins source-qualified pin/function-compatible processor profiles as **alternatives**. It is not an electrical connection between two installed processors, proof of factory sourcing, or physical verification of every package/revision in a family. Source taps retain manufacturer colors; one common trunk and one computer tap represent the shared role on the left. Click that trunk or computer tap to choose an original CPU or a compatible substitute.

`data/compatible-chips.json` defines the primary catalog ID, candidate member IDs, short wire label, neutral trunk color, sources and package/electrical qualifications. `sync-connections.mjs` attaches a group to an existing native primary-CPU gate and exports `type: compatible` alternatives. It does not add AMD blocked-by gates: alternatives are OR choices, not simultaneous completion requirements. Every exported alternative retains its source and qualification. Source-specific implementation and physical evidence are still required before acceptance.

## Qualified groups

| Role | Primary and AMD alternative | Profile boundary and sources |
| --- | --- | --- |
| 8086 | Intel 8086 / AMD 8086 | Matching 40-pin DIP, supply, bus mode and clock grade. [AMD 1983 catalog](https://bitsavers.org/components/amd/_dataBooks/1983_AMD_MOS_Microprocessors_and_Peripherals.pdf), printed 2-104 onward; [Intel family manual](https://bitsavers.org/components/intel/8086/9800722-03_The_8086_Family_Users_Manual_Oct79.pdf) |
| 8088 | Intel 8088 / AMD 8088 | Matching 40-pin **8088** package/pin functions and 8-bit external bus; AMD catalog printed 2-136 onward explicitly distinguishes its pinout from 8086 |
| 80286 | Intel 80286 / AMD 80286 | Match the specific 68-pin package, supply and host clock. [AMD 1985 datasheet](https://www.bitsavers.org/components/amd/x86/_dataSheets/1985_80286.pdf) includes the 6/8/10 MHz and separate carrier/PGA choices |
| 386DX | Intel 80386DX / AMD Am386DX | Matching original 132-pin DX package and 5 V board timing. [AMD manufacturer sheet](https://pccomponents.com/datasheets/AMD-A80386.PDF) describes the compatible i386DX implementation and package/connection specifications |
| 386SX | Intel 80386SX / AMD Am386SX | Original 5 V, 100-lead PQFP profile. [AMD March 1991 Rev A](https://www.ardent-tool.com/CPU/docs/AMD/386/386SX/15022a.pdf), page 1, explicitly identifies a pin-for-pin i386SX replacement. SXL/SXLV low-voltage/power extensions need separate qualification |

Only systems already linked to the primary profile inherit its matching alternative. These definitions do not attach 386SX to an IBM 386SLC machine, swap SX and DX, or infer an adapter. The actual host board, firmware, chipset/cache behavior, operating frequency and package must be selected and checked. Later AMD parts may appear below an older original host: that is a replacement option, not an original-BOM date claim.

## Correct 8086 and 8088 host selection

The original **IBM PS/2 Model 30 8530-021 uses an 8 MHz 8086**, documented by [IBM's Technical Reference](https://www.ibmfiles.com/ibmfiles/ps2/25/model30tr.pdf) and [April 1987 product reference](https://bitsavers.org/pdf/ibm/pc/PS2_and_IBM_PC_Product_Reference_Version_4.0_Apr87.pdf). Its common CPU-role wire offers Intel 8086 and AMD 8086-2-class profiles.

The **IBM PC 5150 and XT 5160 use an 8088**, with an 8-bit external bus and four-byte queue. Reuse of the 8086 execution unit in the owning repository does not make the native chips pin interchangeable. A distinct `intel_8088` catalog entry, dated **1979** by [Intel's historical reference](https://www.intel.com/pressroom/kits/quickrefyr.htm), retains canonical family issue #22. The `intel_8086` entry remains the 1978 16-bit-bus chip. `data/component-profiles.json` selects the exact member for all three hosts. The P8088-6 photograph is an identified later speed-grade specimen, with its own Commons credit.

## Exclusions

Architecture or software resemblance alone is insufficient. The existing AMD Am9080A evidence records an ANA/ANI auxiliary-carry difference from Intel 8080; the original Am9517 DMA reconstruction also documents AMD-specific behavior. Do not group those with Intel 8080/8237 as unconditional pin/function equivalents. See the owning [Am9080 README](https://github.com/hevangel/ai_hw_engineer/blob/main/design/amd_am9080/README.md) and [Am9517 README](https://github.com/hevangel/ai_hw_engineer/blob/main/design/amd_am9517/README.md). The AMD 80186/80188 family has no matching native primary/system profile in the current timeline; no host is invented for it.

## Rendering and navigation

`assets/compatible-layout.js` validates groups, expands a primary gate into source-qualified choices and groups visible links by system plus CPU role. Company filters may hide the original chip while leaving an AMD alternative; the computer selector still includes all recorded choices. A missing/ambiguous primary profile fails synchronization and preserves the old snapshot.

Only one shared trunk and one top input pad enter each host CPU role. Each visible candidate exits its own bottom pad to a junction on that trunk. Shared trunks occupy separate left lanes outside the ordinary chip-prerequisite lanes; disjoint row intervals can reuse a lane. Source tracks use the bottom of the complete row, keeping their horizontal segments below neighboring cards. Manufacturer lineage and expansion buses remain separate. The wire toggle removes every shared CPU path, pad and navigation target.

Card taps jump to the computer. The shared CPU trunk and host pad open the connected-member chooser, with original/alternative labels, qualification and manufacturer references. Selection focuses and reveals the chosen card without changing filters. A compatibility group never introduces a repeated subtitle on a hardware card.

## Native qualification trackers

Compatible CPU qualification is separately tracked in `data/option-issues.json`. Each profile's qualification issue is blocked by the canonical original CPU issue. This host-independent comparison task references the alternative's canonical implementation issue and preserves package/clock limits. It does not make every computer depend on both CPUs. Use `node scripts/sync-option-issues.mjs` to verify these native edges and project membership.
