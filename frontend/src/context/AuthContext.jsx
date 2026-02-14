import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = authService.getUser();
        if (savedUser && authService.isAuthenticated()) {
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            const userData = data.user || { email, name: email.split('@')[0] };
            const token = data.token || data.access_token || 'demo-token';
            authService.setSession(token, userData);
            setUser(userData);
            return data;
        } catch (error) {
            // Fallback to demo mode if API fails
            console.warn('API login failed, using demo mode:', error.message);
            const demoUser = {
                name: email.split('@')[0],
                email,
                role: email.includes('teacher') ? 'teacher' : 'student'
            };
            authService.setSession('demo-token-' + Date.now(), demoUser);
            setUser(demoUser);
            return { user: demoUser, token: 'demo-token' };
        }
    };


    const register = async (name, email, password, extra = {}) => {
        try {
            const data = await authService.register(name, email, password);
            const userData = data.user || { name, email, ...extra };
            const token = data.token || data.access_token || 'demo-token';
            authService.setSession(token, userData);
            setUser(userData);
            return data;
        } catch (error) {
            // Fallback to demo mode if API fails
            console.warn('API registration failed, using demo mode:', error.message);
            const demoUser = { name, email, ...extra };
            authService.setSession('demo-token-' + Date.now(), demoUser);
            setUser(demoUser);
            return { user: demoUser, token: 'demo-token' };
        }
    };


    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Demo login (when backend is unavailable)
    const demoLogin = () => {
        const demoUser = { name: 'Dr. Priya Sharma', email: 'priya@mentorai.edu', role: 'teacher' };
        authService.setSession('demo-token-123', demoUser);
        setUser(demoUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}

export default AuthContext;
