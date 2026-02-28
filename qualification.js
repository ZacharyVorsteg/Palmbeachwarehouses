/**
 * Lead Qualification Scoring System
 * Simplified: budget + timeline + size/industry signals
 * HOT (5+) / WARM (3-4) / COOL (<3)
 */

const QUALIFICATION = {
    /**
     * Score a lead based on form data
     * Returns {score, tier, timelineEstimate}
     */
    scoreQualification(formData) {
        let score = 0;

        // 1. BUDGET CLARITY (0-3 points)
        if (formData.budget && formData.budget !== 'Flexible') {
            score += 3;
        } else if (formData.budget === 'Flexible') {
            score += 1;
        }

        // 2. TIMELINE URGENCY (0-3 points)
        const timeline = formData.moveTiming || formData.move_date;
        if (timeline === 'Immediate' || timeline === '1-3 months') {
            score += 3;
        } else if (timeline === '3-6 months') {
            score += 2;
        }

        // 3. INDUSTRY + SIZE FIT (0-2 points)
        if (formData.industry) {
            score += 1;
        }
        if (formData.sizeMin || formData.space_size) {
            score += 1;
        }

        // Determine tier
        let tier = 'COOL';
        let timelineEstimate = 'Within 1 week';

        if (score >= 5) {
            tier = 'HOT';
            timelineEstimate = 'Within 2 hours';
        } else if (score >= 3) {
            tier = 'WARM';
            timelineEstimate = 'Within 24 hours';
        }

        return { score, tier, timelineEstimate };
    }
};
