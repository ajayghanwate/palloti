import api from './api';

export const feedbackService = {
    /**
     * POST /generate-feedback
     * Generate AI-powered student feedback
     * Input: { student_name, score, weak_topics }
     * Returns: { strengths, weak_areas, improvement_plan, motivational_message }
     */
    async generateFeedback({ student_name, score, weak_topics }) {
        const response = await api.post('/generate-feedback', {
            student_name,
            score: parseFloat(score),
            weak_topics,
        });
        return response.data;
    },
};

export default feedbackService;
