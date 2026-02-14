import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { syllabusService } from '../services/syllabusService';
import toast from 'react-hot-toast';
import { HiOutlineLightBulb, HiOutlineBookOpen, HiOutlineBeaker } from 'react-icons/hi';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E'];

export default function LearningGapPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
        if (!file) return toast.error('Please upload a PDF syllabus first.');
        setLoading(true);
        try {
            const data = await syllabusService.analyzeSyllabus(file);
            setResult(data);
            toast.success('Syllabus analyzed successfully!');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Analysis failed. Using demo data.');
            setResult({
                topics: [
                    { name: 'Introduction to Computing', weight: 10, coverage: 'High' },
                    { name: 'Data Types & Variables', weight: 8, coverage: 'High' },
                    { name: 'Control Structures', weight: 12, coverage: 'Medium' },
                    { name: 'Functions & Recursion', weight: 15, coverage: 'Low' },
                    { name: 'Arrays & Strings', weight: 12, coverage: 'Medium' },
                    { name: 'Pointers & Memory', weight: 18, coverage: 'Low' },
                    { name: 'Structures & Unions', weight: 10, coverage: 'Medium' },
                    { name: 'File Handling', weight: 8, coverage: 'Low' },
                    { name: 'Dynamic Memory Allocation', weight: 7, coverage: 'Low' },
                ],
                focus_areas: [
                    { topic: 'Functions & Recursion', reason: 'High weight (15%) with low student coverage. Recursion concepts need deeper practice.', priority: 'Critical' },
                    { topic: 'Pointers & Memory', reason: 'Highest weight (18%) in syllabus but lowest understanding. Core concept for advanced topics.', priority: 'Critical' },
                    { topic: 'File Handling', reason: 'Often neglected but appears in practical exams. Needs dedicated lab sessions.', priority: 'Important' },
                    { topic: 'Dynamic Memory Allocation', reason: 'Builds on pointers knowledge. Students struggle with malloc/calloc/free concepts.', priority: 'Important' },
                ],
            });
        } finally {
            setLoading(false);
        }
    };

    const chartData = result?.topics?.map((t) => ({
        name: t.name.length > 15 ? t.name.substring(0, 15) + '...' : t.name,
        fullName: t.name,
        weight: t.weight,
    })) || [];

    const coverageColor = (coverage) => {
        switch (coverage?.toLowerCase()) {
            case 'high': return 'badge-green';
            case 'medium': return 'badge-amber';
            case 'low': return 'badge-rose';
            default: return 'badge-blue';
        }
    };

    const priorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'critical': return 'badge-rose';
            case 'important': return 'badge-amber';
            default: return 'badge-blue';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-white">Learning Gap Analysis</h1>
                <p className="text-slate-400 text-sm mt-1">Upload syllabus PDF to identify learning gaps and assessment focus areas</p>
            </div>

            {/* Upload */}
            <div className="glass-card p-6 animate-fade-in animate-fade-in-delay-1">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <HiOutlineBookOpen className="w-5 h-5 text-cyan-400" />
                    Upload Syllabus
                </h2>
                <FileUploader
                    accept=".pdf"
                    file={file}
                    onFileSelect={setFile}
                    onClear={() => { setFile(null); setResult(null); }}
                    description="Accepted format: PDF syllabus document"
                />
                <button onClick={handleAnalyze} disabled={!file || loading} className="btn-gradient mt-4">
                    {loading ? (
                        <>
                            <div className="spinner !w-4 !h-4 !border-2" /> Analyzing Syllabus...
                        </>
                    ) : (
                        <>
                            <HiOutlineBeaker className="w-4 h-4" /> Analyze Syllabus
                        </>
                    )}
                </button>
            </div>

            {/* Results */}
            {result && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Topics Chart */}
                        <div className="glass-card p-5 animate-fade-in">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
                                Topic Weight Distribution (%)
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} />
                                    <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} width={130} axisLine={false} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload?.length) {
                                                return (
                                                    <div className="glass-card p-3 !rounded-lg">
                                                        <p className="text-xs text-white font-medium">{payload[0].payload.fullName}</p>
                                                        <p className="text-xs text-blue-400">Weight: {payload[0].value}%</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="weight" radius={[0, 6, 6, 0]}>
                                        {chartData.map((_, idx) => (
                                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Topics Table */}
                        <div className="glass-card p-5 animate-fade-in animate-fade-in-delay-1">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
                                Topics & Coverage Level
                            </h3>
                            <div className="space-y-2">
                                {result.topics?.map((topic, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-500 w-6">{idx + 1}.</span>
                                            <span className="text-sm text-slate-300">{topic.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-500">{topic.weight}%</span>
                                            <span className={`badge ${coverageColor(topic.coverage)}`}>{topic.coverage}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Focus Areas */}
                    <div className="animate-fade-in animate-fade-in-delay-2">
                        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                            <HiOutlineLightBulb className="w-5 h-5 text-amber-400" />
                            AI Recommended Assessment Focus Areas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.focus_areas?.map((area, idx) => (
                                <div key={idx} className="glass-card p-5 border-l-2" style={{ borderLeftColor: idx < 2 ? '#F43F5E' : '#F59E0B' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-white">{area.topic}</h4>
                                        <span className={`badge ${priorityColor(area.priority)}`}>{area.priority}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">{area.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
