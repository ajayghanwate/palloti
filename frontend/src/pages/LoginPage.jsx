import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineBookOpen, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const { isDark, toggleTheme } = useTheme();
    const [form, setForm] = useState({ name: '', email: '', password: '', subject: '' });
    const [loading, setLoading] = useState(false);
    const { login, register, demoLogin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(form.email, form.password);
            } else {
                await register(form.name, form.email, form.password);
            }
            toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Authentication failed. Try demo mode.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        demoLogin();
        toast.success('Welcome to MentorAI demo!');
        navigate('/');
    };

    return (
        <div className={`h-screen flex items-center justify-center relative overflow-hidden p-4 transition-colors duration-500 ${isDark ? 'bg-gradient-to-b from-[#0a1628] via-[#0f1c2e] to-[#1a2332]' : 'login-light-bg'}`}>
            {/* Starfield background */}
            {isDark && (
                <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 150 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.7,
                                animationDelay: `${Math.random() * 3}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Theme toggle */}
            <button
                onClick={toggleTheme}
                className={`absolute top-6 right-6 z-20 p-3 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 hover:rotate-180 ${isDark ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-gray-900/10 text-indigo-600 hover:bg-gray-900/20'}`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                {isDark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>
            {/* Animated background orbs - only in light mode */}
            {!isDark && (
                <>
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl gentle-pulse bg-blue-500/20" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl gentle-pulse bg-purple-400/20" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl gentle-pulse bg-cyan-400/10" style={{ animationDelay: '4s' }} />
                </>
            )}

            {/* Phone mockup container */}
            <div className="w-full max-w-[500px] relative z-10 slide-up-fade">
                {/* Phone frame outer glow */}
                <div className="absolute inset-0 rounded-[56px] md:rounded-[48px] bg-gradient-to-br from-blue-500/30 via-blue-400/20 to-cyan-400/30 blur-xl" />

                {/* Phone screen content */}
                <div className={`relative rounded-[54px] md:rounded-[46px] p-8 md:p-12 min-h-[750px] flex flex-col justify-center transition-all duration-500 ${isDark
                    ? 'bg-gradient-to-b from-[#1e3a5f]/95 via-[#152238]/95 to-[#0f1c2e]/95 backdrop-blur-xl'
                    : 'bg-white/95 backdrop-blur-xl'
                    }`}>
                    {/* Logo - adjusted margin */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 mb-6 shadow-2xl shadow-blue-500/40">
                            <HiOutlineAcademicCap className="w-10 h-10 text-white" />
                        </div>
                        <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>MentorAI</h1>
                        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>AI-Powered Teaching Co-Pilot</p>
                    </div>

                    {/* Form heading */}
                    <h2 className={`text-2xl font-bold mb-10 text-center tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    <form id="loginForm" onSubmit={handleSubmit} className="space-y-7 stagger-children">
                        {!isLogin && (
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Full Name</label>
                                <div className="relative">
                                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Dr. John Smith"
                                        className={`login-input login-input-animate ${!isDark ? 'login-input-light' : ''}`}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        {!isLogin && (
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Subject</label>
                                <div className="relative">
                                    <HiOutlineBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                                    <input
                                        type="text"
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder="e.g. Data Structures"
                                        className={`login-input login-input-animate ${!isDark ? 'login-input-light' : ''}`}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Email</label>
                            <div className="relative">
                                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="teacher@college.edu"
                                    className={`login-input login-input-animate ${!isDark ? 'login-input-light' : ''}`}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Password</label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`login-input login-input-animate ${!isDark ? 'login-input-light' : ''}`}
                                    required
                                />
                            </div>
                        </div>
                    </form>

                    {/* Actions section - uniform width & spacing */}
                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                        {/* Sign In button */}
                        <button
                            type="submit"
                            form="loginForm"
                            disabled={loading}
                            className="btn-premium justify-center py-3.5 text-base rounded-xl hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60"
                            style={{ display: 'flex', width: '100%' }}
                        >
                            {loading ? (
                                <div className="spinner !w-5 !h-5 !border-2" />
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3" style={{ margin: '0.25rem 0' }}>
                            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>or</span>
                            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
                        </div>

                        {/* Demo Login */}
                        <button
                            onClick={handleDemoLogin}
                            className={`justify-center py-3 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${isDark ? 'btn-secondary' : 'btn-secondary-light'}`}
                            style={{ display: 'flex', width: '100%' }}
                        >
                            🚀 Try Demo Mode
                        </button>
                    </div>

                    {/* Toggle */}
                    <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            {isLogin ? 'Register' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
