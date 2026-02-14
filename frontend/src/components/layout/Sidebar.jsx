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
} from 'react-icons/hi';

const navItems = [
    { path: '/', label: 'Dashboard', icon: HiOutlineHome },
    { path: '/attendance', label: 'Attendance & Marks', icon: HiOutlineClipboardCheck },
    { path: '/assessment', label: 'Assessment Generator', icon: HiOutlineDocumentText },
    { path: '/learning-gap', label: 'Learning Gap Analysis', icon: HiOutlineLightBulb },
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

            <aside
                className={`
          fixed top-0 left-0 h-full z-50 
          w-[280px] bg-[#0F172A] border-r border-white/10
          flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <HiOutlineAcademicCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">MentorAI</h1>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Teaching Co-Pilot</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-blue-400 border border-blue-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5">
                    <div className="glass-card p-4 text-center">
                        <p className="text-xs text-slate-500">Powered by</p>
                        <p className="text-sm font-semibold gradient-text">Groq AI Engine</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
