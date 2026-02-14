import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineBookOpen } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
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
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden p-4">
            {/* Animated background orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative z-10">
                {/* Premium outer container with gradient border */}
                <div className="rounded-3xl p-[1px] bg-gradient-to-br from-blue-500/40 via-purple-500/20 to-cyan-500/40 shadow-2xl shadow-blue-500/10">
                    {/* Logo */}
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/20">
                            <HiOutlineAcademicCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">MentorAI</h1>
                        <p className="text-slate-400 text-sm mt-1">AI-Powered Teaching Co-Pilot</p>
                    </div>

                    {/* Card */}
                    <div className="rounded-[23px] bg-[#0F172A]/95 backdrop-blur-2xl p-8 md:p-10">
                        <h2 className="text-xl font-semibold text-white mb-8 text-center">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Dr. John Smith"
                                            className="login-input"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
                                    <div className="relative">
                                        <HiOutlineBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                                        <input
                                            type="text"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                            placeholder="e.g. Data Structures"
                                            className="login-input"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                                <div className="relative">
                                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="teacher@college.edu"
                                        className="login-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="login-input"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-gradient w-full justify-center py-3.5 text-base mt-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/20"
                            >
                                {loading ? (
                                    <div className="spinner !w-5 !h-5 !border-2" />
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-slate-500">or</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Demo Login */}
                        <button
                            onClick={handleDemoLogin}
                            className="btn-secondary w-full justify-center py-3"
                        >
                            🚀 Try Demo Mode
                        </button>

                        {/* Toggle */}
                        <p className="text-center text-sm text-slate-400 mt-5">
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
                <p className="text-center text-xs text-slate-600 mt-6">
                    Reducing Cognitive Load on Educators with AI
                </p>
            </div>
        </div>
    );
}
