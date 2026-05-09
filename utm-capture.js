// UTM + Click ID + Meta Cookie Capture
// Load this FIRST in <head>, before all other tracking scripts.
// Persists across pageviews via sessionStorage so click IDs survive
// SPA-style navigations and direct hits to interior pages.
(function() {
  'use strict';

  const STORAGE_KEY = 'pbw_attribution';

  function readStored() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function writeStored(data) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const stored = readStored();

    // First-touch wins for UTMs (don't overwrite on later pageviews in same session)
    const utm = {
      source:     params.get('utm_source')   || stored.source     || null,
      medium:     params.get('utm_medium')   || stored.medium     || null,
      campaign:   params.get('utm_campaign') || stored.campaign   || null,
      content:    params.get('utm_content')  || stored.content    || null,
      term:       params.get('utm_term')     || stored.term       || null,
      adSetId:    params.get('ad_set_id')    || stored.adSetId    || null,
      campaignId: params.get('campaign_id')  || stored.campaignId || null,
    };

    // Click IDs — fbclid (Meta), gclid (Google Ads). Last-touch wins.
    const fbclidParam = params.get('fbclid');
    const gclidParam  = params.get('gclid');
    const fbclid = fbclidParam || stored.fbclid || null;
    const gclid  = gclidParam  || stored.gclid  || null;

    // Build _fbc cookie from fbclid per Meta spec when present from URL.
    // Format: fb.1.<unix_ms>.<fbclid>
    if (fbclidParam) {
      const fbc = `fb.1.${Date.now()}.${fbclidParam}`;
      setCookie('_fbc', fbc, 90);
    }
    if (gclidParam) {
      setCookie('_gcl_aw', `GCL.${Math.floor(Date.now() / 1000)}.${gclidParam}`, 90);
    }

    // Meta cookies — read whatever fbevents.js has set (or our manual _fbc)
    window.__fbCookies = {
      fbp: getCookie('_fbp'),  // browser ID, set by Pixel after init
      fbc: getCookie('_fbc'),  // click ID cookie, set above or by Pixel
    };

    window.__utm = utm;
    window.__clickIds = { fbclid, gclid };

    window.__pageContext = {
      referrer: document.referrer,
      landingUrl: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Persist for next pageview in this session
    writeStored({ ...utm, fbclid, gclid });

    if (Object.values(utm).some(v => v !== null) || fbclid || gclid) {
      console.log('✅ Attribution captured:', { ...utm, fbclid, gclid });
    }
  } catch (e) {
    console.error('Error capturing attribution:', e);
    window.__utm = {};
    window.__clickIds = {};
    window.__fbCookies = {};
    window.__pageContext = {};
  }
})();
