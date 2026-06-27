const QUALIFICATION = {
  scoreQualification(lead) {
    let score = 0;

    // 1. BUDGET SCORING (scaled by amount — keys match form option values)
    const budgetMap = {
      '$20,000+/mo': 5,
      '$10,000-20,000/mo': 3,
      '$5,000-10,000/mo': 2,
      '$3,000-5,000/mo': 1,
      '$1,500-3,000/mo': 1,
      'Flexible': 1,
    };
    const budgetScore = budgetMap[lead.budget] || 0;
    score += budgetScore;

    // 2. TIMELINE SCORING
    const moveTiming = lead.moveTiming || lead.move_date;
    if (moveTiming === 'Immediate' || moveTiming === '1-3 months') {
      score += 3;
    } else if (moveTiming === '3-6 months') {
      score += 2;
    }

    // 3. INDUSTRY (any industry = +1)
    if (lead.industry) score += 1;

    // 4. SPACE SIZE SCORING (scaled by SF)
    let sizeScore = 0;
    const minSize = lead.sizeMin || 0;
    const maxSize = lead.sizeMax || 0;
    const midSize = Math.max(minSize, maxSize) || 0;

    if (midSize >= 50000) {
      sizeScore = 3;  // Enterprise
    } else if (midSize >= 20000) {
      sizeScore = 2;  // Mid-market
    } else if (midSize >= 5000) {
      sizeScore = 1;  // Small
    }
    score += sizeScore;

    // 5. ENTERPRISE CALCULATION (Annual Revenue Potential)
    // Enterprise: 50,000+ SF × $18/SF avg = $900K+ potential value
    const annualRevenueMin = minSize * 15;  // Conservative: $15/SF/year
    const annualRevenueMax = maxSize * 20;  // Optimistic: $20/SF/year
    const avgAnnualRevenue = (annualRevenueMin + annualRevenueMax) / 2;

    // TIER LOGIC
    let tier = 'COOL';
    let timelineEstimate = 'Within 1 week';
    let conversionValue = 5;

    // TRANSACTION-TYPE OVERRIDE (additive — only fires when a page sends transactionType).
    // Building purchases and land/development deals are the highest-commission opportunities;
    // signal max conversion value so Google Ads value-based bidding chases them hardest.
    // tier stays 'ENTERPRISE' so existing success-message UI keeps working.
    const txn = (lead.transactionType || '').toLowerCase();
    if (txn.includes('land') || txn.includes('develop')) {
      return {
        score, tier: 'ENTERPRISE', timelineEstimate: 'Within 1 hour',
        conversionValue: 200, annualRevenueEstimate: Math.round(avgAnnualRevenue),
        metadata: { dealType: 'land-development', sizeScore, minSize, maxSize }
      };
    }
    if (txn.includes('buy') || txn.includes('purchase')) {
      return {
        score, tier: 'ENTERPRISE', timelineEstimate: 'Within 1 hour',
        conversionValue: 150, annualRevenueEstimate: Math.round(avgAnnualRevenue),
        metadata: { dealType: 'purchase', sizeScore, minSize, maxSize }
      };
    }

    if (avgAnnualRevenue >= 240000) {
      // ENTERPRISE: $240K+/year revenue potential
      tier = 'ENTERPRISE';
      timelineEstimate = 'Within 1 hour';
      conversionValue = 100;
    } else if (score >= 5) {
      // HOT: High-urgency + good budget + soon timeline
      tier = 'HOT';
      timelineEstimate = 'Within 2 hours';
      conversionValue = 50;
    } else if (score >= 3) {
      // WARM: Medium-urgency, some factors met
      tier = 'WARM';
      timelineEstimate = 'Within 24 hours';
      conversionValue = 25;
    }
    // else COOL: score < 3

    return {
      score: score,
      tier: tier,
      timelineEstimate: timelineEstimate,
      conversionValue: conversionValue,
      annualRevenueEstimate: Math.round(avgAnnualRevenue),
      metadata: {
        budgetScore: budgetScore,
        sizeScore: sizeScore,
        minSize: minSize,
        maxSize: maxSize,
      }
    };
  }
};
