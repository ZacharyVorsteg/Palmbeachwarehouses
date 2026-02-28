/**
 * Cookie Consent Banner - GDPR & CCPA Compliant
 * Manages tracking consent for Facebook Pixel and Google Ads
 * Auto-injects banner on first visit, respects user preferences
 */

(function() {
  'use strict';

  const CONSENT_KEY = 'cookieConsent';
  const CONSENT_VERSION = '1.0';
  const PIXEL_ID = '1245057844149331';
  const GOOGLE_ADS_ID = 'AW-17147516072';

  // Color scheme from site's CSS
  const COLORS = {
    darkBg: '#141824',
    darkBgLight: '#1a1f33',
    accentBlue: '#007AFF',
    textLight: '#e8eaed',
    textGray: '#b0b6bc',
  };

  class CookieConsentManager {
    constructor() {
      this.consentState = this.getConsentState();
      this.hasConsented = this.consentState !== null;
      this.consentGiven = this.consentState === 'accept';
      this.init();
    }

    /**
     * Get the current consent state from localStorage
     */
    getConsentState() {
      try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          return data.choice; // 'accept' or 'decline'
        }
        return null;
      } catch (e) {
        console.warn('Error reading consent from localStorage:', e);
        return null;
      }
    }

    /**
     * Save consent state to localStorage
     */
    saveConsentState(choice) {
      try {
        const data = {
          choice: choice,
          version: CONSENT_VERSION,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
        this.consentState = choice;
        this.consentGiven = choice === 'accept';
      } catch (e) {
        console.warn('Error saving consent to localStorage:', e);
      }
    }

    /**
     * Initialize: Block tracking by default, show banner if needed, load FB/GA if consented
     */
    init() {
      // Block Facebook Pixel and Google Ads by default
      this.blockTracking();

      // Show banner only if no consent given yet
      if (!this.hasConsented) {
        this.showBanner();
      } else if (this.consentGiven) {
        // Consent already given, load tracking scripts
        this.loadTracking();
      }
    }

    /**
     * Block tracking by preventing fbq and gtag from firing
     */
    blockTracking() {
      window.fbq = window.fbq || function() {};
      window.gtag = window.gtag || function() {};

      // Disable actual tracking
      window.trackingBlocked = true;

      // Prevent image beacon for Facebook
      if (document.currentScript) {
        const noscripts = document.querySelectorAll('noscript');
        noscripts.forEach((noscript) => {
          if (noscript.textContent.includes('facebook.com/tr')) {
            noscript.style.display = 'none';
          }
        });
      }
    }

    /**
     * Load Facebook Pixel and Google Ads scripts
     */
    loadTracking() {
      // Load Facebook Pixel
      this.loadFacebookPixel();

      // Load Google Ads
      this.loadGoogleAds();
    }

    /**
     * Dynamically load Facebook Pixel
     */
    loadFacebookPixel() {
      if (window.fbq && typeof window.fbq === 'function') {
        try {
          window.fbq('init', PIXEL_ID);
          window.fbq('track', 'PageView');
        } catch (e) {
          console.warn('Error initializing Facebook Pixel:', e);
        }
      }
    }

    /**
     * Dynamically load Google Ads via gtag
     */
    loadGoogleAds() {
      if (typeof window.gtag === 'function') {
        try {
          window.gtag('js', new Date());
          window.gtag('config', GOOGLE_ADS_ID);
        } catch (e) {
          console.warn('Error initializing Google Ads:', e);
        }
      }
    }

    /**
     * Create and inject the cookie consent banner HTML
     */
    createBanner() {
      const banner = document.createElement('div');
      banner.id = 'cookie-consent-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-labelledby', 'cookie-consent-title');
      banner.setAttribute('aria-describedby', 'cookie-consent-text');

      banner.innerHTML = `
        <div style="
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: ${COLORS.darkBg};
          border-top: 1px solid ${COLORS.accentBlue}40;
          padding: 20px;
          z-index: 9999;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 100%;
        ">
          <style>
            @keyframes slideUp {
              from {
                transform: translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }

            #cookie-consent-banner * {
              box-sizing: border-box;
            }

            #cookie-consent-content {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            #cookie-consent-title {
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              color: ${COLORS.textLight};
              line-height: 1.4;
            }

            #cookie-consent-text {
              margin: 0;
              font-size: 14px;
              color: ${COLORS.textGray};
              line-height: 1.5;
            }

            #cookie-consent-text a {
              color: ${COLORS.accentBlue};
              text-decoration: none;
              transition: color 0.2s ease;
            }

            #cookie-consent-text a:hover {
              color: #4EA8FF;
              text-decoration: underline;
            }

            #cookie-consent-buttons {
              display: flex;
              gap: 12px;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-between;
            }

            .cookie-consent-btn {
              padding: 10px 20px;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease;
              min-width: 140px;
              text-align: center;
            }

            #cookie-consent-accept {
              background-color: ${COLORS.accentBlue};
              color: white;
              flex: 1;
              min-width: 140px;
            }

            #cookie-consent-accept:hover {
              background-color: #4EA8FF;
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
            }

            #cookie-consent-accept:active {
              transform: translateY(0);
            }

            #cookie-consent-decline {
              background-color: transparent;
              color: ${COLORS.textLight};
              border: 1px solid ${COLORS.textGray};
              flex: 1;
              min-width: 140px;
            }

            #cookie-consent-decline:hover {
              background-color: rgba(255, 255, 255, 0.05);
              border-color: ${COLORS.textLight};
            }

            #cookie-consent-decline:active {
              background-color: rgba(255, 255, 255, 0.1);
            }

            /* Responsive: Stack buttons on mobile */
            @media (max-width: 640px) {
              #cookie-consent-banner {
                padding: 16px;
                gap: 12px;
              }

              #cookie-consent-buttons {
                flex-direction: column;
                width: 100%;
              }

              .cookie-consent-btn {
                width: 100%;
                min-width: unset;
              }

              #cookie-consent-title {
                font-size: 15px;
              }

              #cookie-consent-text {
                font-size: 13px;
              }
            }
          </style>

          <div id="cookie-consent-content">
            <h2 id="cookie-consent-title">Cookie & Tracking Consent</h2>
            <p id="cookie-consent-text">
              This website uses cookies and tracking technologies (Facebook Pixel, Google Ads) to improve your experience and measure advertising effectiveness. See our <a href="/privacy/" target="_blank">Privacy Policy</a> for details.
            </p>
          </div>

          <div id="cookie-consent-buttons">
            <button id="cookie-consent-accept" class="cookie-consent-btn">Accept All</button>
            <button id="cookie-consent-decline" class="cookie-consent-btn">Decline Non-Essential</button>
          </div>
        </div>
      `;

      return banner;
    }

    /**
     * Show the consent banner and attach event listeners
     */
    showBanner() {
      if (document.getElementById('cookie-consent-banner')) {
        return; // Already shown
      }

      const banner = this.createBanner();
      document.body.appendChild(banner);

      // Attach event listeners
      document.getElementById('cookie-consent-accept').addEventListener('click', () => {
        this.handleAccept();
      });

      document.getElementById('cookie-consent-decline').addEventListener('click', () => {
        this.handleDecline();
      });

      // Keyboard accessibility: close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.removeBanner();
        }
      });
    }

    /**
     * Handle "Accept All" click
     */
    handleAccept() {
      this.saveConsentState('accept');
      this.loadTracking();
      this.removeBanner();
      this.dispatchEvent('cookieConsent:accept');
    }

    /**
     * Handle "Decline Non-Essential" click
     */
    handleDecline() {
      this.saveConsentState('decline');
      this.blockTracking();
      this.removeBanner();
      this.dispatchEvent('cookieConsent:decline');
    }

    /**
     * Remove the banner from the DOM
     */
    removeBanner() {
      const banner = document.getElementById('cookie-consent-banner');
      if (banner) {
        banner.style.animation = 'slideUp 0.3s ease-out reverse';
        setTimeout(() => {
          if (banner.parentNode) {
            banner.parentNode.removeChild(banner);
          }
        }, 300);
      }
    }

    /**
     * Dispatch custom event for external listeners
     */
    dispatchEvent(eventName) {
      if (window.CustomEvent) {
        const event = new CustomEvent(eventName, {
          detail: { choice: this.consentState },
        });
        window.dispatchEvent(event);
      }
    }

    /**
     * Show banner again (for "Cookie Settings" link in footer)
     */
    showSettings() {
      this.showBanner();
    }

    /**
     * Get current consent status
     */
    getConsent() {
      return {
        given: this.consentGiven,
        choice: this.consentState,
      };
    }

    /**
     * Check if tracking is allowed
     */
    isTrackingAllowed() {
      return this.consentGiven;
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.cookieConsent = new CookieConsentManager();
    });
  } else {
    window.cookieConsent = new CookieConsentManager();
  }

  // Expose API for footer "Cookie Settings" link
  window.showCookieSettings = function() {
    if (window.cookieConsent) {
      window.cookieConsent.showSettings();
    }
  };

  window.getCookieConsent = function() {
    if (window.cookieConsent) {
      return window.cookieConsent.getConsent();
    }
    return null;
  };

  window.isTrackingAllowed = function() {
    if (window.cookieConsent) {
      return window.cookieConsent.isTrackingAllowed();
    }
    return false;
  };
})();
