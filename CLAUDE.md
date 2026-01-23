# Palm Beach Warehouses - AI Assistant Context

## CRITICAL: Listing Data is NOT Dynamic

This site uses **hardcoded listings** across multiple files. When adding, removing, or modifying any property listing, you MUST update ALL of the following locations:

### Files Containing Listings

```
ALWAYS CHECK ALL OF THESE WHEN MODIFYING LISTINGS:

index.html                              # Homepage - all featured listings
locations/west-palm-beach/index.html    # WPB listings only
locations/boca-raton/index.html         # Boca listings only
locations/delray-beach/index.html       # Delray listings only
```

### What to Update in Each File

When removing a leased property or adding a new one:

1. **Listing cards** - The visible HTML cards in `.listings-grid`
2. **Property counts** - Meta description, hero text, OG tags, Twitter tags
3. **Size ranges** - Update min/max SF if the removed/added property affects range
4. **JSON-LD schema** - `ItemList` with `numberOfItems` and individual `ListItem` entries
5. **FAQ answers** - Any FAQ mentioning property counts or size ranges
6. **Comments** - `<!-- BEGIN_LISTINGS: Location | Count: X -->` markers

### Quick Grep Commands

```bash
# Find all files with a specific property address
grep -r "Gator Lane" --include="*.html" .

# Find all property count references
grep -rn "properties\|listings\|spaces available" --include="*.html" .

# Find all JSON-LD schemas
grep -rn "numberOfItems" --include="*.html" .
```

### Map Coordinates (CRITICAL)

The map view requires accurate lat/lng coordinates for each property. **Never estimate coordinates.**

**To get coordinates for a new property:**
```bash
./geocode.sh "1234 Main Street, West Palm Beach, FL 33405"
```

This uses the FREE US Census Geocoder API (no API key needed, most accurate for US addresses).

**When adding a new property:**
1. Run `./geocode.sh` with the full address
2. Copy the lat/lng values into the `properties` array in `index.html`
3. Verify by viewing the map locally before deploying

**Properties array location:** `index.html` line ~1250 (search for `const properties =`)

### Deployment

After updating listings:
```bash
git add -A && git commit -m "Update listings: [describe change]" && git push origin main
```

This triggers automatic Netlify deployment via GitHub.

## Other Notes

- CRM integration: `crm-integration.js` (Trusenda)
- Styles: `styles.css`
- Facebook Pixel: `1245057844149331`
- Google Ads: `AW-17147516072`
