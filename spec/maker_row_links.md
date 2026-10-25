# Direct maker links within a row

The owner specified Am9300 before Am2501. Both entries retain their existing **Documented by 1970** bound; the catalog order places Am9300 on the left and Am2501 next. This display ordering does not invent an exact launch month/day or rename the specific Am2501 profile to a different part.

Adjacent visible chips from one maker on the same year/category row connect directly across the gap. Use hollow pads on the right edge of the earlier chip and left edge of the next chip, with one horizontal segment aligned within the photo area. These links reserve no top/bottom row tracks and no right-gutter lane. Other maker connections keep bottom-to-top PCB routing in the right gutter. Never draw a direct wire across a third card, another year group or a wrapped row.

Compute adjacency from actual rendered columns inside each width-fitting pass, after filtering. At one column the same link returns to the gutter. Preserve bidirectional clicking, Enter and arrow-key navigation; transparent rectangular hit areas give horizontal segments a usable mouse/keyboard target. Maker lineage controls these links normally. Company colors and canonical issue/status data remain unchanged.

`assets/maker-layout.js` supplies adjacency and horizontal geometry. Run `node --test scripts/maker-layout.test.mjs` with the existing suite. Verify the AMD 1970 order, a two/three-column direct segment, the one-column fallback, filters, endpoint/keyboard navigation and the absence of extra row-track spacing.

The same adjacent-cell rule covers Am2505 → Am3101 in the 1971 chip row. Their existing order and qualified dates remain unchanged; check this pair in the unfiltered overview, not only the AMD filter.
