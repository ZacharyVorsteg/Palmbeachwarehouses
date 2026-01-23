#!/bin/bash
# Geocode Helper for Palm Beach Warehouses
# Uses FREE US Census Geocoder API (no API key needed)
#
# Usage: ./geocode.sh "1234 Main Street, West Palm Beach, FL 33401"
#
# This script returns verified lat/lng coordinates for any US address.
# Use these coordinates in index.html when adding new properties.

if [ -z "$1" ]; then
    echo "Usage: ./geocode.sh \"ADDRESS\""
    echo ""
    echo "Examples:"
    echo "  ./geocode.sh \"1400 Forsythe Road, West Palm Beach, FL 33405\""
    echo "  ./geocode.sh \"352 Tall Pines Road, West Palm Beach, FL 33413\""
    echo ""
    echo "The script will return lat/lng coordinates from US Census Geocoder."
    exit 1
fi

ADDRESS="$1"
ENCODED_ADDRESS=$(echo "$ADDRESS" | sed 's/ /+/g' | sed 's/,/%2C/g')

echo "Geocoding: $ADDRESS"
echo "---"

RESPONSE=$(curl -s "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${ENCODED_ADDRESS}&benchmark=Public_AR_Current&format=json")

# Parse response
MATCH_COUNT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d['result']['addressMatches']))" 2>/dev/null)

if [ "$MATCH_COUNT" = "0" ] || [ -z "$MATCH_COUNT" ]; then
    echo "ERROR: No match found for this address."
    echo "Try:"
    echo "  - Remove unit/suite numbers"
    echo "  - Verify the ZIP code"
    echo "  - Check spelling"
    exit 1
fi

# Extract coordinates
COORDS=$(echo "$RESPONSE" | python3 -c "
import sys, json
d = json.load(sys.stdin)
m = d['result']['addressMatches'][0]
lat = m['coordinates']['y']
lng = m['coordinates']['x']
matched = m['matchedAddress']
print(f'Matched Address: {matched}')
print(f'')
print(f'Coordinates:')
print(f'  lat: {lat:.6f}')
print(f'  lng: {lng:.6f}')
print(f'')
print(f'For index.html:')
print(f'  lat: {lat:.6f},')
print(f'  lng: {lng:.6f},')
")

echo "$COORDS"
