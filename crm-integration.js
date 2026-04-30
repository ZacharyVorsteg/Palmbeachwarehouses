(function() {
  'use strict';

  const CONFIG = {
    TRUSENDA_SLUG: 'zacharyvorsteg',
    TRUSENDA_API_URL: 'https://trusenda.com/.netlify/functions'
  };

  let tenantId = null;
  let isSubmitting = false;
  let activeFormType = null; // 'tenant' | 'landlord' | 'report' | 'valuation' | 'sales' | 'featured-tenant' | 'warehouse-owner' | 'active-tenant'
  let activeLpSource = null; // 'lease-review' | 'tenant-rep' | 'start-search' (set when active-tenant form detected)

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Trusenda CRM Integration...');

    // Detect which form exists on this page
    const tenantForm = document.getElementById('lead-form');
    const landlordForm = document.getElementById('landlord-lead-form');
    const reportForm = document.getElementById('report-lead-form');
    const valuationForm = document.getElementById('valuation-lead-form');
    const salesForm = document.getElementById('sales-lead-form');
    const featuredTenantForm = document.getElementById('featured-tenant-form');

    if (tenantForm) {
      activeFormType = 'tenant';
      tenantForm.addEventListener('submit', handleFormSubmit);
      console.log('✅ Tenant form handler attached');
    } else if (landlordForm) {
      activeFormType = 'landlord';
      landlordForm.addEventListener('submit', handleFormSubmit);
      console.log('✅ Landlord form handler attached');
    } else if (reportForm) {
      activeFormType = 'report';
      reportForm.addEventListener('submit', handleFormSubmit);
      console.log('✅ Report form handler attached');
    } else if (valuationForm) {
      activeFormType = 'valuation';
      valuationForm.addEventListener('submit', handleFormSubmit);
      console.log('✅ Valuation form handler attached');
    } else if (salesForm) {
      activeFormType = 'sales';
      salesForm.addEventListener('submit', handleFormSubmit);
      console.log('✅ Sales form handler attached');
    } else if (featuredTenantForm) {
      activeFormType = 'featured-tenant';
      featuredTenantForm.addEventListener('submit', handleFormSubmit);
      console.log('✅ Featured tenant form handler attached');
    }

    const warehouseOwnerForm = document.getElementById('warehouse-owner-form');
    if (!activeFormType && warehouseOwnerForm) {
      activeFormType = 'warehouse-owner';
      warehouseOwnerForm.addEventListener('submit', handleFormSubmit);
      console.log('✅ Warehouse owner form handler attached');
    }

    const activeTenantForm = document.getElementById('active-tenant-form');
    if (!activeFormType && activeTenantForm) {
      activeFormType = 'active-tenant';
      activeLpSource = activeTenantForm.dataset.lpSource || 'active-tenant-generic';
      activeTenantForm.addEventListener('submit', handleFormSubmit);
      console.log('✅ Active tenant form handler attached, source:', activeLpSource);
    }

    if (!activeFormType) {
      console.warn('⚠️  No known form found on page');
    }

    // Try to load tenant ID from cache
    const cached = localStorage.getItem('trusenda_tenant_id');
    if (cached) {
      tenantId = cached;
      console.log('✅ Tenant ID loaded from cache:', tenantId);
    }

    // Fetch tenant ID
    fetchTenantId();

    // Mobile form auto-scroll: smoothly guide users to each field as they fill out the form
    setupFormAutoScroll();
  });

  // Auto-scroll form fields on mobile for seamless fill-out experience
  function setupFormAutoScroll() {
    const isMobile = () => window.innerWidth <= 768;

    // Get all forms on the page
    const forms = document.querySelectorAll('#lead-form, #landlord-lead-form, #report-lead-form, #valuation-lead-form, #sales-lead-form, #featured-tenant-form, #warehouse-owner-form, #active-tenant-form');
    forms.forEach(form => {
      const fields = form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]), select, textarea');

      // On select change: auto-advance to next field.
      // Use preventScroll so the auto-advance focus doesn't trigger a second
      // scroll on top of iOS's native keyboard-open scroll (causes jumpiness).
      fields.forEach((field, i) => {
        if (field.tagName === 'SELECT') {
          field.addEventListener('change', function() {
            if (!isMobile() || !this.value) return;
            const next = findNextField(fields, i);
            // Don't chain into another <select> — iOS native picker dismiss/reopen
            // causes a visible flicker. Let user tap the next select themselves.
            if (next && next.tagName !== 'SELECT') {
              setTimeout(() => {
                try { next.focus({ preventScroll: true }); }
                catch (e) { next.focus(); }
              }, 150);
            }
          });
        }
      });
    });
  }

  // Find the next visible, enabled field in the form
  function findNextField(fields, currentIndex) {
    for (let i = currentIndex + 1; i < fields.length; i++) {
      const f = fields[i];
      // Skip hidden fields (in collapsed advanced section or display:none)
      if (f.offsetParent === null) continue;
      if (f.disabled) continue;
      return f;
    }
    return null;
  }

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
    console.log(`📝 ${activeFormType} form submission started...`);

    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const formMessage = document.getElementById('form-message');

    // Disable button and show loading
    submitBtn.disabled = true;
    if (btnText) btnText.classList.add('hidden');
    if (btnLoading) btnLoading.classList.remove('hidden');
    if (formMessage) formMessage.classList.add('hidden');

    // For report form (no btn-text/btn-loading spans), update button text
    if (!btnText && submitBtn) {
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      // Ensure we have tenant ID
      if (!tenantId) {
        console.log('⚠️  Tenant ID not available, fetching now...');
        await fetchTenantId();
        if (!tenantId) {
          throw new Error('Unable to connect to CRM. Please try again later.');
        }
      }

      // Build lead data based on form type
      let leadData;
      if (activeFormType === 'landlord') {
        leadData = extractLandlordFormData(form);
      } else if (activeFormType === 'report') {
        leadData = extractReportFormData(form);
      } else if (activeFormType === 'valuation') {
        leadData = extractValuationFormData(form);
      } else if (activeFormType === 'sales') {
        leadData = extractSalesFormData(form);
      } else if (activeFormType === 'featured-tenant') {
        leadData = extractFeaturedTenantFormData(form);
      } else if (activeFormType === 'warehouse-owner') {
        leadData = extractWarehouseOwnerFormData(form);
      } else if (activeFormType === 'active-tenant') {
        leadData = extractActiveTenantFormData(form);
      } else {
        leadData = extractTenantFormData(form);
      }
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
      if (btnText) {
        btnText.classList.remove('hidden');
      } else if (submitBtn.dataset.originalText) {
        submitBtn.textContent = submitBtn.dataset.originalText;
      }
      if (btnLoading) btnLoading.classList.add('hidden');
    } finally {
      isSubmitting = false;
    }
  }

  // ─── TENANT form data extraction (original) ───
  function extractTenantFormData(form) {
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
      notes: buildTenantNotesField(formData),
      ...getUtmData()
    };
  }

  // ─── LANDLORD form data extraction ───
  function extractLandlordFormData(form) {
    const formData = new FormData(form);
    const propertySize = formData.get('property_size');

    let sizeMin = null;
    if (propertySize) {
      const match = propertySize.match(/(\d[\d,]*)/);
      if (match) {
        sizeMin = parseInt(match[1].replace(/,/g, ''), 10);
      }
    }

    const notes = [
      'Source: palmbeachwarehouses.com/list-your-space',
      'Lead Type: LANDLORD LISTING',
      `Property: ${formData.get('property_address') || 'N/A'}, ${formData.get('property_city') || ''} ${formData.get('property_zip') || ''}`,
      `Property Type: ${formData.get('property_type') || 'N/A'}`,
      `Property Size: ${propertySize || 'N/A'}`,
      `Current Status: ${formData.get('property_status') || 'N/A'}`,
      `Timeline: ${formData.get('timeline') || 'N/A'}`
    ].join('\n');

    return {
      tenant_id: tenantId,
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      company: formData.get('company') || null,
      sizeMin: sizeMin,
      propertyType: formData.get('property_type') || 'Warehouse',
      preferredArea: formData.get('property_city') || 'Palm Beach County, FL',
      notes: notes,
      ...getUtmData()
    };
  }

  // ─── REPORT form data extraction ───
  function extractReportFormData(form) {
    const formData = new FormData(form);

    const notes = [
      'Source: palmbeachwarehouses.com/market-report',
      'Lead Type: MARKET REPORT DOWNLOAD',
      `Role: ${formData.get('role') || 'N/A'}`,
      `Preferred Location: ${formData.get('preferred_location') || 'N/A'}`
    ].join('\n');

    return {
      tenant_id: tenantId,
      name: formData.get('name'),
      email: formData.get('email') || null,
      preferredArea: formData.get('preferred_location') || 'Palm Beach County, FL',
      notes: notes,
      ...getUtmData()
    };
  }

  // ─── VALUATION form data extraction ───
  function extractValuationFormData(form) {
    const formData = new FormData(form);

    const notes = [
      'Source: palmbeachwarehouses.com/what-is-my-space-worth',
      'Lead Type: SPACE VALUATION',
      `Property Address: ${formData.get('property_address') || 'N/A'}`,
      `City: ${formData.get('property_city') || 'N/A'}`,
      `Property Type: ${formData.get('property_type') || 'N/A'}`,
      `Square Footage: ${formData.get('square_footage') || 'N/A'}`,
      `Year Built: ${formData.get('year_built') || 'N/A'}`,
      `Clear Height: ${formData.get('clear_height') || 'N/A'}`,
      `Loading: ${formData.get('loading_type') || 'N/A'}`,
      `Condition: ${formData.get('condition') || 'N/A'}`,
      `Estimated Value: ${formData.get('estimated_value') || 'N/A'}`
    ].join('\n');

    let sizeMin = null;
    const sf = formData.get('square_footage');
    if (sf) {
      const match = sf.match(/(\d[\d,]*)/);
      if (match) sizeMin = parseInt(match[1].replace(/,/g, ''), 10);
    }

    return {
      tenant_id: tenantId,
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      sizeMin: sizeMin,
      propertyType: formData.get('property_type') || 'Warehouse',
      preferredArea: formData.get('property_city') || 'Palm Beach County, FL',
      notes: notes,
      ...getUtmData()
    };
  }

  // ─── SALES form data extraction ───
  function extractSalesFormData(form) {
    const formData = new FormData(form);

    const notes = [
      'Source: palmbeachwarehouses.com/sell-your-property',
      'Lead Type: INVESTMENT SALES',
      `Property Address: ${formData.get('property_address') || 'N/A'}`,
      `City: ${formData.get('property_city') || 'N/A'}`,
      `Property Type: ${formData.get('property_type') || 'N/A'}`,
      `Square Footage: ${formData.get('property_size') || 'N/A'}`,
      `Lot Size: ${formData.get('lot_size') || 'N/A'}`,
      `Year Built: ${formData.get('year_built') || 'N/A'}`,
      `Occupancy: ${formData.get('occupancy') || 'N/A'}`,
      `Current Rent: ${formData.get('current_rent') || 'N/A'}`,
      `Reason for Selling: ${formData.get('reason_selling') || 'N/A'}`,
      `Timeline: ${formData.get('timeline') || 'N/A'}`,
      `Price Expectation: ${formData.get('price_expectation') || 'N/A'}`
    ].join('\n');

    let sizeMin = null;
    const propertySize = formData.get('property_size');
    if (propertySize) {
      const match = propertySize.match(/(\d[\d,]*)/);
      if (match) sizeMin = parseInt(match[1].replace(/,/g, ''), 10);
    }

    return {
      tenant_id: tenantId,
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      company: formData.get('company') || null,
      sizeMin: sizeMin,
      propertyType: formData.get('property_type') || 'Industrial',
      preferredArea: formData.get('property_city') || 'Palm Beach County, FL',
      notes: notes,
      ...getUtmData()
    };
  }

  // ─── FEATURED TENANT form data extraction ───
  function extractFeaturedTenantFormData(form) {
    const formData = new FormData(form);
    const sf = formData.get('property_sf');

    let sizeMin = null;
    if (sf) {
      sizeMin = parseInt(sf, 10) || null;
    }

    const notes = [
      'Source: palmbeachwarehouses.com/featured-tenant',
      'Lead Type: FEATURED TENANT CAMPAIGN — PROPERTY SUBMISSION',
      `Property Address: ${formData.get('property_address') || 'N/A'}`,
      `Square Footage: ${sf || 'N/A'}`,
      `3-Phase Electric: ${formData.get('three_phase') || 'N/A'}`,
      `Additional Notes: ${formData.get('additional_notes') || 'None'}`
    ].join('\n');

    return {
      tenant_id: tenantId,
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      sizeMin: sizeMin,
      propertyType: 'Warehouse',
      preferredArea: 'Palm Beach County, FL',
      notes: notes,
      ...getUtmData()
    };
  }

  // ─── WAREHOUSE OWNER form data extraction ───
  function extractWarehouseOwnerFormData(form) {
    const formData = new FormData(form);
    const propertySize = formData.get('property_size');

    let sizeMin = null;
    if (propertySize) {
      const match = propertySize.match(/(\d[\d,]*)/);
      if (match) {
        sizeMin = parseInt(match[1].replace(/,/g, ''), 10);
      }
    }

    const notes = [
      'Source: palmbeachwarehouses.com/warehouse-owners-5000-sf',
      'Lead Type: WAREHOUSE OWNER — 5,000-7,500 SF CAMPAIGN',
      `Property Address: ${formData.get('property_address') || 'N/A'}`,
      `Property Size: ${propertySize || 'N/A'}`,
      `3-Phase Electric: ${formData.get('three_phase') || 'N/A'}`,
      `Contact Type: ${formData.get('contact_type') || 'N/A'}`
    ].join('\n');

    return {
      tenant_id: tenantId,
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      sizeMin: sizeMin,
      propertyType: 'Warehouse',
      preferredArea: 'Palm Beach County, FL',
      notes: notes,
      ...getUtmData()
    };
  }

  // ─── ACTIVE TENANT form data extraction (Meta Ad LPs: lease-review, tenant-rep, start-search) ───
  function extractActiveTenantFormData(form) {
    const formData = new FormData(form);
    const lpSource = activeLpSource || 'active-tenant-generic';
    const spaceSize = formData.get('space_size');
    const leaseEnd = formData.get('lease_end');
    const currentLocation = formData.get('current_location');
    const moveTiming = formData.get('move_timing');

    let sizeMin = null;
    let sizeMax = null;
    if (spaceSize) {
      if (spaceSize.includes('-')) {
        const parts = spaceSize.split('-').map(p => p.replace(/[,\s]/g, '').trim());
        sizeMin = parseInt(parts[0], 10) || null;
        sizeMax = parseInt(parts[1], 10) || null;
      } else if (spaceSize.includes('+')) {
        const m = spaceSize.match(/(\d[\d,]*)/);
        if (m) sizeMin = parseInt(m[1].replace(/,/g, ''), 10);
      } else {
        const m = spaceSize.match(/(\d[\d,]*)/);
        if (m) sizeMin = parseInt(m[1].replace(/,/g, ''), 10);
      }
    }

    const sourceLabel = {
      'lease-review': 'LEASE REVIEW (renewing tenant)',
      'tenant-rep': 'TENANT REP INQUIRY',
      'start-search': 'START SEARCH (founder positioning)'
    }[lpSource] || 'ACTIVE TENANT INQUIRY';

    const notes = [
      `Source: palmbeachwarehouses.com/${lpSource}`,
      `Lead Type: ${sourceLabel}`,
      `Current Location: ${currentLocation || 'N/A'}`,
      `Lease End: ${leaseEnd || 'N/A'}`,
      `Move Timing: ${moveTiming || 'N/A'}`,
      `Industry: ${formData.get('industry') || 'N/A'}`,
      `Notes: ${formData.get('notes') || 'None'}`
    ].join('\n');

    return {
      tenant_id: tenantId,
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      company: formData.get('company') || null,
      sizeMin: sizeMin,
      sizeMax: sizeMax,
      propertyType: 'Warehouse',
      moveTiming: moveTiming || null,
      industry: formData.get('industry') || null,
      preferredArea: formData.get('preferred_area') || 'Palm Beach County, FL',
      notes: notes,
      ...getUtmData()
    };
  }

  // Shared UTM data extraction
  function getUtmData() {
    return {
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

  // Get preferred area with fallback (tenant form)
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

  // Build notes field from requirements (tenant form)
  function buildTenantNotesField(formData) {
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

  // Fire tracking ONLY after CRM success
  function fireTrackingPixels(leadData) {
    if (activeFormType === 'tenant') {
      fireTenantPixels(leadData);
    } else if (activeFormType === 'landlord') {
      fireLandlordPixels(leadData);
    } else if (activeFormType === 'report') {
      fireReportPixels(leadData);
    } else if (activeFormType === 'valuation') {
      fireValuationPixels(leadData);
    } else if (activeFormType === 'sales') {
      fireSalesPixels(leadData);
    } else if (activeFormType === 'featured-tenant') {
      fireFeaturedTenantPixels(leadData);
    } else if (activeFormType === 'warehouse-owner') {
      fireWarehouseOwnerPixels(leadData);
    } else if (activeFormType === 'active-tenant') {
      fireActiveTenantPixels(leadData);
    }
  }

  // Tenant tracking (original - with qualification scoring)
  function fireTenantPixels(leadData) {
    const qualification = QUALIFICATION.scoreQualification(leadData);
    console.log(`📊 Lead Qualification: ${qualification.tier} (Score: ${qualification.score})`);

    const pixelValue = qualification.conversionValue;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-17147516072/f_LJCMeD4tMaEKipyfA_',
        value: pixelValue,
        currency: 'USD',
        conversion_label: qualification.tier,
        transaction_id: Date.now().toString(),
      });
      console.log(`✅ Google Ads conversion fired (Value: $${pixelValue}, Tier: ${qualification.tier})`);
    }

    if (typeof fbq !== 'undefined') {
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

  // Landlord tracking (high-value listing lead)
  function fireLandlordPixels(leadData) {
    const pixelValue = 150; // Listing agreements are high-value

    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-17147516072/f_LJCMeD4tMaEKipyfA_',
        value: pixelValue,
        currency: 'USD',
        conversion_label: 'LANDLORD_LISTING',
        transaction_id: Date.now().toString(),
      });
      console.log(`✅ Google Ads conversion fired (Landlord Listing: $${pixelValue})`);
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Landlord Listing',
        content_category: 'LANDLORD',
        content_type: 'listing',
        value: pixelValue,
        currency: 'USD',
        status: 'new_listing',
        utm_source: window.__utm?.source || null,
        utm_campaign: window.__utm?.campaign || null,
        utm_content: window.__utm?.content || null,
        utm_medium: window.__utm?.medium || null,
        ad_set_id: window.__utm?.adSetId || null,
        location: leadData.preferredArea,
      });
      console.log('✅ Facebook Lead conversion fired (Landlord Listing)');
    }
  }

  // Report tracking (top-of-funnel lead magnet)
  function fireReportPixels(leadData) {
    const pixelValue = 25; // Lower value - top-of-funnel

    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-17147516072/f_LJCMeD4tMaEKipyfA_',
        value: pixelValue,
        currency: 'USD',
        conversion_label: 'MARKET_REPORT',
        transaction_id: Date.now().toString(),
      });
      console.log(`✅ Google Ads conversion fired (Market Report: $${pixelValue})`);
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Market Report Download',
        content_category: 'REPORT',
        content_type: 'content',
        value: pixelValue,
        currency: 'USD',
        status: 'nurture',
        utm_source: window.__utm?.source || null,
        utm_campaign: window.__utm?.campaign || null,
        utm_content: window.__utm?.content || null,
        utm_medium: window.__utm?.medium || null,
        ad_set_id: window.__utm?.adSetId || null,
        location: leadData.preferredArea,
      });
      console.log('✅ Facebook Lead conversion fired (Market Report)');
    }
  }

  // Valuation tracking (mid-funnel landlord lead)
  function fireValuationPixels(leadData) {
    const pixelValue = 75; // Mid-funnel — interested in value, likely to list

    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-17147516072/f_LJCMeD4tMaEKipyfA_',
        value: pixelValue,
        currency: 'USD',
        conversion_label: 'SPACE_VALUATION',
        transaction_id: Date.now().toString(),
      });
      console.log(`✅ Google Ads conversion fired (Space Valuation: $${pixelValue})`);
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Space Valuation',
        content_category: 'VALUATION',
        content_type: 'valuation',
        value: pixelValue,
        currency: 'USD',
        status: 'valuation_lead',
        utm_source: window.__utm?.source || null,
        utm_campaign: window.__utm?.campaign || null,
        utm_content: window.__utm?.content || null,
        utm_medium: window.__utm?.medium || null,
        ad_set_id: window.__utm?.adSetId || null,
        location: leadData.preferredArea,
      });
      console.log('✅ Facebook Lead conversion fired (Space Valuation)');
    }
  }

  // Sales tracking (highest-value — investment sales lead)
  function fireSalesPixels(leadData) {
    const pixelValue = 250; // Highest value — investment sales commissions are largest

    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-17147516072/f_LJCMeD4tMaEKipyfA_',
        value: pixelValue,
        currency: 'USD',
        conversion_label: 'INVESTMENT_SALES',
        transaction_id: Date.now().toString(),
      });
      console.log(`✅ Google Ads conversion fired (Investment Sales: $${pixelValue})`);
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Investment Sales Inquiry',
        content_category: 'SALES',
        content_type: 'investment_sale',
        value: pixelValue,
        currency: 'USD',
        status: 'sales_lead',
        utm_source: window.__utm?.source || null,
        utm_campaign: window.__utm?.campaign || null,
        utm_content: window.__utm?.content || null,
        utm_medium: window.__utm?.medium || null,
        ad_set_id: window.__utm?.adSetId || null,
        location: leadData.preferredArea,
      });
      console.log('✅ Facebook Lead conversion fired (Investment Sales)');
    }
  }

  // Featured tenant tracking (high-value — property matched to active tenant)
  function fireFeaturedTenantPixels(leadData) {
    const pixelValue = 200;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-17147516072/qPCrCKTAm5IBEI2Xn7so',
        value: pixelValue,
        currency: 'USD',
        conversion_label: 'FEATURED_TENANT_PROPERTY',
        transaction_id: Date.now().toString(),
      });
      console.log(`✅ Google Ads conversion fired (Featured Tenant Property: $${pixelValue})`);
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Featured Tenant Property Submission',
        content_category: 'FEATURED_TENANT',
        content_type: 'property_submission',
        value: pixelValue,
        currency: 'USD',
        status: 'property_matched',
        utm_source: window.__utm?.source || null,
        utm_campaign: window.__utm?.campaign || null,
        utm_content: window.__utm?.content || null,
        utm_medium: window.__utm?.medium || null,
        ad_set_id: window.__utm?.adSetId || null,
        location: leadData.preferredArea,
      });
      console.log('✅ Facebook Lead conversion fired (Featured Tenant Property)');
    }
  }

  // Warehouse owner tracking (high-value — property matched to active tenant campaign)
  function fireWarehouseOwnerPixels(leadData) {
    const pixelValue = 200;

    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-17147516072/qPCrCKTAm5IBEI2Xn7so',
        value: pixelValue,
        currency: 'USD',
        conversion_label: 'WAREHOUSE_OWNER_5000SF',
        transaction_id: Date.now().toString(),
      });
      console.log(`✅ Google Ads conversion fired (Warehouse Owner: $${pixelValue})`);
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Warehouse Owner 5000SF Campaign',
        content_category: 'WAREHOUSE_OWNER',
        content_type: 'property_submission',
        value: pixelValue,
        currency: 'USD',
        status: 'owner_lead',
        utm_source: window.__utm?.source || null,
        utm_campaign: window.__utm?.campaign || null,
        utm_content: window.__utm?.content || null,
        utm_medium: window.__utm?.medium || null,
        ad_set_id: window.__utm?.adSetId || null,
        location: leadData.preferredArea,
      });
      console.log('✅ Facebook Lead conversion fired (Warehouse Owner)');
    }
  }

  // Active tenant tracking (high-intent — Meta-driven LP leads)
  function fireActiveTenantPixels(leadData) {
    const pixelValue = 200;
    const lpSource = activeLpSource || 'active-tenant-generic';
    const conversionLabel = 'ACTIVE_TENANT_' + lpSource.toUpperCase().replace(/-/g, '_');

    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: 'AW-17147516072/f_LJCMeD4tMaEKipyfA_',
        value: pixelValue,
        currency: 'USD',
        conversion_label: conversionLabel,
        transaction_id: Date.now().toString(),
      });
      console.log(`✅ Google Ads conversion fired (Active Tenant ${lpSource}: $${pixelValue})`);
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Active Tenant Inquiry — ' + lpSource,
        content_category: 'ACTIVE_TENANT',
        content_type: 'tenant_inquiry',
        value: pixelValue,
        currency: 'USD',
        status: 'high_intent',
        lp_source: lpSource,
        utm_source: window.__utm?.source || null,
        utm_campaign: window.__utm?.campaign || null,
        utm_content: window.__utm?.content || null,
        utm_medium: window.__utm?.medium || null,
        ad_set_id: window.__utm?.adSetId || null,
        location: leadData.preferredArea,
      });
      console.log(`✅ Facebook Lead conversion fired (Active Tenant ${lpSource})`);
    }
  }

  // Show success message (form-type aware)
  function showSuccessMessage(form, leadData) {
    const successMessage = document.getElementById('success-message');

    if (activeFormType === 'tenant') {
      // Tenant: hide form, show success with qualification callout
      const leadForm = document.getElementById('lead-form');
      leadForm.classList.add('hidden');
      successMessage.classList.remove('hidden');

      const qualification = QUALIFICATION.scoreQualification(leadData);
      const callout = document.getElementById('success-callout');
      let message = '';

      if (qualification.tier === 'ENTERPRISE') {
        message = '<strong>Priority request received.</strong> Given your requirements, Zach will personally call you within the hour to discuss available options and schedule tours.';
      } else if (qualification.tier === 'HOT') {
        message = '<strong>Great fit — your request is in good hands.</strong> Zach will personally follow up within a few hours with curated matches for your business.';
      } else if (qualification.tier === 'WARM') {
        message = '<strong>Request received.</strong> Zach will review available spaces in your area and reach out within 24 hours with options that match your criteria.';
      } else {
        message = '<strong>Request received.</strong> Zach will review your requirements and follow up within 24-48 hours with relevant options.';
      }

      callout.innerHTML = message;
      callout.style.display = 'block';
    } else if (activeFormType === 'landlord') {
      // Landlord: hide form, show success (content is already in HTML)
      const landlordForm = document.getElementById('landlord-lead-form');
      landlordForm.classList.add('hidden');
      successMessage.classList.remove('hidden');
    } else if (activeFormType === 'report') {
      // Report: hide form, show success with download link
      form.style.display = 'none';
      successMessage.style.display = 'block';
    } else if (activeFormType === 'valuation') {
      // Valuation: hide form, show success
      const valuationForm = document.getElementById('valuation-lead-form');
      valuationForm.classList.add('hidden');
      successMessage.classList.remove('hidden');
    } else if (activeFormType === 'sales') {
      // Sales: hide form, show success
      const salesForm = document.getElementById('sales-lead-form');
      salesForm.classList.add('hidden');
      successMessage.classList.remove('hidden');
    } else if (activeFormType === 'featured-tenant') {
      // Featured tenant: hide form wrapper, show success screen
      const ftForm = document.getElementById('featured-tenant-form');
      ftForm.parentElement.style.display = 'none';
      const successScreen = document.getElementById('success-screen');
      if (successScreen) successScreen.classList.add('show');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } else if (activeFormType === 'warehouse-owner') {
      // Warehouse owner: hide form container, show success screen
      const formContainer = document.getElementById('form-container');
      if (formContainer) formContainer.classList.add('hidden');
      const successScreen = document.getElementById('success-screen');
      if (successScreen) successScreen.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } else if (activeFormType === 'active-tenant') {
      // Active tenant: hide form container, show success screen
      const atForm = document.getElementById('active-tenant-form');
      if (atForm) atForm.classList.add('hidden');
      const formContainer = document.getElementById('form-container');
      if (formContainer) formContainer.classList.add('hidden');
      const successScreen = document.getElementById('success-screen');
      if (successScreen) successScreen.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Scroll success message into view — double rAF ensures layout is complete after unhiding
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  // Show error message
  function showErrorMessage(message) {
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = message;
    formMessage.className = 'form-message error';
    formMessage.classList.remove('hidden');
    formMessage.style.display = 'block';
  }

  // Global reset function
  window.resetForm = function() {
    const formId = activeFormType === 'landlord' ? 'landlord-lead-form'
                 : activeFormType === 'report' ? 'report-lead-form'
                 : activeFormType === 'valuation' ? 'valuation-lead-form'
                 : activeFormType === 'sales' ? 'sales-lead-form'
                 : activeFormType === 'featured-tenant' ? 'featured-tenant-form'
                 : activeFormType === 'warehouse-owner' ? 'warehouse-owner-form'
                 : activeFormType === 'active-tenant' ? 'active-tenant-form'
                 : 'lead-form';

    const form = document.getElementById(formId);
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const formMessage = document.getElementById('form-message');

    form.reset();
    form.classList.remove('hidden');
    form.style.display = '';
    if (form.parentElement) form.parentElement.style.display = '';

    if (activeFormType === 'featured-tenant') {
      const successScreen = document.getElementById('success-screen');
      if (successScreen) successScreen.classList.remove('show');
    } else if (activeFormType === 'warehouse-owner') {
      const formContainer = document.getElementById('form-container');
      if (formContainer) formContainer.classList.remove('hidden');
      const successScreen = document.getElementById('success-screen');
      if (successScreen) successScreen.classList.add('hidden');
    } else if (activeFormType === 'active-tenant') {
      const formContainer = document.getElementById('form-container');
      if (formContainer) formContainer.classList.remove('hidden');
      const successScreen = document.getElementById('success-screen');
      if (successScreen) successScreen.classList.add('hidden');
    } else if (successMessage) {
      successMessage.classList.add('hidden');
      successMessage.style.display = '';
    }
    submitBtn.disabled = false;
    if (btnText) {
      btnText.classList.remove('hidden');
    } else if (submitBtn.dataset.originalText) {
      submitBtn.textContent = submitBtn.dataset.originalText;
    }
    if (btnLoading) btnLoading.classList.add('hidden');
    if (formMessage) {
      formMessage.classList.add('hidden');
      formMessage.style.display = '';
    }

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
    const formSection = document.getElementById('lead-form-section')
                     || document.getElementById('landlord-lead-form')
                     || document.getElementById('report-lead-form')
                     || document.getElementById('valuation-lead-form')
                     || document.getElementById('sales-lead-form')
                     || document.getElementById('featured-tenant-form')
                     || document.getElementById('warehouse-owner-form')
                     || document.getElementById('active-tenant-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function() {
        const formId = activeFormType === 'landlord' ? 'landlord-lead-form'
                     : activeFormType === 'report' ? 'report-lead-form'
                     : activeFormType === 'valuation' ? 'valuation-lead-form'
                     : activeFormType === 'sales' ? 'sales-lead-form'
                     : activeFormType === 'featured-tenant' ? 'featured-tenant-form'
                     : activeFormType === 'warehouse-owner' ? 'warehouse-owner-form'
                     : activeFormType === 'active-tenant' ? 'active-tenant-form'
                     : 'lead-form';
        const form = document.getElementById(formId);
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
  });

  console.log('🎉 Trusenda CRM Integration loaded successfully');
})();
