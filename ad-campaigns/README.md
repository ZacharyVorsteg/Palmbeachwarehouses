# Ad Campaign Suite — Palm Beach Warehouses
**Status: BUILT — NOT LIVE**
**Last Updated: 2026-03-08**

## Three-Campaign Architecture

| Campaign | File | Target | Landing Page | Avg Commission |
|----------|------|--------|-------------|---------------|
| **Tenant Rep** | *(existing — already running)* | Tenants looking for space | Homepage / listings | $5K-$35K/deal |
| **Landlord Listing** | `listing-campaign.md` | Landlords who want to lease out space | /list-your-space/ | $5K-$35K/deal |
| **Investment Sales** | `selling-campaign.md` | Owners who want to sell property | /sell-your-property/ | $30K-$150K/deal |

### Why Three Separate Campaigns

Each campaign targets a fundamentally different person with different pain points:

- **Tenant** = "I need space" → Show them listings, get them touring
- **Landlord** = "I have space sitting empty" → Show them your tenant database, get them listing
- **Seller** = "I want to cash out" → Show them market values, get them valuating

Different keywords. Different ad copy. Different audiences. Different conversion events. Different landing pages. Mixing them kills relevance scores and wastes budget.

---

## Combined Budget & Revenue Model

### Monthly Ad Spend

| Campaign | Google Ads | Facebook/IG | Total |
|----------|-----------|-------------|-------|
| Tenant Rep (existing) | — | — | *(already running)* |
| Landlord Listing | $1,500 | $1,200 | $2,700 |
| Investment Sales | $1,800 | $1,500 | $3,300 |
| **Total New Spend** | **$3,300** | **$2,700** | **$6,000/month** |

### Revenue Projection (All Three Campaigns Combined)

**Conservative (Year 1):**

| Source | Deals/Month | Avg Commission | Annual Gross | Your 70% |
|--------|------------|----------------|-------------|---------|
| Current inventory | 1-2 | $14,500 | $87,454 | $61,218 |
| New tenant leads (site SEO + ads) | 2-3 | $14,500 | $348K-$522K | $244K-$365K |
| New landlord listings (listing campaign) | 1-2 | $14,500 | $174K-$348K | $122K-$244K |
| Investment sales (selling campaign) | 0.5-1 | $60,000 | $360K-$720K | $252K-$504K |
| **TOTAL** | **4.5-8** | — | **$969K-$1.68M** | **$679K-$1.17M** |

**Note:** Listing and selling campaigns have a DUAL effect — each new listing acquired also generates a lease or sale commission when the deal closes. The listing campaign doesn't just add listings; it adds future commissions.

### Path to $500K-$1M Net Commission

| Scenario | Monthly Deals | Mix | Annual Net (70%) |
|----------|--------------|-----|-----------------|
| **$500K net** | 4-5 deals | 3 leases + 1 sale every 2 months | ~$500K |
| **$750K net** | 5-7 deals | 4 leases + 1 sale/month | ~$750K |
| **$1M net** | 7-9 deals | 5 leases + 2 sales/month | ~$1M |

The math works. 4-5 deals/month — which is very achievable for an active industrial broker with paid + organic lead flow — gets you to $500K net.

The investment sales campaign is the multiplier. One $3M warehouse sale = $90K gross = $63K net. That's 4-5 lease deals compressed into one transaction.

---

## What's Already Wired Up (No Additional Dev Needed)

- [x] Google Ads pixel (AW-17147516072) — fires on all form submissions
- [x] Facebook Pixel (1245057844149331) — fires Lead events on all forms
- [x] UTM parameter capture — all params auto-appended to CRM submissions
- [x] Lead qualification scoring — tier-based conversion values
- [x] Landlord landing page (/list-your-space/) — optimized, live
- [x] Seller landing page (/sell-your-property/) — optimized, live
- [x] Valuation tool (/what-is-my-space-worth/) — 3-step wizard, live
- [x] Separate conversion events per form type

## What's Needed to Go Live

- [ ] Ad creative images (1200x628 — building exteriors, site screenshots)
- [ ] Google Ads account campaign creation (copy from campaign files)
- [ ] Facebook Ads Manager campaign creation (copy from campaign files)
- [ ] Weekly reporting cadence
- [ ] Phase 2 audiences (after lead volume builds)
