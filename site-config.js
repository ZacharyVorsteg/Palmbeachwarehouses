/**
 * SITE CONFIGURATION - Palm Beach Warehouses
 * ============================================
 * Edit this file to update site-wide values.
 * AI assistants: Update values here for site-wide changes.
 *
 * Last updated: 2026-01-18
 */

const SITE_CONFIG = {
    // === CONTACT INFO ===
    phone: "561-718-6725",
    phoneFormatted: "(561) 718-6725",
    phoneTel: "tel:561-718-6725",
    email: "zach@cri-re.com",

    // === AGENT INFO ===
    agentName: "Zachary Vorsteg",
    licenseNumber: "SL3603483",
    licenseState: "FL",
    brokerage: "Cornerstone Realty",
    brokerageEmail: "zach@cri-re.com",

    // === LISTING COUNTS (update when inventory changes) ===
    // When you add/remove listings, update these counts
    listingCounts: {
        total: 7,           // Total across all areas
        westPalmBeach: 6,   // WPB page listings
        bocaRaton: 0,       // Boca page listings
        delrayBeach: 0      // Delray page listings
    },

    // === MARKET DATA (update periodically) ===
    marketData: {
        westPalmBeach: {
            rateRange: "$12-18/SF NNN",
            rateMin: 12,
            rateMax: 18
        },
        bocaRaton: {
            rateRange: "$16-24/SF NNN",
            rateMin: 16,
            rateMax: 24
        },
        delrayBeach: {
            rateRange: "$12-16/SF NNN",
            rateMin: 12,
            rateMax: 16
        }
    },

    // === TRACKING IDs ===
    facebookPixelId: "1245057844149331",
    trusendaSlug: "zacharyvorsteg",
    trusendaApiUrl: "https://trusenda.com/.netlify/functions",

    // === META ===
    copyrightYear: 2025,
    lastUpdated: "2026-01-18",
    siteUrl: "https://palmbeachwarehouses.com",
    siteName: "Palm Beach Warehouses"
};

// Make available globally
if (typeof window !== 'undefined') {
    window.SITE_CONFIG = SITE_CONFIG;
}

// For Node.js/build tools
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_CONFIG;
}
