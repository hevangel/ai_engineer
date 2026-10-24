# Intel 287 and 387 reconstruction profiles

Canonical Chips trackers: [80287 family #113](https://github.com/hevangel/ai_engineer/issues/113) and [80387 DX/SX family #115](https://github.com/hevangel/ai_engineer/issues/115), both in [Project 1](https://github.com/users/hevangel/projects/1). Reuse these issues; separate timeline profiles do not create duplicate family trackers. No implementation or verification is asserted.

## Device members and history

- 80287: retain the 1982 family history entry. Source the legacy HMOS interface/semantics separately from the later 80287XL; existing 8087 RTL does not establish 287 correctness.
- 80387DX: retain the stable `intel_80387` ID and 1987 original-family date, with its actual PGA photograph.
- 80387SX: `intel_80387sx`, a separate 68-pin PLCC photograph and 16-bit host profile under #115. Intel datasheet 240225-002 is dated **November 1988**, printed page **4-450**, PDF page **968** of the [1989 Microprocessor and Peripheral Handbook, volume 1](https://www.bitsavers.org/components/intel/_dataBooks/1989_Intel_Microprocessor_and_Peripheral_Handbook_Vol_1.pdf#page=968). Label **Documented by 1988**, rather than infer a shipment date or copy the DX’s 1987 introduction. The handbook’s original 80387 sheet, printed 4-133 (PDF 651), identifies its distinct 68-pin PGA package and 32-bit data interface. Equal pin counts do not mean interchangeable pinouts.

## Optional machine profiles

| Device | Host | Evidence and qualification |
| --- | --- | --- |
| 80287 | IBM PC/AT 5170 | [IBM Technical Reference, March 1984](https://minuszerodegrees.net/manuals/IBM_5170_Technical_Reference_1502243_MAR84.pdf), math-coprocessor section. Match clock, grade and motherboard. |
| 80387DX | IBM PS/2 Model 70 386 | [Preserved IBM specification](https://www.ardent-tool.com/qtechinfo/GJAN-43WJX8.html) explicitly lists the optional 80387. Select exact 8570 planar and speed. |
| 80387SX | IBM PS/2 Model 35 SX | [Planar inventory](https://www.ardent-tool.com/35_40/), U29 i387SX socket; manufacturer [announcement 191-075](https://www.ardent-tool.com/35_40/191-075.txt) establishes the 20 MHz SX and math socket. |
| 80387SX candidate | IBM PS/2 Model 25 SX | [IBM announcement 192-019](https://www.ardent-tool.com/8525/192-019.txt) specifies a 16 MHz 386SX and math socket. The candidate type is an inference from the host interface; exact K00 planar/socket still requires confirmation. |
| 80387SX | IBM PS/2 Model 56 SLC | [8556 planar inventory](https://www.ardent-tool.com/8556/), U41 accepts a PLCC 387SX socket or CPU upgrade module. Match adapter and 20 MHz part; do not confuse the alternative CPU upgrade with an FPU. |

These are optional configurations, not base-machine POST blockers, claims of original installation or verified board compatibility. Do not infer that every 386DX host uses 387DX: early machines can use 287 interfaces. Compaq Deskpro 386 and Model 80 options remain unconnected pending exact board evidence.

## Acceptance

Inventory exact silicon stepping, package, speed, board/ROM and errata before RTL. Write spec, implementation plan and an assumption ledger. Verify x87 stack/tag/control/status behavior, integer/BCD and floating formats, rounding modes, precision, signed zero, infinities, NaNs, denormals, exceptions and restart/wait behavior against independent artifacts. Exercise CPU bus/handshake, reset, BUSY/ERROR and IRQ routing with the selected host. Run original floating-point software and retain independent numeric traces, software/ROM provenance and reproducible formal/simulation reports. Qualify legacy 287, 287XL, 387DX and 387SX differences explicitly. FPGA timing/resource acceptance remains separate. Never infer implementation from a checked task or Done status.

## Website maintenance

`data/system-options.json` accepts chip and card sources targeting systems, each with HTTPS evidence and a qualifying note. Connection sync emits `type: optional` without changing GitHub blockers. Coprocessors use individual dotted left wires and bottom/top hollow pads; expansion cards keep their shared far-right buses. Tooltips identify the planned option and show its qualification, including the Model 25 SX inference. The computer filter includes these options. Both 387 cards derive status from canonical #115; photographs and credits remain separate. Refresh both JSON snapshots after changing profiles. Do not add card subtitles.
