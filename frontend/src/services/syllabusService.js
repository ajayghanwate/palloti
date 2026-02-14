import api from './api';

export const syllabusService = {
    /**
     * POST /analyze-syllabus
     * Upload PDF syllabus for AI analysis
     * Returns: { topics: [...], focus_areas: [...] }
     */
    async analyzeSyllabus(pdfFile) {
        const formData = new FormData();
        formData.append('file', pdfFile);

        const response = await api.post('/analyze-syllabus', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

export default syllabusService;
