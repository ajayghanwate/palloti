import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineClipboardCheck,
    HiOutlineDocumentText,
    HiOutlineChartBar,
    HiOutlineLightBulb,
    HiOutlinePresentationChartLine,
    HiOutlineAcademicCap,
    HiOutlineX,
    HiOutlineUpload,
} from 'react-icons/hi';

const navItems = [
    { path: '/', label: 'Dashboard', icon: HiOutlineHome },
    { path: '/attendance', label: 'Attendance & Marks', icon: HiOutlineClipboardCheck },
    { path: '/assessment', label: 'Assessment Generator', icon: HiOutlineDocumentText },
    { path: '/learning-gap', label: 'Learning Gap Analysis', icon: HiOutlineLightBulb },
    { path: '/materials', label: 'Study Materials', icon: HiOutlineUpload },
    { path: '/reports', label: 'Performance Reports', icon: HiOutlineChartBar },
    { path: '/engagement', label: 'Engagement Analytics', icon: HiOutlinePresentationChartLine },
];

export default function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className="sidebar-container">
                {/* Logo */}
                <div className="sidebar-header">
                    <div className="sidebar-logo-wrapper">
                        <div className="sidebar-logo-icon">
                            <HiOutlineAcademicCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="sidebar-logo-text">
                            <h1 className="sidebar-logo-title">MentorAI</h1>
                            <p className="sidebar-logo-subtitle">TEACHING CO-PILOT</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="sidebar-close-btn lg:hidden">
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `sidebar-nav-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon className="sidebar-nav-icon" />
                            <span className="sidebar-nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-footer-card">
                        <p className="sidebar-footer-text">Powered by</p>
                        <p className="sidebar-footer-brand">Groq AI Engine</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
