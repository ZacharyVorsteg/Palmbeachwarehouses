# Landlord-Facing Funnel Architecture
## Two-Sided Marketplace Strategy for Palm Beach Warehouses

**Client:** Zach Vorsteg (Cornerstone Realty, Palm Beach County)
**Goal:** Create a flywheel where tenant leads → attract landlords → more listings → more tenants
**Timeline:** 90-day build and launch

---

## PART 1: FUNNEL ARCHITECTURE

### Current State (Tenant-Facing Only)
```
palmbeachwarehouses.com (homepage)
├── Tenant Lead Form (hero)
├── Listings Grid (6 properties)
├── Location Pages (/locations/*)
├── Educational Guides (/guides/*)
└── CRM Integration → Trusenda
```

### Target State (Two-Sided Marketplace)
```
palmbeachwarehouses.com (dual-purpose homepage)
├── TENANT FUNNEL (existing, optimized)
│   ├── Hero → "Find Space"
│   ├── Listings Grid
│   └── Tenant Lead Form
├── LANDLORD FUNNEL (new, parallel)
│   ├── Call-to-action: "List Your Space"
│   ├── Landlord Hub (/list-your-space/)
│   ├── Valuation Tool (/what-is-my-space-worth/)
│   ├── Landlord Resources (/guides/landlord/)
│   └── Landlord Lead Form → Trusenda (marked "landlord" source)
└── UNIFIED CONTENT
    ├── Market Reports (both audiences)
    ├── Email Newsletter (both audiences)
    └── Social/Video Content
```

---

## PART 2: NEW PAGES TO BUILD

### Page 1: `/list-your-space/` (Landlord Hub)
**Purpose:** Entry point for property owners wanting to list with Zach
**Type:** Hybrid landing page + lead capture

**Structure:**
```html
Hero
  Headline: "Turn Your Warehouse Into Revenue"
  Subheading: "List with Palm Beach's leading industrial broker.
              We've leased [X] SF of warehouse space in the last 12 months."
  CTA: "Get a Free Consultation"

Social Proof Section
  – "6 active properties generating steady revenue"
  – "Average lease-up time: [X] days" (data from 6 current properties)
  – "Broker Zach Vorsteg, SL3603483, Cornerstone Realty"

Why List With Zach?
  1. Direct Tenant Network
     Problem: Landlords usually get brokers who have a theoretical network
     Zach's angle: "I actively source tenants across Palm Beach.
                   You get exposed to real, qualified buyers—not just listings."

  2. Local Expert
     "12+ years in PBC industrial market. I know zoning, soil condition,
      carrier accessibility for every micro-neighborhood."

  3. Fast Leasing
     "Average lease-up: [X] days vs. county average: [Y] days"

  4. Transparent Reporting
     "Real-time updates. Weekly market reports. No surprises."

Comparison Table (vs. Typical Broker)
  Feature                    | Zach's Model  | Typical Broker
  ────────────────────────────────────────────────────────────
  Direct tenant network      | Yes (active)  | Maybe (passive)
  Local market expertise     | 12+ years PBC | Regional (less deep)
  Tenant qualification check | Yes (upfront) | No
  Lease-up speed             | [X] days      | [Y] days
  Market updates             | Weekly        | Quarterly
  Zoning/compliance guidance | Included      | Extra fee

Listing Process (4 Simple Steps)
  1. Free Consultation
     – 15-min call about your property
     – Zach assesses condition, location, market rate

  2. Market Analysis Report
     – Comparable lease rates in your submarket
     – Recommended rent (at 90%, 95%, 100% of market)
     – Estimated lease-up timeline

  3. Tenant Matching
     – Zach shows your space to pre-qualified tenants
     – You approve/reject prospects

  4. Closing
     – Zach handles lease negotiation, signing
     – You collect rent

Form Section (Landlord Lead Capture)
  [See form design below]

FAQ (Landlord-Specific)
  Q: How much will you charge me?
  Q: How long does it typically take to lease up?
  Q: What's the process for vetting tenants?
  Q: Can you help with contract negotiations?
  Q: What if I want to sell instead of lease?
  Q: Do you handle property management?
```

**Form Fields (Landlord Version):**
```
1. Owner Info
   - Name *
   - Email *
   - Phone *
   - Company (if applicable)

2. Property Info
   - Property Address *
   - City/Zip *
   - Square Footage *
   - Year Built
   - Property Type (Warehouse / Flex / Cold Storage / Other)

3. Current Situation *
   - Currently leased (and expiring when?)
   - Currently vacant
   - For sale
   - Planning to build/develop

4. Timeline
   - When do you want to list? (ASAP / 30 days / 60+ days)

5. Property Condition
   - Excellent condition
   - Good condition
   - Needs minor repairs
   - Major renovations needed

6. Special Features (checkboxes)
   - Loading dock(s)
   - Clear height 14+ ft
   - Clear height 18+ ft
   - 3-phase power
   - Fenced yard
   - Office/showroom
   - Climate controlled

7. Additional Info
   - Any special circumstances? (e.g., "current tenant departing")
   - Preferred lease rate? (optional)
   - Any questions?

8. Hidden Fields (auto-captured)
   - UTM source/campaign
   - Landing page URL
   - Referrer
```

**Success Message (Landlord):**
```
"Your property consultation request received!

Zach will call you within 2 hours during business hours
to discuss your property and answer any questions.

In the meantime, you can review comparable
lease rates in your area. [link to market data]"
```

---

### Page 2: `/what-is-my-space-worth/` (Valuation Tool)
**Purpose:** Qualify landlords + demonstrate market knowledge
**Type:** Interactive tool + lead capture

**Mechanism:**
User inputs → tool calculates estimated lease rate → captures contact info for custom analysis

**Form Flow:**
```
Step 1: Property Basics
  – Address (autocomplete using Google Places API)
  – Square footage
  – Year built
  → Fetches demographic + zoning data from public sources

Step 2: Condition & Features
  – Select condition (excellent/good/fair/poor)
  – Check relevant features (docks, power, height, etc.)
  → Adjusts comp set and rate calculation

Step 3: Results Screen
  Headline: "Your Space is Worth $X.XX/SF/Year (NNN)"

  Breakdown:
    Base Rate (comparable properties): $X/SF
    Location Adjustment: +/- $Y
    Condition Adjustment: +/- $Z
    Feature Adjustment: +/- $W
    ────────────────────────────
    ESTIMATED RATE: $X.XX/SF/year

  Scenario Planning:
    "At this rate, a 10,000 SF space would lease for:
     - $X,XXX/month (NNN)
     - Assuming full occupancy and 5-year lease"

  Context:
    "This is an estimate based on 6-month market data.
     Your actual rate may vary based on:
     - Current market conditions
     - Specific tenant requirements
     - Negotiation dynamics"

  [Enter Email for Custom Analysis]
    "Get a detailed market analysis for your property.
     Zach will provide:
     - Comparable lease rates in your submarket
     - Recommended asking rent (at 90%, 95%, 100% of market)
     - Estimated lease-up timeline
     - Specific tenant prospects we're currently representing"
```

**Form Capture (Valuation Tool):**
```
First name *
Email *
Phone (optional)

[Submit for Custom Analysis]
```

**Tech Stack for This Page:**
- Address autocomplete: Google Places API (existing Analytics 4 account should have access)
- Comp data: Hardcoded JSON with 12-month rolling averages from CoStar, CBRE
- Calculations: JavaScript formula engine
- Form submission: Same Trusenda integration as tenant form, but with `source: "valuation_tool"`

---

### Page 3: `/guides/landlord-resources/` (Content Hub)
**Purpose:** Position Zach as expert, nurture landlord leads with valuable content

**Structure:**
```
Hero
  "Industrial Property Owner's Guides"
  Subtitle: "Market insights, leasing strategies, and tenant vetting checklist."

Content Pieces (blog-style):

1. "The Complete Landlord's Guide to Palm Beach Warehouse Leasing"
   - Market overview
   - Optimal rental rates by submarket
   - Tenant qualification checklist
   - Lease structure options (gross vs. NNN, triple-net components)
   - Common lease terms negotiation points

2. "Tenant Vetting: What You Need to Know"
   - Financial checks (credit, bank statements)
   - Industry reputation (call previous landlords)
   - Use of space (does it match your restrictions?)
   - Background check considerations
   - Zach's tenant qualification process (differentiator)

3. "4 Mistakes Landlords Make When Leasing Industrial Space"
   - Underpricing (how to avoid)
   - Not understanding your tenant's timeline
   - Accepting tenants without proper vetting
   - Ignoring market conditions during negotiation

4. "Industrial Leasing vs. Selling: Which is Right for You?"
   - Cash flow analysis
   - 1031 exchange considerations
   - Market timing
   - Leverage and risk

5. "Recent Market Data: Palm Beach County Industrial"
   - Average rates by submarket (WPB, Boca, Delray, etc.)
   - Lease-up times
   - Tenant mix (what industries are active?)
   - Rent growth year-over-year
   - Class A vs. Class B property performance

6. "The Landlord's Calendar: When to List for Maximum Leasing"
   - Seasonal trends in PBC industrial
   - Best/worst months to list
   - Why Q2 is typically the hottest

7. "Your Property, Your Rules: Setting Restrictions"
   - What types of restrictions are enforceable
   - Environmental concerns
   - Access/signage restrictions
   - How to protect your long-term interests

Downloadable Resources:
  – "Landlord's Tenant Vetting Checklist" (PDF)
  – "Industrial Lease Term Glossary" (PDF)
  – "Market Rate Comps by Submarket" (monthly updated)
  – "Zach's Lease Negotiation Template" (for attorneys)

Each article ends with:
  "Get Your Property Valued
   Let Zach show you what your space could lease for.
   [Button: Get Free Valuation]"
```

---

## PART 3: FACEBOOK AD CAMPAIGNS (LANDLORD)

### Campaign 1: "List Your Space" Awareness
**Objective:** Page views → traffic to `/list-your-space/`
**Audience:**
- US, FL, ages 35–75, high income
- Interest in: "Real estate investing", "commercial real estate", "property management", "small business"
- Exclusion: Zach's existing landlord/tenant lookalike
- Estimated size: 15K–20K people in PBC

**Creative Concepts:**

**Concept A: Social Proof + Conversion**
```
Video (15 sec):
  [Scene 1: Zach on job site, pointing at a 10,000 SF warehouse]
  Voiceover: "Three months ago, Sarah owned a vacant warehouse
             in West Palm Beach making $0 per month."

  [Scene 2: Cut to happy tenant moving into space, handshake]
  Voiceover: "Now, she collects $3,200/month in steady income."

  [Scene 3: Zach shaking hands with Sarah]
  Sarah (on-camera): "Zach found the right tenant, handled everything.
                     I didn't have to lift a finger."

  [Text overlay]: "Turn vacant space into revenue"
  [CTA]: "Get Your Space Valued — Free"

Headline: "Turn Your Warehouse Into Revenue"
Body: "Join 6 properties already leased with Zach.
       Get a free market analysis for your space."
CTA Button: "Learn More"
Landing Page: /list-your-space/

Budget: $500/week
```

**Concept B: Market Data (Authority)**
```
Static Image: Infographic
  Title: "Palm Beach Warehouse Market 2026"
  Data Points:
    - Average lease rate: $X/SF/year NNN
    - Avg lease-up time: X days
    - YoY rent growth: X%
    - Most active markets: [cities]
  Footer: "Zach Vorsteg — 12+ years PBC industrial"

Headline: "Your Space Is Worth More Than You Think"
Body: "Palm Beach warehouse rates are UP 8% YoY.
       Find out what your property could lease for.
       [Free valuation inside]"
CTA: "See Your Property Value"
Landing Page: /what-is-my-space-worth/

Budget: $300/week
```

**Concept C: Problem/Solution**
```
Static Image: Before/After
  BEFORE (red): Vacant warehouse, tumbleweed, "$0 income"
  AFTER (green): Tenant using space, calendar showing cash flow, "$3K+/month"

Headline: "Tired of Empty Space? We're Not."
Body: "We specialize in finding quality tenants for warehouse
       owners in Palm Beach County. Average lease-up: X days.
       Average tenant quality: 98% approval rate.
       [Get matched with a tenant]"
CTA: "Start Listing"
Landing Page: /list-your-space/

Budget: $400/week
```

---

### Campaign 2: Retargeting Landlords (Cold → Warm → Hot)
**Objective:** Lead nurturing across 30-day cycle

**Audience:** Website visitors who engaged with landlord content but didn't convert

**Sequence:**

**Step 1: 3-Day Delay (Cold Retarget)**
```
Headline: "You Visited — Let Us Help"
Body: "Thinking about leasing your warehouse in PBC?
       We found 12 tenants actively looking THIS MONTH.
       [See current tenant demand]"
CTA: "See Tenant Pipeline"
Landing Page: /list-your-space/ (anchor to "current prospects" section)

Creative: Casual, low-pressure
```

**Step 2: 7-Day (Warm Retarget)**
```
Headline: "Don't Leave Money on the Table"
Body: "Compare your current rent to market rates.
       (Spoiler: many owners are undershooting.)
       [Get a free analysis]"
CTA: "Check Market Rates"
Landing Page: /what-is-my-space-worth/

Creative: Case study or before/after
```

**Step 3: 14-Day (Hot Retarget)**
```
Headline: "Sarah Just Filled Her Warehouse. You Can Too."
Body: "3-month vacancy → full occupancy in 40 days.
       Here's how we do it...
       [Book a consultation]"
CTA: "Get Your Space Leased"
Landing Page: /list-your-space/

Creative: Testimonial video or detailed case study
```

**Step 4: 30-Day (Final Push)**
```
Headline: "Let's Talk Timeline"
Body: "Every month vacant = lost revenue.
       Zach's average lease-up: X days.
       Your space might be worth $XXXXX+ in annual revenue.
       [Schedule a call]"
CTA: "Schedule Consultation"
Landing Page: /list-your-space/

Creative: Zach on camera, speaking directly
Ad format: Video (15-30 sec)
```

**Budget:** $200/week total (split across 4 audiences)

---

### Campaign 3: Google Ads (Search) - Landlord
**Objective:** Capture high-intent search traffic from landlords actively looking for CRE brokers

**Keywords (Landlord Intent):**
```
"warehouse broker palm beach"
"industrial property leasing palm beach county"
"list warehouse for lease florida"
"commercial real estate broker west palm beach"
"commercial property management palm beach"
"industrial space broker boca raton"
```

**Search Ads:**

**Ad Variant 1 (Brand Awareness):**
```
Headline 1: Warehouse Leasing in Palm Beach
Headline 2: Expert Industrial Broker | Zach Vorsteg
Headline 3: Fast Lease-Up. Qualified Tenants.

Description 1: Turn your vacant warehouse into monthly income.
               Zach has leased 10K+ SF in 2025. Free consultation.
Description 2: Get your space valued and matched with qualified
               tenants. No obligation.

Final URL: /list-your-space/
Display URL: palmbeachwarehouses.com/list-your-space
```

**Ad Variant 2 (Competitor Differentiation):**
```
Headline 1: Why Landlords Choose Zach
Headline 2: Direct Tenant Network + Local Expertise
Headline 3: Average Lease-Up: X Days

Description 1: Unlike typical brokers, Zach actively sources tenants
               (not just listings). Landlords see faster results.
Description 2: 12+ years in PBC. Broker Zach Vorsteg, SL3603483.

Final URL: /list-your-space/
Display URL: palmbeachwarehouses.com/list-your-space
```

**Landing Page:** /list-your-space/
**Budget:** $500/month (~$15/day)
**Bid Strategy:** Maximize conversions (let Google optimize)

---

## PART 4: EMAIL NURTURE SEQUENCES

### Sequence 1: Landlord Discovery Sequence (Cold → Warm)
**Trigger:** Form submission on `/list-your-space/` OR `/what-is-my-space-worth/`
**Goal:** Establish relationship, set consultation call

**Email 1: Immediate (within 5 minutes)**
```
Subject: Your Property Consultation Requested

Hi [Name],

Thank you for requesting a consultation. I'll be in touch
within 2 hours to discuss your property and market opportunities
in your area.

In the meantime, here's what to expect:
1. Quick 15-min call to understand your property
2. Detailed market analysis with comps for your submarket
3. Realistic timeline and strategy for lease-up or sale
4. No obligation—just a conversation

During our call, be ready to share:
- Property address and square footage
- Current condition
- Any special features (docks, power, height, etc.)
- Your timeline (ASAP vs. planned)

Looking forward to connecting.

Best,
Zach Vorsteg
SL3603483 | Cornerstone Realty
561-718-6725
```

**Email 2: 24-hour follow-up (if no response to call/email)**
```
Subject: Quick question about your property

Hi [Name],

I wanted to follow up on your consultation request.
Given the current market in [City/Area], this is actually
a really good time to discuss options for your property.

A few things to know:
- Lease rates in your area are UP 6% year-over-year
- We have 3 qualified tenants actively looking in your size range
- Average lease-up time is only X days (faster than county average)

Let's find a time that works for a brief call.
Options: Tomorrow 10am, 2pm, or Thursday?

[Calendar link to schedule call]

Zach
561-718-6725
```

**Email 3: 5-day follow-up (value-first, no pressure)**
```
Subject: Market data for your area

Hi [Name],

I pulled some market data for properties in [City/Submarket]
similar to yours. You're looking at competitive rates around
$X/SF for a [type] property in [year-built] condition.

If you're evaluating lease vs. sell, here's the quick math:
- At $X/SF, a [size] space would gross $XXX/month (NNN)
- That's a 6.2% cap rate (assuming 80% occupancy)
- Break-even after lease-up: [X months]

No pressure, but I wanted you to have the data.
If you'd like to dive deeper, I'm happy to pull comps
and run different scenarios.

Call if you want to talk strategy.

Zach
561-718-6725
```

**Email 4: 10-day (case study + social proof)**
```
Subject: How Sarah leased her warehouse in 40 days

Hi [Name],

One of my landlord clients, Sarah, had a 10K SF warehouse
in West Palm that sat vacant for 3 months. Here's what we did:

Problem: Asking rent was 15% below market
Solution: Re-priced at 100% of market, added virtual tour
Result: 3 qualified prospects in 2 weeks, leased in 40 days

Her tenant has been stable for 8 months now, paying on time,
no issues.

Your property likely has similar upside. Market rates are strong
right now, and we have active tenant demand.

Ready to explore?

[Schedule a call]

Zach
```

**Email 5: 21-day (educational, positions expertise)**
```
Subject: 3 things to know before leasing your warehouse

Hi [Name],

Here are insights I share with every landlord considering
a lease. These mistakes cost thousands:

1. Underpricing
   Many owners price at 85-90% of market hoping for faster
   lease-up. In this market, you'll get full-price offers
   within weeks. Don't leave money on the table.

2. Skipping tenant vetting
   A "warm body" isn't worth months of payment issues. We
   check financials, references, and industry background on
   every prospect before you even meet them.

3. Misunderstanding NNN structures
   NNN looks cheaper but tenants pay operating costs on top.
   Make sure your lease clearly outlines CAM, insurance, taxes.

When you're ready, let's discuss which strategy fits your
property best.

[Call me]

Zach
561-718-6725
```

**Email 6: 30-day (last touch before archive)**
```
Subject: One more thought...

Hi [Name],

I've sent a few messages, so I'll keep this one short.
I'm here whenever you're ready to explore leasing or selling
your warehouse.

No pressure, but every month a property sits vacant is
lost revenue. If now's the time to act, I'm ready.

Looking forward to connecting.

Zach
561-718-6725

P.S. Can't talk right now? No problem. Reply with your
best available time and I'll work around it.
```

**Automation in Trusenda:**
- Trigger: New lead with `source: "landlord_form"`
- Sequence: Auto-send emails at 5 min, 24 hr, 5 day, 10 day, 21 day, 30 day
- Skip email if: Phone call logged OR form conversion marked "scheduled"

---

### Sequence 2: Tenant Lead Nurture (Enhanced - Existing)
**Goal:** Warm leads who don't convert to form on first visit

**Current Sequence:** (Needs optimization)
```
Email 1 (immediate): "We Found Space For You"
Email 2 (3 days): "Here's This Week's New Listings"
Email 3 (7 days): "Market Update + 3 Top Matches"
Email 4 (14 days): "Ready to Schedule a Tour?"
Email 5 (21 days): "Timing Opportunity"
```

**Optimization:** Add market context + landlord social proof
```
Email 2 REVISED (3 days): "New Listings + Market Insight"

Subject: New inventory just added—and it's moving fast

Hi [Name],

Two new listings hit the market this week that match your
[size/location] criteria. Here's what's worth noting:

LISTING 1: 5,000 SF, West Palm Beach
  Rate: $X/SF, NNN | Available: 30 days
  Features: Docks, 14' clear height, office

LISTING 2: 8,500 SF, Boca Raton
  Rate: $X/SF, NNN | Available: 45 days
  Features: 16' clear height, yard, 3-phase power

Why you should act fast:
We represent both landlords AND tenants. When a great space
comes on, qualified tenants snap it up. Average lease-up time
for new listings: X days.

Want a closer look? [Schedule Virtual Tour]

Zach
```

---

### Sequence 3: Market Update Newsletter (Dual Audience)
**Cadence:** Monthly (last Friday of month)
**Audience:** Tenant leads + landlord prospects
**Goal:** Stay top-of-mind, position Zach as expert, drive engagement

**Template:**

```
Subject: PBC Industrial Market Update — [Month] 2026

Hi [Name or "Friend"],

Here's what moved in the Palm Beach industrial market this month.

MARKET SNAPSHOT
  Average lease rate (NNN): $X/SF (↑2% from last month)
  Lease-up time (median): X days (↓ from X days last month)
  Avg rent growth YoY: +6%
  Top markets: West Palm Beach, Boca Raton, Delray
  Vacancy rate: X% (tight market)

WHAT THIS MEANS FOR TENANTS
  ✓ Competition is high—move fast on spaces you like
  ✓ Early site selection is critical (limited inventory)
  ✓ Market is favoring long-term leases (3-5 years)
  ✗ Expect to negotiate on terms, not rate

WHAT THIS MEANS FOR LANDLORDS
  ✓ Strong demand across all property classes
  ✓ Tenants willing to pay for quality spaces
  ✓ NNN terms holding steady (CAM ~$X/SF)
  ✗ Demand favors move-in ready properties

THIS MONTH'S HIGHLIGHTS
  New listings: 3
  Recently leased: 2 (Sarah's WPB warehouse — 40 days)
  Market movers: Cold storage demand ↑ 15%

LOOKING AHEAD
  Q2 is historically the strongest leasing quarter.
  If you're considering a move or listing, now is the time
  to act while momentum is strong.

FEATURED LISTING
  [Property A with photo and specs]
  [Property B with photo and specs]
  [CTA: Browse All Listings]

NEED GUIDANCE?
  Tenant looking for space? [Find Your Match]
  Landlord ready to list? [Get Your Property Valued]
  Just want to chat about market? [Schedule a call]

Best,
Zach Vorsteg
Cornerstone Realty | SL3603483
561-718-6725
palmbeachwarehouses.com
```

**Distribution:**
- Send to all leads in Trusenda with `email_opted_in: true`
- Track: Opens, clicks, engagement by audience segment
- A/B test: Subject line (data-focused vs. story-focused)

---

## PART 5: CONTENT MARKETING STRATEGY

### Blog Content Calendar (6 Months)

#### Tenant-Facing Content
```
Week 1: "How to Choose Between Warehouse & Flex Space"
        SEO: warehouse vs flex space, when to choose flex
        Length: 1,500 words
        CTA: "Find Your Space"

Week 2: "Palm Beach Industrial Market Report Q1 2026"
        SEO: palm beach warehouse market, industrial real estate PBC
        Length: 3,000 words (deep dive, data-driven)
        CTA: "See Current Listings"

Week 3: "Tenant Improvements: What Landlords Will Pay For"
        SEO: tenant improvements warehouse, TI allowance industrial
        Length: 2,000 words
        CTA: "Get Matched with TI-Ready Spaces"

Week 4: "5 Red Flags When Leasing Industrial Space"
        SEO: industrial lease red flags, warehouse lease mistakes
        Length: 1,800 words
        CTA: "Talk to an Expert"
```

#### Landlord-Facing Content
```
Week 5: "The Landlord's Complete Guide to NNN Leases"
        SEO: NNN triple net lease, industrial NNN structure
        Length: 2,500 words
        CTA: "List Your Space"

Week 6: "Tenant Vetting: How to Avoid Problem Tenants"
        SEO: tenant credit check, industrial tenant screening
        Length: 2,000 words
        CTA: "Get a Consultation"

Week 7: "Warehouse Lease Rate Trends in Palm Beach (2026)"
        SEO: warehouse lease rates palm beach, commercial rent
        Length: 2,200 words (data + analysis)
        CTA: "Check Your Property Value"

Week 8: "Selling vs. Leasing Your Warehouse: ROI Comparison"
        SEO: should I sell or lease my warehouse
        Length: 2,800 words (financial calculator)
        CTA: "Get a Free Analysis"
```

#### Shared Content
```
Week 9: "Palm Beach Industrial Zoning Guide"
        Audience: Both (tenants care about use, landlords about restrictions)
        SEO: palm beach industrial zoning, warehouse zoning FL
        Length: 3,000 words
        CTA: Dual ("Find Zoned Space" / "Know Your Zoning")

Week 10: "Hidden Gems: Up-and-Coming Industrial Areas in PBC"
         Audience: Both
         SEO: best warehouse locations palm beach, rising areas
         Length: 2,000 words
         CTA: Dual
```

### Video Content Strategy

#### YouTube Channel: "Zach's PBC Industrial Insights"

**Video Series 1: Property Walkthroughs (Tenant Focus)**
```
Format: 3-5 min walkthrough videos
Cadence: Weekly (one per featured listing)

Example:
  Title: "5,000 SF West Palm Warehouse — Loading Docks, 14' Height"
  Content: Zach walks through property, explains features,
           highlights tenant value, mentions lease rate
  CTA: "Interested? Schedule a tour" [link]
  Distribution: YouTube, Facebook, Instagram

Production: iPhone 15 Pro + gimbal, good lighting
Cost: $0 (DIY)
```

**Video Series 2: Market Updates (Both Audiences)**
```
Format: 2-3 min monthly market overview
Cadence: First Friday of month

Example:
  Title: "Palm Beach Warehouse Market — March 2026 Update"
  Content: Zach sits down, discusses rates, lease-up times,
           market trends, what it means for tenants & landlords
  Distribution: YouTube, Facebook, LinkedIn, email (link)

Production: Desk setup, good audio, simple graphics
Cost: $0 (DIY)
```

**Video Series 3: "Ask Zach" (Q&A, Both Audiences)**
```
Format: 2-4 min Q&A videos
Cadence: Twice monthly

Example questions:
  - "What credit score do I need to lease a warehouse?"
  - "How long does it take to lease a warehouse?"
  - "Should I negotiate rate or terms?"
  - "What's the difference between gross and NNN?"
  - "Can I sublease my warehouse space?"
  - "How do I price my warehouse for lease?"

Distribution: YouTube Shorts, Instagram Reels, TikTok, email
Cost: $0
```

### LinkedIn Content Strategy
**Goal:** Position Zach as thought leader, generate landlord + tenant credibility

**Content Mix:**
```
40% Market insights ("PBC warehouse rates up 6% YoY...")
30% Success stories ("Just helped Sarah lease her warehouse...")
20% Educational ("NNN lease explained...")
10% Personal brand ("Celebrating 12 years in PBC industrial...")

Cadence: 3–4 posts/week
Format: Text + image, short video, carousel
Engagement: Comment & reply to landlord/investor posts in PBC
```

**Example Posts:**

```
POST 1: Market Insight
"Just reviewed March comps. Palm Beach warehouse rates are
now $X/SF NNN—up 6% from last year. Strong demand, tight
inventory, and Q2 is historically the hottest quarter.

If you're a landlord: now's the time to list.
If you're a tenant: act fast—inventory moves quickly.

Thoughts on market timing? Reply in comments."

[Image: Market chart showing rent growth trend]
```

```
POST 2: Success Story
"Three months ago, Sarah owned a 10K SF warehouse in West
Palm that sat vacant for 90 days. Today, it's fully leased
to a stable manufacturing tenant.

What changed?
1. Repriced at 100% of market (not 85%)
2. Invested in professional photography + virtual tour
3. We pre-qualified 5 tenants before showing

Result: Lease-up in 40 days. Tenant quality: A+.

If you have vacant industrial space in PBC, let's talk.
[DM for consultation]"

[Image: Before/after property photo or testimonial]
```

```
POST 3: Educational
"NNN explained: What most landlords get wrong.

NNN = Triple Net lease. Tenant pays:
– Base rent (e.g., $X/SF)
– CAM (common area maintenance)
– Taxes
– Insurance

Why CAM matters: It's typically $X/SF, and it fluctuates
with building expenses. Make sure your lease clearly caps
CAM or sets audit rights.

Question: Are you pricing your CAM charges correctly?
[Reply in comments]"

[Image: Infographic showing NNN breakdown]
```

### Search Engine Optimization (Existing + New)

**Keyword Strategy (Landlord Intent):**
```
Primary Keywords:
  - warehouse broker palm beach county
  - list warehouse for lease florida
  - industrial property management boca raton
  - warehouse leasing west palm beach

Secondary Keywords:
  - commercial real estate broker palm beach
  - industrial space broker florida
  - warehouse owner resources
  - lease vs sell warehouse calculator

Content Pages Targeting These:
  /list-your-space/ → "warehouse broker palm beach county"
  /what-is-my-space-worth/ → "list warehouse for lease"
  /guides/landlord-resources/ → "landlord industrial guides"
  /guides/palm-beach-industrial-market/ → "warehouse market palm beach"
```

**On-Page SEO Checklist (New Pages):**
```
META:
  ✓ Title (50–60 chars): "List Your Warehouse in Palm Beach | Zach Vorsteg"
  ✓ Description (150–160 chars): "Turn your warehouse into monthly income..."
  ✓ H1 tag: "Turn Your Warehouse Into Revenue" (unique, keyword-relevant)
  ✓ Canonical URL: Set on each page

CONTENT:
  ✓ 2-3 H2 headings with target keywords
  ✓ Internal links to related pages (guides, listings, testimonials)
  ✓ External links to authority sources (CoStar, CBRE, NAR reports)
  ✓ Image alt text: "warehouse in west palm beach with loading docks"
  ✓ Schema markup: Organization, FAQPage, LocalBusiness

TECHNICAL:
  ✓ Page speed: <3 seconds (test with PageSpeed Insights)
  ✓ Mobile responsive: Yes
  ✓ SSL certificate: Yes (https://)
  ✓ XML sitemap: Updated (include new pages)
```

---

## PART 6: RETARGETING & CROSS-SELLING FLYWHEEL

### The Two-Sided Retargeting Loop

**Tenant Lead → Potential Landlord:**
```
Scenario: A tenant finds space on palmbeachwarehouses.com,
schedules a tour. Six months later, they expand and need
additional space.

Trigger: In Trusenda, mark lead as "expanding."
Action: Send landlord-facing content
  – "Considering expanding? Let us match you with space."
  – Market updates showing strong tenant demand
  – Success stories of other expanding businesses
Upsell: "If you decide to sublease your current space, we can help."
```

**Landlord Lead → Potential Tenant:**
```
Scenario: A landlord lists their warehouse. One of your
existing tenant leads is a perfect fit.

Trigger: New listing created (e.g., "5K SF Boca warehouse")
Action: Query tenant leads matching location/size criteria
  – Send personalized email: "New space just hit market—might be perfect."
  – Feature listing in weekly newsletter
Outcome: Tenant moves into new space, landlord fills vacancy
Result: Flywheel effect—both audiences see success
```

### Lifecycle Segment Automation (in Trusenda)

```
TENANT SEGMENTS:
  1. Searcher (viewed listings, no form)
     → Send market updates + email nurture sequence

  2. Prospect (submitted form)
     → Follow-up calls, property showings, lease negotiations

  3. Tenant (active lease)
     → Renewal reminders (11 months before expiry)
     → Market updates (might want to upgrade/downgrade)
     → Sublease opportunity alerts

LANDLORD SEGMENTS:
  1. Prospect (submitted form)
     → Consultation call, market analysis, listing agreement

  2. Landlord (active listing)
     → Weekly showing reports, tenant inquiries
     → Market updates (adjust pricing if needed)
     → Lease-up timeline messaging

  3. Inactive (previously listed, now leased/sold)
     → Renewal reminders (if tenant lease expiring)
     → Market updates (might want to list again)
     → Referral incentives ("Know another landlord?")
```

---

## PART 7: METRICS & MEASUREMENT

### Conversion Funnel Tracking

**Tenant Funnel:**
```
Traffic to palmbeachwarehouses.com
  ↓
Browse listings (page view)
  ↓ Conversion: 40%
Submit form
  ↓ Conversion: 60%
Schedule tour / receive curated matches
  ↓ Conversion: 35%
Lease signed (tracked in Trusenda/outside CRM)

Target metrics:
  – Form submission rate: 5–8% of visitors
  – Lead quality (credit tier): 60%+ HOT/ENTERPRISE
  – Lease conversion rate: 15–25%
```

**Landlord Funnel:**
```
Traffic to /list-your-space/ or /what-is-my-space-worth/
  ↓
View content
  ↓ Conversion: 35%
Submit form / request consultation
  ↓ Conversion: 85% (high-intent audience)
Schedule consultation call
  ↓ Conversion: 60%
Sign listing agreement
  ↓ Conversion: 40% (depends on market conditions)
Space leased

Target metrics:
  – Form submission rate: 6–10% of visitors
  – Lead quality: 80%+ viable listings
  – Listing agreement close rate: 60–70%
  – Average lease-up time: <60 days
```

### Campaign Performance Tracking

**Facebook Ads (Landlord):**
```
Campaign: "List Your Space Awareness"
  Metric              | Target  | Current
  ─────────────────────────────────────
  Cost per lead       | $15–25  | [—]
  Landing page CTR    | 3–5%    | [—]
  Form submission rate| 5–8%    | [—]
  Cost per form       | $50–75  | [—]
  ROAS (if tracked)   | 3:1     | [—]

Reporting cadence: Weekly
  – Check spend vs. budget
  – Pause underperforming creatives
  – Scale winning ads
```

**Google Ads (Landlord Search):**
```
Campaign: "Warehouse Broker - Landlord"
  Metric              | Target  | Current
  ────────────────────────────────────────
  Avg CPC             | $2–4    | [—]
  Quality Score       | 7+      | [—]
  CTR (click-through) | 4–6%    | [—]
  Landing page qual   | 80%+    | [—]
  Conversion rate     | 8–15%   | [—]
  Cost per conversion | $25–50  | [—]

Reporting cadence: Weekly
```

**Email Performance:**
```
Landlord Nurture Sequence
  Email 1 (immediate)
    Metric: Open rate, CTA clicks, form views
    Target: 40%+ open, 5%+ CTA click

  Email 2 (24 hr)
    Metric: Open rate, reply rate
    Target: 35%+ open, 3%+ replies

  Email 3 (5 day)
    Metric: Open rate, engagement
    Target: 25%+ open, 2%+ engagement

  Email 4 (10 day)
    Metric: Open rate, link clicks
    Target: 20%+ open, 3%+ clicks

  Email 5 (21 day)
    Metric: Open rate, call-to-action
    Target: 18%+ open, 2%+ CTA

Overall sequence metrics:
  – Segment: At least 1 email open: 70%+
  – Segment: Form fill: 5–8%
  – Segment: Call booked: 10–15%
```

### Key Performance Indicators (Dashboards)

**Tenant Funnel KPIs:**
```
Lead Volume
  – Visitors/month: [target: 5K+]
  – Form submissions: [target: 250–400/mo]
  – CPL by source: [Facebook: <$25, Google: <$30, Organic: <$10]

Lead Quality
  – % High-quality leads (HOT tier): [target: 60%+]
  – Avg. property match score: [1–10 scale]
  – Time to first contact: [target: <2 hrs]

Conversion
  – Tour scheduled: % of forms
  – Lease signed: % of tours
  – Avg. time to close: [target: 30–60 days]
  – Lease value range: [track avg. annual revenue per lease]
```

**Landlord Funnel KPIs:**
```
Lead Volume
  – Visitors to /list-your-space/: [target: 1K+/mo]
  – Form submissions: [target: 50–100/mo]
  – CPL by source: [Facebook: <$20, Google: <$30]

Lead Quality
  – % Properties viable for listing: [target: 80%+]
  – Avg. property value estimate: [track for trend]
  – Property size range: [ensure diverse portfolio]

Conversion
  – Consultation scheduled: % of forms [target: 85%+]
  – Listing agreement signed: % of consultations [target: 60%+]
  – Lease-up time: [target: <60 days avg]
  – Landlord satisfaction: [post-lease survey, target: 4.5+/5]
```

**Overall Marketplace Health:**
```
Two-Sided Flywheel
  – Tenant leads with active listings: [% of tenant base]
  – Landlord-tenant match rate: [% of landlord listings filled]
  – Repeat engagement: [% of repeat tenants/landlords]
  – Referral rate: [% of new leads from referrals]
  – NPS (Net Promoter Score): [target: 50+]
```

---

## PART 8: TECH STACK & IMPLEMENTATION

### Tools Needed (Existing + New)

| Component | Tool | Current? | Notes |
|-----------|------|----------|-------|
| Landing pages | Netlify | Yes | Deploy `/list-your-space/`, `/what-is-my-space-worth/`, `/guides/landlord-resources/` |
| CRM | Trusenda | Yes | Add landlord lead source, create separate email flows |
| Email | CRE Mail | Yes | Set up landlord sequences, calendar reminders, templates |
| Form handler | Custom JS + Trusenda API | Yes | Modify `crm-integration.js` to handle "landlord" lead type |
| Analytics | Google Analytics 4 | Yes | Track funnel steps, goal conversions |
| Facebook Ads | Meta Ads Manager | Yes | Create landlord-targeting campaigns |
| Google Ads | Google Ads | Yes | Create landlord search campaigns |
| Pixel tracking | Facebook Pixel + Gtag | Yes | Fire conversions for both audiences |
| Database | Trusenda backend | Yes | Use existing API, extend for landlord fields |
| Calendar scheduling | Calendly | Optional | Embed on consultation CTA buttons |
| Video hosting | YouTube | Optional | Publish property tours, market updates |
| SEO monitoring | Google Search Console | Yes | Monitor new pages, keywords, rankings |

### Implementation Roadmap (90 Days)

**Week 1-2: Planning & Design**
- [ ] Create wireframes for 3 new pages
- [ ] Design landlord form (Figma/Adobe)
- [ ] Plan email sequences (templates)
- [ ] Write content outlines for 6-month plan

**Week 3-4: Page Build**
- [ ] Build `/list-your-space/` landing page
- [ ] Build `/what-is-my-space-worth/` valuation tool
- [ ] Build `/guides/landlord-resources/` hub
- [ ] QA and mobile testing

**Week 5-6: Form Integration**
- [ ] Modify `crm-integration.js` to handle landlord leads
- [ ] Update Trusenda API calls (add landlord_lead flag)
- [ ] Test form submissions (dev → staging → prod)
- [ ] Set up tracking pixels for landlord conversions

**Week 7-8: Email & CRM**
- [ ] Write landlord email sequences (6 emails)
- [ ] Set up automation in Trusenda
- [ ] Create landlord segment in email list
- [ ] Test email delivery & opens

**Week 9-10: Ads & Campaigns**
- [ ] Design ad creatives (Facebook video + static)
- [ ] Set up Facebook campaigns (3 campaigns, 4 ad sets)
- [ ] Set up Google Ads search campaigns
- [ ] Configure conversion tracking (Facebook Pixel, Gtag)

**Week 11-12: Content & Launch**
- [ ] Write 6-month blog content calendar
- [ ] Publish first 2 blog posts
- [ ] Create LinkedIn content templates
- [ ] Record first 2-3 property walkthrough videos
- [ ] Soft launch (internal testing, beta emails)
- [ ] Full launch (all campaigns live)

**Week 13: Monitor & Optimize**
- [ ] Review analytics and conversion data
- [ ] Pause underperforming ads
- [ ] Optimize landing pages based on behavior
- [ ] Plan Q2 content

---

## PART 9: MESSAGING FRAMEWORK

### Tenant Messaging (Existing - Refined)

**Problem:** Tenant needs space fast, worried about landlord/lease quality
**Solution:** "Zach finds perfect-fit space in Palm Beach"
**Proof:** "6 properties, average lease-up 30–60 days, pre-qualified tenants only"

**Key Messages:**
1. **Expert guidance:** "12+ years in PBC industrial—I know every micro-market"
2. **Speed:** "Average match within 24 hours, tours scheduled same day"
3. **Quality:** "Pre-qualified properties only—no surprises on lease-up"
4. **Personal service:** "You talk to the broker, not an assistant"

---

### Landlord Messaging (New)

**Problem:** Landlord has vacant space or expired lease, losing money
**Solution:** "Turn your warehouse into monthly revenue with Zach's direct tenant network"
**Proof:** "6 active listings, average lease-up 40 days, quality tenants vetted"

**Key Messages:**
1. **Direct network:** "Unlike typical brokers, I actively source tenants—not just listings"
2. **Local expertise:** "12+ years in PBC. I know zoning, market rates, tenant demand by area"
3. **Speed:** "Average lease-up: 40 days vs. county average: 90 days"
4. **Transparency:** "Weekly updates, no surprises, real-time market data"
5. **Landlord-centric:** "We work for you, not against you"

---

### Competitive Differentiation

**vs. Large CRE Firms (CBRE, JLL, NAI):**
```
They:
  – Treat your property as 1 of 1000s
  – Assign you to a junior broker
  – Standard 5-6% commission
  – Slow process, bureaucracy

You:
  – Get Zach directly (the decision-maker)
  – Personal service, weekly updates
  – Flexible commission (negotiate)
  – Fast lease-up (40 days avg)
```

**vs. Passive "Virtual" Brokers:**
```
They:
  – List your property online
  – Wait for inbound inquiries
  – No tenant sourcing
  – Slow lease-up (120+ days)

You:
  – Active tenant sourcing
  – Pre-qualified prospects only
  – Local market expertise
  – Fastest lease-up in PBC
```

---

## PART 10: SUCCESS CRITERIA & MILESTONES

### 30-Day Milestone
- [ ] All 3 new pages launched and indexed
- [ ] Landlord email sequences live (auto-sending)
- [ ] Facebook campaigns running at $600/week budget
- [ ] 50+ landlord form submissions
- [ ] 5+ consultation calls booked

### 60-Day Milestone
- [ ] 150+ landlord form submissions
- [ ] 2+ new listing agreements signed
- [ ] Facebook CPL $20–30 (on target)
- [ ] Google Ads keywords ranking page 1–2
- [ ] Email open rate 30%+ on first 2 emails
- [ ] Blog published (4 articles, 2 landlord, 2 tenant)
- [ ] YouTube channel with 5+ videos (property tours + market update)

### 90-Day Milestone
- [ ] 300+ landlord form submissions
- [ ] 5–8 new listing agreements signed
- [ ] 3–5 leases completed (landlord spaces filled)
- [ ] Tenant CPL stable at <$25 (maintained while adding landlord campaigns)
- [ ] Monthly newsletter: 1K+ subscribers (50% tenants, 50% landlords)
- [ ] LinkedIn: 500+ followers, 2–4 posts/week
- [ ] SEO: "warehouse broker palm beach county" ranking page 1 or 2

### 6-Month Vision
- [ ] 8–12 active listing agreements
- [ ] 200–300 monthly form submissions (50% tenant, 50% landlord)
- [ ] Two-sided marketplace generating 5–10 leases/month
- [ ] Predictable CPL: Tenant <$25, Landlord <$20
- [ ] Content library: 24 blog posts, 20+ videos
- [ ] Email database: 3K+ active subscribers
- [ ] Brand recognized in PBC as "go-to industrial broker"

---

## QUICK REFERENCE: CHANGES TO EXISTING SITE

### `/index.html` (Homepage) - Add Landlord CTA

**Current Hero:**
```html
<!-- Just tenant CTA -->
<button onclick="scrollToForm()">Get Matched Now</button>
```

**New Dual Hero:**
```html
<div class="hero-cta-group">
  <button onclick="scrollToForm()" class="cta-button primary">
    Find Space
  </button>
  <a href="/list-your-space/" class="cta-button secondary">
    List Your Space
  </a>
</div>
```

### `/index.html` - Add Landlord Section Before Footer

```html
<section class="landlord-callout">
  <h2>Landlords: Turn Vacant Space Into Revenue</h2>
  <p>Join 6 property owners already leased with Zach.
     Get a free market analysis and tenant match.</p>
  <a href="/list-your-space/" class="cta-button">Get Started</a>
</section>
```

### Navigation - Add "For Landlords" Link

```html
<nav class="nav-desktop">
  <a href="/">Home</a>
  <a href="/">For Tenants</a>  <!-- new label -->
  <a href="/list-your-space/">For Landlords</a>  <!-- NEW -->
  <a href="/about/">About</a>
  <!-- ... rest of nav ... -->
</nav>
```

### Footer - Add Landlord Links

```html
<footer>
  <!-- ... existing footer ... -->
  <div class="footer-section">
    <h4>For Landlords</h4>
    <ul>
      <li><a href="/list-your-space/">List Your Space</a></li>
      <li><a href="/what-is-my-space-worth/">Property Valuation</a></li>
      <li><a href="/guides/landlord-resources/">Landlord Guides</a></li>
    </ul>
  </div>
</footer>
```

---

## APPENDIX: DETAILED PAGE EXAMPLES

### `/list-your-space/` - Full HTML Outline

```html
<!DOCTYPE html>
<html>
<head>
  <title>List Your Warehouse in Palm Beach | Free Consultation</title>
  <meta name="description" content="Turn your warehouse into monthly income.
    Free market analysis from Zach Vorsteg, industrial broker, PBC.">
</head>
<body>
  <!-- HERO -->
  <section class="hero">
    <h1>Turn Your Warehouse Into Revenue</h1>
    <p>List with Palm Beach's leading industrial broker.</p>
    <button onclick="scrollToForm()">Get Free Consultation</button>
  </section>

  <!-- SOCIAL PROOF -->
  <section class="social-proof">
    <div class="stat">
      <h3>6</h3>
      <p>Active properties generating revenue</p>
    </div>
    <div class="stat">
      <h3>40</h3>
      <p>Average lease-up time (days)</p>
    </div>
    <div class="stat">
      <h3>12+</h3>
      <p>Years in PBC industrial</p>
    </div>
  </section>

  <!-- WHY ZACH -->
  <section class="benefits">
    <h2>Why List with Zach?</h2>
    <!-- [benefit cards] -->
  </section>

  <!-- COMPARISON TABLE -->
  <section class="comparison">
    <h2>Zach vs. Typical Brokers</h2>
    <table><!-- ... --></table>
  </section>

  <!-- PROCESS -->
  <section class="process">
    <h2>The Listing Process</h2>
    <!-- [4-step process] -->
  </section>

  <!-- FORM -->
  <section class="form-section" id="lead-form-section">
    <form id="landlord-form" class="lead-form">
      <!-- [landlord form fields] -->
      <button type="submit" id="submit-btn">Request Consultation</button>
    </form>
  </section>

  <!-- FAQ -->
  <section class="faq">
    <h2>Questions?</h2>
    <!-- [faq items] -->
  </section>
</body>
</html>
```

---

## APPENDIX: FACEBOOK AD CREATIVE BRIEFS

**Creative 1: Video - "Sarah's Warehouse"**
```
Title: "From Vacant to Revenue"
Duration: 15 sec
Format: Vertical (for mobile feed)

Scene breakdown:
  0–3 sec: Empty warehouse, "This sat vacant for 3 months"
  3–6 sec: Zach measuring, "We repriced and repositioned"
  6–9 sec: Moving truck arriving, "60 days later, it's leased"
  9–12 sec: Happy tenant at loading dock, testimonial quote
  12–15 sec: "Turn your warehouse into income. [CTA]"

Audio: Uplifting background music, Zach voiceover
CTA: "List Your Space"
```

---

## APPENDIX: VALUATION TOOL CALCULATION LOGIC

```javascript
// Simplified pseudocode for /what-is-my-space-worth/ calculator

function calculatePropertyValue(inputs) {
  const { address, sqft, yearBuilt, condition, features } = inputs;

  // Base rate from comps (hardcoded 6-month averages)
  const comps = lookupComps(address); // e.g., $18.50/SF for Boca warehouse
  let estimatedRate = comps.avgRate;

  // Adjustments
  if (yearBuilt < 2000) estimatedRate -= 0.50; // Age penalty
  if (condition === 'excellent') estimatedRate += 0.75;
  if (condition === 'poor') estimatedRate -= 1.50;

  // Feature bonuses
  if (features.includes('docks')) estimatedRate += 0.25;
  if (features.includes('14ft_height')) estimatedRate += 0.10;
  if (features.includes('16ft_height')) estimatedRate += 0.35;
  if (features.includes('power_3phase')) estimatedRate += 0.15;
  if (features.includes('fenced_yard')) estimatedRate += 0.20;
  if (features.includes('office')) estimatedRate += 0.10;

  // Calculate monthly rent
  const monthlyRent = (estimatedRate * sqft) / 12;

  // Estimate lease-up time
  const leaseUpDays = estimateLeaseUpTime(address, sqft);

  return {
    estimatedRatePerSfPerYear: estimatedRate,
    estimatedMonthlyRent: monthlyRent,
    estimatedLeaseUpDays: leaseUpDays,
    scenarios: {
      at80Occupancy: monthlyRent * 0.80,
      at100Occupancy: monthlyRent,
      annualRevenue: monthlyRent * 12,
    }
  };
}

// Comp data (would be in JSON or database)
const COMP_RATES = {
  'West Palm Beach': { avgRate: 18.50, high: 20.00, low: 16.00 },
  'Boca Raton': { avgRate: 19.75, high: 22.00, low: 17.50 },
  'Delray Beach': { avgRate: 17.25, high: 19.00, low: 15.50 },
  // ... etc
};
```

---

## END OF DOCUMENT

**Next Steps:**
1. Review this architecture with Zach
2. Prioritize pages (recommend: `/list-your-space/` first, then valuation tool)
3. Assign design/dev resources
4. Set 90-day sprint timeline
5. Plan first content releases
6. Allocate ad budget ($600–800/week combined)

**Questions to validate:**
- What's the current monthly spend on tenant ads? (helps allocate landlord budget)
- Do you have video equipment for property walkthrough tours?
- Who handles the consultation calls with landlord prospects?
- Timeline: When can design/dev start?
