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
        <div className={`min-h-screen flex items-center justify-center relative overflow-hidden p-4 transition-colors duration-500 ${isDark ? 'bg-[#0F172A]' : 'login-light-bg'}`}>
            {/* Theme toggle */}
            <button
                onClick={toggleTheme}
                className={`absolute top-6 right-6 z-20 p-3 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 hover:rotate-180 ${isDark ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-gray-900/10 text-indigo-600 hover:bg-gray-900/20'}`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                {isDark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>
            {/* Animated background orbs */}
            <div className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl gentle-pulse ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/20'}`} />
            <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl gentle-pulse ${isDark ? 'bg-purple-500/10' : 'bg-purple-400/20'}`} style={{ animationDelay: '2s' }} />
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl gentle-pulse ${isDark ? 'bg-cyan-500/5' : 'bg-cyan-400/10'}`} style={{ animationDelay: '4s' }} />

            <div className="w-full max-w-md relative z-10 slide-up-fade">
                {/* Premium outer container with gradient border */}
                <div className={`rounded-3xl p-[1px] shadow-2xl transition-all duration-300 hover:shadow-blue-500/20 ${isDark ? 'bg-gradient-to-br from-blue-500/40 via-purple-500/20 to-cyan-500/40 shadow-blue-500/10' : 'bg-gradient-to-br from-blue-400/50 via-purple-400/30 to-cyan-400/50 shadow-blue-300/20'}`}>
                    {/* Logo */}
                    <div className="text-center mb-10 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/20">
                            <HiOutlineAcademicCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>MentorAI</h1>
                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>AI-Powered Teaching Co-Pilot</p>
                    </div>

                    {/* Card */}
                    <div className={`rounded-[23px] backdrop-blur-2xl p-8 md:p-10 transition-all duration-500 ${isDark ? 'bg-[#0F172A]/95' : 'bg-white/95'}`}>
                        <h2 className={`text-2xl font-bold mb-8 text-center tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5 stagger-children">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-gradient w-full justify-center py-3.5 text-base mt-6 rounded-xl hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30"
                            >
                                {loading ? (
                                    <div className="spinner !w-5 !h-5 !border-2" />
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>or</span>
                            <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
                        </div>

                        {/* Demo Login */}
                        <button
                            onClick={handleDemoLogin}
                            className={`w-full justify-center py-3 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${isDark ? 'btn-secondary' : 'btn-secondary-light'}`}
                        >
                            🚀 Try Demo Mode
                        </button>

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

                {/* Footer */}
                <p className={`text-center text-xs mt-6 ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>
                    Reducing Cognitive Load on Educators with AI
                </p>
            </div>
        </div>
    );
}
