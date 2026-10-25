# Timeline historical date audit

## Meaning of the dates

This audit resolves all 19 entries previously shown as undated and corrects four MOS entries placed using later reference-manual printings. It changes historical presentation, not engineering completion status. At the initial audit, all 102 catalog entries had a year; uncertain introduction dates remained qualified. Subsequent additions follow the same evidence rules.

- **Introduction:** a source explicitly dates the family’s introduction.
- **Documented by:** a dated document proves the part was documented by that year; exact commercial launch may be earlier.
- **Preview / advance information:** dates the manufacturer’s announcement material, not established volume shipments or final pinout.
- **Reported introduction:** a retrospective industry account supplies the introduction date, with corroboration recorded below.
- **Original system profile / by:** anchors a broad reconstruction family to an identifiable original host or card. Its fitted components necessarily existed by release; this is an inference about availability, not a claim that every family member launched then.

The pictured package or board can be a later representative revision. Its photograph does not establish the family’s year. For example, the SNES 1CHIP photograph is later than the original 1990 Super Famicom chipset and is now explicitly marked representative.

## Sourced placements

| Catalog entry | Public date label | Evidence type and source | Scope / qualification |
| --- | --- | --- | --- |
| `mos_6530` — MOS 6530 | Documented by 1975 | [documented](https://mirrors.apple2.org.za/ftp.apple.asimov.net/documentation/hardware/processors/6502_Mostek.pdf) | MOS’s August 1975 MCS6500 Hardware Manual describes the MCS6530 on introductory page iii. Exact first shipment is not established here. |
| `crtc6845` — MC6845-compatible CRTC for historical display cards | 1977 · advance information | [preview](https://www.theoddys.com/acorn/the_6845_crtc/MC6845%20Motorola%201977.pdf) | Motorola’s MC6845 advance-information sheet is copyrighted 1977. This documents the original controller, not every later compatible variant. |
| `mos_6522` — MOS 6522 | Documented by 1977 | [documented](https://www.americanhistory.si.edu/collections/object/nmah_1401243) | The Smithsonian catalogs an original MOS MCS6522 preliminary datasheet dated March 1977. This is a documentation bound rather than an exact shipping date. |
| `mos_6532` — MOS 6532 | Documented by 1977 | [documented](https://www.americanhistory.si.edu/collections/object/nmah_1401243) | The Smithsonian catalogs MOS’s MCS6532 datasheet dated February 1977. The previous 1982 catalog bound was too late to place the RIOT used in the original 1977 Atari VCS. |
| `tia` — Atari TIA and missing Atari 2600 support devices | 1977 · original VCS profile | [system](https://atari.com/pages/history) | Anchored to the original 1977 Atari VCS chipset. Earlier development documents and later TIA revisions do not establish one introduction date for every support device. |
| `rtc146818` — MC146818 RTC | 1978 · product preview | [preview](https://bitsavers.org/components/motorola/_dataBooks/1978_Motorola_CMOS_Data_Book.pdf) | Motorola’s 1978 data book previews MC146818/MC146819 on page 6-7, with proposed packages. This dates the family preview, not the later production package fitted in the IBM AT. |
| `mos_6560` — MOS 6560 | Documented by 1980 | [documented](https://www.zimmers.net/anonftp/pub/cbm/documents/chipdata/6560.zip) | The original MOS 6560/6561 datasheet is dated February 1980. This replaces a later 1983 manual-printing bound; it does not assert the first design or shipment date. |
| `mac_scc` — Z8530 SCC family | 1981 · SCC family introduced | [introduced](https://www.zilog.com/docs/serial/ps0117.pdf) | Zilog explicitly dates introduction of its SCC family to 1981. The cited later CMOS datasheet records that history; its own publication year is not the family’s launch year. |
| `intel_8042` — 8042 controller family | Documented by 1982 | [documented](https://bitsavers.org/magazines/Digital_Design/Digital_Design_V12_N08_198208.pdf) | Intel’s UPI-42 (8042) appears in the August 1982 new-product notice. The earlier MCS-48 family launch does not date this specific controller. |
| `mos_6567` — MOS 6567 | By 1982 · original C64 profile | [system](https://www.zimmers.net/anonftp/pub/cbm/schematics/computers/c64/326106-2of2.gif) | The original 1982 C64 uses the 6567 VIC-II (U19 in Commodore schematic 326106). A 1983 reference-guide printing cannot serve as its introduction date; later PAL and die revisions need individual dates. |
| `mos_6581` — MOS 6581 | By 1982 · original C64 profile | [system](https://www.zimmers.net/anonftp/pub/cbm/schematics/computers/c64/326106-2of2.gif) | The original 1982 C64 uses the 6581 SID (U18 in Commodore schematic 326106). The previous 1983 date identified a later manual printing, not the chip’s introduction; the 8580 is later. |
| `nes_parts` — NES/Famicom Ricoh CPU, PPU, APU and cartridge support | 1983 · original Famicom profile | [system](https://www.nintendo.co.jp/corporate/en/history/index.html) | Anchored to Nintendo’s 1983 Japanese Famicom launch. Later NES regional silicon, cartridge mappers and revisions are not all 1983 devices. |
| `ega_chip` — EGA controller family | Documented by 1984 | [documented](https://www.bitsavers.org/pdf/ibm/pc/cards/Technical_Reference_Options_and_Adapters_Volume_2_Apr84.pdf) | IBM’s EGA technical-reference section, dated August 2, 1984, documents the original controller chipset. Later EGA-compatible implementations have separate dates. |
| `mac_floppy` — IWM / SWIM family | By 1984 · IWM in Macintosh | [system](https://vintageapple.org/inside_o/pdf/Guide_to_Macintosh_Family_Hardware_2nd_Edition_1990.pdf) | Apple identifies the IWM in the original Macintosh 128K. This is an in-system availability bound; the later SWIM is not assigned a 1984 launch date. |
| `mac_glue` — Macintosh custom silicon | 1984 · original Macintosh profile | [system](https://vintageapple.org/inside_o/pdf/Guide_to_Macintosh_Family_Hardware_2nd_Edition_1990.pdf) | The original Macintosh’s PAL logic anchors this family. BBU, GLUE, ASC and later I/O processors belong to subsequent machine profiles. |
| `mac_scsi` — NCR 5380 SCSI | 1984 · NCR 5380 introduction | [reported](https://www.endl.com/letter/se100t10.pdf) | The ENDL SCSI history dates NCR’s 5380 introduction to April 1984, following the distinct 5385 in April 1983. Apple’s April 1985 File Server manual independently documents the 5380 in use. |
| `mos_7360` — MOS 7360 | Documented by 1984 | [documented](https://www.zimmers.net/anonftp/pub/cbm/schematics/computers/plus4/C16_Service_Manual_314001-03_(1984_Oct).pdf) | Commodore’s October 1984 C16 service manual lists the 7360 TED and its 8360 substitute. The bound does not date every TED revision. |
| `pc_at_glue` — AT / 386 support silicon | 1984 · original AT profile | [system](https://minuszerodegrees.net/manuals/IBM_5170_Technical_Reference_1502243_MAR84.pdf) | The original IBM AT support circuits anchor this mixed family in 1984. Later 386 chipsets are separate implementation profiles, not 1984 parts. |
| `mac_adb` — Apple Desktop Bus controllers | 1986 · Apple IIgs profile | [system](https://goldstarsoftware.com/applesite/Documentation/AppleIIgsHardwareReferenceManual.PDF) | The original Apple IIgs provides the 1986 ADB anchor; Macintosh II and SE implementations follow in 1987. Individual controller revisions need their own dates. |
| `card_nubus_video` — Macintosh II-family NuBus video adapter | March 1987 · Macintosh II Video Card | [documented](https://fsck.technology/documentation/Apple/Product%20Data%20%28Information%20Exchange%29%20-%201990/displays/macintosh-ii-video-card-8703.pdf) | Apple’s Macintosh II Video Card and Expansion Kit product sheet is dated March 1987. Later NuBus video adapters are separate card profiles. |
| `vga_chip` — VGA controller family | 1987 · original PS/2 VGA profile | [system](https://www.ibm.com/history/ps-2) | IBM dates the PS/2 and its new VGA controller to 1987. Later VGA-compatible chips are subsequent family members. |
| `sb_dsp` — Sound Blaster DSP family | 1989 · Sound Blaster 1.0 profile | [system](https://us.creative.com/soundblaster/ourstory/) | Creative dates the original Sound Blaster to 1989. This anchors its original digital-audio controller profile; later Pro/16 DSPs retain their own dates. |
| `snes_parts` — Super Nintendo CPU, PPU, audio and support devices | 1990 · original Super Famicom profile | [system](https://www.nintendo.co.jp/corporate/en/history/index.html) | Anchored to Nintendo’s 1990 Japanese Super Famicom launch. The US SNES followed in 1991; the representative 1CHIP board photograph depicts a later revision. |

## Source details and corroboration

- **MOS 6530:** MOS Technology, *MCS6500 Microcomputer Family Hardware Manual*, first edition, August 1975, publication 6500-10. PDF page 3 is the dated title; page 5 (printed iii) describes MCS6530. The mirror filename says Mostek, but the scanned title identifies MOS Technology.
- **MOS 6522 / 6532:** Smithsonian object 1991.3201.26 catalogs the original March 1977 preliminary 6522 sheet and February 1977 6532 sheet. These are cataloged original artifacts; the museum’s broad collection title uses MOSTEK, while individual sheet descriptions identify MOS Technology. Do not use the archive upload time as a historical date.
- **MOS VIC:** the [preservation index](https://www.zimmers.net/anonftp/pub/cbm/documents/chipdata/index.html) identifies the original 6560/6561 sheet as 2/80. Its scan carries that date. A 1983 printing of a computer reference book supplies a weaker, later bound.
- **MOS VIC-II / SID:** Commodore schematic 326106, sheet 2, identifies U19 as 6567 VIC and U18 as 6581 SID. The [Computer History Museum’s catalog of Commodore’s original C64 brochure](https://www.computerhistory.org/brochures/doc-4372957127052/) dates the original system to 1982. Together these support availability in the original machine, not a universal date for PAL variants, later VIC-II dies or SID 8580. The 1983 book printing remains valid documentation, but cannot date the original fitted chips after the host.
- **MC6845:** Motorola advance-information sheet AD1-465 (replaces NP-67), copyright 1977, PDF page 1. Later 6845-compatible parts are separate implementations.
- **MC146818:** Motorola *CMOS Data*, Series C, third printing, copyright 1978 (PDF page 4), product preview on printed page 6-7 (PDF page 48). The preview proposes 22-/28-pin devices; it is not proof of the later AT package shipping in 1978. IBM’s [1984 AT Technical Reference](https://minuszerodegrees.net/manuals/IBM_5170_Technical_Reference_1502243_MAR84.pdf), system-board section, independently identifies the fitted MC146818. Preserve the preview qualifier.
- **8042:** *Digital Design*, August 1982, New Products / Components, PDF page 78, reports Intel’s UPI-42 (8042), including Intel contact and pricing. This is a contemporary trade-publication notice, not an Intel-authored datasheet. IBM’s 1984 AT Technical Reference, printed page 1-17 (PDF page 53), independently identifies the Intel 8042 keyboard controller. The 1976 MCS-48 launch alone does not date the 8042.
- **SCC:** Zilog PS011708-0115, printed page 1 (PDF page 11), explicitly recalls the SCC family’s 1981 introduction. The cited CMOS specification is newer; it is used for its manufacturer history statement.
- **NCR 5380:** ENDL’s SCSI history, special edition for T10’s 100th meeting, page 9, reports April 1984 for 5380 and April 1983 for the distinct 5385. This is an industry participant’s retrospective. [Apple’s File Server Theory of Operation, April 1985](https://bitsavers.trailing-edge.com/pdf/apple/file_server/File_Server_Theory_of_Operation_Apr85.pdf), documents NCR5380 in an actual design and corroborates pre-Macintosh-Plus availability. Do not reuse 5385’s date for 5380 or treat later 53C80 as the original NMOS chip.
- **Apple Macintosh profiles:** Apple’s *Guide to the Macintosh Family Hardware*, second edition (1990), printed page 19 (PDF page 58) identifies PALs, SCC and IWM in Macintosh 128K/512K; printed pages 80–81 discuss IWM/SWIM. The original Macintosh profile is 1984. This is a later manufacturer description of earlier hardware, not a 1990 chip launch. SWIM, BBU, GLUE, ASC and IOP implementations remain associated with their later hosts.
- **ADB:** Apple’s original *Apple IIgs Hardware Reference*, copyright 1986, chapter 6 (Apple Desktop Bus), anchors the original IIgs interface. The Macintosh II/SE profiles follow in 1987. Controller packaging and firmware vary by machine.
- **EGA:** IBM *Technical Reference Options and Adapters*, volume 2, EGA section dated August 2, 1984, describes the original graphics-controller circuitry. The bound-volume filename’s April date is not the later insert’s date.
- **TED:** Commodore *C16 Service Manual*, October 1984, PN314001-03, PCB parts list (PDF page 9), identifies U1 IC7360 and substitute IC8360. This establishes a 1984 bound without inventing an earlier standalone launch.
- **NuBus video:** Apple’s *Macintosh II Video Card and Expansion Kit* product sheet, page 2, explicitly says March 1987 and copyright 1987. It identifies the original card and optional VRAM expansion, not later 8•24 adapters.
- **Nintendo / Creative / IBM VGA:** manufacturer histories identify the original host or product launch. [Nintendo’s 2005 annual report](https://www.nintendo.co.jp/kessan/annual0503e.pdf) additionally describes the 1983 Famicom’s custom CPU and PPU. The anchors do not backdate later mappers, SNES 1CHIP silicon, Sound Blaster Pro/16 controllers or VGA clones.
- **TIA:** [Atari’s own history](https://atari.com/pages/history) anchors the original VCS in 1977. The [preserved Atari Stella guide indexed as 1976](https://www.digitpress.com/library/techdocs/2600_Stella_Guide_1976_incomplete.pdf) is incomplete and has no dated title in the surviving excerpt, so it is not used to assert a precise standalone TIA release. The original-host anchor remains explicit.

## Ordering rules

1. Maintain chronological year order and update the era whenever a year changes. Era chapters describe periods, not the bus width of every item.
2. Within each year render complete chip rows, then expansion-card rows, then computer rows. A computer must start below same-year component rows, including at wide desktop widths.
3. A required original chip cannot be placed after the computer that used it. Investigate a late manual, wrong revision or overly broad family before changing dates or dependencies.
4. Keep later optional retrofit cards at their real dates; an optional Sound Blaster for an older AT does not make the card a 1984 product.
5. Preserve stable entry IDs, canonical issues, image attribution and status snapshots when changing history. New evidence can improve an availability bound without silently promoting it to a confirmed launch date.

## PDP-1, IBM and AMD additions

See [PDP-1](pdp1_am29xx.md) for the 1959 original-machine date and explicit later-Am29xx reconstruction exception. See [IBM/AMD profiles](ibm_386_amd_scope.md) for the 1988 Intel SX and Model 70, 1991 IBM 386SLC/Model 35 SX/Am386, 1992 Model 25 SX/Model 56 SLC, and qualified AMD 1983 catalog bounds/previews. The former Compaq 386s SX selection is replaced by IBM Model 25 SX; keep its stable catalog and issue IDs. The historical Compaq flyer is not evidence for the IBM replacement.


The distinct Intel 8088 timeline profile is anchored to 1979 by [Intel's historical reference](https://www.intel.com/pressroom/kits/quickrefyr.htm). PC/XT use 8088; the original PS/2 Model 30 uses 8086. Source-qualified later AMD substitution options may postdate their original host and share a CPU-role wire; they do not change the original date/BOM. See [compatible processor profiles](compatible_chips.md).

## Intel numeric coprocessors

[287 and 387 profiles](coprocessors_287_387.md) retain canonical #113/#115, distinguish 387DX/SX history and host interfaces, and record optional machine configurations without adding base-machine blockers. The 387SX has a separate photograph and a November 1988 manufacturer-document bound.

## Roland LAPC-I

`card_roland_lapc_i`: **Documented by 1989**, from the copyright on PDF page 2 of [Roland’s original manual](https://cdn.roland.com/assets/media/pdf/LAPC-1_OM.pdf#page=2). This is a documentation bound. [The 1995 support supplement](https://cdn.roland.com/assets/media/pdf/MPU401_Setup.pdf) describes setup, not introduction. See [the card profiles](roland_isa.md).

## Support chipsets

Intel 82230/82231: **Documented by 1988**, Intel 240017-002, August 1988, printed 4-667 / PDF 1185. CHIPS NEAT CS8221: **Documented by 1987**, data-book opening pages, 10/87 Rev 0. [Sources and scope](chipsets.md). Photos show representative members and do not establish first shipments or exact board fit.

## Early AMD within-year order

The owner specified Am9300 before Am2501. Retain both existing 1970 documentation bounds and place Am9300 first in catalog order; no precise introduction month/day is inferred. See [direct maker links](maker_row_links.md).
