// Consent-aware tracking initialization
// Loaded synchronously in <head> — checks localStorage BEFORE loading any tracking pixels
(function() {
  var PIXEL_ID = '1245057844149331';
  var GADS_ID = 'AW-17147516072';

  function loadTracking() {
    if (window.__trackingLoaded) return;
    window.__trackingLoaded = true;

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
  }

  function blockTracking() {
    window.fbq = function() {};
    window.gtag = function() {};
    window.dataLayer = window.dataLayer || [];
    window.trackingBlocked = true;
  }

  // Synchronous consent check — runs before any tracking fires
  var consent;
  try { consent = JSON.parse(localStorage.getItem('cookieConsent')); } catch(e) {}

  if (consent && consent.choice === 'accept') {
    loadTracking();
  } else {
    blockTracking();
  }

  // Expose for cookie-consent.js to call when user accepts
  window.__loadTracking = loadTracking;
})();
