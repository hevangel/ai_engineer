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

## User-supplied Am25xx photo and consolidated scope

The owner supplied [this locally downloaded Am2501DC JPEG](https://pbs.twimg.com/media/EOqxpz0U8AIOCds?format=jpg&name=small), from [Ken Shirriff’s post](https://x.com/kenshirriff/status/1218982024070955009). Its package marking was visually inspected. The post identifies the photographed device as dating to 1985; no reuse license is stated. The credit explicitly records `provenance: user-supplied` and `rightsStatus: unspecified`, with the exact source registered under `userSupplied` in `data/image-import.json`. It must not be labeled Creative Commons without additional evidence.

Am2501 and Am2505 now share one **AMD Am25xx series** card and canonical issue #5. The Am2501DC photo illustrates that series, with a caption explaining that Am2505 is not pictured. There is no separate Am2505 card or active issue; historical issue #6 is superseded. The stable Am2501 catalog ID is retained.

## Still unsourced

| Card | Research result |
| --- | --- |
| Am9102 | Chipsetc shows an Am9102 collector paperweight; photo reuse permission has not been established. |
| Am9517 | A collector page shows Am9517 and Am9517-5 packages; photo reuse permission has not been established. |

These two cards use `image.status: "needed"`, with qualified leads in their info dialogs. They must not revert to generic Am2901 photos or republish candidate images as licensed assets. A separate reuse-cleared Am2505 photo was not found; it is not needed for an additional card after the series consolidation. No permission requests have been sent to image owners. The earlier searches covered exact numbers, numeric package variants, Commons files, collector/museum pages and image search; they do not establish that no other photographs exist.

## Local asset policy

Every displayed photograph is a tracked JPEG/PNG under `images/`, referenced by a relative `image.src`. `source` and `downloadedFrom` are provenance and maintenance metadata, not runtime image sources. `check-site.mjs` rejects external catalog image paths, remote image tags and remote CSS asset URLs. A source site disappearing cannot break the checked-in website image.
