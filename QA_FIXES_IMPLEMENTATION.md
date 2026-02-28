# QA Audit - Implementation Guide

## PRIORITY 1: CRITICAL FIXES

---

## Fix #1: Standardize Form IDs (Lantana & Riviera Beach)

### Current State
- Lantana: `id="crmForm"`
- Riviera Beach: `id="crmForm"`
- All other locations: `id="lead-form"`

### File Changes

#### File: `/locations/lantana/index.html` (Line 110)

**FIND:**
```html
                <form id="crmForm" class="hero-form">
```

**REPLACE WITH:**
```html
                <form id="lead-form" class="lead-form">
```

**Also Change:** Line 111
**FIND:**
```html
                    <h2 id="form-title">Find Your Warehouse</h2>
```

**REPLACE WITH:**
```html
                    <h2 id="form-title">Find Lantana Space</h2>
```

---

#### File: `/locations/riviera-beach/index.html` (Line 93)

**FIND:**
```html
                <form id="crmForm" class="hero-form">
```

**REPLACE WITH:**
```html
                <form id="lead-form" class="lead-form">
```

**Also Change:** Line 94
**FIND:**
```html
                    <h2 id="form-title">Find Your Warehouse</h2>
```

**REPLACE WITH:**
```html
                    <h2 id="form-title">Find Riviera Beach Space</h2>
```

---

## Fix #2: Standardize Submit Button Text

### Pages to Update
- Delray Beach: "SEND ME OPTIONS" → "SEARCH FOR ME"
- West Palm Beach: "SEND ME OPTIONS" → "SEARCH FOR ME"

#### File: `/locations/delray-beach/index.html` (Line 210)

**FIND:**
```html
                                <span id="btn-text">SEND ME OPTIONS</span>
```

**REPLACE WITH:**
```html
                                <span id="btn-text">SEARCH FOR ME</span>
```

---

#### File: `/locations/west-palm-beach/index.html` (Line 216)

**FIND:**
```html
                                <span id="btn-text">SEND ME OPTIONS</span>
```

**REPLACE WITH:**
```html
                                <span id="btn-text">SEARCH FOR ME</span>
```

---

## Fix #3: Update Copyright Year (Location Pages Only)

### Pages to Update (9 total)
All location pages currently show "© 2026" instead of "© 2025-2026"

#### File: `/locations/boca-raton/index.html` (Line 391)

**FIND:**
```html
                <p class="footer-copyright">&copy; 2026 Palm Beach Warehouses. All rights reserved.</p>
```

**REPLACE WITH:**
```html
                <p class="footer-copyright">© 2025-2026 Palm Beach Warehouses. All rights reserved.</p>
```

#### Repeat for these files:
- `/locations/boynton-beach/index.html:382`
- `/locations/delray-beach/index.html:382`
- `/locations/jupiter/index.html:382`
- `/locations/lake-worth/index.html:382`
- `/locations/lantana/index.html:334`
- `/locations/riviera-beach/index.html:317`
- `/locations/royal-palm-beach/index.html:388`
- `/locations/west-palm-beach/index.html:374`

---

## Fix #4: Add Facebook Pixel to All Location Pages

### Pages Missing Facebook Pixel (All 9 Location Pages)

The Facebook Pixel code should be added to the `<head>` section of each page that's missing it.

#### Template Code to Add (Insert around line 55-60, before Google Ads):

```html
    <!-- Facebook Pixel -->
    <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1245057844149331');
        fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=1245057844149331&ev=PageView&noscript=1"
    /></noscript>
```

#### Add to These Files (before line with Google Ads `<script async src="https://www.googletagmanager.com/gtag/js`):

1. `/locations/boca-raton/index.html:60` (before Google Ads at line 61)
2. `/locations/boynton-beach/index.html:60`
3. `/locations/delray-beach/index.html:60`
4. `/locations/jupiter/index.html:60`
5. `/locations/lake-worth/index.html:60`
6. `/locations/lantana/index.html:495` (after current code starts; adjust placement)
7. `/locations/riviera-beach/index.html:477` (after current code starts; adjust placement)
8. `/locations/royal-palm-beach/index.html:60`
9. `/locations/west-palm-beach/index.html:65`

---

## PRIORITY 2: CONSISTENCY IMPROVEMENTS

---

## Fix #5: Standardize CRM Integration Path

### Current Inconsistency
- Most pages: `src="/crm-integration.js"` (root-relative)
- Some pages: `src="../../crm-integration.js"` (relative)

### Pages to Update
- Lantana: `/locations/lantana/index.html:494`
- Riviera Beach: `/locations/riviera-beach/index.html:476`
- Check all guide pages that use relative paths

#### File: `/locations/lantana/index.html` (Line 494)

**FIND:**
```html
    <script defer src="../../crm-integration.js"></script>
```

**REPLACE WITH:**
```html
    <script defer src="/crm-integration.js"></script>
```

#### File: `/locations/riviera-beach/index.html` (Line 476)

**FIND:**
```html
    <script defer src="../../crm-integration.js"></script>
```

**REPLACE WITH:**
```html
    <script defer src="/crm-integration.js"></script>
```

---

## Fix #6: Reorder Cookie Consent & CRM Integration

### Current Problem
CRM Integration loads before Cookie Consent, which may violate privacy compliance.

### Fix: Swap Script Load Order

**Pattern:** Change script order to ensure cookie-consent.js loads FIRST

#### Example - Lantana: `/locations/lantana/index.html` (Lines 494-578)

**CURRENT ORDER (WRONG):**
```html
    <script defer src="/crm-integration.js"></script>  <!-- Line 494 -->
    ...
    <script defer src="/cookie-consent.js"></script>   <!-- Line 578 -->
```

**NEW ORDER (CORRECT):**
```html
    <script defer src="/cookie-consent.js"></script>   <!-- Load first -->
    ...
    <script defer src="/crm-integration.js"></script>  <!-- Load second -->
```

**Action:** Move `<script defer src="/cookie-consent.js">` to appear BEFORE `<script defer src="/crm-integration.js">` in all location and guide pages.

---

## Fix #7: Migrate Lantana & Riviera Beach to `.nav-dropdown` Pattern

### Current Issue
Lantana and Riviera Beach use simplified `.nav` structure instead of `.nav-dropdown` with ARIA roles.

### Solution
Replace navigation structure in both pages to match Pattern A (Lake Worth, Boca Raton, etc.)

#### File: `/locations/lantana/index.html` (Lines 56-67)

**CURRENT (SIMPLIFIED):**
```html
            <nav class="nav">
                <a href="/locations/west-palm-beach/">West Palm Beach</a>
                <a href="/locations/boca-raton/">Boca Raton</a>
                <!-- ... more links ... -->
            </nav>
```

**REPLACE WITH (PATTERN A - FROM LAKE WORTH):**

```html
            <nav class="nav">
                <div class="nav-dropdown">
                    <button class="nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">Locations <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l4 4 4-4"/></svg></button>
                    <div class="nav-dropdown-menu" role="menu">
                        <a href="/locations/west-palm-beach/" role="menuitem">West Palm Beach</a>
                        <a href="/locations/boca-raton/" role="menuitem">Boca Raton</a>
                        <a href="/locations/delray-beach/" role="menuitem">Delray Beach</a>
                        <a href="/locations/lake-worth/" role="menuitem">Lake Worth</a>
                        <a href="/locations/boynton-beach/" role="menuitem">Boynton Beach</a>
                        <a href="/locations/jupiter/" role="menuitem">Jupiter</a>
                        <a href="/locations/riviera-beach/" role="menuitem">Riviera Beach</a>
                        <a href="/locations/royal-palm-beach/" role="menuitem">Royal Palm Beach</a>
                        <a href="/locations/lantana/" role="menuitem">Lantana</a>
                    </div>
                </div>
                <div class="nav-dropdown">
                    <button class="nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">Guides <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l4 4 4-4"/></svg></button>
                    <div class="nav-dropdown-menu" role="menu">
                        <a href="/guides/how-to-lease-warehouse/" role="menuitem">How to Lease Warehouse</a>
                        <a href="/guides/palm-beach-industrial-market/" role="menuitem">Market Report</a>
                        <a href="/guides/warehouse-vs-flex-space/" role="menuitem">Warehouse vs Flex Space</a>
                        <a href="/guides/warehouse-sizing/" role="menuitem">Warehouse Sizing</a>
                        <a href="/guides/nnn-leases/" role="menuitem">NNN Leases</a>
                        <a href="/guides/tenant-improvements/" role="menuitem">Tenant Improvements</a>
                        <a href="/guides/loading-dock-guide/" role="menuitem">Loading Dock Guide</a>
                        <a href="/guides/cold-storage/" role="menuitem">Cold Storage</a>
                    </div>
                </div>
                <a href="/privacy/">Privacy</a>
            </nav>
```

**Reference Template:** Copy full navigation structure from `/locations/lake-worth/index.html:71-104`

#### Repeat for: `/locations/riviera-beach/index.html` (Lines 39-50)

---

## PRIORITY 3: BOCA RATON ELEVATION

---

## Fix #8: Reorder Navigation to Put Boca First

### Impact Locations to Update
All 10 location pages + homepage

#### File: `/locations/boca-raton/index.html` (Lines 80-88)

**CURRENT:**
```html
                        <a href="/locations/west-palm-beach/" role="menuitem">West Palm Beach</a>
                        <a href="/locations/boca-raton/" role="menuitem">Boca Raton</a>
                        <a href="/locations/delray-beach/" role="menuitem">Delray Beach</a>
```

**CHANGE TO:**
```html
                        <a href="/locations/boca-raton/" role="menuitem"><strong>Boca Raton</strong> <span class="badge-new" style="font-size: 0.7rem; background: #64c8ff; padding: 2px 6px; border-radius: 3px; color: white; margin-left: 4px;">Premium</span></a>
                        <a href="/locations/west-palm-beach/" role="menuitem">West Palm Beach</a>
                        <a href="/locations/delray-beach/" role="menuitem">Delray Beach</a>
```

#### Files to Update (All location pages):
1. `/locations/boynton-beach/index.html:80-88`
2. `/locations/delray-beach/index.html:80-88`
3. `/locations/jupiter/index.html:80-88`
4. `/locations/lake-worth/index.html:80-88`
5. `/locations/royal-palm-beach/index.html:80-88`
6. `/locations/west-palm-beach/index.html:85-93` (adjust for their line numbers)
7. `/locations/lantana/index.html:[check actual line numbers after nav migration]`
8. `/locations/riviera-beach/index.html:[check actual line numbers after nav migration]`

#### Also Update: `/index.html` navigation dropdown

---

## Fix #9: Add "Premium Market" Badge to Boca Raton in Homepage Grid

### File: `/index.html`

**Search for:** The Boca Raton location card in the listings grid

**Add this CSS to the `<style>` section (around line 600):**

```css
.premium-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #333;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 2;
}
```

**Find the Boca Raton location card (search for "Boca Raton" in the grid section):**

**Current Structure Example:**
```html
                <a href="/locations/boca-raton/" class="location-card">
                    <h3>Boca Raton</h3>
                    <p>...</p>
                </a>
```

**Replace with:**
```html
                <a href="/locations/boca-raton/" class="location-card" style="position: relative;">
                    <span class="premium-badge">Premium Market</span>
                    <h3>Boca Raton</h3>
                    <p>...</p>
                </a>
```

---

## Fix #10: Reorder Homepage Grid - Boca Raton First

### File: `/index.html`

**Current Order:** West Palm Beach, Boca Raton, Delray Beach, ...

**Change to:** Boca Raton, West Palm Beach, Delray Beach, ...

**Search for:** The `.listings-grid` section containing location cards

**Reorder HTML:** Move the Boca Raton card to be first in the grid.

---

## TESTING PLAN

After making all Priority 1 fixes:

1. **Form Submission Test (Lantana)**
   - Navigate to `/locations/lantana/`
   - Open browser DevTools
   - Submit form
   - Verify form ID is now `lead-form` (check form element)
   - Check Network tab to confirm CRM submission

2. **Form Submission Test (Riviera Beach)**
   - Same as above for `/locations/riviera-beach/`

3. **Button Text Verification**
   - Visit `/locations/delray-beach/`
   - Verify button says "SEARCH FOR ME" (not "SEND ME OPTIONS")
   - Visit `/locations/west-palm-beach/`
   - Verify button says "SEARCH FOR ME"

4. **Copyright Year Test**
   - Open DevTools Inspector
   - Check footer on all location pages
   - Verify copyright shows "© 2025-2026"

5. **Facebook Pixel Test**
   - Visit a location page
   - Open DevTools Network tab
   - Search for "facebook.com/tr"
   - Verify pixel fires with event=PageView

6. **CRM Integration Path Test**
   - Check Network tab when loading any page
   - Verify crm-integration.js loads from `/crm-integration.js` (not relative path)

7. **Cookie Consent Order Test**
   - Open DevTools Sources tab
   - Check execution order: cookie-consent.js should load before crm-integration.js
   - Verify cookies are populated before CRM tracking initiates

8. **Navigation Structure Test (After Priority 2)**
   - Visit `/locations/lantana/` and `/locations/riviera-beach/`
   - Hover over "Locations" button
   - Verify dropdown menu appears with all 9 locations
   - Click location links to confirm they work

9. **Boca Raton Elevation Test (After Priority 3)**
   - Check all location pages navigation
   - Verify Boca Raton appears first in Locations dropdown
   - Check homepage grid
   - Verify Boca Raton card has "Premium Market" badge
   - Verify Boca Raton card appears first in grid

---

## DEPLOYMENT STEPS

1. Create new branch: `git checkout -b fix/qa-audit-improvements`

2. Make all Priority 1 fixes (15-20 minutes)

3. Test Priority 1 fixes locally (20 minutes)

4. Commit: `git commit -m "Fix: Standardize form IDs, button text, copyright, and add Facebook Pixel"`

5. Make Priority 2 fixes (20 minutes)

6. Test Priority 2 fixes (15 minutes)

7. Commit: `git commit -m "Fix: Standardize CRM integration paths and navigation structure"`

8. Make Priority 3 fixes (15 minutes)

9. Test Priority 3 fixes (10 minutes)

10. Commit: `git commit -m "Feature: Elevate Boca Raton positioning in navigation and homepage"`

11. Create Pull Request

12. Review and merge to main

13. Deploy to production via Netlify webhook

---

## VERIFICATION CHECKLIST

- [ ] All form IDs standardized to `id="lead-form"`
- [ ] All submit buttons say "SEARCH FOR ME"
- [ ] All copyright shows "© 2025-2026" on location pages
- [ ] Facebook Pixel present on all 9 location pages
- [ ] All CRM integration paths use root-relative `/crm-integration.js`
- [ ] Cookie consent loads before CRM integration on all pages
- [ ] Lantana and Riviera Beach use `.nav-dropdown` pattern
- [ ] Boca Raton appears first in all location dropdowns with "Premium" badge
- [ ] Homepage grid has Boca Raton first with "Premium Market" badge
- [ ] All pages tested and working without console errors
- [ ] Facebook Pixel fires on all pages
- [ ] Forms submit successfully on all location pages
- [ ] Navigation dropdowns function correctly on all pages

---

**Total Estimated Time:** 2-3 hours implementation + testing
**Risk Level:** LOW (mostly HTML/text updates, no logic changes)
**Rollback Time:** 10 minutes (revert commit)
