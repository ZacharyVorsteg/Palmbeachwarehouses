# Landlord Acquisition - Quick Start Guide
## "Do This First Week"

**Updated**: March 7, 2026
**Time Commitment**: 8-10 hours this week
**Expected Outcome**: First 2-3 qualified prospects identified; landing page live

---

## MONDAY: Website + Messaging (2-3 hours)

### 1. Create Landing Page
**File**: Create `/list-your-space/index.html` in palmbeachwarehouses.com root

Start with this minimal structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>List Your Space | Palm Beach Warehouses</title>
    <meta name="description" content="List your industrial space with Zach Vorsteg. Exclusive marketing, active tenants, fast results. 30 days to a signed lease.">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <!-- Reuse header from index.html -->

    <main>
        <section class="hero" style="background: linear-gradient(135deg, var(--darker-bg) 0%, var(--dark-bg) 100%); padding: 5rem 2rem; text-align: center;">
            <h1>30 Days to a Signed Lease</h1>
            <p class="hero-subtitle">Your space is sitting empty. We have 150+ tenants ready to lease.</p>
            <a href="#form" class="cta-button">Schedule Your Consultation</a>
        </section>

        <section style="max-width: 1200px; margin: 0 auto; padding: 4rem 2rem;">
            <h2>Why Landlords Choose Zach</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 2rem 0;">
                <tr style="border-bottom: 1px solid #ccc;">
                    <th style="text-align: left; padding: 1rem;">Feature</th>
                    <th style="text-align: left; padding: 1rem;">Typical Broker</th>
                    <th style="text-align: left; padding: 1rem;">Zach's Advantage</th>
                </tr>
                <tr style="border-bottom: 1px solid #ccc;">
                    <td style="padding: 1rem;">Tenant Pipeline</td>
                    <td style="padding: 1rem;">Posts on LoopNet</td>
                    <td style="padding: 1rem;">150+ active inquiries/quarter</td>
                </tr>
                <tr style="border-bottom: 1px solid #ccc;">
                    <td style="padding: 1rem;">Marketing Timeline</td>
                    <td style="padding: 1rem;">6+ months typical</td>
                    <td style="padding: 1rem;">30-day intensive push</td>
                </tr>
                <tr style="border-bottom: 1px solid #ccc;">
                    <td style="padding: 1rem;">Specialization</td>
                    <td style="padding: 1rem;">All property types</td>
                    <td style="padding: 1rem;">Industrial/warehouse only</td>
                </tr>
                <tr>
                    <td style="padding: 1rem;">Price Guarantee</td>
                    <td style="padding: 1rem;">Hope for the best</td>
                    <td style="padding: 1rem;">Honest feedback by Day 30</td>
                </tr>
            </table>
        </section>

        <section id="form" style="max-width: 600px; margin: 0 auto; padding: 3rem 2rem; background: var(--card-bg); border-radius: 12px;">
            <h2>Get Started</h2>
            <form id="landlord-form">
                <input type="text" placeholder="Your Name" required style="width: 100%; padding: 0.75rem; margin: 0.75rem 0; border: 1px solid #ccc; border-radius: 6px;">
                <input type="tel" placeholder="Phone Number" required style="width: 100%; padding: 0.75rem; margin: 0.75rem 0; border: 1px solid #ccc; border-radius: 6px;">
                <input type="email" placeholder="Email" required style="width: 100%; padding: 0.75rem; margin: 0.75rem 0; border: 1px solid #ccc; border-radius: 6px;">
                <input type="text" placeholder="Property Address" required style="width: 100%; padding: 0.75rem; margin: 0.75rem 0; border: 1px solid #ccc; border-radius: 6px;">
                <input type="number" placeholder="Square Footage" required style="width: 100%; padding: 0.75rem; margin: 0.75rem 0; border: 1px solid #ccc; border-radius: 6px;">
                <input type="text" placeholder="Asking Rent (/SF/Year)" required style="width: 100%; padding: 0.75rem; margin: 0.75rem 0; border: 1px solid #ccc; border-radius: 6px;">
                <select required style="width: 100%; padding: 0.75rem; margin: 0.75rem 0; border: 1px solid #ccc; border-radius: 6px;">
                    <option value="">--Vacancy Status--</option>
                    <option value="vacant">Vacant</option>
                    <option value="occupied">Occupied (Tenant Moving Out)</option>
                    <option value="month-to-month">Month-to-Month</option>
                </select>
                <textarea placeholder="Additional notes..." style="width: 100%; padding: 0.75rem; margin: 0.75rem 0; border: 1px solid #ccc; border-radius: 6px; height: 100px;"></textarea>
                <button type="submit" class="cta-button" style="width: 100%; padding: 1rem;">Schedule My Consultation</button>
            </form>
        </section>
    </main>

    <script>
    document.getElementById('landlord-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // Send to CRM or email
        alert('Thanks! I\'ll be in touch within 2 hours.');
        // TODO: Integrate with Trusenda or email backend
    });
    </script>
</body>
</html>
```

**Time**: 45 minutes (copy-paste + customize)

---

### 2. Write 5 Email Templates
Save these in `/assets/email-templates/` (text files):

**Email 1: Awareness**
```
Subject: Are you losing money on [PROPERTY]?

Hi [NAME],

I noticed your space at [ADDRESS] in [CITY].

That property is costing you roughly $[MONTHLY] per month while vacant.

Here's what usually happens: Broker lists it, it sits on LoopNet for 8+ months,
landlord gets frustrated.

I do this differently. I have 150+ facility managers and logistics companies actively
looking for space. Last year, I leased 8 industrial spaces in Palm Beach County—
average signed in 45 days.

Would you be open to a quick 15-minute call to discuss filling that space faster?

—Zach Vorsteg
561.718.6725
```

**Email 2: Social Proof**
```
Subject: I just helped another landlord do this

Hi [NAME],

Last quarter, I worked with a landlord who had a similar space sitting vacant for 8 months.

We signed a 3-year lease in 54 days.

How? I activated my full tenant pipeline, ran Facebook ads, made direct calls.

Cost to the landlord: $0 upfront. Commission only if lease closed.

Result: $54K in annual revenue vs. 8 months of vacancy loss.

Your space could be next. Available for a call Thursday or Friday?

—Zach
```

**Email 3: Objection Handling**
```
Subject: You already have a broker—I get it

Hi [NAME],

Most landlords I talk to already have a broker. Two scenarios:

1. Exclusive expired → You're free to engage me right now
2. Exclusive is active → No problem. Let's talk about options.

Either way, no harm in a conversation.

15 min call Thursday?

—Zach
```

**Email 4: Urgency**
```
Subject: I'm launching a Facebook campaign for [CITY]

Hi [NAME],

Next week, I'm running targeted ads to facility managers searching for warehouse
space in [CITY].

Your space could be featured.

Interested? Let me know. Otherwise, I'm moving forward.

—Zach
```

**Email 5: Final**
```
Subject: Last chance before I move on

Hi [NAME],

I've reached out a few times. No hard feelings if this isn't a fit.

But if you've been thinking about filling that space faster, I'm here.

15 minutes, zero obligation: [CALENDAR LINK]

—Zach
```

**Time**: 30 minutes

---

## TUESDAY: Database Building (2-3 hours)

### 1. Property Appraiser Search
Go to **pbcgov.com/pab** and:
1. Click "Property Search"
2. Select "Advanced Search"
3. Filter:
   - Zoning: "IND-1" (or "WM" or "PUD-IND")
   - Square Footage: 3,000-50,000 SF
4. Export to CSV (target: 200-300 results)

**Result**: spreadsheet with owner names, addresses, phone numbers

**Time**: 60 minutes

---

### 2. Google Street View Verification
Open Google Maps. Check top 50 properties:
- Are they visibly vacant? (Boarded windows, overgrown landscaping, no signage)
- Add column: "Vacancy Status" (Confirmed / Unclear / Occupied)
- Mark the 25 most "likely vacant"

**Time**: 60 minutes

---

### 3. Top 25 Priority List
Create "Priority Prospects" spreadsheet with:
- Owner Name
- Phone
- Property Address
- SF
- Asking Rent (if available)
- Vacancy Status
- Column: "Contact Date"
- Column: "Response"

**Time**: 30 minutes

---

## WEDNESDAY: First Campaign Launch (2 hours)

### 1. Send Cold Email #1
Open your email. Send to top 10 prospects:

Subject: "Are you losing money on [PROPERTY]?"

Use Email Template #1 (customize with actual property/address).

**Expectation**: 2-3 responses, 5-7 no-response (follow-up next week)

**Time**: 30 minutes

---

### 2. First Cold Calls
Call top 5 prospects. Script:

> "Hi [Name], this is Zach Vorsteg, industrial specialist in Palm Beach. I noticed
> your space at [ADDRESS] and I specialize in leasing properties like this. Quick
> question—has your space been leased yet?"
>
> [Wait for response]
>
> "If you have a minute, would you be open to a quick 15-minute call to discuss a
> faster path to occupancy? No pressure at all."

**Expectation**: 2 out of 5 will agree to a call

**Time**: 20 minutes (dials + attempted conversations)

---

### 3. Set Up Calendly
Go to **calendly.com**. Create:
- 15-minute "Landlord Consultation"
- Available: Mon-Fri, 10am-3pm
- Send link to anyone who agrees to call

**Time**: 10 minutes

---

## THURSDAY: Networking + Ads (2 hours)

### 1. Schedule NAIOP Meeting
Go to **naiopflorida.org**. Register for next monthly breakfast.
- Usually 3rd Thursday of month
- Venue: TBD in West Palm
- Cost: ~$35 for non-member
- Prep: Print 10 business cards, write elevator pitch (30 seconds)

**Time**: 10 minutes

---

### 2. Create Facebook Ad (Simple)
Go to **facebook.com/business**. Create ad:

**Image**: Screenshot of your palmbeachwarehouses.com homepage or testimonial

**Copy**:
```
Your warehouse has been vacant too long.
We have tenants. Let's connect.

30-day marketing push. Fast results.
Schedule a free consultation →
```

**Audience**:
- Location: Palm Beach County
- Age: 40-65
- Interests: Real Estate, Property Management

**Budget**: $10/day for 3 days (test)

**Landing Page**: palmbeachwarehouses.com/list-your-space

**Time**: 45 minutes (design + setup + launch)

---

### 3. Save Money Materials
Create and save (as PDFs):
- One-page "Landlord Value Prop" (use template from main doc)
- Case study (find 1 recent lease; anonymize property; show results)

**Time**: 25 minutes

---

## FRIDAY: Review + Scale (1-2 hours)

### Review This Week's Activity
- [ ] Landing page live? Test it.
- [ ] Cold emails sent? Check response rate.
- [ ] Cold calls made? Any scheduled calls?
- [ ] Facebook ads running? Check performance.
- [ ] Database built? 25+ priority prospects identified?

**Scorecard**:
- Leads generated: ____
- Scheduled calls: ____
- Cost per lead: $____
- Next week focus: [list top 3 items]

---

### NEXT WEEK: Expand

**Week 2 Focus**:
- [ ] Run Email #2 (Social Proof) to non-responders
- [ ] Make 5-10 more cold calls
- [ ] Drive one industrial area (Beacon Lake, Commerce Center)
- [ ] Conduct first consultation calls (from Week 1 responses)
- [ ] Attend NAIOP (if applicable)
- [ ] Scale Facebook ads if CPA is good

---

## MATERIALS CHECKLIST

**By End of Friday, You Need**:
- [ ] Landing page live at `/list-your-space/`
- [ ] 5 email templates in drafts
- [ ] 25+ prospect database with contact info
- [ ] Calendly link created
- [ ] 5+ cold emails sent (at least 1-2 responses)
- [ ] 3-5 cold calls made (at least 1 scheduled call)
- [ ] Facebook ad running
- [ ] Case study PDF ready to send

---

## EXPECTED OUTCOMES

**By End of Week 1**:
- 10-15 cold contacts made (email + phone)
- 2-3 scheduled consultation calls
- 20-30 website visits (from cold email + organic)
- 1-2 Facebook leads
- First impressions of response rate + messaging effectiveness

**If this is working**:
→ Scale up Week 2 (more calls, bigger email list, increase ad spend)

**If this is NOT working**:
→ Adjust messaging (landing page CTA too weak? Email subject lines boring?)
→ Verify database quality (are these really decision-makers?)

---

## TIPS FOR SUCCESS

1. **Do the calls first.** Cold calls are uncomfortable. Do them early in the week.
2. **Batch the emails.** Send all at once (Tuesday morning) rather than slow-dripping.
3. **Track everything.** Make notes on every prospect (response, objection, next step).
4. **Use calendar links.** Don't negotiate times. Let them book on Calendly.
5. **Send follow-ups same day.** If someone responds, you have 24-hour window.
6. **Be human.** Don't copy-paste. Customize each message with property details.

---

## PROBLEM-SOLVE

**"I'm getting no responses to cold email"**
→ Check subject line. Is it specific? ("Are you losing money on [ADDRESS]?" is better than "Let's talk.")
→ Check time sent. Send Tuesday 9am-10am (peak business hours).
→ Check email list. Are these actually decision-makers? (Verify phone numbers are owner/GM, not office assistant.)

**"Cold calls are going to voicemail"**
→ Leave brief, specific voicemail: "Hi Bob, this is Zach Vorsteg. I specialize in leasing industrial spaces. I noticed your property at [ADDRESS]. Call me back if you want to discuss. 561-718-6725."
→ Follow up with email within 1 hour (while you're fresh in their mind).

**"Facebook ads not converting"**
→ Check landing page. Is form too long? (Should be 6 fields max.)
→ Check ad copy. Is CTA clear? ("Schedule Consultation" vs. "Learn More"?)
→ Check audience. Too broad? Try narrowing to specific job titles.

**"People agree to call but don't show up"**
→ Send reminder email 24 hours before.
→ Send calendar link again in reminder.
→ Call 5 min before scheduled time (some people forget).

---

## MEASUREMENT DASHBOARD

Track these numbers daily:

| Metric | Week 1 Target | Week 1 Actual |
|--------|---|---|
| Emails sent | 10 | ____ |
| Cold calls made | 5 | ____ |
| Responses to email | 2-3 | ____ |
| Calls answered | 2 | ____ |
| Scheduled calls | 1-2 | ____ |
| Website visits | 30+ | ____ |
| Facebook ads cost | <$30 | $____ |
| Cost per lead | <$10 | $____ |

---

## GO LIVE CHECKLIST

**Before launching Week 1, confirm**:
- [ ] Domain working? palmbeachwarehouses.com/list-your-space/
- [ ] Form submitting? (Test with your own email)
- [ ] Confirmation email received?
- [ ] Calendly link is public?
- [ ] Case study PDF exists?
- [ ] Phone number on page is correct?
- [ ] CTA buttons clickable?

---

## This Week Ahead

**Monday**: Website + emails
**Tuesday**: Database + prospecting
**Wednesday**: First cold emails + calls
**Thursday**: Networking + ads setup
**Friday**: Review + plan Week 2

**Total time commitment**: 8-10 hours spread across week

**Expected first meeting**: Thursday or Friday (or early next week)

**Go build it.**

---

**Document Version**: 1.0
**Created**: March 7, 2026
**Status**: Ready to Execute NOW
