import { useAuth } from '../../context/AuthContext';
import { HiOutlineMenu, HiOutlineBell, HiOutlineLogout } from 'react-icons/hi';

export default function Navbar({ onMenuClick }) {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-30 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
                {/* Left */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <HiOutlineMenu className="w-5 h-5" />
                    </button>
                    <div>
                        <p className="text-xs text-slate-500">Welcome back,</p>
                        <p className="text-sm font-semibold text-white">{user?.name || 'Teacher'}</p>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {/* Notification bell */}
                    <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <HiOutlineBell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                    </button>

                    {/* User avatar */}
                    <div className="flex items-center gap-3 ml-2 pl-3 border-l border-white/10">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'T'}
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Logout"
                        >
                            <HiOutlineLogout className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
