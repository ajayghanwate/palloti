import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineBookOpen } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isTeacher, setIsTeacher] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '', subject: '', class: '' });
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
                if (isTeacher) {
                    await register(form.name, form.email, form.password, { subject: form.subject, role: 'teacher' });
                } else {
                    await register(form.name, form.email, form.password, { class: form.class, role: 'student' });
                }
            }
            toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
            navigate('/');
        } catch (err) {
            // This should rarely happen now since AuthContext handles failures
            console.error('Unexpected error:', err);
            toast.error('An unexpected error occurred. Please try again.');
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
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Blurred classroom background */}
            <div
                className="login-bg-classroom"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1920&q=80')`,
                }}
            />

            {/* Login Card */}
            <div className="login-card">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                        <HiOutlineAcademicCap className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">MentorAI</h1>
                    <p className="text-sm text-gray-500">AI-Powered Teaching Co-Pilot</p>
                </div>

                {/* Segmented Control - Teacher/Student Toggle */}
                <div className="segmented-control mb-6">
                    <button
                        type="button"
                        onClick={() => setIsTeacher(true)}
                        className={`segmented-button ${isTeacher ? 'active' : ''}`}
                    >
                        Teacher
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsTeacher(false)}
                        className={`segmented-button ${!isTeacher ? 'active' : ''}`}
                    >
                        Student
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="input-label">Full Name</label>
                            <div className="input-wrapper">
                                <HiOutlineUser className="input-icon" />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder={isTeacher ? "Dr. John Smith" : "Alex Doe"}
                                    className="input-field"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    {!isLogin && isTeacher && (
                        <div>
                            <label className="input-label">Subject</label>
                            <div className="input-wrapper">
                                <HiOutlineBookOpen className="input-icon" />
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="e.g. Data Structures"
                                    className="input-field"
                                    required={!isLogin && isTeacher}
                                />
                            </div>
                        </div>
                    )}

                    {!isLogin && !isTeacher && (
                        <div>
                            <label className="input-label">Class/Grade</label>
                            <div className="input-wrapper">
                                <HiOutlineBookOpen className="input-icon" />
                                <input
                                    type="text"
                                    name="class"
                                    value={form.class}
                                    onChange={handleChange}
                                    placeholder="e.g. Class 10 - Section A"
                                    className="input-field"
                                    required={!isLogin && !isTeacher}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="input-label">Email</label>
                        <div className="input-wrapper">
                            <HiOutlineMail className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder={isTeacher ? "teacher@college.edu" : "student@college.edu"}
                                className="input-field"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            <HiOutlineLockClosed className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input-field"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? (
                            <div className="spinner-small" />
                        ) : (
                            isLogin ? (isTeacher ? 'Teacher Sign In' : 'Student Sign In') : 'Create Account'
                        )}
                    </button>
                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <button onClick={handleDemoLogin} className="btn-secondary">
                    🚀 Try Demo Mode
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        {isLogin ? 'Register' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
}
