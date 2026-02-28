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
            
            // Re-enable form
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
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

        // Map form fields to Trusenda CRM format
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
            preferredArea: formDataObj.get('preferred_location_value') || formDataObj.get('preferred_location') || formDataObj.get('preferred_area') || 'Palm Beach County, FL',
            searchRadius: parseInt(formDataObj.get('search_radius'), 10) || 25,
            notes: buildNotesField(formDataObj),
            source: 'palmbeachwarehouses.com',
            // Pain Discovery fields (Phase 2)
            painPoint: formDataObj.get('pain_point') || null,
            moveTimeline: formDataObj.get('move_timeline') || null,
            beenGhosted: formDataObj.get('been_ghosted') === 'yes'
        };

        // Calculate qualification score
        if (typeof QUALIFICATION !== 'undefined') {
            const qualification = QUALIFICATION.scoreQualification(leadData);
            leadData.qualificationScore = qualification.score;
            leadData.qualificationTier = qualification.tier;
            console.log(`📊 Lead qualified as: ${qualification.tier} (${qualification.score} points)`);
        }

        return leadData;
    }

    /**
     * Build a comprehensive notes field
     */
    function buildNotesField(formData) {
        const notes = [];
        
        const preferredLocation = formData.get('preferred_location_value') || formData.get('preferred_location') || formData.get('preferred_area') || 'Palm Beach County, FL';
        const searchRadius = formData.get('search_radius') || '25';
        notes.push('Source: palmbeachwarehouses.com');
        notes.push('Preferred Location: ' + preferredLocation + ' (within ' + searchRadius + ' miles)');
        notes.push('');
        
        const customNotes = formData.get('notes');
        if (customNotes && customNotes.trim()) {
            notes.push('Special Requirements:');
            notes.push(customNotes.trim());
        }
        
        return notes.join('\n');
    }

    /**
     * Show success screen with qualification scoring
     */
    function showSuccessScreen() {
        const form = document.getElementById('lead-form');
        const successScreen = document.getElementById('success-message');

        // Get the form data for qualification scoring
        const formDataObj = new FormData(form);
        const leadData = {
            budget: formDataObj.get('budget'),
            property_use: formDataObj.get('property_use'),
            move_timeline: formDataObj.get('move_timeline'),
            pain_point: formDataObj.get('pain_point'),
            been_ghosted: formDataObj.get('been_ghosted'),
            industry: formDataObj.get('industry'),
            space_size: formDataObj.get('space_size')
        };

        // Calculate qualification
        let qualification = null;
        if (typeof QUALIFICATION !== 'undefined') {
            qualification = QUALIFICATION.scoreQualification(leadData);
            console.log(`📊 Success screen: ${qualification.tier} lead (${qualification.score} pts)`);
        }

        // Update success screen content
        if (qualification) {
            displayQualificationBadge(qualification);
        }

        form.classList.add('hidden');
        successScreen.classList.remove('hidden');

        // Track Google Ads Conversion
        if (typeof gtag !== 'undefined') {
            // Fire Google Ads conversion event for Contact conversion
            gtag('event', 'conversion', {
                'send_to': 'AW-17147516072/f_LJCMeD4tMaEKipyfA_',
                'value': 1.0,
                'currency': 'USD'
            });
            console.log('✅ Google Ads conversion fired');
        }

        // Track Facebook/Meta Lead Conversion
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Warehouse Inquiry',
                content_category: 'Industrial Real Estate'
            });
            console.log('✅ Facebook Lead conversion fired');
        }
    }

    /**
     * Display qualification badge and next steps on success screen
     */
    function displayQualificationBadge(qualification) {
        const badge = document.getElementById('qualification-badge');
        const tierBadge = document.getElementById('qualification-tier');
        const tierLabel = document.getElementById('qualification-label');
        const headline = document.getElementById('success-headline');
        const subtitle = document.getElementById('success-subtitle');
        const nextStepsDiv = document.getElementById('success-next-steps');
        const stepsContainer = document.getElementById('steps-container');
        const calloutDiv = document.getElementById('success-callout');

        const customMsg = QUALIFICATION.getCustomMessage(qualification);

        // Show badge
        if (badge) {
            tierBadge.textContent = qualification.tier;
            tierBadge.style.backgroundColor = customMsg.tierColor;
            tierLabel.textContent = customMsg.tierLabel;
            badge.style.display = 'flex';
        }

        // Update headline and subtitle
        if (headline) headline.textContent = customMsg.headline;
        if (subtitle) subtitle.textContent = customMsg.subtitle;

        // Show next steps
        if (nextStepsDiv && stepsContainer && customMsg.nextSteps) {
            stepsContainer.innerHTML = '';
            customMsg.nextSteps.forEach(step => {
                const stepEl = document.createElement('div');
                stepEl.className = 'step-item';
                stepEl.innerHTML = `<span class="step-icon">${step.icon}</span><span class="step-text">${step.text}</span>`;
                stepsContainer.appendChild(stepEl);
            });
            nextStepsDiv.style.display = 'block';
        }

        // Show callout
        if (calloutDiv && customMsg.calloutText) {
            calloutDiv.textContent = customMsg.calloutText;
            calloutDiv.className = `success-callout ${qualification.tier.toLowerCase()}`;
            calloutDiv.style.display = 'block';
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

