import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import StudentListTable from '../components/StudentListTable';
import StatsCard from '../components/StatsCard';
import { marksService } from '../services/marksService';
import toast from 'react-hot-toast';
import {
    HiOutlineChartBar,
    HiOutlineExclamationCircle,
    HiOutlineUserGroup,
    HiOutlineLightBulb,
    HiOutlineUpload,
} from 'react-icons/hi';

export default function AttendancePage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
        if (!file) return toast.error('Please upload a CSV file first.');
        setLoading(true);
        try {
            const data = await marksService.analyzeMarks(file);
            setResult(data);
            toast.success('Analysis complete!');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Analysis failed. Using demo data.');
            // Demo fallback
            setResult({
                average_score: 72,
                weak_topics: ['Unit 2 — Recursion', 'Unit 4 — Dynamic Programming', 'Unit 6 — Graph Algorithms'],
                risk_students: ['Amit Kumar', 'Sneha Patil', 'Rohan Das', 'Priya Nair'],
                strategy: 'Based on the analysis, it is recommended to conduct a focused revision workshop on Recursion and Dynamic Programming. Use visual aids and step-by-step problem solving. Pair at-risk students with high-performing peers for collaborative learning. Consider a supplementary assessment with easier difficulty to build confidence before the final exam.',
                students: [
                    { name: 'Rahul Sharma', score: 85, grade: 'A', status: 'Excellent' },
                    { name: 'Priya Nair', score: 52, grade: 'D', status: 'At-Risk' },
                    { name: 'Amit Kumar', score: 45, grade: 'F', status: 'At-Risk' },
                    { name: 'Sneha Patil', score: 58, grade: 'D', status: 'At-Risk' },
                    { name: 'Vikram Singh', score: 78, grade: 'B', status: 'Good' },
                    { name: 'Ananya Desai', score: 92, grade: 'A+', status: 'Excellent' },
                    { name: 'Rohan Das', score: 48, grade: 'F', status: 'At-Risk' },
                    { name: 'Meera Joshi', score: 74, grade: 'B', status: 'Good' },
                    { name: 'Karthik Reddy', score: 81, grade: 'A', status: 'Excellent' },
                    { name: 'Divya Menon', score: 67, grade: 'C', status: 'Average' },
                ],
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="attendance-page-container">
            {/* Header */}
            <div className="attendance-page-header">
                <h1 className="attendance-page-title">Attendance & Marks Analysis</h1>
                <p className="attendance-page-subtitle">Upload student marks CSV to get AI-powered insights and teaching strategies</p>
            </div>

            {/* Upload Section */}
            <div className="upload-marks-card">
                <h2 className="upload-marks-title">
                    <HiOutlineUpload className="w-5 h-5 text-blue-400" />
                    Upload Student Marks
                </h2>
                <FileUploader
                    accept=".csv"
                    file={file}
                    onFileSelect={setFile}
                    onClear={() => { setFile(null); setResult(null); }}
                    description="Accepted format: CSV with columns — Student Name, Subject, Score"
                />
                <button
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    className="analyze-marks-btn"
                >
                    {loading ? (
                        <>
                            <div className="spinner !w-5 !h-5 !border-2" />
                            Analyzing with AI...
                        </>
                    ) : (
                        <>
                            <HiOutlineChartBar className="w-5 h-5" />
                            Analyze Marks
                        </>
                    )}
                </button>
            </div>

            {/* Results */}
            {result && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                        <StatsCard icon={HiOutlineChartBar} label="Average Score" value={`${result.average_score}%`} color="blue" />
                        <StatsCard icon={HiOutlineExclamationCircle} label="Weak Topics" value={result.weak_topics?.length || 0} color="amber" />
                        <StatsCard icon={HiOutlineUserGroup} label="At-Risk Students" value={result.risk_students?.length || 0} color="rose" />
                        <StatsCard icon={HiOutlineLightBulb} label="Class Health" value={result.average_score >= 70 ? 'Good' : 'Needs Attention'} color={result.average_score >= 70 ? 'emerald' : 'amber'} />
                    </div>

                    {/* Weak Topics + At-Risk Students */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in animate-fade-in-delay-1">
                        {/* Weak Topics */}
                        <div className="glass-card p-5">
                            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-3">
                                ⚠️ Weak Topics Identified
                            </h3>
                            <div className="space-y-2">
                                {result.weak_topics?.map((topic, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">{idx + 1}</span>
                                        <span className="text-sm text-slate-300">{topic}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* At-Risk Students */}
                        <div className="glass-card p-5">
                            <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wide mb-3">
                                🚨 At-Risk Students
                            </h3>
                            <div className="space-y-2">
                                {result.risk_students?.map((student, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                                        <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold">
                                            {student.charAt(0)}
                                        </div>
                                        <span className="text-sm text-slate-300">{student}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Strategy */}
                    {result.strategy && (
                        <div className="glass-card p-5 border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-transparent animate-fade-in animate-fade-in-delay-2">
                            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <HiOutlineLightBulb className="w-5 h-5" />
                                AI Teaching Strategy Recommendation
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{result.strategy}</p>
                        </div>
                    )}

                    {/* Student Table */}
                    {result.students && (
                        <div className="animate-fade-in animate-fade-in-delay-3">
                            <h2 className="text-base font-semibold text-white mb-3">Student Performance Table</h2>
                            <StudentListTable students={result.students} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
