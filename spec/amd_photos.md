# Early AMD photograph audit

The original importer used `brandFallbacks.amd = "AMD Am2901"` when an exact photo search failed. This produced the same Am2901 photograph on Am9300, Am2501, Am2505, Am3101, Am9102 and Am9517 cards. An Am2901 is appropriate for the Am29xx family, not those unrelated devices. The brand fallback is removed; unresolved entries require an exact result before import.

## Verified replacements

All four replacement images are original JPEGs by Christian Bassow under **CC BY-SA 4.0**, downloaded unchanged. Package markings were visually inspected. Attribution and download URLs are in `data/photo-credits.json` and exact-file selections in `data/image-import.json`.

| Card | Actual photographed device | Source |
| --- | --- | --- |
| Am9300 | AMD 930059X, visibly marked 930059X with AMD logo | [Commons](https://commons.wikimedia.org/wiki/File:AMD_930059X_1.jpg) |
| Am3101 | AMD AM3101E, visibly marked AM3101E | [Commons](https://commons.wikimedia.org/wiki/File:AMD_AM3101E_1.jpg) |
| Am9080 | AMD AM9080ADC, marked AM9080ADC and IC8080A | [Commons](https://commons.wikimedia.org/wiki/File:AMD_AM9080ADC_1.jpg) |
| Am9511 | AMD AM9511A-1DC, a later A-family variant | [Commons](https://commons.wikimedia.org/wiki/File:AMD_AM9511A_IDC_1.jpg) |

The Am9511A photograph remains explicitly representative of the earlier family. Captions name every pictured variant; historical catalog dates and implementation states do not change. The actual Am2901 image remains on Am29xx only.

## Still unsourced

| Card | Research result |
| --- | --- |
| Am2501 | Ken Shirriff shared an Am2501 reference; an exact reuse-cleared photo has not been verified. |
| Am2505 | Exact-number web/image and Commons searches did not establish an authentic reusable chip photograph. Search engines frequently confuse it with modern AM5 hardware and unrelated products. |
| Am9102 | Chipsetc shows an Am9102 collector paperweight; photo reuse permission has not been established. |
| Am9517 | A collector page shows Am9517 and Am9517-5 packages; photo reuse permission has not been established. |

These four cards use `image.status: "needed"`, with qualified leads in their info dialogs. They must not revert to generic Am2901 photos or republish candidate images as licensed assets. No permission requests have been sent to image owners. Searches covered exact part numbers, numeric package-name variants, Commons bitmap searches/file inventories, collector and museum pages, and image search. This records an unresolved source search, not a claim that no such photos exist.
