import StatsCard from '../components/StatsCard';
import { EngagementLineChart, EngagementBarChart, EngagementPieChart, EngagementRadarChart } from '../components/EngagementAnalyticsCharts';
import { HiOutlinePresentationChartLine, HiOutlineChatAlt2, HiOutlineEye, HiOutlineTrendingUp } from 'react-icons/hi';

const questionFrequency = [
    { name: 'Week 1', value: 12 }, { name: 'Week 2', value: 18 },
    { name: 'Week 3', value: 15 }, { name: 'Week 4', value: 25 },
    { name: 'Week 5', value: 22 }, { name: 'Week 6', value: 30 },
    { name: 'Week 7', value: 28 }, { name: 'Week 8', value: 35 },
];

const topicEngagement = [
    { name: 'Arrays', value: 85 }, { name: 'Trees', value: 72 },
    { name: 'Graphs', value: 65 }, { name: 'DP', value: 45 },
    { name: 'Sorting', value: 90 }, { name: 'Recursion', value: 55 },
];

const behaviorBreakdown = [
    { name: 'Active Participation', value: 35 }, { name: 'Passive Listening', value: 25 },
    { name: 'Note Taking', value: 20 }, { name: 'Asking Questions', value: 12 },
    { name: 'Off-Task', value: 8 },
];

const skillRadar = [
    { name: 'Problem Solving', value: 78 }, { name: 'Conceptual', value: 85 },
    { name: 'Practical', value: 70 }, { name: 'Communication', value: 62 },
    { name: 'Collaboration', value: 88 }, { name: 'Critical Thinking', value: 72 },
];

export default function EngagementPage() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-white">Engagement Analytics</h1>
                <p className="text-slate-400 text-sm mt-1">Monitor class engagement patterns, behavioral signals, and participation trends</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in animate-fade-in-delay-1">
                <StatsCard icon={HiOutlinePresentationChartLine} label="Engagement Score" value="78%" change="+5%" color="blue" />
                <StatsCard icon={HiOutlineChatAlt2} label="Questions This Week" value="35" change="+7" color="purple" />
                <StatsCard icon={HiOutlineEye} label="Avg Attention" value="82%" change="+3%" color="cyan" />
                <StatsCard icon={HiOutlineTrendingUp} label="Participation Rate" value="91%" change="+8%" color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in animate-fade-in-delay-2">
                <EngagementLineChart data={questionFrequency} title="Question Frequency Over Time" />
                <EngagementBarChart data={topicEngagement} title="Topic-wise Engagement (%)" />
                <EngagementPieChart data={behaviorBreakdown} title="Behavioral Pattern Distribution" />
                <EngagementRadarChart data={skillRadar} title="Class Skill Radar" />
            </div>

            <div className="glass-card p-5 border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-transparent animate-fade-in animate-fade-in-delay-3">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-3">🧠 AI Pedagogical Insight</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    Engagement in <span className="text-white font-medium">Dynamic Programming</span> is significantly lower (45%) compared to other topics.
                    Consider using visual animations, step-by-step walkthroughs, and real-world analogies. The question frequency trend is positive (+15% over 8 weeks),
                    indicating growing class confidence. Recommend peer-teaching sessions for top-performing students to boost collaborative engagement.
                </p>
            </div>
        </div>
    );
}
