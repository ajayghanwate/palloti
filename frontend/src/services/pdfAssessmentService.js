import api from './api';

/**
 * Generate assessment questions from PDF document
 * POST /academic/generate-assessment-from-pdf
 */
export async function generateAssessmentFromPDF(formData) {
    const response = await api.post('/academic/generate-assessment-from-pdf', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export default {
    generateAssessmentFromPDF,
};
