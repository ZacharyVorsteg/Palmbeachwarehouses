// Cookie consent banner removed — not legally required for US/FL business
// Tracking handled by tracking-init.js (fires unconditionally in <head>)
// Privacy policy linked in footer covers disclosure requirements

// Clear legacy consent data that may have blocked tracking for some visitors
try { localStorage.removeItem('cookieConsent'); localStorage.removeItem('cookieNotice'); } catch(e) {}

// Legacy API stubs (other scripts may reference these)
window.cookieConsent = { getConsent: function() { return { given: true, choice: 'accept' }; }, isTrackingAllowed: function() { return true; }, showSettings: function() {} };
window.showCookieSettings = function() {};
window.getCookieConsent = function() { return { given: true, choice: 'accept' }; };
window.isTrackingAllowed = function() { return true; };
