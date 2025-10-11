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

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', async function() {
        console.log('🚀 Initializing Trusenda CRM Integration...');
        
        // Fetch tenant ID from Trusenda API
        await fetchTenantId();
        
        // Set up form submission handler
        const form = document.getElementById('lead-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
            console.log('✅ Form submission handler attached');
        } else {
            console.error('❌ Lead form not found on page');
        }
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
            budget: formDataObj.get('budget') || null,
            sizeMin: sizeMin,
            sizeMax: sizeMax, // Now includes max!
            propertyType: formDataObj.get('property_use') || 'Warehouse',
            moveTiming: formDataObj.get('move_date') || null,
            preferredArea: null, // Don't include - implied by website
            notes: buildNotesField(formDataObj),
            source: 'palmbeachwarehouses.com'
        };

        return leadData;
    }

    /**
     * Build a comprehensive notes field
     */
    function buildNotesField(formData) {
        const notes = [];
        
        notes.push('Source: palmbeachwarehouses.com');
        notes.push('Location: Palm Beach County, FL');
        notes.push('');
        
        const customNotes = formData.get('notes');
        if (customNotes && customNotes.trim()) {
            notes.push('Special Requirements:');
            notes.push(customNotes.trim());
        }
        
        return notes.join('\n');
    }

    /**
     * Show success screen
     */
    function showSuccessScreen() {
        const form = document.getElementById('lead-form');
        const successScreen = document.getElementById('success-message');
        
        form.classList.add('hidden');
        successScreen.classList.remove('hidden');
        
        // Track conversion (if you have analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead_submission', {
                'event_category': 'form',
                'event_label': 'palm_beach_warehouses'
            });
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

