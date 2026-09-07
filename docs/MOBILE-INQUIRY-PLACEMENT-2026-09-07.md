# Mobile inquiry placement — September 7, 2026

The owner observed that the first optimization release looked unchanged. Most of that release improved speed, previews and inquiry reliability; it did not establish optimal conversion performance. Do not present maintenance work as a verified conversion lift.

This follow-up puts the inquiry form directly after the main offer on layouts up to 1100px. Benefits and metrics remain available below it. The DOM follows intro → form → proof; the desktop grid keeps proof left and the form right. Existing headline, form fields, validation requirements, API contract, campaign context and proof copy are preserved.

Chrome and WebKit at 390×844 place the form at about 403px instead of 854px. The first field now finishes at 781–782px instead of 1249–1251px. These are layout coordinates, not conversion rates or guarantees about every phone's browser chrome.

A baseline 320px overflow was also reproduced. Shrinkable hero grid tracks, two-column narrow metrics, and a single-column location grid prevent it. The appointment/contact line now wraps as normal text so its dot and separators do not occupy stray lines.

## Regression gates

- Run the configured build and `node tests/hero-placement.cjs` with installed Playwright Chrome/WebKit runtimes. `PLAYWRIGHT_MODULE` may select the configured tool runtime.
- Optional `QA_BASELINE_HTML` points to the frozen pre-change homepage. Optional `QA_OUTPUT_DIR` collects screenshots and coordinates. Both are owner-side QA inputs, never production dependencies.
- Seven widths: 320, 390, 430, 768, 1100, 1101, 1440. Verify no overflow, proof follows the form on stacked layouts, desktop form/heading/proof positions remain aligned, and all qualifiers are preserved.
- Run `node tests/browser.cjs`, `node tests/packaging.cjs`, and `node tests/blog-navigation.cjs`. Browser inquiries are intercepted fixtures. Never infer actual inbox delivery from them.
- Keep critical hero copy/form outside reveal animations. Preserve brand fonts, imagery, navy/blue palette, crawl routes and metadata.

## Measurement boundary

The owner's 217 all-time mixed campaign conversions at $22.32 per reported conversion combine website inquiries, instant forms and calls. They do not provide website-only conversion rate, CTR or qualified lead rate. Judge this layout by website-only qualified inquiries, booked tours and lead quality by device/source; do not optimize raw clicks at their expense.
