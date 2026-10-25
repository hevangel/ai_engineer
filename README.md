# AI Engineer

**[Explore the hardware history timeline →](https://hevangel.github.io/ai_engineer/)**

Rebuild classic computers from the chips up. AI Engineer brings together a long-term effort to recreate historical chips in SystemVerilog, complete computers with web front panels and simulation backends, physical FPGA builds, and their firmware, operating systems and applications in Rust.

The timeline is the public window into that work. Browse the machines, follow their components, open the source material, and see what has actually been built and verified. A roadmap entry describes a goal; its badges and linked evidence describe its progress.

## Explore the timeline

Scroll from the PDP-1 and early microprocessors through the 386 and 68030 generation, or use the year rail to jump through time. Search for a chip or machine, filter by maker or build stage, and choose a computer to see its recorded components.

The timeline starts with maker lines for a clearer overview. Choose a computer to see its component wires; turn on **All computer links** to show the complete diagram. Returning to **All computers** restores the overview.

The connections show different relationships:

- **Company lines on the right** follow chip families from the same maker. Intel is blue, AMD red, Motorola indigo and MOS/Commodore green.
- **Chip links on the left** show recorded prerequisites for a computer build. Pin/function-compatible processors share one CPU-role wire; choose the original part or a qualified substitute from that wire. Dotted left wires show planned optional coprocessors such as 287 and 387DX/SX. A separately marked reconstruction link identifies later implementation parts, such as Am29xx for the PDP-1.
- **Shared expansion buses on the far right** group cards and computers by bus family, with one ISA rail, one NuBus rail and so on. Cards connect from below and computers from above. Click a shared connection to see the exact recorded card-to-computer choices; each machine keeps its own configuration.

Click a wire or its endpoint circle to follow the connection. Click a shared bus to choose one of its cards or its computer. The destination is highlighted. Keyboard users can Tab to a connection and press Enter; paired chip wires also support ↑ and ↓. Turn off **Show wires** for a simpler view.

Motherboard chipsets appear as one card listing their cooperating member chips. Searching a member’s part number finds its chipset card.

Click a hardware title to open its GitHub issue. The photo information button opens its source and license. Representative photos, later revisions and uncertain historical dates are labeled.

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
| AI FPGA Engineer — planned | Future board selection, FPGA integration and physical verification; repository not yet created |

AI Engineer is the umbrella website and shared roadmap. The existing projects keep their own repositories and histories and are included here as pinned Git submodules. The timeline presents the work; it does not run the chip simulators itself.

See the [initial project plan](spec/initial_project_plan.md), [386/68030 scope](spec/era_386_scope.md), [IBM/AMD profiles](spec/ibm_386_amd_scope.md) and [PDP-1 plan](spec/pdp1_am29xx.md) for the detailed inventory. The [GitHub Project](https://github.com/users/hevangel/projects/1) coordinates dependencies across the projects; board access follows its existing visibility settings.

## Run the website locally

You need Node.js 22 or newer. There is no package installation or build step:

```sh
git clone https://github.com/hevangel/ai_engineer.git
cd ai_engineer
node scripts/serve.mjs
```

Open **http://127.0.0.1:4173/**. Serve the page over HTTP so its JSON files load correctly.

To explore the hardware/software projects as well, run `git submodule update --init`. Initialize nested dependencies only when you need them; some are large.

Maintainers can find status-refresh commands, checks and release instructions in [scripts/README.md](scripts/README.md) and the [website maintenance guide](spec/website.md). GitHub Pages serves a static snapshot from the generated `gh-pages` branch.

## Help improve the project

Report a historical error, suggest a system or card profile, contribute source references, or review implementation and verification evidence through GitHub issues and pull requests.

Changes in these repositories are authored by AI agents at human direction. Humans define requirements and review, approve or reject the resulting work. See [CONTRIBUTING.md](CONTRIBUTING.md) for the process; agents start with [AGENTS.md](AGENTS.md).

Photographs retain their individual licenses and credits in [images/credits.json](images/credits.json). Each project also has its own licensing terms; check the relevant repository before reusing its content.
