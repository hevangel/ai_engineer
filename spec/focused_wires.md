# Focused wire overview

The default timeline is a **maker overview**: Show wires and Maker lineage are enabled; All computer links is disabled. No chip/computer, optional coprocessor, shared CPU-choice or expansion-bus paths/pads/hit targets reserve routing space until computer links are requested. Dates, cards and all connection JSON remain intact.

Selecting a computer from the selector or its Trace components button filters to that machine and its recorded parts, enables computer links and disables maker lineage. This gives one focused computer diagram. Maker lineage remains independently available through its checkbox. Returning to All computers restores the maker-only overview. The empty-result reset also restores that layer choice.

The computer-link checkbox says **All computer links** while browsing all machines; checking it explicitly restores the complete cross-computer diagram. It says **Computer links** for a selected machine. Existing company/category/search/stage filters continue to apply. The context hint describes the view and how to restore detail.

Show wires is still the master: it hides all traces, pads, hit targets, context/help and collapses gutters. Selecting a machine while wires are hidden does not turn the master back on. Toggling the master preserves the current layer choices. Existing right-side maker lines, left-side chip links, shared CPU roles and far-right expansion buses keep their documented routing and navigation behavior.

This is a presentation default, not a change to native prerequisites, compatibility, optional profiles, board scope or issue status. Keep every relationship in JSON. Do not remove edges or change required/optional meaning to reduce clutter. Grouped chipsets continue to expose one card and endpoint set each.

## Verification

Check a fresh overview has no computer/bus paths or left gutter; a selected IBM ISA host shows its original/compatible CPU choices, optional coprocessor and shared audio bus while maker paths are absent. Check the explicit full view restores every recorded visible relation, switching between hosts never mixes bus membership, and All computers restores maker overview. Exercise Show wires, keyboard navigation, chipsets, desktop and narrow layouts.

The connection legend shows only layers currently drawn. Summary counts omit empty layers, and maker-only navigation help omits the bus chooser instructions.
