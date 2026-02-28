/**
 * Palm Beach Warehouses - Main Application JS
 * Extracted from inline scripts for performance
 */

// Ensure page loads at top
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
});

// scrollToForm() and resetForm() are defined in crm-integration.js (authoritative versions)

// Multi-step form navigation
let currentStep = 1;
const totalSteps = 2;

function validateStep(step) {
    const stepEl = document.getElementById(`step-${step}`);
    if (!stepEl) return true;

    const requiredFields = stepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.classList.add('error');
            field.addEventListener('change', () => {
                field.classList.remove('error');
            }, { once: true });
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
}

function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    const targetStep = document.getElementById(`step-${step}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    document.querySelectorAll('.progress-step').forEach((el, idx) => {
        const stepNum = idx + 1;
        el.classList.remove('active', 'completed');
        if (stepNum < step) {
            el.classList.add('completed');
        } else if (stepNum === step) {
            el.classList.add('active');
        }
    });

    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const progress = ((step - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progress}%`;
    }

    currentStep = step;

    setTimeout(() => {
        const firstInput = targetStep?.querySelector('select, input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function nextStep() {
    if (!validateStep(currentStep)) {
        const formCard = document.querySelector('.form-card');
        formCard.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            formCard.style.animation = '';
        }, 300);
        return;
    }

    if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 1) {
        goToStep(currentStep - 1);
    }
}

function toggleAdvanced() {
    const section = document.getElementById('advanced-requirements');
    const toggle = document.querySelector('.advanced-toggle');
    const icon = toggle.querySelector('.toggle-icon');

    section.classList.toggle('active');
    toggle.classList.toggle('expanded');
    icon.textContent = section.classList.contains('active') ? '\u2212' : '+';
}

// Download vCard for contact saving
function downloadVCard() {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:Vorsteg;Zach;;;
FN:Zach Vorsteg
ORG:Cornerstone Realty
TITLE:Licensed Commercial Real Estate Agent
TEL;TYPE=CELL:+1-561-718-6725
EMAIL:zach@cri-re.com
URL:https://palmbeachwarehouses.com
NOTE:Industrial & Warehouse Space Specialist - Palm Beach County
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Zach_Vorsteg_Contact.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Scroll to listings section
function scrollToListings() {
    const listingsSection = document.getElementById('listings');
    if (listingsSection) {
        listingsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ==========================================
// MAP VIEW FUNCTIONALITY
// ==========================================

let map = null;
let mapInitialized = false;

// Property data with VERIFIED coordinates (US Census Geocoder - 2026-01-23)
const properties = [
    {
        address: "1400 Forsythe Road Unit F",
        location: "Tuxedo Industrial Park, West Palm Beach, FL 33405",
        size: "1,600 SF",
        type: "Flex Space",
        price: "$3,133/mo",
        details: ["12 Parking Spaces", "16' Clear Height"],
        lat: 26.687928,
        lng: -80.070881,
        featured: false
    },
    {
        address: "352 Tall Pines Road Unit C",
        location: "Tall Pines Industrial Park, West Palm Beach, FL 33413",
        size: "2,170 SF",
        type: "Warehouse/Flex",
        price: "$4,159/mo",
        details: ["4 Parking Spaces", "20' Clear Height"],
        lat: 26.682432,
        lng: -80.149299,
        featured: false
    },
    {
        address: "440 Tall Pines Rd Unit F",
        location: "Tall Pines Industrial Park, West Palm Beach, FL 33413",
        size: "2,400 SF",
        type: "Office/Warehouse",
        price: "$4,000/mo",
        details: ["40 Parking Spaces", "17'5\" Clear Height"],
        lat: 26.683389,
        lng: -80.149309,
        featured: false
    },
    {
        address: "1225 Omar Road",
        location: "West Palm Beach, FL 33405",
        size: "11,563 SF",
        type: "Office/Warehouse + Yard",
        price: "$17,826/mo",
        details: ["8,006 SF Office", "3,527 SF Warehouse", "23 Parking", "Secured Yard"],
        lat: 26.688576,
        lng: -80.069131,
        featured: true
    },
    {
        address: "585 105th Ave N",
        location: "Royal Palm Beach, FL 33411",
        size: "1,500 SF",
        type: "Flex Space",
        price: "$3,125/mo",
        details: ["36 Parking Spaces", "16' Clear Height"],
        lat: 26.683862,
        lng: -80.210033,
        featured: false
    },
    {
        address: "605 Belvedere Rd",
        location: "West Palm Beach, FL 33405",
        size: "550 SF",
        type: "Office",
        price: "$1,200/mo",
        details: ["Professional Office Space"],
        lat: 26.690461,
        lng: -80.057452,
        featured: false
    },
    {
        address: "7233 Southern Blvd (A Building)",
        location: "West Palm Beach, FL 33411",
        size: "1,800-5,400 SF",
        type: "Industrial",
        price: "$3,525-$10,575/mo",
        details: ["2 Units Available", "36 Parking Spaces", "14' Clear Height"],
        lat: 26.679353,
        lng: -80.161563,
        featured: false
    },
    {
        address: "7231 W Southern Blvd (C Building)",
        location: "West Palm Beach, FL 33411",
        size: "1,300-1,340 SF",
        type: "Industrial Condo - FOR SALE",
        price: "$410,000-$422,000",
        details: ["2 Units Available", "Industrial Condos"],
        lat: 26.679353,
        lng: -80.161542,
        featured: false
    }
];

// Switch between grid and map views
function switchView(view) {
    const gridView = document.querySelector('.listings-grid');
    const mapView = document.getElementById('map-view');
    const buttons = document.querySelectorAll('.view-toggle-btn');

    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    if (view === 'map') {
        gridView.style.display = 'none';
        mapView.style.display = 'block';

        if (!mapInitialized) {
            loadLeafletAndInitMap();
        } else if (map) {
            setTimeout(() => map.invalidateSize(), 100);
        }
    } else {
        gridView.style.display = 'grid';
        mapView.style.display = 'none';
    }
}

// Lazy load Leaflet CSS and JS
function loadLeafletAndInitMap() {
    const mapContainer = document.getElementById('properties-map');
    mapContainer.innerHTML = '<div class="map-loading"><div class="map-loading-spinner"></div><span>Loading map...</span></div>';

    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJS.onload = initializeMap;
    document.body.appendChild(leafletJS);
}

// Initialize the map with markers
function initializeMap() {
    const mapContainer = document.getElementById('properties-map');
    mapContainer.innerHTML = '';

    const centerLat = properties.reduce((sum, p) => sum + p.lat, 0) / properties.length;
    const centerLng = properties.reduce((sum, p) => sum + p.lng, 0) / properties.length;

    map = L.map('properties-map', {
        center: [centerLat, centerLng],
        zoom: 12,
        scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '\u00a9 OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    const markers = [];
    properties.forEach((property, index) => {
        const iconSize = property.featured ? [30, 30] : [24, 24];
        const iconClass = property.featured ? 'custom-marker featured' : 'custom-marker';

        const customIcon = L.divIcon({
            className: iconClass,
            iconSize: iconSize,
            iconAnchor: [iconSize[0]/2, iconSize[1]/2],
            popupAnchor: [0, -iconSize[1]/2]
        });

        const popupContent = `
            <div class="map-popup">
                <div class="map-popup-title">${property.address}</div>
                <div class="map-popup-location">${property.location}</div>
                <div class="map-popup-details">
                    <span class="map-popup-detail">${property.size}</span>
                    <span class="map-popup-detail">${property.type}</span>
                </div>
                <div class="map-popup-price">${property.price}</div>
                <a href="tel:561-718-6725" class="map-popup-cta">Schedule Tour</a>
            </div>
        `;

        const marker = L.marker([property.lat, property.lng], { icon: customIcon })
            .bindPopup(popupContent, { maxWidth: 280 })
            .addTo(map);

        markers.push(marker);
    });

    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));

    mapInitialized = true;
}

// ==========================================
// LOCATION AUTOCOMPLETE
// ==========================================

(function() {
    const floridaCities = [
        { name: 'West Palm Beach', state: 'FL', display: 'West Palm Beach, FL' },
        { name: 'Palm Beach Gardens', state: 'FL', display: 'Palm Beach Gardens, FL' },
        { name: 'Royal Palm Beach', state: 'FL', display: 'Royal Palm Beach, FL' },
        { name: 'Wellington', state: 'FL', display: 'Wellington, FL' },
        { name: 'Boca Raton', state: 'FL', display: 'Boca Raton, FL' },
        { name: 'Delray Beach', state: 'FL', display: 'Delray Beach, FL' },
        { name: 'Boynton Beach', state: 'FL', display: 'Boynton Beach, FL' },
        { name: 'Lake Worth', state: 'FL', display: 'Lake Worth, FL' },
        { name: 'Jupiter', state: 'FL', display: 'Jupiter, FL' },
        { name: 'Riviera Beach', state: 'FL', display: 'Riviera Beach, FL' },
        { name: 'Greenacres', state: 'FL', display: 'Greenacres, FL' },
        { name: 'Palm Springs', state: 'FL', display: 'Palm Springs, FL' },
        { name: 'Lantana', state: 'FL', display: 'Lantana, FL' },
        { name: 'Lake Park', state: 'FL', display: 'Lake Park, FL' },
        { name: 'Loxahatchee', state: 'FL', display: 'Loxahatchee, FL' },
        { name: 'Belle Glade', state: 'FL', display: 'Belle Glade, FL' },
        { name: 'Pahokee', state: 'FL', display: 'Pahokee, FL' },
        { name: 'Tequesta', state: 'FL', display: 'Tequesta, FL' },
        { name: 'North Palm Beach', state: 'FL', display: 'North Palm Beach, FL' },
        { name: 'Juno Beach', state: 'FL', display: 'Juno Beach, FL' },
        { name: 'Palm Beach', state: 'FL', display: 'Palm Beach, FL' },
        { name: 'Atlantis', state: 'FL', display: 'Atlantis, FL' },
        { name: 'Hypoluxo', state: 'FL', display: 'Hypoluxo, FL' },
        { name: 'Manalapan', state: 'FL', display: 'Manalapan, FL' },
        { name: 'Ocean Ridge', state: 'FL', display: 'Ocean Ridge, FL' },
        { name: 'Gulf Stream', state: 'FL', display: 'Gulf Stream, FL' },
        { name: 'Highland Beach', state: 'FL', display: 'Highland Beach, FL' },
        { name: 'South Palm Beach', state: 'FL', display: 'South Palm Beach, FL' },
        { name: 'Cloud Lake', state: 'FL', display: 'Cloud Lake, FL' },
        { name: 'Glen Ridge', state: 'FL', display: 'Glen Ridge, FL' },
        { name: 'Haverhill', state: 'FL', display: 'Haverhill, FL' },
        { name: 'Fort Lauderdale', state: 'FL', display: 'Fort Lauderdale, FL' },
        { name: 'Miami', state: 'FL', display: 'Miami, FL' },
        { name: 'Pompano Beach', state: 'FL', display: 'Pompano Beach, FL' },
        { name: 'Deerfield Beach', state: 'FL', display: 'Deerfield Beach, FL' },
        { name: 'Coral Springs', state: 'FL', display: 'Coral Springs, FL' },
        { name: 'Parkland', state: 'FL', display: 'Parkland, FL' },
        { name: 'Stuart', state: 'FL', display: 'Stuart, FL' },
        { name: 'Port St. Lucie', state: 'FL', display: 'Port St. Lucie, FL' }
    ];

    const input = document.getElementById('preferred_location_input');
    const hiddenInput = document.getElementById('preferred_location');
    const suggestionsDiv = document.getElementById('location-suggestions');
    const radiusSlider = document.getElementById('search_radius');
    const radiusDisplay = document.getElementById('radius-display');

    if (!input || !suggestionsDiv) return;

    let highlightedIndex = -1;

    function filterCities(query) {
        if (!query || query.length < 2) return [];
        const lowerQuery = query.toLowerCase();
        return floridaCities.filter(city =>
            city.name.toLowerCase().includes(lowerQuery) ||
            city.display.toLowerCase().includes(lowerQuery)
        ).slice(0, 8);
    }

    function renderSuggestions(cities) {
        if (cities.length === 0) {
            suggestionsDiv.classList.add('hidden');
            return;
        }

        suggestionsDiv.innerHTML = cities.map((city, index) => `
            <div class="location-suggestion-item${index === highlightedIndex ? ' highlighted' : ''}"
                 data-value="${city.display}" data-index="${index}">
                <span class="location-icon">\ud83d\udccd</span>
                <span>${city.display}</span>
            </div>
        `).join('');

        suggestionsDiv.classList.remove('hidden');

        suggestionsDiv.querySelectorAll('.location-suggestion-item').forEach(item => {
            item.addEventListener('click', () => selectCity(item.dataset.value));
        });
    }

    function selectCity(value) {
        input.value = value;
        if (hiddenInput) hiddenInput.value = value;
        input.classList.add('selected');
        suggestionsDiv.classList.add('hidden');
        highlightedIndex = -1;
    }

    input.addEventListener('input', function() {
        const query = this.value;
        input.classList.remove('selected');
        if (hiddenInput) hiddenInput.value = '';
        highlightedIndex = -1;
        const matches = filterCities(query);
        renderSuggestions(matches);
    });

    input.addEventListener('keydown', function(e) {
        const items = suggestionsDiv.querySelectorAll('.location-suggestion-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
            renderSuggestions(filterCities(input.value));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightedIndex = Math.max(highlightedIndex - 1, 0);
            renderSuggestions(filterCities(input.value));
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            selectCity(items[highlightedIndex].dataset.value);
        } else if (e.key === 'Escape') {
            suggestionsDiv.classList.add('hidden');
        }
    });

    input.addEventListener('blur', function() {
        setTimeout(() => suggestionsDiv.classList.add('hidden'), 200);
    });

    input.addEventListener('focus', function() {
        if (this.value.length >= 2) {
            renderSuggestions(filterCities(this.value));
        }
    });

    if (radiusSlider && radiusDisplay) {
        radiusSlider.addEventListener('input', () => {
            radiusDisplay.textContent = radiusSlider.value + ' miles';
        });
    }
})();
