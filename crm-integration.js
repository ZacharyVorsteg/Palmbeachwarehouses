(function() {
  'use strict';

  const CONFIG = {
    TRUSENDA_SLUG: 'zacharyvorsteg',
    TRUSENDA_API_URL: 'https://trusenda.com/.netlify/functions'
  };

  let tenantId = null;
  let isSubmitting = false;

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Trusenda CRM Integration...');

    const form = document.getElementById('lead-form');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
      console.log('✅ Form submission handler attached');
    } else {
      console.error('❌ Lead form not found on page');
    }

    // Try to load tenant ID from cache
    const cached = localStorage.getItem('trusenda_tenant_id');
    if (cached) {
      tenantId = cached;
      console.log('✅ Tenant ID loaded from cache:', tenantId);
    }

    // Fetch tenant ID
    fetchTenantId();
  });

  // Fetch tenant ID from Trusenda
  async function fetchTenantId() {
    try {
      console.log(`📡 Fetching tenant info for slug: ${CONFIG.TRUSENDA_SLUG}`);
      const response = await fetch(
        `${CONFIG.TRUSENDA_API_URL}/get-public-form?slug=${CONFIG.TRUSENDA_SLUG}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch tenant info: ${response.status}`);
      }

      const data = await response.json();
      tenantId = data.tenantId;
      localStorage.setItem('trusenda_tenant_id', tenantId);
      console.log('✅ Tenant ID retrieved successfully:', tenantId);
      return tenantId;
    } catch (error) {
      console.error('❌ Error fetching tenant ID:', error);
      return null;
    }
  }

  // Main form submission handler
  async function handleFormSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    if (isSubmitting) {
      console.warn('⚠️  Form submission already in progress');
      return;
    }

    isSubmitting = true;
    console.log('📝 Form submission started...');

    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const formMessage = document.getElementById('form-message');

    // Disable button and show loading
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    formMessage.classList.add('hidden');

    try {
      // Ensure we have tenant ID
      if (!tenantId) {
        console.log('⚠️  Tenant ID not available, fetching now...');
        await fetchTenantId();
        if (!tenantId) {
          throw new Error('Unable to connect to CRM. Please try again later.');
        }
      }

      // Build lead data with UTM parameters
      const leadData = extractFormData(form);
      console.log('📦 Submitting lead data:', leadData);

      // POST to CRM
      const response = await fetch(`${CONFIG.TRUSENDA_API_URL}/ingest-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });

      const responseData = await response.json();

      // Check for success
      if (response.status === 201 || response.ok) {
        console.log('✅ Lead submitted successfully:', responseData);

        // ONLY AFTER SUCCESS: Fire tracking pixels
        fireTrackingPixels(leadData);

        // Show success UI
        showSuccessMessage(form, leadData);
      } else {
        // Handle specific errors
        if (response.status === 402) {
          throw new Error('Sorry, we\'re at capacity right now. Please call us directly at 561-718-6725.');
        } else {
          throw new Error(responseData.error || 'Failed to submit form. Please try again.');
        }
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      showErrorMessage(error.message);
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoading.classList.add('hidden');
    } finally {
      isSubmitting = false;
    }
  }

  // Extract form data including UTM parameters
  function extractFormData(form) {
    const formData = new FormData(form);
    const spaceSize = formData.get('space_size');

    let sizeMin = null;
    let sizeMax = null;

    if (spaceSize) {
      if (spaceSize.includes('-')) {
        const parts = spaceSize.split('-').map(p => p.replace(/,/g, '').trim());
        sizeMin = parseInt(parts[0], 10);
        sizeMax = parseInt(parts[1], 10);
      } else if (spaceSize.includes('+')) {
        const match = spaceSize.match(/(\d+)/);
        if (match) {
          sizeMin = parseInt(match[1], 10);
        }
      } else {
        const match = spaceSize.match(/(\d+)/);
        if (match) {
          sizeMin = parseInt(match[1], 10);
        }
      }
    }

    return {
      tenant_id: tenantId,
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      company: formData.get('company') || null,
      budget: formData.get('budget') || null,
      sizeMin: sizeMin,
      sizeMax: sizeMax,
      propertyType: formData.get('property_use') || 'Warehouse',
      moveTiming: formData.get('move_date') || null,
      industry: formData.get('industry') || null,
      leaseTerm: formData.get('lease_term') || null,
      preferredArea: getPreferredArea(formData),
      searchRadiusMiles: parseInt(formData.get('search_radius'), 10) || 25,
      notes: buildNotesField(formData),
      // ADD UTM AND REFERRER DATA
      utm_source: window.__utm?.source || null,
      utm_medium: window.__utm?.medium || null,
      utm_campaign: window.__utm?.campaign || null,
      utm_content: window.__utm?.content || null,
      utm_term: window.__utm?.term || null,
      ad_set_id: window.__utm?.adSetId || null,
      referrer_url: window.__pageContext?.referrer || document.referrer,
      landing_page_url: window.__pageContext?.landingUrl || window.location.href,
    };
  }

  // Get preferred area with fallback
  function getPreferredArea(formData) {
    const selected = formData.get('preferred_location_value');
    const typed = formData.get('preferred_location');

    if (selected) {
      return selected;
    }

    if (typed && typed.trim()) {
      console.warn('⚠️  Location not confirmed from dropdown. User typed:', typed);
      return typed;
    }

    return 'Palm Beach County, FL';
  }

  // Build notes field from requirements
  function buildNotesField(formData) {
    const notes = [];
    notes.push('Source: palmbeachwarehouses.com');

    const requirements = [];
    const docks = formData.get('req_docks');
    const clearheight = formData.get('req_clearheight');
    const power = formData.get('req_power');
    const climate = formData.get('req_climate');
    const office = formData.get('req_office');

    if (docks) requirements.push(docks);
    if (clearheight) requirements.push(clearheight);
    if (power) requirements.push(power);
    if (climate) requirements.push(climate);
    if (office) requirements.push(office);

    [
      'req_grade',
      'req_semi',
      'req_yard',
      'req_trailer',
      'req_247',
      'req_fenced'
    ].forEach(key => {
      const value = formData.get(key);
      if (value) requirements.push(value);
    });

    if (requirements.length > 0) {
      notes.push('Requirements: ' + requirements.join(', '));
    }

    const additionalNotes = formData.get('notes');
    if (additionalNotes && additionalNotes.trim()) {
      notes.push('Notes: ' + additionalNotes.trim());
    }

    return notes.join('\n');
  }

  // New function: Fire tracking ONLY after CRM success
  function fireTrackingPixels(leadData) {
    // Qualify the lead
    const qualification = QUALIFICATION.scoreQualification(leadData);
    console.log(`📊 Lead Qualification: ${qualification.tier} (Score: ${qualification.score})`);

    // Prepare pixel value
    const pixelValue = qualification.conversionValue;

    // Fire Google Ads conversion
    if (typeof gtag !== 'undefined' && window.isTrackingAllowed && window.isTrackingAllowed()) {
      gtag('event', 'conversion', {
        send_to: 'AW-17147516072/f_LJCMeD4tMaEKipyfA_',
        value: pixelValue,
        currency: 'USD',
        conversion_label: leadData.name,
      });
      console.log(`✅ Google Ads conversion fired (Value: $${pixelValue})`);
    }

    // Fire Meta Lead event with UTM data
    if (typeof fbq !== 'undefined' && window.isTrackingAllowed && window.isTrackingAllowed()) {
      fbq('track', 'Lead', {
        content_name: 'Warehouse Inquiry',
        content_category: qualification.tier,
        content_type: 'lead',
        value: pixelValue,
        currency: 'USD',
        status: 'qualified',
        utm_source: window.__utm?.source || null,
        utm_campaign: window.__utm?.campaign || null,
        utm_content: window.__utm?.content || null,
        utm_medium: window.__utm?.medium || null,
        ad_set_id: window.__utm?.adSetId || null,
        location: leadData.preferredArea,
        estimated_revenue: qualification.annualRevenueEstimate,
      });
      console.log(`✅ Facebook Lead conversion fired (Tier: ${qualification.tier})`);
    }
  }

  // Show success message
  function showSuccessMessage(form, leadData) {
    const leadForm = document.getElementById('lead-form');
    const successMessage = document.getElementById('success-message');

    leadForm.classList.add('hidden');
    successMessage.classList.remove('hidden');

    const qualification = QUALIFICATION.scoreQualification(leadData);
    const callout = document.getElementById('success-callout');
    let message = '';

    if (qualification.tier === 'ENTERPRISE') {
      message = '⚡ <strong>Enterprise Lead!</strong> Zach will call you within 1 hour.';
    } else if (qualification.tier === 'HOT') {
      message = '⚡ <strong>Priority Lead!</strong> Zach typically responds to high-urgency requests within 2 hours.';
    } else if (qualification.tier === 'WARM') {
      message = '<strong>✓ Good fit!</strong> You should hear from Zach within 24 hours with matching properties.';
    } else {
      message = 'Zach will review your request and reach out if he finds matching spaces in your area.';
    }

    callout.innerHTML = message;
    callout.style.display = 'block';
  }

  // Show error message
  function showErrorMessage(message) {
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = message;
    formMessage.className = 'form-message error';
    formMessage.classList.remove('hidden');
  }

  // Global reset function
  window.resetForm = function() {
    const form = document.getElementById('lead-form');
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const formMessage = document.getElementById('form-message');

    form.reset();
    form.classList.remove('hidden');
    successMessage.classList.add('hidden');
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    formMessage.classList.add('hidden');

    const advancedReqs = document.getElementById('advanced-requirements');
    if (advancedReqs) {
      advancedReqs.classList.remove('active');
    }

    const advancedToggle = document.querySelector('.advanced-toggle');
    if (advancedToggle) {
      advancedToggle.classList.remove('expanded');
    }

    scrollToForm();
  };

  // Global scroll to form function
  window.scrollToForm = function() {
    const formSection = document.getElementById('lead-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function() {
        const form = document.getElementById('lead-form');
        if (form) {
          const firstInput = form.querySelector('select, input:not([type=hidden])');
          if (firstInput) {
            firstInput.focus();
          }
        }
      }, 600);
    }
  };

  // Contact tracking (phone/email clicks)
  document.addEventListener('click', function(event) {
    const link = event.target.closest('a[href^="tel:"],a[href^="mailto:"]');
    if (!link) return;

    if (window.isTrackingAllowed && window.isTrackingAllowed()) {
      const contactType = link.href.startsWith('tel:') ? 'Phone' : 'Email';

      // Fire Meta tracking
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact', {
          content_name: contactType + ' Click',
          content_category: 'Contact',
          utm_source: window.__utm?.source || 'direct',
          utm_campaign: window.__utm?.campaign || 'organic',
        });
      }

      // Fire Google Ads - scale value based on context
      // If user came from paid ad, track higher value
      const isFromAd = window.__utm?.source === 'facebook' || window.__utm?.source === 'google';
      const contactValue = isFromAd ? 10 : 1;

      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          send_to: 'AW-17147516072/f_LJCMeD4tMaEKipyfA_',
          value: contactValue,
          currency: 'USD',
        });
      }

      console.log(`✅ Contact tracking fired (${contactType}):`, { value: contactValue });
    }
  });

  console.log('🎉 Trusenda CRM Integration loaded successfully');
})();
