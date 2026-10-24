# IBM 386 profiles and AMD x86 history

## Owner-selected systems

| System | Historical anchor | Selected profile and bus | Primary manufacturer evidence |
| --- | --- | --- | --- |
| IBM PS/2 Model 25 SX | 1992 | 8525-K00, **16 MHz Intel 80386SX**, 16-bit ISA, integrated color VGA | [IBM 192-019, January 21, 1992](https://www.ardent-tool.com/8525/192-019.txt); planned availability April 17 |
| IBM PS/2 Model 35 SX | 1991 | 8535-040/043, **20 MHz Intel 80386SX**, 16-bit ISA, VGA and IDE | [IBM 191-075](https://www.ardent-tool.com/35_40/191-075.txt); availability June 11 |
| IBM PS/2 Model 70 386 | 1988 | Original 8570 **80386DX**, Micro Channel and VGA; select exact E61/121-class board | [Preserved IBM specification](https://www.ardent-tool.com/qtechinfo/GJAN-43WJX8.html), announced June 2 |
| IBM PS/2 Model 56 SLC | 1992 | 8556-055 baseline, **20 MHz IBM 386SLC**, 8 KB cache, **16-bit Micro Channel**, integrated SCSI | [Preserved IBM specification](https://www.ardent-tool.com/qtechinfo/GJAN-43VR4V.html), announced February 25 |

The owner replaced the Compaq Deskpro 386s SX build selection with the two IBM SX systems. Retain #148/#149/#150 and catalog ID `system_pc_386sx` for Model 25 SX; Model 35 SX has separate tracks. The earlier Compaq Deskpro 386DX and IBM Model 80 remain distinct existing systems. The original 1987 8086 Model 25, Model 25-286, Model 35 SLC, plain Model 56 SX and later 486 upgrades are not interchangeable with these selected profiles.

Some summaries assign 20 MHz to every Model 25 SX. The original K00/K01/L02 announcement explicitly specifies 16 MHz; this plan follows that source. Choose a specific later submodel before changing the clock or memory/storage configuration.

## CPU profiles and canonical issues

- Intel 80386DX (1985) and 80386SX (1988) have separate history entries but retain the **one canonical Intel 80386 family issue #116**. DX uses a 32-bit external data bus; SX uses a 16-bit data bus and 24-bit physical addressing. The [Intel historical reference](https://www.intel.com/pressroom/kits/quickrefyr.htm) dates the family milestones.
- IBM **386SLC** is a separate vendor-specific chip tracker #188. [IBM announcement 191-201](https://www.ardent-tool.com/CPU/191-201.txt), October 17, 1991, names its 20 MHz cached processor option and 8 KB cache, with December availability planned. Do not confuse it with Intel 386SL, Cyrix 486SLC or IBM’s later SLC2/DLC parts.
- `data/component-profiles.json` selects DX for Deskpro 386, Model 80 and Model 70, and SX for Model 25 SX and Model 35 SX. Native GitHub blockers remain attached to the canonical issue. A shared issue does not mean both CPU variants belong in every machine.

## AMD x86 scope through 386

The owner added AMD x86 history within the existing 386-generation boundary. Later 486/K5/K6/Athlon/Ryzen expansion is not silently included.

| History entries | Date shown | Evidence and qualification | Canonical issue |
| --- | --- | --- | --- |
| AMD 8086 and AMD 8088 | Documented by 1983 | [AMD 1983 data book](https://bitsavers.org/components/amd/_dataBooks/1983_AMD_MOS_Microprocessors_and_Peripherals.pdf), printed 2-104 and 2-136; not Intel’s original launch dates | #189 |
| AMD 80186 / 80188 family | 1983 catalog preview | Same book, printed 2-1, 80186 **advance information**. This dates the earliest catalog profile, not all later 80188/CMOS/Am186 variants or AMD volume production. [1987 80188 sheet](https://bitsavers.org/components/amd/x86/_dataSheets/1987_80188.pdf) is separate variant evidence | #190 |
| AMD 80286 / Am286 | 1983 catalog preview | Same book, printed 2-54, **advance information**. Do not promote this catalog date to confirmed Am286 shipment | #191 |
| AMD Am386DX | 1991 family introduction | [AMD annual-report exhibit](https://ir.amd.com/financial-information/sec-filings/content/0000891618-94-000068/EX-13.txt) explicitly dates introduction to 1991; later speed/package photos are qualified | #192 |
| AMD Am386SX | Documented in 1991 | [AMD Rev A SX sheet](https://www.ardent-tool.com/CPU/docs/AMD/386/386SX/15022a.pdf), March 1991. SXL/SXLV are later variant profiles | #192 |

The 1983 book is an AMD manufacturer catalog containing some Intel material reprinted by permission. An early advance-information listing establishes catalog evidence, not an independently verified silicon shipment. Keep these distinctions in the public Date evidence notes.

AMD CPU history is additional vendor coverage. Do not wire AMD processors as original factory parts of the selected IBM PS/2s without an exact sourced substitution profile. The existing shared x86 toolchain tracks can be reused only after exact ISA/runtime qualification. Vendor timing, pin, low-power and erratum differences remain separate evidence gates.

## Completion graph and expansion cards

ISA Model 25/35 gates use #51, the selected CPU profile, platform inventory #122, VGA #127 and RTC/CMOS #121. Model 70 and Model 56 use **Micro Channel #52**, with the SLC machine depending on its distinct processor #188. The keyboard/mouse and SCSI controller identities remain in the exact-planar inventory; do not assume a discrete 8042 or substitute the Macintosh NCR5380.

Software requires the machine plus original-i386 toolchain #140 for complete native-target acceptance. FPGA requires the machine plus #53. Issue bodies record exact revision, authentic-software, web/SV and physical evidence gates. Optional AdLib/Sound Blaster configurations are limited to the selected ISA hosts and require card clearance, resource and driver qualification. Do not attach ISA audio to MCA slots. Roland remains in the existing shared audio roadmap; exact new-host card fit is additional qualification work.

## Canonical tracks

| Key | Issue | Workstream | Completion prerequisites |
| --- | --- | --- | --- |
| `ibm_386slc` | [[Chip] IBM 386SLC — cached 386SX-derived processor](https://github.com/hevangel/ai_engineer/issues/188) | Chips | [#116](https://github.com/hevangel/ai_engineer/issues/116) |
| `amd_8086_family` | [[Chip] AMD 8086 and 8088 family — licensed x86 implementations](https://github.com/hevangel/ai_engineer/issues/189) | Chips | — |
| `amd_80186_family` | [[Chip] AMD 80186 and 80188 family — integrated x86 processors](https://github.com/hevangel/ai_engineer/issues/190) | Chips | — |
| `amd_80286` | [[Chip] AMD 80286 / Am286 family — protected-mode x86](https://github.com/hevangel/ai_engineer/issues/191) | Chips | — |
| `amd_am386` | [[Chip] AMD Am386 family — DX, SX and low-power variants](https://github.com/hevangel/ai_engineer/issues/192) | Chips | — |
| `system_pc_386sx` | [[System] IBM PS/2 Model 25 SX — SV simulation, web frontend and FPGA handoff](https://github.com/hevangel/ai_engineer/issues/148) | Systems | [#116](https://github.com/hevangel/ai_engineer/issues/116), [#122](https://github.com/hevangel/ai_engineer/issues/122), [#51](https://github.com/hevangel/ai_engineer/issues/51), [#127](https://github.com/hevangel/ai_engineer/issues/127), [#121](https://github.com/hevangel/ai_engineer/issues/121) |
| `software_pc_386sx` | [[Software] IBM PS/2 Model 25 SX — Rust firmware, OS, drivers and applications](https://github.com/hevangel/ai_engineer/issues/150) | Software | [#148](https://github.com/hevangel/ai_engineer/issues/148), [#140](https://github.com/hevangel/ai_engineer/issues/140) |
| `fpga_pc_386sx` | [[FPGA System] IBM PS/2 Model 25 SX — board selection and physical reconstruction](https://github.com/hevangel/ai_engineer/issues/149) | FPGA | [#53](https://github.com/hevangel/ai_engineer/issues/53), [#148](https://github.com/hevangel/ai_engineer/issues/148) |
| `system_ps2_model35sx` | [[System] IBM PS/2 Model 35 SX — SV simulation, web frontend and FPGA handoff](https://github.com/hevangel/ai_engineer/issues/193) | Systems | [#116](https://github.com/hevangel/ai_engineer/issues/116), [#122](https://github.com/hevangel/ai_engineer/issues/122), [#51](https://github.com/hevangel/ai_engineer/issues/51), [#127](https://github.com/hevangel/ai_engineer/issues/127), [#121](https://github.com/hevangel/ai_engineer/issues/121) |
| `software_ps2_model35sx` | [[Software] IBM PS/2 Model 35 SX — Rust firmware, OS, drivers and applications](https://github.com/hevangel/ai_engineer/issues/194) | Software | [#193](https://github.com/hevangel/ai_engineer/issues/193), [#140](https://github.com/hevangel/ai_engineer/issues/140) |
| `fpga_ps2_model35sx` | [[FPGA System] IBM PS/2 Model 35 SX — board selection and physical reconstruction](https://github.com/hevangel/ai_engineer/issues/195) | FPGA | [#53](https://github.com/hevangel/ai_engineer/issues/53), [#193](https://github.com/hevangel/ai_engineer/issues/193) |
| `system_ps2_model70` | [[System] IBM PS/2 Model 70 386 — SV simulation, web frontend and FPGA handoff](https://github.com/hevangel/ai_engineer/issues/196) | Systems | [#116](https://github.com/hevangel/ai_engineer/issues/116), [#122](https://github.com/hevangel/ai_engineer/issues/122), [#52](https://github.com/hevangel/ai_engineer/issues/52), [#127](https://github.com/hevangel/ai_engineer/issues/127), [#121](https://github.com/hevangel/ai_engineer/issues/121) |
| `software_ps2_model70` | [[Software] IBM PS/2 Model 70 386 — Rust firmware, OS, drivers and applications](https://github.com/hevangel/ai_engineer/issues/197) | Software | [#196](https://github.com/hevangel/ai_engineer/issues/196), [#140](https://github.com/hevangel/ai_engineer/issues/140) |
| `fpga_ps2_model70` | [[FPGA System] IBM PS/2 Model 70 386 — board selection and physical reconstruction](https://github.com/hevangel/ai_engineer/issues/198) | FPGA | [#53](https://github.com/hevangel/ai_engineer/issues/53), [#196](https://github.com/hevangel/ai_engineer/issues/196) |
| `system_ps2_model56slc` | [[System] IBM PS/2 Model 56 SLC — SV simulation, web frontend and FPGA handoff](https://github.com/hevangel/ai_engineer/issues/199) | Systems | [#188](https://github.com/hevangel/ai_engineer/issues/188), [#122](https://github.com/hevangel/ai_engineer/issues/122), [#52](https://github.com/hevangel/ai_engineer/issues/52), [#127](https://github.com/hevangel/ai_engineer/issues/127), [#121](https://github.com/hevangel/ai_engineer/issues/121) |
| `software_ps2_model56slc` | [[Software] IBM PS/2 Model 56 SLC — Rust firmware, OS, drivers and applications](https://github.com/hevangel/ai_engineer/issues/200) | Software | [#199](https://github.com/hevangel/ai_engineer/issues/199), [#140](https://github.com/hevangel/ai_engineer/issues/140) |
| `fpga_ps2_model56slc` | [[FPGA System] IBM PS/2 Model 56 SLC — board selection and physical reconstruction](https://github.com/hevangel/ai_engineer/issues/201) | FPGA | [#53](https://github.com/hevangel/ai_engineer/issues/53), [#199](https://github.com/hevangel/ai_engineer/issues/199) |

## Photo provenance and limits

Each downloaded image retains its Commons source, creator and license in `images/credits.json`. CPU package/model identity is inspected separately from the year used for family placement. The AMD 80C186 die is a labeled representative of the earlier 80186-family catalog entry. A Model 25 family chassis is representative, not proof of the selected K00 board. The Model 70 photograph depicts an actual Model 70.

An exact licensed Model 35 SX photo and individual IBM 386SLC package photo were not located. Their cards explicitly identify the actual representative PS/2 family host image. The Model 56 photo contains a Model 56 below a PS/2E, with another Model 30-286 below it; the SLC planar revision is unconfirmed. Captions and attribution expose that limitation. Replace these with exact licensed photographs when available; never relabel them as exact images.
