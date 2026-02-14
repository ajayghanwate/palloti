import api from './api';

export const assessmentService = {
    /**
     * POST /generate-assessment
     * Generate quiz/assessment using AI
     * Input: { subject, unit, difficulty, num_questions }
     * Returns: { mcqs: [...], short_answer: [...] }
     */
    async generateAssessment({ subject, unit, difficulty, num_questions }) {
        const response = await api.post('/generate-assessment', {
            subject,
            unit,
            difficulty,
            num_questions: parseInt(num_questions),
        });
        return response.data;
    },
};

export default assessmentService;
