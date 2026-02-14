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
    const greeting = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening';
    const userName = user?.name?.split(' ')[0] || 'Teacher';

    return (
        <div className="dashboard-container">
            {/* Welcome Banner */}
            <div className="dashboard-welcome-banner">
                <div className="welcome-content">
                    <div>
                        <h1 className="welcome-heading">
                            Good {greeting}, {userName} 👋
                        </h1>
                        <p className="welcome-subtitle">
                            Here's your teaching intelligence overview for today.
                        </p>
                    </div>
                    <Link to="/assessment" className="quick-assessment-btn">
                        <HiOutlineDocumentText className="w-5 h-5" />
                        Quick Assessment
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <StatsCard icon={HiOutlineUserGroup} label="Total Students" value="156" change="+12" color="blue" />
                <StatsCard icon={HiOutlineChartBar} label="Avg Score" value="72%" change="+3%" color="emerald" />
                <StatsCard icon={HiOutlineExclamationCircle} label="At-Risk Students" value="8" change="-2" color="rose" />
                <StatsCard icon={HiOutlineDocumentText} label="Assessments Created" value="24" change="+5" color="purple" />
            </div>

            {/* Quick Actions + Recent Activity */}
            <div className="dashboard-main-grid">
                {/* Quick Actions */}
                <div className="quick-actions-section">
                    <h2 className="section-heading">Quick Actions</h2>
                    <div className="quick-actions-grid">
                        {quickActions.map((action) => (
                            <Link
                                key={action.path}
                                to={action.path}
                                className="quick-action-card"
                            >
                                <div className="quick-action-content">
                                    <div className={`quick-action-icon bg-gradient-to-br ${action.color}`}>
                                        <action.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="quick-action-text">
                                        <h3 className="quick-action-title">{action.label}</h3>
                                        <p className="quick-action-desc">{action.desc}</p>
                                    </div>
                                    <HiOutlineArrowRight className="quick-action-arrow" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity-section">
                    <h2 className="section-heading">Recent Activity</h2>
                    <div className="activity-card">
                        {recentActivities.map((activity, idx) => (
                            <div key={idx} className="activity-item">
                                <div className={`activity-dot ${activity.color}`} />
                                <div className="activity-content">
                                    <p className="activity-action">{activity.action}</p>
                                    <p className="activity-detail">{activity.detail}</p>
                                </div>
                                <span className="activity-time">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Insight Banner */}
            <div className="ai-insight-banner">
                <div className="ai-insight-content">
                    <div className="ai-insight-icon">
                        <HiOutlineLightBulb className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="ai-insight-text">
                        <h3 className="ai-insight-title">AI Insight</h3>
                        <p className="ai-insight-description">
                            Based on recent analysis, <span className="highlight">Unit 3 — Recursion</span> shows the highest
                            learning gap. Consider a revision session or targeted assessment before the mid-term exam.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
