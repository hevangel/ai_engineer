# AI Engineer

**[Explore the hardware history timeline →](https://hevangel.github.io/ai_engineer/)**

Rebuild classic computers from the chips up. AI Engineer brings together a long-term effort to recreate historical chips in SystemVerilog, complete computers with web front panels and simulation backends, physical FPGA builds, and their firmware, operating systems and applications in Rust.

The timeline is the public window into that work. Browse the machines, follow their components, open the source material, and see what has actually been built and verified. A roadmap entry describes a goal; its badges and linked evidence describe its progress.

## Explore the timeline

Scroll from the PDP-1 and early microprocessors through the 386 and 68030 generation, or use the year rail to jump through time. Search for a chip or machine, filter by maker or build stage, and choose a computer to see its recorded components.

The timeline starts with maker lines for a clearer overview. Choose a computer to see its component wires; turn on **All computer links** to show the complete diagram. Returning to **All computers** restores the overview.

The connections show different relationships:

- **Company lines on the right** follow chip families from the same maker; adjacent chips on a row connect directly across their gap. Intel is blue, AMD red, Motorola indigo and MOS/Commodore green.
- **Chip links on the left** show recorded prerequisites for a computer build. Pin/function-compatible processors share one CPU-role wire; choose the original part or a qualified substitute from that wire. Dotted left wires show planned optional coprocessors such as 287 and 387DX/SX. A separately marked reconstruction link identifies later implementation parts, such as Am29xx for the PDP-1.
- **Shared expansion buses on the far right** group cards and computers by bus family, with one ISA rail, one NuBus rail and so on. Cards connect from below and computers from above. Click a shared connection to see the exact recorded card-to-computer choices; each machine keeps its own configuration.

Click a wire or its endpoint circle to follow the connection. Click a shared bus to choose one of its cards or its computer. The destination is highlighted. Keyboard users can Tab to a connection and press Enter; paired chip wires also support ↑/`k` and ↓/`j`, and maker wires ←/`h` and →/`l`. With a card selected, ←/`h` and →/`l` walk its maker's family line and ↑/`k` and ↓/`j` move between a chip and its computers. Use **Maker lineage** and **All computer links** to choose which wires are drawn.

Motherboard chipsets appear as one card listing their cooperating member chips. Searching a member’s part number finds its chipset card.

Click a hardware title to open its GitHub issue. The photo information button opens its source and license. Representative photos, later revisions and uncertain historical dates are labeled.

## The software view

The **Hardware / Software** switch in the top right opens the software view: each computer on the left, followed by its operating systems, drivers, firmware and software (grouped by category), joined by dependency and lineage arrows. Every title is a plan to download the original, reverse engineer it with [REA](https://github.com/morluto/rea), rewrite it in Rust and prove it identical on both an open-source emulator and our Rust emulator. Details are in [spec/software_view.md](spec/software_view.md).

## What we are rebuilding

The current roadmap covers classic chip families and systems through **Intel 386DX/SX, IBM 386SLC, AMD Am386 and Motorola 68030 Macintosh** machines. It includes the earlier Intel and MOS generations, Apple II and Macintosh systems, IBM PCs and PS/2s, selected arcade and console hardware, and a planned **18-bit PDP-1 reconstruction using Am29xx**.

The numeric-coprocessor roadmap includes **Intel 80287 and distinct 80387DX/SX profiles**, with optional host configurations recorded separately from the base machine. See the [coprocessor plan](spec/coprocessors_287_387.md).

Expansion hardware matters too: storage, displays, serial interfaces and sound are part of a usable machine. The roadmap includes S-100, Apple II slots, ISA, Micro Channel and NuBus work, with **AdLib, Sound Blaster and Roland LAPC-I** audio among the planned profiles. Exact card revisions, slot fit, firmware, drivers and software still need qualification.

Each complete system has several connected goals: documented behavior and source material, chip implementations, authentic-software regressions, a web interface driven by an SV simulator, Rust software and any missing compiler support, and a separately qualified FPGA realization. Working on one part does not establish that the whole machine is finished.

## Read the progress badges

The status guide on the website explains every icon:

| Stage | Meaning |
| --- | --- |
| Planned | Scope is on the roadmap |
| Researching | Requirements and source material are being assembled |
| Sources ready | The defined source set is collected and cleaned |
| Building | Implementation is in progress |
| AI verified | Linked evidence records an AI verification result |
| Human verified | A named human approval links supporting evidence |

Source coverage measures cleaned items against an explicitly defined source inventory. An em dash means coverage has not been reported. Build health is shown separately. Closing an issue does not establish verification.

The website reads a checked-in snapshot of GitHub issue/project metadata. It does not query GitHub from your browser, and a source refresh is separate from publishing the site. Follow an item's issue for its latest evidence and discussion.

## The projects behind the site

| Project | Responsibility |
| --- | --- |
| [AI Hardware Engineer](https://github.com/hevangel/ai_hw_engineer) | Chip RTL, verification, complete machines and simulation backends |
| [AI Software Engineer](https://github.com/hevangel/ai_sw_engineer) | Rust reconstructions, target software and compiler/toolchain work |
| [HDL Workbench](https://github.com/hevangel/hdl-workbench) | The working HDL development environment, integrating Xezim simulation and Surfer waveforms |
| [e1647-rs](https://github.com/hevangel/e1647-rs) | Experimental Rust tooling for the IEEE 1647 e verification language; tokenizer and CLI starter, with parsing and execution planned |
| AI FPGA Engineer — planned | Future board selection, FPGA integration and physical verification; repository not yet created |

AI Engineer is the umbrella website and shared roadmap. The existing projects keep their own repositories and histories and are included here as pinned Git submodules. The timeline presents the work; it does not run the chip simulators itself.

See the [initial project plan](spec/initial_project_plan.md), [386/68030 scope](spec/era_386_scope.md), [IBM/AMD profiles](spec/ibm_386_amd_scope.md) and [PDP-1 plan](spec/pdp1_am29xx.md) for the detailed inventory. The [GitHub Project](https://github.com/users/hevangel/projects/1) coordinates dependencies across the projects; board access follows its existing visibility settings.

## Run the website locally

You need Node.js 22 or newer. No package installation or build is needed to serve the checked-in page:

```sh
git clone https://github.com/hevangel/ai_engineer.git
cd ai_engineer
node scripts/serve.mjs
```

Open **http://127.0.0.1:4173/**. Serve the page over HTTP so its JSON files load correctly.

To explore the hardware/software projects as well, run `git submodule update --init`. Initialize nested dependencies only when you need them; some are large.

Maintainers can find status-refresh commands, checks and release instructions in [scripts/README.md](scripts/README.md) and the [website maintenance guide](spec/website.md). GitHub Pages serves a static snapshot from the generated `gh-pages` branch.

## Website content

Editable content lives under `data/`: hardware facts in `catalog.json`, shared wording and page copy in `ui.json`, badge definitions in `stages.json`, and attribution in `photo-credits.json`. Photo-import choices and synchronization metadata also have their own JSON files. JavaScript handles rendering and interaction. Every displayed photo is checked into `images/`; browsers load relative local files, while external links provide source and attribution only. When an exact, reuse-cleared photograph is still unsourced, the card says “Photo needed” and its info dialog records any qualified source leads instead of borrowing a different chip’s picture.

After changing page copy in `data/ui.json` or the layout template, run `node scripts/render-site.mjs` to refresh the static `index.html`. The page keeps its introductory copy, metadata and fallback links even when JavaScript cannot load. `node scripts/check-site.mjs` checks that the generated page matches its JSON sources.

## Help improve the project

Report a historical error, suggest a system or card profile, contribute source references, or review implementation and verification evidence through GitHub issues and pull requests.

Changes in these repositories are authored by AI agents at human direction. Humans define requirements and review, approve or reject the resulting work. See [CONTRIBUTING.md](CONTRIBUTING.md) for the process; agents start with [AGENTS.md](AGENTS.md).

Photographs retain their individual licenses and credits in [data/photo-credits.json](data/photo-credits.json). Each project also has its own licensing terms; check the relevant repository before reusing its content.
