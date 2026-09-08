# Lead confirmation cleanup

The homepage previously kept its acquisition introduction, agent strip and CRM promotion above a success screen, then injected a second confirmation paragraph. The completed state now has one receipt, one compact contact block and one appointment note.

Receipt copy: **Request received** — “I’ll review your requirements and contact you about suitable spaces.” Tours are arranged by appointment. Contact saving and browsing listings remain available. Existing branding, public phone number, brokerage and sales-associate identity are retained.

Only an accepted CRM response completes a form: successful HTTP status, boolean `success: true` and a positive numeric or digit-string lead ID. Failed or malformed responses preserve the form and allow retry. A completed form cannot produce a duplicate request until explicitly reset. Conversion events remain after acceptance, using the existing deduplication ID; report requests remain pixel-silent.

`form-card.is-complete` hides the homepage's pre-submission introduction, duplicate agent strip and form promotion. The homepage receipt state also suppresses the sticky Get Matched bar and desktop exit promotion. Scrolling must not resurrect either. Deliberate listing/city restart restores the form and its normal behavior; sticky dismissal preference is retained. Report submissions stay isolated from the tenant receipt. Property/location pages keep their authored receipt text.

The receipt receives accessible focus after rendering and respects reduced motion. Input-to-payload mapping and backend/database code are unchanged. The existing backend performs a parameterized lead insert with `RETURNING id`; this receipt confirms that acceptance response, not email delivery or a booked tour.

Verification: 29 dedicated receipt tests passed against the staged output, covering pending, duplicate, malformed/failed responses, retry, payload preservation, pixels, report isolation, restart, keyboard access and 320/390/768/1440px. Main-form, analytics-failure, field-mapping and packaging checks pass; Chromium/WebKit integration checks cover listing/reset/report paths. Use `npm run build`, `npm run test:lead-confirmation`, and the existing navigation/route checks before future releases. Tests use synthetic fixtures and intercept CRM/conversion requests; no real inquiry was submitted for this change.

Regression lesson: review the entire completed state, including surrounding form chrome, fixed promotions, focus and reset paths. A new success paragraph does not replace old confirmation content unless the old content is actually removed or hidden. Keep one source of confirmation copy.
