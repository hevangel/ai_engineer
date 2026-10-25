# Shared expansion-bus family rails

The owner replaced repeated per-computer bus rails with **one rail per visible bus family**, and one horizontal run per family on each row. ISA, NuBus, Apple II slots and S-100 remain separate. The diagram summarizes recorded configurations; it does not electrically connect separate computers or assert every card/host combination.

## Membership and navigation

`groupExpansionBuses` groups only recorded `kind: card` links whose source and target are both visible. The group retains every original `links` record and its evidence, note and required/optional type. `cards` and `systems` contain unique endpoint IDs, giving one pad per endpoint per family. Coprocessors and other chips never enter an expansion bus. In the current full view, 25 exact card relationships use four family rails rather than 12 repeated host rails.

A card or computer with one recorded counterpart jumps directly to it. An endpoint with several counterparts opens only its recorded connections. A family rail or horizontal run opens the family connection list, showing source and target separately with required/planned labels and expandable evidence/configuration. Never generate the cross product of card and computer members. Original machine compatibility, physical-fit qualifications and completion blockers remain unchanged.

## Routing

Place the family rails on the far right beyond maker lineage, with one label per family. All expansion cards exit through hollow bottom pads near their right corner. Computer pads are on the top edge near the right corner and receive their paths from above. Multiple families on an endpoint receive separate pads.

Each row has a single horizontal run per family/direction. Card runs sit below the **complete row**, after outgoing chip tracks; computer runs sit above the complete row and its incoming chip tracks. Short vertical stubs turn through 45-degree chamfers into the shared horizontal run. This lets a left card join without passing through a neighboring card. The family whose rightmost endpoint is furthest right gets the nearest track, so its stub stops before a more distant row run. Filled dots identify joins; unrelated crossings do not acquire junctions.

Reserve row space before measuring coordinates. Recompute groups, rows, tracks, ports and rail spans after filters, responsive column changes or layer toggles. Show wires removes all rails, stubs, pads, chooser targets and gutters. A focused computer naturally shows only that computer and its recorded card choices on each relevant family rail.

Short card stubs retain required/optional patterns. A shared row run and family rail are neutral family membership, not a requirement that every option be installed. The chooser retains per-relationship meaning. Existing compatible CPU trunks and chip/maker routes are independent.

## Checks

Run the bus, compatible-CPU, status and window-fit tests. Test one ISA/NuBus rail, unique endpoint taps, exact evidence retention, absent cross-product/hidden-host connections, one horizontal row run per family, bottom/top tap geometry and track order. In the browser inspect the 1987 AdLib/VGA/NuBus row and computer rows at three, two and one columns, the endpoint and family choosers, keyboard navigation and Show wires.
