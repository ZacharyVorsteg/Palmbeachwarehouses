// UTM Parameter Capture
// Load this FIRST in <head>, before all other tracking scripts
(function() {
  'use strict';

  try {
    const params = new URLSearchParams(window.location.search);
    window.__utm = {
      source: params.get('utm_source') || null,
      medium: params.get('utm_medium') || null,
      campaign: params.get('utm_campaign') || null,
      content: params.get('utm_content') || null,
      term: params.get('utm_term') || null,
      adSetId: params.get('ad_set_id') || null,
      campaignId: params.get('campaign_id') || null,
    };

    // Also capture referrer and landing URL
    window.__pageContext = {
      referrer: document.referrer,
      landingUrl: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Log for debugging (remove in production)
    if (Object.values(window.__utm).some(v => v !== null)) {
      console.log('✅ UTM params captured:', window.__utm);
    }
  } catch (e) {
    console.error('Error capturing UTM params:', e);
    window.__utm = {};
    window.__pageContext = {};
  }
})();
