export default function StatsCard({ icon: Icon, label, value, change, color = 'blue' }) {
    const colorMap = {
        blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
        purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
        emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
        amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400',
        rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/20 text-rose-400',
        cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
    };

    const iconColorMap = {
        blue: 'bg-blue-500/20 text-blue-400',
        purple: 'bg-purple-500/20 text-purple-400',
        emerald: 'bg-emerald-500/20 text-emerald-400',
        amber: 'bg-amber-500/20 text-amber-400',
        rose: 'bg-rose-500/20 text-rose-400',
        cyan: 'bg-cyan-500/20 text-cyan-400',
    };

    return (
        <div className={`rounded-2xl border bg-gradient-to-br ${colorMap[color]} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                    {change && (
                        <p className={`text-xs mt-2 font-medium ${change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {change} from last week
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorMap[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    );
}
