# Roland LAPC-I timeline and ISA options

The canonical [card issue #183](https://github.com/hevangel/ai_engineer/issues/183) is already a Todo / Cards item in [Project 1](https://github.com/users/hevangel/projects/1). The webpage uses stable ID `card_roland_lapc_i`, `kind: card`, `bus: isa`, a local photograph and JSON-derived status. Keep the tracker and its required ISA dependency #51; optional host choices do not add base-machine blockers.

## Historical and physical evidence

Roland’s [original owner’s manual](https://cdn.roland.com/assets/media/pdf/LAPC-1_OM.pdf) has copyright **1989** on PDF page 2. The history label is **Documented by 1989**; no exact release month or day is inferred. PDF page 3 requires a full-length **13-inch** expansion slot, and pages 4–5 illustrate installation. The pictured board is an actual ISA LAPC-I; it is not an external MT-32, LAPC-N or SCC-1.

The [manufacturer’s July 10, 1995 setup supplement](https://cdn.roland.com/assets/media/pdf/MPU401_Setup.pdf), pages 1–2, identifies LAPC-1, address/IRQ conflicts and selectable settings. This later support note is not used to date the card’s launch. ROM, PCB and software revisions still need an implementation source inventory; inspecting these references does not establish cleaned-source percentages or verification.

The [Commons photograph](https://commons.wikimedia.org/wiki/File:Lapc-1.jpg) is CC BY-SA 2.5. Commons infers author Atarian~commonswiki and own-work provenance from copyright claims; preserve that qualification and the license in `images/credits.json`. The local JPEG is optimized without cropping/recoloring.

## Planned hosts and diagram

The selected optional profiles are IBM AT 5170, Compaq Deskpro 386, IBM PS/2 Model 25 SX and Model 35 SX. Match full-length clearance, slot/riser geometry, power, IRQ routing and I/O allocation for the exact machine before acceptance. The SX configurations remain explicit candidates pending physical-fit qualification. These records do not assert factory installation or simultaneous compatibility with every other optional card. Do not attach this ISA card to Model 70, Model 80 or Model 56 SLC Micro Channel buses.

`data/system-options.json` holds the four choices and their evidence. After connection sync, they join the single far-right ISA family rail alongside AdLib and Sound Blaster. The chooser retains the four exact host profiles. The card tap leaves its bottom edge and joins the shared row run below the complete row; computer taps arrive from above. Optional taps stay dotted. There are no individual left-side card wires. Filters, member chooser, keyboard navigation and the layer toggles apply normally. No card subtitle is rendered.

## Maintenance checks

`check-site.mjs` now rejects an ISA catalog card with no connected computer. The bus tests explicitly include LAPC-I in both selected SX audio buses, preserve per-host separation, retain every evidence link and reject orphan ISA cards. Refresh status and connection JSON after editing these profiles. No new native system dependencies are required for optional audio.

See [shared bus-family rails](expansion_buses.md) for unique card/computer taps, one horizontal run per family on a row, bottom/top routing and exact connection choosers.
