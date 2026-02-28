# Trusenda CRM Integration Guide

**For:** cri-re.com
**Prepared by:** Zach Thomas (Palm Beach Warehouses)

This guide explains how to connect your website's lead form to Trusenda CRM so leads go directly into the app—the same way palmbeachwarehouses.com does it.

---

## Quick Overview

Your Trusenda slug: **`devin`**
Your public form: https://trusenda.com/submit/devin

When someone fills out your website form, the data gets sent directly to your Trusenda CRM via API.

---

## Step 1: Add the JavaScript File

Create a file called `crm-integration.js` and add it to your website. Here's the complete code:

```javascript
/**
 * Trusenda CRM Integration for CRI Commercial Real Estate
 */
(function() {
    'use strict';

    // CONFIGURATION - Your Trusenda slug
    const CONFIG = {
        TRUSENDA_SLUG: 'devin',  // Your unique Trusenda slug
        TRUSENDA_API_URL: 'https://trusenda.com/.netlify/functions'
    };

    let tenantId = null;

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', async function() {
        await fetchTenantId();

        const form = document.getElementById('lead-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
    });

    // Fetch tenant ID from Trusenda
    async function fetchTenantId() {
        try {
            const response = await fetch(
                `${CONFIG.TRUSENDA_API_URL}/get-public-form?slug=${CONFIG.TRUSENDA_SLUG}`
            );
            if (response.ok) {
                const data = await response.json();
                tenantId = data.tenantId;
            }
        } catch (error) {
            console.error('Error fetching tenant ID:', error);
        }
    }

    // Handle form submission
    async function handleFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = document.getElementById('submit-btn');

        // Disable button while submitting
        if (submitBtn) submitBtn.disabled = true;

        try {
            if (!tenantId) {
                await fetchTenantId();
                if (!tenantId) throw new Error('Unable to connect. Please try again.');
            }

            const formData = collectFormData(form);

            const response = await fetch(`${CONFIG.TRUSENDA_API_URL}/ingest-lead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok || response.status === 201) {
                showSuccess();
            } else {
                throw new Error('Submission failed. Please try again.');
            }

        } catch (error) {
            showError(error.message);
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    // Collect form data and map to Trusenda fields
    function collectFormData(form) {
        const fd = new FormData(form);

        // Parse size range (e.g., "5000-10000" or "50000+")
        const spaceSize = fd.get('space_size') || '';
        let sizeMin = null, sizeMax = null;

        if (spaceSize.includes('-')) {
            const parts = spaceSize.split('-').map(p => parseInt(p.replace(/\D/g, '')));
            sizeMin = parts[0];
            sizeMax = parts[1];
        } else if (spaceSize.includes('+')) {
            sizeMin = parseInt(spaceSize.replace(/\D/g, ''));
        }

        return {
            tenant_id: tenantId,
            name: fd.get('name'),
            email: fd.get('email') || null,
            phone: fd.get('phone') || null,
            company: fd.get('company') || null,
            budget: fd.get('budget') || null,
            sizeMin: sizeMin,
            sizeMax: sizeMax,
            propertyType: fd.get('property_type') || 'Industrial',
            moveTiming: fd.get('move_date') || null,
            industry: fd.get('industry') || null,
            leaseTerm: fd.get('lease_term') || null,
            preferredArea: fd.get('preferred_location') || null,
            searchRadius: parseInt(fd.get('search_radius')) || 25,
            notes: fd.get('notes') || '',
            source: 'cri-re.com'  // Change to your domain
        };
    }

    // Show success message
    function showSuccess() {
        const form = document.getElementById('lead-form');
        const success = document.getElementById('success-message');
        if (form) form.style.display = 'none';
        if (success) success.style.display = 'block';
    }

    // Show error message
    function showError(message) {
        const errorDiv = document.getElementById('form-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        } else {
            alert(message);
        }
    }

})();
```

---

## Step 2: Add the Script to Your Page

Add this line before the closing `</body>` tag:

```html
<script src="crm-integration.js"></script>
```

---

## Step 3: Form HTML Structure

Your form needs these specific IDs and field names to work:

```html
<form id="lead-form">
    <!-- Required Fields -->
    <input type="text" name="name" required placeholder="Your name">
    <input type="email" name="email" placeholder="Email">
    <input type="tel" name="phone" placeholder="Phone">
    <input type="text" name="company" placeholder="Company name">

    <!-- Property Requirements -->
    <select name="space_size">
        <option value="">Select size needed</option>
        <option value="1000-5000">1,000 - 5,000 SF</option>
        <option value="5000-10000">5,000 - 10,000 SF</option>
        <option value="10000-25000">10,000 - 25,000 SF</option>
        <option value="25000-50000">25,000 - 50,000 SF</option>
        <option value="50000+">50,000+ SF</option>
    </select>

    <select name="property_type">
        <option value="">Property type</option>
        <option value="Warehouse">Warehouse</option>
        <option value="Industrial">Industrial</option>
        <option value="Flex">Flex Space</option>
        <option value="Office">Office</option>
    </select>

    <select name="budget">
        <option value="">Budget range</option>
        <option value="Under $10/SF">Under $10/SF</option>
        <option value="$10-15/SF">$10-15/SF</option>
        <option value="$15-20/SF">$15-20/SF</option>
        <option value="$20+/SF">$20+/SF</option>
    </select>

    <select name="move_date">
        <option value="">When do you need space?</option>
        <option value="Immediately">Immediately</option>
        <option value="1-3 months">1-3 months</option>
        <option value="3-6 months">3-6 months</option>
        <option value="6+ months">6+ months</option>
    </select>

    <input type="text" name="preferred_location" placeholder="Preferred location/area">

    <textarea name="notes" placeholder="Additional requirements"></textarea>

    <button type="submit" id="submit-btn">Submit</button>
</form>

<!-- Success Message (hidden by default) -->
<div id="success-message" style="display: none;">
    <h3>Thank you!</h3>
    <p>We'll be in touch within 24 hours.</p>
</div>

<!-- Error Message (hidden by default) -->
<div id="form-error" style="display: none; color: red;"></div>
```

---

## Field Mapping Reference

| Form Field Name | Trusenda CRM Field | Notes |
|-----------------|-------------------|-------|
| `name` | Name | Required |
| `email` | Email | |
| `phone` | Phone | |
| `company` | Company | |
| `space_size` | Size Min/Max | Format: "5000-10000" or "50000+" |
| `property_type` | Property Type | |
| `budget` | Budget | |
| `move_date` | Move Timing | |
| `preferred_location` | Preferred Area | |
| `search_radius` | Search Radius | Number in miles |
| `industry` | Industry | |
| `lease_term` | Lease Term | |
| `notes` | Notes | |

---

## Testing

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Fill out and submit the form
4. You should see no errors
5. Check your Trusenda app - the lead should appear

---

## Troubleshooting

**Lead not appearing in Trusenda?**
- Check browser console for errors
- Verify the slug is exactly `devin`
- Make sure form has `id="lead-form"`

**"Unable to connect" error?**
- Check internet connection
- Trusenda API may be temporarily unavailable

---

