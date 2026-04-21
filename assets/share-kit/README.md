# Palm Beach Warehouses — Share Kit

Social preview cards, favicons, and paste-in meta tags for palmbeachwarehouses.com.

---

## What's inside

```
share-kit/
├── images/
│   ├── og-editorial-1200x630.png   ← Default OG/Twitter card (premium editorial)
│   ├── og-bold-1200x630.png        ← Alt OG card (bold conversion, split panel)
│   ├── og-square-1200x1200.png     ← Square card for iMessage / WhatsApp
│   └── og-square-400.png           ← Smaller 400×400 version
├── favicons/
│   ├── favicon-source.svg          ← Master vector (use this in <link rel="icon">)
│   ├── favicon-16.png              ← Browser tab (legacy)
│   ├── favicon-32.png              ← Browser tab (legacy)
│   ├── favicon-192.png             ← Android home screen
│   ├── favicon-512.png             ← PWA / high-DPI
│   └── apple-touch-icon-180.png    ← iOS home screen
├── og-editorial.html               ← Source (edit here, re-render for changes)
├── og-bold.html
├── og-square.html
└── README.md                       ← You are here
```

---

## Pick a default card

Go with **`og-editorial-1200x630.png`**. It's the premium one — strong editorial headline, serif accent, stat strip, broker proof. Works in LinkedIn, Twitter/X, Slack, iMessage preview.

Use **`og-bold-1200x630.png`** for paid ads or when you want the CTA front-and-center.

Use **`og-square-1200x1200.png`** as the square-format fallback (some clients prefer square).

---

## Paste-in meta tags

Drop this inside your site's `<head>` and replace `https://palmbeachwarehouses.com` with the final deployed origin:

```html
<!-- Favicons -->
<link rel="icon" type="image/svg+xml" href="/favicons/favicon-source.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon-180.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicons/favicon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicons/favicon-512.png">
<meta name="theme-color" content="#0E1322">

<!-- Primary SEO -->
<title>Palm Beach Warehouses — Tenant-Rep Broker for Warehouse & Flex Space</title>
<meta name="description" content="Free tenant representation for warehouse, industrial, and flex space in Palm Beach County. Landlords already have a broker — you should too. On-market + off-market inventory, 10–15% avg rent reduction, $0 to the tenant.">

<!-- Open Graph (Facebook, LinkedIn, iMessage, Slack, WhatsApp) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Palm Beach Warehouses">
<meta property="og:url" content="https://palmbeachwarehouses.com/">
<meta property="og:title" content="Don't sign a warehouse lease alone.">
<meta property="og:description" content="Free tenant-rep for Palm Beach County warehouse & flex space. Landlords pay all commissions. 47+ leases closed since 2020.">
<meta property="og:image" content="https://palmbeachwarehouses.com/images/og-editorial-1200x630.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Palm Beach Warehouses — tenant representation for warehouse and flex space in Palm Beach County.">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Don't sign a warehouse lease alone.">
<meta name="twitter:description" content="Free tenant-rep for Palm Beach County warehouse & flex space. Landlords pay all commissions.">
<meta name="twitter:image" content="https://palmbeachwarehouses.com/images/og-editorial-1200x630.png">
```

### A/B option: bold card

To switch the default card to the conversion-focused version, change these two lines:

```html
<meta property="og:image" content="https://palmbeachwarehouses.com/images/og-bold-1200x630.png">
<meta name="twitter:image" content="https://palmbeachwarehouses.com/images/og-bold-1200x630.png">
```

---

## Editing the cards

The PNGs are rendered from the `.html` source files. To update any card:

1. Open the `.html` file in a browser
2. Edit the copy / colors / layout
3. Screenshot at exactly the intended size (1200×630 or 1200×1200) using Chrome DevTools → Device mode → custom dimensions → Capture screenshot
4. Replace the PNG in `images/`

Or open the file in Figma / Framer / any screenshot-to-PNG tool — the HTML is deterministic.

---

## Testing after deploy

- **Facebook / LinkedIn:** https://www.opengraph.xyz/url/ or LinkedIn Post Inspector
- **Twitter/X:** https://cards-dev.twitter.com/validator (log in required)
- **iMessage / Slack:** paste the URL into a chat, preview appears
- **Cache busting:** if you update a card after deploy, append `?v=2` to the image URL in both `og:image` and `twitter:image` to force re-scrape

---

## Notes

- All cards use **Inter** + **Instrument Serif** from Google Fonts. They're embedded in the HTML sources; no local files needed.
- The favicon is a refined logomark (warehouse + palm + water-lines motif) on a deep-navy rounded square. Works against light and dark Chrome tab backgrounds.
- The "online now" dots on the cards are static PNGs — they don't actually reflect live status. Keep them or don't, but don't claim real-time presence on your site unless you actually wire it up.
