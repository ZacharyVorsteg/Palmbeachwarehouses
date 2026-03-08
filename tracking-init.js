// Tracking initialization — always loads (US-based, no consent gate required)
// Loaded synchronously in <head> so pixel fires on every pageview
(function() {
  var PIXEL_ID = '1245057844149331';
  var GADS_ID = 'AW-17147516072';

  if (window.__trackingLoaded) return;
  window.__trackingLoaded = true;

  // Clear any legacy consent-block state
  try { localStorage.removeItem('cookieConsent'); } catch(e) {}

  // Facebook Pixel
  !function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  // Google Ads
  var gs = document.createElement('script');
  gs.async = true;
  gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GADS_ID;
  document.head.appendChild(gs);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GADS_ID);

  // GA4 — Add measurement ID when GA4 property is created
  // gtag('config', 'G-XXXXXXXXXX');

  // Legacy compat — cookie-consent.js may call this
  window.__loadTracking = function() {};
})();
