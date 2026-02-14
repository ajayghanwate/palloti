import api from './api';

export const marksService = {
    /**
     * POST /analyze-marks
     * Upload CSV file of student marks for analysis
     * Returns: { average_score, weak_topics, risk_students, strategy }
     */
    async analyzeMarks(csvFile) {
        const formData = new FormData();
        formData.append('file', csvFile);

        const response = await api.post('/analyze-marks', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

export default marksService;
