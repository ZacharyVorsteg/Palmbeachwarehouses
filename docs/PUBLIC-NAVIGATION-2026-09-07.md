# Public navigation regression gate

Build the staged site, then run:

```sh
npm run build
npm run test:public-navigation
```

The test uses the project's Playwright dependency, installed Google Chrome, and the Playwright WebKit browser. Install WebKit with `npx playwright install webkit` when needed. An existing runtime can be selected with `PLAYWRIGHT_MODULE`; the test otherwise uses `require('playwright')`.

The fixture serves only this repository's `public/` files through browser request interception. External requests, API requests, and every non-GET request are blocked. It does not submit forms, make calls, contact production, or write screenshots. A missing browser installation is a failed prerequisite, not a passing check.

Coverage:

- Archive, locations, market report, and landlord resources at 320px and 390px in Chromium and WebKit: actual menu links fit the viewport, keyboard/pointer opening, synchronized ARIA, Escape and focus return, scroll restoration, mobile-to-desktop resize, retained desktop dropdown, and Blog/Home destinations.
- WebKit desktop: pointer-opened dropdowns on archive, locations, listing, and sales pages synchronize their expanded state when switching, close with Escape, and return focus.
- Both locations “Get Matched Now” links are native `/#form` links and expose the actual inquiry section in both engines. The form is never submitted.
- Built inline scripts, structured data, and the shared mobile controller parse successfully.

Failure lessons:

1. A defined function and an animated hamburger are insufficient. Two handlers changed only the button while navigation remained hidden. Assert the visible links, not just classes.
2. Showing desktop navigation with `display:flex` can place mobile links outside the viewport. Measure the links after opening the menu, including links reached by scrolling it.
3. Fixed mobile overlays must release scrolling and move focus to a visible control when the viewport becomes desktop-sized. Wait for the actual media-query state change before asserting it.
4. Safari pointer activation does not always focus a button. Escape must close the open dropdown even when focus remains elsewhere; do not artificially focus the button before testing this path.
5. A CTA can look correct while scrolling to a nonexistent local form. Prefer a real destination link and test its resulting URL and visible target.
6. A generated archive can drift from its template. Verify built output after every relevant template/controller change. Wait for fonts and two animation frames before measuring layout; DOM load alone does not establish painted geometry.

This is a focused navigation gate. It does not establish production delivery, database persistence, every page's accessibility, or conversion uplift. Keep existing intake and packaging checks in the release gate.
