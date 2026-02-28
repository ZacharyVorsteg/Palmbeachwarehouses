/**
 * Lead Qualification Scoring System
 * Sandler methodology: pain-based discovery scoring
 * HOT (5+) / WARM (3-4) / COOL (<3)
 */

const QUALIFICATION = {
    /**
     * Score a lead based on form data
     * Returns {score, tier, message, timelineEstimate}
     */
    scoreQualification(formData) {
        let score = 0;

        // 1. BUDGET CLARITY (0-3 points)
        if (formData.budget) {
            score += 3; // Clear budget = qualified
        } else if (formData.property_use) {
            score += 1; // At least property type selected
        }

        // 2. TIMELINE URGENCY (0-3 points)
        if (formData.move_timeline === 'Immediate' || formData.move_timeline === '1-3 months') {
            score += 3; // Hot timeline
        } else if (formData.move_timeline === '3-6 months') {
            score += 2; // Warm timeline
        } else if (formData.move_timeline === '6+ months' || formData.move_timeline === 'exploring') {
            score += 0; // Cool timeline
        }

        // 3. PAIN IDENTIFICATION (0-2 points)
        if (formData.pain_point) {
            // Pain point identified = stronger signal
            score += 2;
        }

        // 4. LANDLORD GHOSTING (0-2 points)
        if (formData.been_ghosted === 'yes') {
            // Been ghosted = high urgency signal
            score += 2;
        }

        // 5. INDUSTRY FIT (0-2 points)
        if (formData.industry) {
            score += 1;
        }
        if (formData.space_size) {
            score += 1;
        }

        // Determine tier
        let tier = 'COOL';
        let timelineEstimate = 'Within 1 week';
        let tierMessage = 'Join our market updates';

        if (score >= 5) {
            tier = 'HOT';
            timelineEstimate = 'Within 2 hours';
            tierMessage = 'Zach will call you immediately';
        } else if (score >= 3) {
            tier = 'WARM';
            timelineEstimate = 'Within 24 hours';
            tierMessage = 'Your request is queued';
        }

        return {
            score,
            tier,
            timelineEstimate,
            tierMessage,
            painPoint: formData.pain_point || null,
            timeline: formData.move_timeline || null,
            hasBeenGhosted: formData.been_ghosted === 'yes'
        };
    },

    /**
     * Get custom success message based on qualification tier and pain point
     */
    getCustomMessage(qualification) {
        const { tier, painPoint, timelineEstimate, tierMessage } = qualification;

        const painMessages = {
            timeline_pressure: 'Move quickly without the usual delays',
            budget_uncertainty: 'Know you\'re getting fair market rates',
            wrong_space_before: 'Avoid costly mistakes with expert guidance',
            landlord_ghosting: 'Never deal with ghosting again',
            other_pain: 'Get exactly what you need'
        };

        const primaryMessage = painMessages[painPoint] || 'Get matched with the right space';

        return {
            headline: tier === 'HOT'
                ? 'Request Locked In!'
                : tier === 'WARM'
                ? 'Request Received!'
                : 'Inquiry Submitted',

            subtitle: tier === 'HOT'
                ? `Zach will call you within 2 hours. ${primaryMessage}.`
                : tier === 'WARM'
                ? `Your request is queued for review. ${primaryMessage}.`
                : `We'll reach out when relevant opportunities match your criteria.`,

            tierBadge: tier,
            tierColor: tier === 'HOT'
                ? '#d32f2f'
                : tier === 'WARM'
                ? '#f57c00'
                : '#757575',

            tierLabel: tier === 'HOT'
                ? 'Priority Lead'
                : tier === 'WARM'
                ? 'Qualified Lead'
                : 'Nurture List',

            nextSteps: getNextSteps(tier, painPoint),
            calloutText: tier === 'HOT'
                ? `Priority: Zach will call ${qualification.timelineEstimate.toLowerCase()}`
                : tier === 'WARM'
                ? `Follow up: Check email for property matches within 24 hours`
                : `Stay informed: We'll send monthly market updates`
        };
    },

    /**
     * Get next steps based on tier
     */
    getNextSteps(tier, painPoint) {
        if (tier === 'HOT') {
            return [
                { icon: '📞', text: 'Zach calls within 2 hours' },
                { icon: '📧', text: 'Receive matched property list' },
                { icon: '🔍', text: 'Schedule property tours' }
            ];
        } else if (tier === 'WARM') {
            return [
                { icon: '📧', text: 'Email review of your request' },
                { icon: '🏢', text: 'Get matched property suggestions' },
                { icon: '📞', text: 'Call within 24 hours if qualified' }
            ];
        } else {
            return [
                { icon: '📊', text: 'Receive monthly market reports' },
                { icon: '🔔', text: 'Get alerts when new spaces match' },
                { icon: '📞', text: 'Call when you\'re ready to move' }
            ];
        }
    },

    /**
     * Calculate percentage progress (visual progress indicator)
     */
    getProgressPercentage(score) {
        // Score ranges 0-14, convert to 0-100%
        return Math.min(100, Math.round((score / 14) * 100));
    }
};

/**
 * Helper function to get next steps - delegates to QUALIFICATION.getNextSteps
 */
function getNextSteps(tier, painPoint) {
    return QUALIFICATION.getNextSteps(tier, painPoint);
}
