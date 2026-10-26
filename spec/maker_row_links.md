# Direct maker links within a row

Am9300 precedes the combined Am25xx series card, whose earliest member is Am2501. Both cards retain their existing **Documented by 1970** bound; Am9300 is on the left and Am25xx next. The Am2501 and Am2505 member identities and separate dates remain in the series ledger; no exact launch month/day is inferred.

Adjacent visible chips from one maker on the same year/category row connect directly across the gap. Use hollow pads on the right edge of the earlier chip and left edge of the next chip, with one horizontal segment aligned within the photo area. These links reserve no top/bottom row tracks and no right-gutter lane. Other maker connections keep bottom-to-top PCB routing in the right gutter. Never draw a direct wire across a third card, another year group or a wrapped row.

Compute adjacency from actual rendered columns inside each width-fitting pass, after filtering. At one column the same link returns to the gutter. Preserve bidirectional clicking, Enter and arrow-key navigation; transparent rectangular hit areas give horizontal segments a usable mouse/keyboard target. Maker lineage controls these links normally. Company colors and canonical issue/status data remain unchanged.

`assets/maker-layout.js` supplies adjacency and horizontal geometry. Run `node --test scripts/maker-layout.test.mjs` with the existing suite. Verify the AMD 1970 order, a two/three-column direct segment, the one-column fallback, filters, endpoint/keyboard navigation and the absence of extra row-track spacing.

After the Am25xx consolidation there is no separate Am2505 card. Verify the direct Am9300 → Am25xx link in the shared 1970 row. Am25xx → Am3101 spans different year groups and keeps its routed maker connection.
