import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import {
    HiOutlineUserGroup,
    HiOutlineChartBar,
    HiOutlineExclamationCircle,
    HiOutlineDocumentText,
    HiOutlineClipboardCheck,
    HiOutlineLightBulb,
    HiOutlinePresentationChartLine,
    HiOutlineArrowRight,
} from 'react-icons/hi';

const quickActions = [
    { path: '/attendance', label: 'Analyze Marks', desc: 'Upload CSV and get AI insights', icon: HiOutlineClipboardCheck, color: 'from-blue-500 to-blue-600' },
    { path: '/assessment', label: 'Generate Assessment', desc: 'Create AI-powered quizzes', icon: HiOutlineDocumentText, color: 'from-purple-500 to-purple-600' },
    { path: '/learning-gap', label: 'Syllabus Analysis', desc: 'Upload PDF syllabus for insights', icon: HiOutlineLightBulb, color: 'from-cyan-500 to-cyan-600' },
    { path: '/reports', label: 'Student Feedback', desc: 'Generate personalized reports', icon: HiOutlineChartBar, color: 'from-emerald-500 to-emerald-600' },
    { path: '/engagement', label: 'Engagement Analytics', desc: 'Class engagement patterns', icon: HiOutlinePresentationChartLine, color: 'from-amber-500 to-amber-600' },
];

const recentActivities = [
    { action: 'Generated assessment', detail: 'Data Structures — Trees & Graphs', time: '2 hours ago', color: 'bg-purple-500' },
    { action: 'Analyzed marks', detail: '45 students, Avg: 72%', time: '5 hours ago', color: 'bg-blue-500' },
    { action: 'Syllabus analyzed', detail: 'Computer Networks — PDF uploaded', time: '1 day ago', color: 'bg-cyan-500' },
    { action: 'Feedback generated', detail: 'Student: Rahul Sharma — 68%', time: '1 day ago', color: 'bg-emerald-500' },
    { action: 'Engagement report', detail: 'Class engagement up 15%', time: '2 days ago', color: 'bg-amber-500' },
];

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-transparent border-blue-500/10 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'Teacher'} 👋
                        </h1>
                        <p className="text-slate-400 mt-1">Here's your teaching intelligence overview for today.</p>
                    </div>
                    <Link to="/assessment" className="btn-gradient">
                        <HiOutlineDocumentText className="w-5 h-5" />
                        Quick Assessment
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in animate-fade-in-delay-1">
                <StatsCard icon={HiOutlineUserGroup} label="Total Students" value="156" change="+12" color="blue" />
                <StatsCard icon={HiOutlineChartBar} label="Avg Score" value="72%" change="+3%" color="emerald" />
                <StatsCard icon={HiOutlineExclamationCircle} label="At-Risk Students" value="8" change="-2" color="rose" />
                <StatsCard icon={HiOutlineDocumentText} label="Assessments Created" value="24" change="+5" color="purple" />
            </div>

            {/* Quick Actions + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 animate-fade-in animate-fade-in-delay-2">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quickActions.map((action) => (
                            <Link
                                key={action.path}
                                to={action.path}
                                className="glass-card p-4 group hover:border-blue-500/20 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                                        <action.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{action.label}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                                    </div>
                                    <HiOutlineArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all mt-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="animate-fade-in animate-fade-in-delay-3">
                    <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                    <div className="glass-card p-4 space-y-4">
                        {recentActivities.map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full ${activity.color} mt-1.5 flex-shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-medium">{activity.action}</p>
                                    <p className="text-xs text-slate-500 truncate">{activity.detail}</p>
                                </div>
                                <span className="text-xs text-slate-600 flex-shrink-0">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Insight Banner */}
            <div className="glass-card p-5 border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-transparent animate-fade-in animate-fade-in-delay-4">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <HiOutlineLightBulb className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-purple-300">AI Insight</h3>
                        <p className="text-sm text-slate-400 mt-1">
                            Based on recent analysis, <span className="text-white font-medium">Unit 3 — Recursion</span> shows the highest
                            learning gap. Consider a revision session or targeted assessment before the mid-term exam.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
