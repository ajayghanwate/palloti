import api from './api';

export const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    async register(name, email, password) {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },

    async getProfile() {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    logout() {
        localStorage.removeItem('mentorai_token');
        localStorage.removeItem('mentorai_user');
        window.location.href = '/login';
    },

    getToken() {
        return localStorage.getItem('mentorai_token');
    },

    getUser() {
        const user = localStorage.getItem('mentorai_user');
        return user ? JSON.parse(user) : null;
    },

    setSession(token, user) {
        localStorage.setItem('mentorai_token', token);
        localStorage.setItem('mentorai_user', JSON.stringify(user));
    },

    isAuthenticated() {
        return !!localStorage.getItem('mentorai_token');
    },
};

export default authService;
