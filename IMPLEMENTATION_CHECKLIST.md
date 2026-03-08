# Two-Sided Marketplace Implementation Checklist
## Tactical Build Guide for Palm Beach Warehouses

---

## PHASE 1: SETUP & CONFIGURATION (Week 1-2)

### CRM & Form Configuration
- [ ] Trusenda API: Create new lead source type `landlord_lead`
- [ ] Trusenda CRM: Create "Landlord" segment for filtering
- [ ] Trusenda: Set up landlord email sequences (6 emails)
- [ ] Trusenda: Configure automation rules (see email triggers below)
- [ ] Google Analytics 4: Create "landlord_form_submission" conversion event
- [ ] Facebook Pixel: Add "LandlordLeadForm" custom event
- [ ] Google Ads: Set up new conversion action "landlord_lead"

### Content & Copy
- [ ] Write landlord hero headline + subheading
- [ ] Write landlord form labels & placeholder text
- [ ] Write 6 landlord nurture emails (drafts in shared doc)
- [ ] Write FAQ section for `/list-your-space/`
- [ ] Write 3–4 benefit sections comparing Zach to competitors
- [ ] Create testimonial quotes (from existing landlord clients)
- [ ] Write market data copy for valuation tool results screen

### Design Assets
- [ ] Create wireframes for 3 new pages (Figma/Adobe)
- [ ] Photograph/get images for landlord hero section
- [ ] Gather/create comparison chart graphics
- [ ] Design form layout (mobile-first)
- [ ] Design success message layout
- [ ] Create Facebook ad templates (video + static)

---

## PHASE 2: BUILD NEW PAGES (Week 3-4)

### `/list-your-space/` - Core Landing Page

**File Structure:**
```
/list-your-space/
├── index.html          (main page)
└── styles.css          (already have in root, reuse)
```

**HTML Sections to Build:**

1. **Hero Section**
   ```html
   <section class="hero landlord-hero">
     <div class="hero-content">
       <div class="hero-left">
         <h1>Turn Your Warehouse Into Revenue</h1>
         <p class="hero-subtitle">List with Palm Beach's leading industrial broker.
            We've leased 10,000+ SF this year. Average lease-up: 40 days.</p>
         <button class="cta-button" onclick="scrollToForm()">Get Free Consultation</button>
       </div>
       <div class="hero-right">
         <!-- Hero image: property photo or illustration -->
       </div>
     </div>
   </section>
   ```

2. **Social Proof Stats**
   ```html
   <section class="stats-row">
     <div class="stat-card">
       <div class="stat-number">6</div>
       <div class="stat-label">Active Properties</div>
     </div>
     <div class="stat-card">
       <div class="stat-number">40 days</div>
       <div class="stat-label">Average Lease-Up</div>
     </div>
     <div class="stat-card">
       <div class="stat-number">12+ years</div>
       <div class="stat-label">PBC Industrial</div>
     </div>
     <div class="stat-card">
       <div class="stat-number">98%</div>
       <div class="stat-label">Tenant Approval</div>
     </div>
   </section>
   ```

3. **Why Zach Section** (4 benefit cards)
   ```html
   <section class="benefits-section">
     <h2>Why List with Zach?</h2>
     <div class="benefits-grid">
       <div class="benefit-card">
         <div class="benefit-icon">🎯</div>
         <h3>Direct Tenant Network</h3>
         <p>Unlike typical brokers who just list online, Zach actively sources
            qualified tenants. You get real prospects, not just views.</p>
       </div>
       <div class="benefit-card">
         <div class="benefit-icon">📍</div>
         <h3>Local Expert</h3>
         <p>12+ years in PBC industrial. Deep knowledge of zoning, accessibility,
            market rates, and tenant demand by micro-neighborhood.</p>
       </div>
       <div class="benefit-card">
         <div class="benefit-icon">⚡</div>
         <h3>Fast Leasing</h3>
         <p>Average lease-up: 40 days vs. county average: 90+ days.
            Your space generating revenue faster.</p>
       </div>
       <div class="benefit-card">
         <div class="benefit-icon">📊</div>
         <h3>Transparent Reporting</h3>
         <p>Real-time updates. Weekly market reports. No surprises.
            You always know what's happening with your property.</p>
       </div>
     </div>
   </section>
   ```

4. **Comparison Table**
   ```html
   <section class="comparison-section">
     <h2>Zach's Approach vs. Typical Brokers</h2>
     <table class="comparison-table">
       <thead>
         <tr>
           <th>Feature</th>
           <th>Zach's Model</th>
           <th>Typical Broker</th>
         </tr>
       </thead>
       <tbody>
         <tr>
           <td>Direct tenant sourcing</td>
           <td>✓ Yes (active)</td>
           <td>✗ No (passive listings)</td>
         </tr>
         <tr>
           <td>Your broker vs. junior</td>
           <td>✓ Zach directly</td>
           <td>✗ Assigned junior broker</td>
         </tr>
         <tr>
           <td>Local market expertise</td>
           <td>✓ 12+ years PBC</td>
           <td>~ Regional (less deep)</td>
         </tr>
         <tr>
           <td>Average lease-up time</td>
           <td>✓ 40 days</td>
           <td>~ 90+ days</td>
         </tr>
         <tr>
           <td>Market reports</td>
           <td>✓ Weekly</td>
           <td>~ Quarterly</td>
         </tr>
         <tr>
           <td>Commission flexibility</td>
           <td>✓ Negotiable</td>
           <td>~ Fixed 5–6%</td>
         </tr>
       </tbody>
     </table>
   </section>
   ```

5. **4-Step Process Section**
   ```html
   <section class="process-section">
     <h2>How It Works</h2>
     <div class="process-steps">
       <div class="step">
         <div class="step-number">1</div>
         <h3>Free Consultation</h3>
         <p>15-minute call about your property. Zach assesses condition,
            location, and market rate. No obligation.</p>
       </div>
       <div class="step">
         <div class="step-number">2</div>
         <h3>Market Analysis</h3>
         <p>Detailed report with comparable lease rates, recommended rent
            (at 90%, 95%, 100% of market), and lease-up timeline.</p>
       </div>
       <div class="step">
         <div class="step-number">3</div>
         <h3>Tenant Matching</h3>
         <p>Zach shows your space to pre-qualified tenants. You approve/reject.
            Zach handles follow-up and negotiations.</p>
       </div>
       <div class="step">
         <div class="step-number">4</div>
         <h3>Lease Closing</h3>
         <p>Zach handles lease negotiation and signing. You collect rent.
            No surprises, no problems.</p>
       </div>
     </div>
   </section>
   ```

6. **Landlord Form (Full)**
   ```html
   <section class="form-section" id="lead-form-section">
     <div class="form-card">
       <h2 class="form-title">Request a Free Consultation</h2>
       <p class="form-subtitle">Tell us about your property. Zach will call within
          2 hours during business hours with a custom market analysis.</p>

       <form id="landlord-form" class="lead-form" method="POST" action="javascript:void(0);">
         <input type="hidden" name="lead_type" value="landlord_lead">

         <!-- SECTION: Owner Info -->
         <h3 class="form-section-title">Your Information</h3>

         <div class="form-group">
           <label for="name">Full Name *</label>
           <input type="text" id="name" name="name" required placeholder="John Smith">
         </div>

         <div class="form-row">
           <div class="form-group">
             <label for="email">Email *</label>
             <input type="email" id="email" name="email" required placeholder="john@example.com">
           </div>
           <div class="form-group">
             <label for="phone">Phone *</label>
             <input type="tel" id="phone" name="phone" required placeholder="(561) 555-1234">
           </div>
         </div>

         <div class="form-group">
           <label for="company">Company / Entity Name (optional)</label>
           <input type="text" id="company" name="company" placeholder="ABC Holdings LLC">
         </div>

         <!-- SECTION: Property Info -->
         <h3 class="form-section-title">Your Property</h3>

         <div class="form-group">
           <label for="address">Property Address *</label>
           <input type="text" id="address" name="address" required placeholder="1234 Industrial Blvd">
         </div>

         <div class="form-row">
           <div class="form-group">
             <label for="city">City *</label>
             <input type="text" id="city" name="city" required placeholder="West Palm Beach">
           </div>
           <div class="form-group">
             <label for="zip">ZIP Code *</label>
             <input type="text" id="zip" name="zip" required placeholder="33407">
           </div>
         </div>

         <div class="form-row">
           <div class="form-group">
             <label for="sqft">Square Footage *</label>
             <input type="number" id="sqft" name="sqft" required placeholder="10000">
           </div>
           <div class="form-group">
             <label for="year_built">Year Built (approximate)</label>
             <input type="number" id="year_built" name="year_built" placeholder="1995">
           </div>
         </div>

         <div class="form-group">
           <label for="property_type">Property Type *</label>
           <select id="property_type" name="property_type" required>
             <option value="">Select one...</option>
             <option value="warehouse">Warehouse</option>
             <option value="flex">Flex / Mixed-Use</option>
             <option value="cold_storage">Cold Storage</option>
             <option value="specialized">Specialized (Outdoor, Covered, etc.)</option>
             <option value="land">Land</option>
           </select>
         </div>

         <!-- SECTION: Current Status -->
         <h3 class="form-section-title">Current Situation</h3>

         <div class="form-group">
           <label for="current_status">What's the current status of your property? *</label>
           <select id="current_status" name="current_status" required>
             <option value="">Select one...</option>
             <option value="occupied_lease_expiring">Occupied (lease expiring)</option>
             <option value="occupied_early_termination">Occupied (early termination possible)</option>
             <option value="vacant">Vacant</option>
             <option value="considering_sale">Considering sale</option>
             <option value="planning_development">Planning to develop</option>
           </select>
         </div>

         <div class="form-group">
           <label for="timeline">When do you want to list? *</label>
           <select id="timeline" name="timeline" required>
             <option value="">Select one...</option>
             <option value="asap">ASAP (within 30 days)</option>
             <option value="60_days">30–60 days</option>
             <option value="90_days">60–90 days</option>
             <option value="exploring">Just exploring options</option>
           </select>
         </div>

         <!-- SECTION: Property Condition -->
         <h3 class="form-section-title">Property Condition</h3>

         <div class="form-group">
           <label for="condition">Overall Condition *</label>
           <select id="condition" name="condition" required>
             <option value="">Select one...</option>
             <option value="excellent">Excellent (recently renovated)</option>
             <option value="good">Good (well-maintained)</option>
             <option value="fair">Fair (some deferred maintenance)</option>
             <option value="poor">Poor (significant repairs needed)</option>
           </select>
         </div>

         <!-- SECTION: Features -->
         <h3 class="form-section-title">Property Features (check all that apply)</h3>

         <div class="form-checkboxes">
           <label class="checkbox-label">
             <input type="checkbox" name="feature_docks" value="Loading dock(s)">
             <span>Loading dock(s)</span>
           </label>
           <label class="checkbox-label">
             <input type="checkbox" name="feature_14ft" value="14+ ft clear height">
             <span>14+ ft clear height</span>
           </label>
           <label class="checkbox-label">
             <input type="checkbox" name="feature_16ft" value="16+ ft clear height">
             <span>16+ ft clear height</span>
           </label>
           <label class="checkbox-label">
             <input type="checkbox" name="feature_power" value="3-phase power">
             <span>3-phase power available</span>
           </label>
           <label class="checkbox-label">
             <input type="checkbox" name="feature_yard" value="Fenced yard/outdoor space">
             <span>Fenced yard/outdoor space</span>
           </label>
           <label class="checkbox-label">
             <input type="checkbox" name="feature_office" value="Office/showroom space">
             <span>Office/showroom space</span>
           </label>
           <label class="checkbox-label">
             <input type="checkbox" name="feature_climate" value="Climate controlled">
             <span>Climate controlled</span>
           </label>
         </div>

         <!-- SECTION: Additional Info -->
         <h3 class="form-section-title">Additional Information</h3>

         <div class="form-group">
           <label for="asking_rate">Expected asking rate (optional, e.g., "$18/SF NNN")</label>
           <input type="text" id="asking_rate" name="asking_rate" placeholder="$18/SF NNN">
         </div>

         <div class="form-group">
           <label for="notes">Anything else we should know?</label>
           <textarea id="notes" name="notes" rows="4" placeholder="e.g., 'Current tenant leaving month-end,' 'Recent roof replacement,' etc."></textarea>
         </div>

         <!-- SUBMIT -->
         <button type="submit" id="submit-btn" class="cta-button">
           <span id="btn-text">Request Consultation</span>
           <span id="btn-loading" class="hidden">Sending...</span>
         </button>

         <p class="form-note">No obligation. No cost. Response within 2 hours during business hours.</p>
         <div id="form-message" class="form-message hidden"></div>
       </form>

       <div id="success-message" class="hidden">
         <h3>Consultation Request Received! 🎉</h3>
         <p id="success-callout"></p>
         <p>Zach will call you within 2 hours during business hours
            to discuss your property and market opportunities.</p>
         <p>In the meantime, feel free to browse recent market data
            for your area: <a href="/guides/palm-beach-industrial-market/">Market Report 2026</a></p>
         <button class="cta-button" onclick="resetForm()">Submit Another Property</button>
       </div>
     </div>
   </section>
   ```

7. **FAQ Section**
   ```html
   <section class="faq-section">
     <h2>Frequently Asked Questions</h2>
     <div class="faq-list">
       <div class="faq-item">
         <h3>How much do you charge?</h3>
         <p>Commission is negotiable based on property type and market conditions.
            Typical range: 4–6%. No upfront fees. You pay only when space is leased.</p>
       </div>
       <div class="faq-item">
         <h3>How long does leasing typically take?</h3>
         <p>Average lease-up: 40 days from listing to signed lease. This depends on
            property condition, market rate, and lease terms. We'll give you a
            realistic estimate in your market analysis.</p>
       </div>
       <div class="faq-item">
         <h3>What's the tenant vetting process?</h3>
         <p>Before showing your space, Zach pre-qualifies all prospects:
            - Credit check (minimum 650)
            - Bank statements (3 months)
            - Industry/reference checks
            - Site visit with prospect
            You only meet tenants who pass all checks.</p>
       </div>
       <div class="faq-item">
         <h3>Do you handle lease negotiations?</h3>
         <p>Yes. Zach handles all negotiations, lease review, and signing.
            Your attorney can review the lease before signing.</p>
       </div>
       <div class="faq-item">
         <h3>What if I want to sell instead of lease?</h3>
         <p>We can discuss both options. Leasing provides ongoing income;
            selling provides immediate capital. We'll model out the financials
            for your specific situation.</p>
       </div>
       <div class="faq-item">
         <h3>Do you handle property management?</h3>
         <p>We broker the lease. For ongoing property management (rent collection,
            maintenance coordination, CAM administration), we recommend a local
            property manager. We can provide referrals.</p>
       </div>
     </div>
   </section>
   ```

**CSS Updates Needed:**
```css
/* Add to styles.css */

.landlord-hero {
  /* Use existing hero styles, just update copy */
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 2rem;
  background: var(--card-bg);
}

.stat-card {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent-blue);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.benefit-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, .1);
}

.benefit-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.comparison-table {
  width: 100%;
  margin-top: 2rem;
  border-collapse: collapse;
}

.comparison-table thead {
  background: var(--card-bg);
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.comparison-table tbody tr:hover {
  background: rgba(255, 255, 255, .05);
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.step {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid var(--accent-blue);
}

.step-number {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: var(--accent-blue);
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  font-weight: 700;
  margin-bottom: 1rem;
}

.form-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--form-label);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--form-text);
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.faq-list {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.faq-item {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--accent-blue);
}

.faq-item h3 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.faq-item p {
  color: var(--text-gray);
  line-height: 1.6;
}
```

---

### `/what-is-my-space-worth/` - Valuation Tool

**Key Components:**

1. **Hero + Tool Container**
```html
<section class="hero">
  <h1>What's Your Space Worth?</h1>
  <p>Get a free market valuation in 60 seconds.</p>
</section>

<section class="valuation-tool">
  <div class="tool-container">
    <!-- Step 1: Property Basics -->
    <div class="tool-step" id="step-1">
      <h2>Step 1: Property Basics</h2>
      <form id="valuation-form">
        <div class="form-group">
          <label for="v_address">Property Address *</label>
          <input type="text" id="v_address" name="v_address"
                 placeholder="1234 Industrial Blvd" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="v_sqft">Square Footage *</label>
            <input type="number" id="v_sqft" name="v_sqft"
                   placeholder="10000" required>
          </div>
          <div class="form-group">
            <label for="v_year">Year Built</label>
            <input type="number" id="v_year" name="v_year"
                   placeholder="1995">
          </div>
        </div>
        <button type="button" class="cta-button" onclick="nextStep(2)">
          Next
        </button>
      </form>
    </div>

    <!-- Step 2: Condition & Features -->
    <div class="tool-step hidden" id="step-2">
      <h2>Step 2: Condition & Features</h2>
      <form>
        <div class="form-group">
          <label for="v_condition">Property Condition *</label>
          <select id="v_condition" name="v_condition" required>
            <option value="">Select...</option>
            <option value="excellent">Excellent (recently renovated)</option>
            <option value="good">Good (well-maintained)</option>
            <option value="fair">Fair (some maintenance needed)</option>
            <option value="poor">Poor (significant repairs needed)</option>
          </select>
        </div>

        <h3>Special Features (check all that apply)</h3>
        <div class="form-checkboxes">
          <label class="checkbox-label">
            <input type="checkbox" name="v_feature" value="docks">
            <span>Loading docks</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" name="v_feature" value="14ft">
            <span>14+ ft clear height</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" name="v_feature" value="16ft">
            <span>16+ ft clear height</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" name="v_feature" value="power">
            <span>3-phase power</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" name="v_feature" value="yard">
            <span>Fenced yard</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" name="v_feature" value="office">
            <span>Office/showroom</span>
          </label>
        </div>

        <div class="button-group">
          <button type="button" class="cta-button secondary"
                  onclick="prevStep(1)">Back</button>
          <button type="button" class="cta-button"
                  onclick="showResults()">See Valuation</button>
        </div>
      </form>
    </div>

    <!-- Step 3: Results -->
    <div class="tool-step hidden" id="step-3">
      <h2>Your Property Valuation</h2>

      <div class="valuation-results">
        <div class="result-card featured">
          <div class="result-label">Estimated Annual Rate</div>
          <div class="result-value" id="result_rate">$18.50/SF</div>
          <div class="result-detail">(Net Net Net - NNN)</div>
        </div>

        <div class="result-card">
          <div class="result-label">Estimated Monthly Rent</div>
          <div class="result-value" id="result_monthly">$15,417</div>
          <div class="result-detail">Based on [X] SF at 100% occupancy</div>
        </div>

        <div class="result-card">
          <div class="result-label">Annual Revenue (Est.)</div>
          <div class="result-value" id="result_annual">$185,000</div>
          <div class="result-detail">Assuming full occupancy</div>
        </div>
      </div>

      <div class="valuation-explanation">
        <h3>How We Calculated This</h3>
        <div class="calc-breakdown">
          <div class="calc-row">
            <span>Base comparable rate:</span>
            <span id="calc_base">$18.00/SF</span>
          </div>
          <div class="calc-row">
            <span>Condition adjustment:</span>
            <span id="calc_condition">+$0.25/SF</span>
          </div>
          <div class="calc-row">
            <span>Feature adjustment:</span>
            <span id="calc_features">+$0.25/SF</span>
          </div>
          <div class="calc-row total">
            <span>Your estimated rate:</span>
            <span id="calc_total">$18.50/SF</span>
          </div>
        </div>
      </div>

      <div class="valuation-context">
        <h3>What This Means</h3>
        <p>This estimate is based on 6-month market data for properties
           similar to yours in your area. Your actual lease rate may vary
           based on:</p>
        <ul>
          <li>Current market conditions and tenant demand</li>
          <li>Specific property quirks (location, access, restrictions)</li>
          <li>Lease term (longer terms typically get better rates)</li>
          <li>Negotiation dynamics</li>
        </ul>
        <p><strong>For a detailed, custom analysis:</strong>
           Enter your info below and Zach will provide:</p>
        <ul>
          <li>Detailed comparable market analysis (comps)</li>
          <li>Recommended asking rent (at 90%, 95%, 100% of market)</li>
          <li>Estimated lease-up timeline for your property</li>
          <li>Current tenant prospects we're representing</li>
        </ul>
      </div>

      <!-- Capture email for custom analysis -->
      <div class="capture-form">
        <h3>Get Your Custom Market Analysis</h3>
        <form id="custom-analysis-form">
          <div class="form-row">
            <div class="form-group">
              <input type="text" name="name" placeholder="Your Name" required>
            </div>
            <div class="form-group">
              <input type="email" name="email" placeholder="Your Email" required>
            </div>
          </div>
          <div class="form-group">
            <input type="tel" name="phone" placeholder="Your Phone (optional)">
          </div>
          <button type="submit" class="cta-button full-width">
            Get Detailed Analysis
          </button>
        </form>
      </div>

      <button type="button" class="cta-button secondary"
              onclick="startOver()">Check Another Property</button>
    </div>
  </div>
</section>
```

2. **JavaScript for Valuation Logic**
```javascript
// Add to /what-is-my-space-worth/ or separate file
// Include after DOM is ready

const COMP_DATA = {
  'West Palm Beach': { baseRate: 18.50, high: 20.00, low: 17.00 },
  'Boca Raton': { baseRate: 19.75, high: 22.00, low: 18.50 },
  'Delray Beach': { baseRate: 17.25, high: 19.00, low: 15.50 },
  'Lake Worth': { baseRate: 16.75, high: 18.50, low: 15.00 },
  'Boynton Beach': { baseRate: 16.00, high: 17.50, low: 14.50 },
  'Jupiter': { baseRate: 18.00, high: 20.00, low: 16.00 },
  'Riviera Beach': { baseRate: 17.50, high: 19.00, low: 16.00 },
  'Royal Palm Beach': { baseRate: 15.75, high: 17.25, low: 14.25 },
  'Lantana': { baseRate: 16.50, high: 18.00, low: 15.00 },
};

function calculateValuation() {
  const address = document.getElementById('v_address').value;
  const sqft = parseInt(document.getElementById('v_sqft').value);
  const year = parseInt(document.getElementById('v_year').value || 0);
  const condition = document.getElementById('v_condition').value;

  // Get features
  const features = Array.from(
    document.querySelectorAll('input[name="v_feature"]:checked')
  ).map(el => el.value);

  // Determine city from address (simplified)
  let city = 'West Palm Beach'; // default
  Object.keys(COMP_DATA).forEach(c => {
    if (address.toLowerCase().includes(c.toLowerCase())) {
      city = c;
    }
  });

  let rate = COMP_DATA[city].baseRate;

  // Age adjustment
  const age = 2026 - year;
  if (age > 30) rate -= 0.50;
  else if (age > 20) rate -= 0.25;

  // Condition adjustment
  if (condition === 'excellent') rate += 0.75;
  else if (condition === 'fair') rate -= 0.50;
  else if (condition === 'poor') rate -= 1.50;

  // Feature bonuses
  if (features.includes('docks')) rate += 0.25;
  if (features.includes('14ft')) rate += 0.10;
  if (features.includes('16ft')) rate += 0.35;
  if (features.includes('power')) rate += 0.15;
  if (features.includes('yard')) rate += 0.20;
  if (features.includes('office')) rate += 0.10;

  const monthlyRent = (rate * sqft) / 12;
  const annualRent = rate * sqft;

  return {
    rate: rate.toFixed(2),
    monthly: Math.round(monthlyRent),
    annual: Math.round(annualRent),
    city: city,
    baseRate: COMP_DATA[city].baseRate,
  };
}

function showResults() {
  const results = calculateValuation();

  document.getElementById('result_rate').textContent =
    `$${results.rate}/SF`;
  document.getElementById('result_monthly').textContent =
    `$${results.monthly.toLocaleString()}`;
  document.getElementById('result_annual').textContent =
    `$${results.annual.toLocaleString()}`;

  document.getElementById('step-1').classList.add('hidden');
  document.getElementById('step-2').classList.add('hidden');
  document.getElementById('step-3').classList.remove('hidden');

  window.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextStep(stepNum) {
  document.getElementById('step-1').classList.toggle('hidden');
  document.getElementById('step-2').classList.toggle('hidden');
}

function prevStep(stepNum) {
  document.getElementById('step-1').classList.remove('hidden');
  document.getElementById('step-2').classList.add('hidden');
}

function startOver() {
  document.getElementById('valuation-form').reset();
  document.getElementById('step-1').classList.remove('hidden');
  document.getElementById('step-2').classList.add('hidden');
  document.getElementById('step-3').classList.add('hidden');
  window.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Form submission
document.getElementById('custom-analysis-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  // Same CRM integration as tenant form, but with lead_type: "landlord_valuation"
  submitLandlordLead(this);
});
```

---

### `/guides/landlord-resources/` - Content Hub

**Structure:**
```html
<section class="guides-hero">
  <h1>Landlord Resources & Guides</h1>
  <p>Everything you need to know about leasing industrial space in PBC.</p>
</section>

<section class="guides-list">
  <article class="guide-card">
    <h3><a href="/guides/landlord-complete-guide/">
      The Complete Landlord's Guide to Palm Beach Warehouse Leasing
    </a></h3>
    <p>Market overview, optimal rental rates, tenant vetting, lease structures.</p>
    <a href="/guides/landlord-complete-guide/" class="read-more">Read Guide →</a>
  </article>

  <article class="guide-card">
    <h3><a href="/guides/tenant-vetting/">
      Tenant Vetting: What You Need to Know
    </a></h3>
    <p>Financial checks, industry reputation, background screening, red flags.</p>
    <a href="/guides/tenant-vetting/" class="read-more">Read Guide →</a>
  </article>

  <!-- ... more guides ... -->
</section>

<section class="resources-downloads">
  <h2>Downloadable Resources</h2>
  <div class="download-list">
    <div class="download-item">
      <h4>Tenant Vetting Checklist</h4>
      <p>Step-by-step checklist for qualifying tenants.</p>
      <a href="/assets/landlord-vetting-checklist.pdf" class="download-btn">
        Download PDF
      </a>
    </div>
    <!-- ... more downloads ... -->
  </div>
</section>
```

---

## PHASE 3: FORM INTEGRATION & CRM (Week 5-6)

### Modify `crm-integration.js` to Handle Landlord Leads

**Changes:**

1. Update form detection to handle both tenant and landlord forms
```javascript
document.addEventListener('DOMContentLoaded', function() {
  const tenantForm = document.getElementById('lead-form');
  const landlordForm = document.getElementById('landlord-form');
  const valuationForm = document.getElementById('custom-analysis-form');

  if (tenantForm) {
    tenantForm.addEventListener('submit', handleFormSubmit);
  }
  if (landlordForm) {
    landlordForm.addEventListener('submit', handleLandlordFormSubmit);
  }
  if (valuationForm) {
    valuationForm.addEventListener('submit', handleValuationFormSubmit);
  }
});
```

2. Add landlord-specific submission handler
```javascript
async function handleLandlordFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const leadData = extractLandlordFormData(form);
  leadData.lead_type = 'landlord_lead';

  // ... same CRM submission logic, but with landlord_lead flag
}

function extractLandlordFormData(form) {
  const formData = new FormData(form);

  return {
    tenant_id: tenantId,
    lead_type: 'landlord_lead',
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),

    // Landlord-specific fields
    property_address: formData.get('address'),
    property_city: formData.get('city'),
    property_zip: formData.get('zip'),
    property_sqft: parseInt(formData.get('sqft')),
    property_year_built: formData.get('year_built'),
    property_type: formData.get('property_type'),
    property_condition: formData.get('condition'),
    property_status: formData.get('current_status'),
    listing_timeline: formData.get('timeline'),
    asking_rate: formData.get('asking_rate'),
    special_notes: formData.get('notes'),

    // Captured features
    features: extractFeatures(formData),

    // Standard tracking
    utm_source: window.__utm?.source || null,
    utm_campaign: window.__utm?.campaign || null,
    referrer_url: document.referrer,
    landing_page_url: window.location.href,
  };
}

function extractFeatures(formData) {
  const features = [];
  if (formData.get('feature_docks')) features.push('Docks');
  if (formData.get('feature_14ft')) features.push('14ft clear height');
  if (formData.get('feature_16ft')) features.push('16ft clear height');
  if (formData.get('feature_power')) features.push('3-phase power');
  if (formData.get('feature_yard')) features.push('Fenced yard');
  if (formData.get('feature_office')) features.push('Office space');
  if (formData.get('feature_climate')) features.push('Climate controlled');
  return features.join(', ');
}
```

### Trusenda CRM Configuration

1. **Create new lead source:** `landlord_lead`
2. **Create lead classification:** Mark leads with `lead_type: "landlord_lead"` in API
3. **Set up email automation:**
   - Trigger: `lead_type == "landlord_lead"`
   - Sequence: 6 emails at 5 min, 24 hr, 5 day, 10 day, 21 day, 30 day
   - Include: Calendar reminders for consultation calls

4. **Create landlord segment:** Filter for `lead_type: "landlord_lead"` for targeted email sends

### Google Analytics Configuration

1. **Create conversion events:**
   ```
   Event: landlord_form_submission
   Event: landlord_consultation_scheduled
   Event: valuation_tool_view
   Event: valuation_custom_analysis_request
   ```

2. **Create custom dimensions:**
   ```
   Dimension: property_type (warehouse, flex, etc.)
   Dimension: property_city
   Dimension: listing_timeline (asap, 60 days, etc.)
   ```

3. **Create goal funnels:**
   - View `/list-your-space/` → Submit form → Consultation scheduled

### Facebook & Google Ads Conversion Tracking

1. **Facebook Pixel events:**
```javascript
// Fire on landlord form submission
fbq('track', 'Lead', {
  content_name: 'Landlord Consultation',
  content_category: 'Listing Agreement',
  content_type: 'landlord_lead',
  value: 50, // Estimated landlord lead value
  currency: 'USD',
  property_type: formData.property_type,
  property_city: formData.property_city,
});
```

2. **Google Ads conversion tag:**
```javascript
// Fire on landlord form submission
gtag('event', 'conversion', {
  send_to: 'AW-17147516072/landlord_conversion_label',
  value: 50,
  currency: 'USD',
  transaction_id: Date.now().toString(),
});
```

---

## PHASE 4: EMAIL SETUP (Week 7-8)

### Email Sequence 1: Landlord Discovery (Auto-Triggered)

**Email 1 (5 min after form submission)**
- Subject: "Your Property Consultation Requested"
- Content: Welcome, set expectations for follow-up call
- CTA: None (informational)

**Email 2 (24 hr)**
- Subject: "Quick question about your property"
- Content: Mention market opportunity, current tenant demand
- CTA: Calendar link to schedule call

**Email 3 (5 days)**
- Subject: "Market data for your area"
- Content: Comparable rates, sample revenue math
- CTA: View custom analysis

**Email 4 (10 days)**
- Subject: "How Sarah leased her warehouse in 40 days"
- Content: Case study, social proof
- CTA: Schedule consultation

**Email 5 (21 days)**
- Subject: "3 things to know before leasing your warehouse"
- Content: Tips & mistakes to avoid
- CTA: Call to talk strategy

**Email 6 (30 days)**
- Subject: "One more thought..."
- Content: Final low-pressure touch
- CTA: Reply with best available time

### Template in Trusenda CRM Setup:
```
Trigger: New lead with lead_type = "landlord_lead"
Sequence: Auto-send 6 emails
Wait times: 5 min, 24 hr, 5 days, 10 days, 21 days, 30 days
Skip rule: If phone call logged OR form mark "consultation_scheduled"
```

---

## PHASE 5: AD CAMPAIGNS (Week 9-10)

### Facebook Ads Setup

**Campaign 1: "List Your Space Awareness"**
- Objective: Conversions (form fills)
- Budget: $500/week
- Audience: Property owners, real estate investors, ages 35–75, PBC + surrounding areas
- Ad sets: 3 creatives (video + 2 static images)

**Campaign 2: "Landlord Retargeting"**
- Objective: Conversions
- Budget: $200/week
- Audience: Website visitors (landlord pages) in past 30 days
- Sequence: 4 ad sets, 7-day wait between each, different messaging
- Total duration: 30 days per visitor

**Campaign 3: "Landlord Lead Lookalike"**
- Objective: Conversions
- Budget: $100/week (test)
- Audience: Lookalike of existing landlord contacts (1% similarity, high quality)

### Google Ads Setup

**Search Campaign: "Warehouse Broker - Landlord"**
- Keywords:
  - "warehouse broker palm beach county"
  - "list warehouse for lease florida"
  - "commercial property management west palm beach"
  - "industrial space broker boca raton"

- Budget: $20/day (~$600/mo)
- Landing page: /list-your-space/
- Bid strategy: Maximize conversions

---

## PHASE 6: CONTENT & LAUNCH (Week 11-12)

### Blog Content Publication

**Week 11:**
- [ ] Publish: "The Complete Landlord's Guide to PBC Warehouse Leasing" (3,000 words)
- [ ] Publish: "Tenant Vetting: What You Need to Know" (2,000 words)
- [ ] Create internal links from homepage

**Week 12:**
- [ ] Publish: "Market Report Q2 2026" (2,500 words)
- [ ] Publish: "Selling vs. Leasing Your Warehouse" (2,800 words)

### Video Content

**Week 11-12:**
- [ ] Record first property tour video (5 min)
- [ ] Record Zach intro to market (2 min)
- [ ] Record "Ask Zach" video (landlord question)
- [ ] Upload to YouTube, optimize for search

### LinkedIn Setup

- [ ] Post 3x landlord-focused posts
- [ ] Share blog links
- [ ] Engage with local RE investor posts

### Soft Launch (Week 12, Limited)

- [ ] Send beta email to existing landlord contacts
- [ ] Get feedback on pages (mobile, form usability)
- [ ] Fix any issues

### Full Launch (Week 13)

- [ ] All campaigns live simultaneously
- [ ] Social media push (LinkedIn + Facebook)
- [ ] Email announcement to tenant list: "Now listing landlord properties"
- [ ] Monitor dashboard for leads and conversions

---

## PHASE 7: MONITORING & OPTIMIZATION (Week 13+)

### Weekly Monitoring Checklist

- [ ] Facebook spend vs. budget (should be $600–800/week)
- [ ] CPL by campaign (target: $15–25 for landlord)
- [ ] Form submission rate (target: 5–8%)
- [ ] Google Ads quality score (target: 7+)
- [ ] Email open rates (target: 30–40%)
- [ ] Website traffic to landlord pages

### Optimization Rules

**If CPL > $30 (too high):**
- Pause underperforming ad creative
- Increase budget to better-performing ads
- Refine audience targeting (tighten demographics)

**If form submission rate < 3% (too low):**
- Test new landing page headlines
- Simplify form (reduce fields)
- Add more trust signals (testimonials, comparison table)

**If email open rate < 20% (too low):**
- Test new subject lines
- Adjust send times
- Reduce email frequency

---

## FILES TO CREATE/MODIFY

### New Files:
```
/list-your-space/index.html                    (2,500 lines)
/what-is-my-space-worth/index.html             (2,000 lines)
/guides/landlord-resources/index.html          (1,500 lines)
/guides/landlord-complete-guide/index.html     (2,500 lines)
/guides/tenant-vetting/index.html              (1,800 lines)
/assets/landlord-vetting-checklist.pdf         (new PDF)
/assets/landlord-email-templates.html          (email HTML)
```

### Modify Files:
```
/index.html                                    (add landlord CTA section)
/crm-integration.js                            (update form handlers)
/styles.css                                    (add landlord-specific CSS)
/site-config.js                                (add new config values)
```

---

## TESTING CHECKLIST

Before launch:

- [ ] All forms submit successfully (dev + prod)
- [ ] Leads appear in Trusenda CRM with correct source
- [ ] Emails send on schedule
- [ ] Facebook Pixel fires conversion events
- [ ] Google Ads tracks conversions
- [ ] Mobile responsiveness (test on iPhone, Android)
- [ ] Form validation works (required fields, email format, etc.)
- [ ] Success messages display correctly
- [ ] Links in emails work (test with Litmus)
- [ ] Page load speed < 3 seconds (test with PageSpeed Insights)
- [ ] Meta tags/OG images correct on each page
- [ ] UTM parameters captured correctly
- [ ] Analytics goals tracking properly

---

## SUCCESS TARGETS (90 Days)

| Metric | Target | How to Track |
|--------|--------|-------------|
| Landlord form submissions | 300+ | GA4 event: landlord_form_submission |
| Landlord CPL | $15–25 | Facebook Ads Manager |
| Landlord consultation calls booked | 200+ | Trusenda CRM |
| Listing agreements signed | 5–8 | Trusenda CRM + manual tracking |
| Email database growth | 1K+ landlords | CRE Mail subscriber count |
| Blog traffic | 2K+ monthly | GA4 landing page report |
| Video views | 5K+ | YouTube analytics |
| Tenant funnel maintained | CPL < $25 | Facebook Ads Manager |

---

End of Implementation Checklist
