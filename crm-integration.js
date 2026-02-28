/**
 * Trusenda CRM Integration for Palm Beach Warehouses
 * This script connects the lead form to your Trusenda CRM backend
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        TRUSENDA_SLUG: 'zacharyvorsteg', // Your Trusenda form slug
        TRUSENDA_API_URL: 'https://trusenda.com/.netlify/functions',
        // For local development, use: 'http://localhost:8888/.netlify/functions'
    };

    let tenantId = null;
    let isSubmitting = false;  // Prevent double-submit

    // Initialize on page load — attach form handler immediately, fetch tenant ID in background
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Initializing Trusenda CRM Integration...');

        // Attach form handler immediately (no await blocking)
        const form = document.getElementById('lead-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
            console.log('✅ Form submission handler attached');
        } else {
            console.error('❌ Lead form not found on page');
        }

        // Try localStorage cache first, then fetch in background
        const cached = localStorage.getItem('trusenda_tenant_id');
        if (cached) {
            tenantId = cached;
            console.log('✅ Tenant ID loaded from cache:', tenantId);
        }
        // Always refresh in background (updates cache for next visit)
        fetchTenantId();
    });

    /**
     * Fetch the tenant ID from Trusenda API using the slug
     */
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
            // Don't throw - we'll handle the error during form submission
            return null;
        }
    }

    /**
     * Handle form submission
     */
    async function handleFormSubmit(event) {
        event.preventDefault();

        // PREVENT DOUBLE-SUBMIT
        if (isSubmitting) {
            console.warn('⚠️ Form submission already in progress');
            return;
        }
        isSubmitting = true;

        console.log('📝 Form submission started...');

        // Get form elements
        const form = event.target;
        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnLoading = document.getElementById('btn-loading');
        const messageDiv = document.getElementById('form-message');

        // Disable submit button
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        messageDiv.classList.add('hidden');

        try {
            // Check if we have tenant ID
            if (!tenantId) {
                console.log('⚠️ Tenant ID not available, fetching now...');
                await fetchTenantId();
                
                if (!tenantId) {
                    throw new Error('Unable to connect to CRM. Please try again later.');
                }
            }

            // Collect form data
            const formData = collectFormData(form);
            
            console.log('📦 Submitting lead data:', formData);

            // Submit to Trusenda CRM
            const response = await fetch(`${CONFIG.TRUSENDA_API_URL}/ingest-lead`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.status === 201 || response.ok) {
                console.log('✅ Lead submitted successfully:', result);
                showSuccessScreen();
            } else if (response.status === 402) {
                throw new Error('Sorry, we\'re at capacity right now. Please call us directly at 561-718-6725.');
            } else {
                throw new Error(result.error || 'Failed to submit form. Please try again.');
            }

        } catch (error) {
            console.error('❌ Form submission error:', error);
            showError(error.message);

            // Re-enable form on error
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');

        } finally {
            // RESET SUBMISSION FLAG
            isSubmitting = false;
        }
    }

    /**
     * Collect and format form data for Trusenda CRM
     */
    function collectFormData(form) {
        const formDataObj = new FormData(form);

        // Extract space size range - parse BOTH min and max
        const spaceSize = formDataObj.get('space_size');
        let sizeMin = null;
        let sizeMax = null;

        // Parse the size range to extract min and max square footage
        if (spaceSize) {
            // Handle ranges like "5000-10000" or "50000+"
            if (spaceSize.includes('-')) {
                const parts = spaceSize.split('-').map(p => p.replace(/,/g, '').trim());
                sizeMin = parseInt(parts[0], 10);
                sizeMax = parseInt(parts[1], 10);
            } else if (spaceSize.includes('+')) {
                // For "50000+", just set min
                const numMatch = spaceSize.match(/(\d+)/);
                if (numMatch) {
                    sizeMin = parseInt(numMatch[1], 10);
                }
            } else {
                // Single number
                const numMatch = spaceSize.match(/(\d+)/);
                if (numMatch) {
                    sizeMin = parseInt(numMatch[1], 10);
                }
            }
        }

        // Map form fields to Trusenda CRM format (1:1 with ingest-lead API)
        const leadData = {
            tenant_id: tenantId,
            name: formDataObj.get('name'),
            email: formDataObj.get('email') || null,
            phone: formDataObj.get('phone') || null,
            company: formDataObj.get('company') || null,
            budget: formDataObj.get('budget') || null,
            sizeMin: sizeMin,
            sizeMax: sizeMax,
            propertyType: formDataObj.get('property_use') || 'Warehouse',
            moveTiming: formDataObj.get('move_date') || null,
            industry: formDataObj.get('industry') || null,
            leaseTerm: formDataObj.get('lease_term') || null,
            preferredArea: (function() {
                const selected = formDataObj.get('preferred_location_value');
                const typed = formDataObj.get('preferred_location');

                if (selected) {
                    return selected;  // User selected from dropdown
                }

                if (typed && typed.trim()) {
                    // User typed something but didn't select - use it but warn in notes
                    console.warn('⚠️ Location not confirmed from dropdown. User typed:', typed);
                    return typed;  // Use what they typed
                }

                // Fallback only if completely empty
                return 'Palm Beach County, FL';
            })(),
            searchRadiusMiles: parseInt(formDataObj.get('search_radius'), 10) || 25,
            notes: buildNotesField(formDataObj)
        };

        return leadData;
    }

    /**
     * Build a comprehensive notes field
     */
    function buildNotesField(formData) {
        const notes = [];

        notes.push('Source: palmbeachwarehouses.com');

        // Advanced building specs
        const specs = [];
        const docks = formData.get('req_docks');
        const clearHeight = formData.get('req_clearheight');
        const power = formData.get('req_power');
        const climate = formData.get('req_climate');
        const office = formData.get('req_office');

        if (docks) specs.push(docks);
        if (clearHeight) specs.push(clearHeight);
        if (power) specs.push(power);
        if (climate) specs.push(climate);
        if (office) specs.push(office);

        // Checkbox features
        const checkboxFields = ['req_grade', 'req_semi', 'req_yard', 'req_trailer', 'req_247', 'req_fenced'];
        checkboxFields.forEach(field => {
            const val = formData.get(field);
            if (val) specs.push(val);
        });

        if (specs.length > 0) {
            notes.push('Requirements: ' + specs.join(', '));
        }

        // User-entered notes
        const customNotes = formData.get('notes');
        if (customNotes && customNotes.trim()) {
            notes.push('Notes: ' + customNotes.trim());
        }

        return notes.join('\n');
    }

    /**
     * Show success screen with qualification scoring
     */
    function showSuccessScreen() {
        const form = document.getElementById('lead-form');
        const successScreen = document.getElementById('success-message');

        form.classList.add('hidden');
        successScreen.classList.remove('hidden');

        // SCORE THE LEAD
        const formData = collectFormData(form);
        const qualification = QUALIFICATION.scoreQualification(formData);
        console.log(`📊 Lead Qualification: ${qualification.tier} (Score: ${qualification.score})`);

        // Show appropriate callout based on lead tier
        const calloutDiv = document.getElementById('success-callout');
        let calloutMessage = '';
        let conversionValue = 5; // Default: COOL

        if (qualification.tier === 'HOT') {
            calloutMessage = '⚡ <strong>Priority Lead!</strong> Zach typically responds to high-urgency requests within 2 hours.';
            conversionValue = 50;
        } else if (qualification.tier === 'WARM') {
            calloutMessage = '<strong>✓ Good fit!</strong> You should hear from Zach within 24 hours with matching properties.';
            conversionValue = 25;
        } else {
            calloutMessage = 'Zach will review your request and reach out if he finds matching spaces in your area.';
            conversionValue = 5;
        }

        calloutDiv.innerHTML = calloutMessage;
        calloutDiv.style.display = 'block';

        // Track Google Ads Conversion (with lead value)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-17147516072/f_LJCMeD4tMaEKipyfA_',
                'value': conversionValue,
                'currency': 'USD'
            });
            console.log(`✅ Google Ads conversion fired (Value: $${conversionValue})`);
        }

        // Track Facebook/Meta Lead Conversion
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                'content_name': 'Warehouse Inquiry',
                'content_category': qualification.tier,
                'value': conversionValue,
                'currency': 'USD'
            });
            console.log(`✅ Facebook Lead conversion fired (Tier: ${qualification.tier})`);
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        const messageDiv = document.getElementById('form-message');
        messageDiv.textContent = message;
        messageDiv.className = 'form-message error';
        messageDiv.classList.remove('hidden');
    }

    /**
     * Reset form (called from success screen button)
     */
    window.resetForm = function() {
        const form = document.getElementById('lead-form');
        const successScreen = document.getElementById('success-message');
        const submitBtn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnLoading = document.getElementById('btn-loading');
        const messageDiv = document.getElementById('form-message');

        // Reset form
        form.reset();
        form.classList.remove('hidden');
        successScreen.classList.add('hidden');

        // Reset button state
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        messageDiv.classList.add('hidden');

        // RESET PROGRESS INDICATOR TO STEP 1
        document.querySelectorAll('.progress-step').forEach((el, idx) => {
            el.classList.remove('active', 'completed');
            if (idx === 0) el.classList.add('active');
        });
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) progressFill.style.width = '0%';

        // Go back to Step 1
        currentStep = 1;
        const step1 = document.getElementById('step-1');
        document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
        if (step1) {
            step1.classList.add('active');
            // Focus first input
            setTimeout(() => {
                const firstInput = step1.querySelector('select, input');
                if (firstInput) firstInput.focus();
            }, 100);
        }

        // Scroll to form
        scrollToForm();
    };

    /**
     * Scroll to form helper
     */
    window.scrollToForm = function() {
        const formSection = document.getElementById('lead-form-section');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    console.log('🎉 Trusenda CRM Integration loaded successfully');

})();

