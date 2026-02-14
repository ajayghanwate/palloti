import api from './api';

/**
 * Upload text study material for analysis
 * POST /analytics/upload-text-material
 */
export async function uploadTextMaterial(formData) {
    const response = await api.post('/analytics/upload-text-material', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export default {
    uploadTextMaterial,
};
