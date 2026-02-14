export default function StatsCard({ icon: Icon, label, value, change, color = 'blue' }) {
    const colorMap = {
        blue: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/30',
        purple: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/30',
        emerald: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/30',
        amber: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/30',
        rose: 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/30',
        cyan: 'bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/30',
    };

    const iconColorMap = {
        blue: 'bg-blue-500/15 text-blue-400',
        purple: 'bg-purple-500/15 text-purple-400',
        emerald: 'bg-emerald-500/15 text-emerald-400',
        amber: 'bg-amber-500/15 text-amber-400',
        rose: 'bg-rose-500/15 text-rose-400',
        cyan: 'bg-cyan-500/15 text-cyan-400',
    };

    return (
        <div className={`dashboard-stat-card ${colorMap[color]}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="stat-label">{label}</p>
                </div>
                {Icon && (
                    <div className={`stat-icon ${iconColorMap[color]}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>
            <div>
                <p className="stat-value">{value}</p>
                {change && (
                    <p className={`stat-change ${change.startsWith('+') || change.startsWith('-') && !change.includes('-') ? 'positive' : 'negative'}`}>
                        {change} from last week
                    </p>
                )}
            </div>
        </div>
    );
}
