(function(){"use strict";const o="cookieConsent",c="1245057844149331",s="AW-17147516072",n={darkBg:"#141824",darkBgLight:"#1a1f33",accentBlue:"#007AFF",textLight:"#e8eaed",textGray:"#b0b6bc"};class i{constructor(){this.consentState=this.getConsentState(),this.hasConsented=this.consentState!==null,this.consentGiven=this.consentState==="accept",this.init()}getConsentState(){try{const e=localStorage.getItem(o);return e?JSON.parse(e).choice:null}catch(e){return console.warn("Error reading consent from localStorage:",e),null}}saveConsentState(e){try{const t={choice:e,version:"1.0",timestamp:new Date().toISOString()};localStorage.setItem(o,JSON.stringify(t)),this.consentState=e,this.consentGiven=e==="accept"}catch(t){console.warn("Error saving consent to localStorage:",t)}}init(){this.blockTracking(),this.hasConsented?this.consentGiven&&this.loadTracking():this.showBanner()}blockTracking(){window.fbq=window.fbq||function(){},window.gtag=window.gtag||function(){},window.trackingBlocked=!0,document.currentScript&&document.querySelectorAll("noscript").forEach(t=>{t.textContent.includes("facebook.com/tr")&&(t.style.display="none")})}loadTracking(){window.__loadTracking&&window.__loadTracking()}createBanner(){const e=document.createElement("div");return e.id="cookie-consent-banner",e.setAttribute("role","dialog"),e.setAttribute("aria-labelledby","cookie-consent-title"),e.setAttribute("aria-describedby","cookie-consent-text"),e.innerHTML=`
        <div style="
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: ${n.darkBg};
          border-top: 1px solid ${n.accentBlue}40;
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
              color: ${n.textLight};
              line-height: 1.4;
            }

            #cookie-consent-text {
              margin: 0;
              font-size: 14px;
              color: ${n.textGray};
              line-height: 1.5;
            }

            #cookie-consent-text a {
              color: ${n.accentBlue};
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
              background-color: ${n.accentBlue};
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
              color: ${n.textLight};
              border: 1px solid ${n.textGray};
              flex: 1;
              min-width: 140px;
            }

            #cookie-consent-decline:hover {
              background-color: rgba(255, 255, 255, 0.05);
              border-color: ${n.textLight};
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
      `,e}showBanner(){if(document.getElementById("cookie-consent-banner"))return;const e=this.createBanner();document.body.appendChild(e),document.getElementById("cookie-consent-accept").addEventListener("click",()=>{this.handleAccept()}),document.getElementById("cookie-consent-decline").addEventListener("click",()=>{this.handleDecline()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&this.removeBanner()})}handleAccept(){this.saveConsentState("accept"),this.loadTracking(),this.removeBanner(),this.dispatchEvent("cookieConsent:accept")}handleDecline(){this.saveConsentState("decline"),this.blockTracking(),this.removeBanner(),this.dispatchEvent("cookieConsent:decline")}removeBanner(){const e=document.getElementById("cookie-consent-banner");e&&(e.style.animation="slideUp 0.3s ease-out reverse",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},300))}dispatchEvent(e){if(window.CustomEvent){const t=new CustomEvent(e,{detail:{choice:this.consentState}});window.dispatchEvent(t)}}showSettings(){this.showBanner()}getConsent(){return{given:this.consentGiven,choice:this.consentState}}isTrackingAllowed(){return this.consentGiven}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{window.cookieConsent=new i}):window.cookieConsent=new i,window.showCookieSettings=function(){window.cookieConsent&&window.cookieConsent.showSettings()},window.getCookieConsent=function(){return window.cookieConsent?window.cookieConsent.getConsent():null},window.isTrackingAllowed=function(){return window.cookieConsent?window.cookieConsent.isTrackingAllowed():!1}})();
