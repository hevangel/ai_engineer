# Grouped motherboard chipset cards

The owner requested one public card per cooperating non-CPU chipset. The first explicit profiles are:

| Chipset | Member chips | Canonical issue | Historical bound |
| --- | --- | --- | --- |
| Intel 82230 / 82231 AT-compatible support chipset | 82230, 82231 | [#203](https://github.com/hevangel/ai_engineer/issues/203) | Intel 240017-002, August 1988, printed 4-667 / PDF page 1185. Documentation bound; not a shipping-date assertion. |
| CHIPS NEAT CS8221 — 82C211 / 82C212 / 82C215 / 82C206 | 82C211, 82C212, 82C215, 82C206 | [#204](https://github.com/hevangel/ai_engineer/issues/204) | CHIPS CS8221 NEAT Data Book, 10/87 Rev 0, pages 1–2. Documentation bound; not a shipping-date assertion. |

## Public contract

Each is a single catalog entry with `kind: chip` and a `chipset` object containing HTTPS `evidence` and an ordered `members` array of `{part, role}` records. Render the meta label **CHIPSET** and every member/role inside the same card. The card has one historical date, photograph, canonical issue, status snapshot and wire endpoint set. Search includes member part numbers and roles, so searching 82C212 returns the NEAT card. Do not add CPU members or create separate duplicate member cards for these two sets.

Member rows are requested content, not the repetitive descriptive subtitles removed from all cards. Existing cards without chipset metadata retain their current presentation. Maker lineage, filters, optional links, navigation and responsive routing operate on the whole group as one chip entry. Required computer wires must select the actual chipset as a unit once the original motherboard is sourced. Separate stock IBM AT/PS/2 boards do not acquire these sets simply because the register interfaces are AT-compatible.

## Engineering and statuses

Each chipset has one Chips / Todo family issue with a member checklist. Per-member RTL contracts, assumptions, unit verification and a full integration gate remain necessary. A family-level verification badge requires every scoped member and the chipset integration evidence; one verified member cannot verify the group. No verification or source percentages are invented. #122 remains the motherboard inventory and links both concrete families.

Generic 8259, 8237, 8254 and other independently used physical chips keep their canonical issues/cards and existing original-board prerequisites. Intel’s integrated replacements implement those functions without requiring extra instances of the separate physical chips. Group by a sourced physical set, not by a shared register interface, manufacturer or presence on one board. No selected original IBM machine is currently asserted to use either newly added chipset.

## Dates and photographs

Intel 240017-002 is dated August 1988, printed page 4-667 (PDF page 1185 in the linked 1989 handbook). The CHIPS CS8221 book’s opening pages identify all four members and carry **10/87 Rev 0**. Both public dates are **Documented by**, rather than guessed first shipments. Keep those document dates separate from dates printed on later photographed silicon.

The Intel photo shows **N82230-2** and retains ZyMOS attribution / CC BY-SA 4.0. The NEAT representative photo shows **P82C206 on a motherboard**, with Smial/Rainer Knäpper attribution under the Free Art License. It does not establish that the pictured board is a complete NEAT implementation. Both captions explicitly identify the pictured member and the remaining unpictured chips. Preserve each photo’s individual license and source in `data/photo-credits.json`.

## Maintenance

`check-site.mjs` rejects a chipset with fewer than two members, duplicate part names, missing roles, non-chip routing or missing HTTPS evidence. Refresh status and connection snapshots after catalog changes. Every future machine link needs exact board/ROM evidence; never automatically replace a required general-purpose peripheral with a functionally similar integrated chipset. Follow the existing static publication and PR workflow.
