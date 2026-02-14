import { HiOutlineDownload, HiOutlineUser, HiOutlineStar, HiOutlineExclamation, HiOutlineArrowUp, HiOutlineHeart } from 'react-icons/hi';

export default function ReportViewer({ report, onDownload }) {
    if (!report) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-slate-500">No report generated yet. Enter student details and generate feedback.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Student Header */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {report.student_name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">{report.student_name || 'Student'}</h3>
                            <p className="text-sm text-slate-400">Score: <span className="text-blue-400 font-semibold">{report.score}%</span></p>
                        </div>
                    </div>
                    {onDownload && (
                        <button onClick={onDownload} className="btn-secondary">
                            <HiOutlineDownload className="w-4 h-4" />
                            Download Report
                        </button>
                    )}
                </div>
            </div>

            {/* Report Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                {report.strengths && (
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <HiOutlineStar className="w-5 h-5 text-emerald-400" />
                            <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">Strengths</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{report.strengths}</p>
                    </div>
                )}

                {/* Weak Areas */}
                {report.weak_areas && (
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <HiOutlineExclamation className="w-5 h-5 text-amber-400" />
                            <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Areas to Improve</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{report.weak_areas}</p>
                    </div>
                )}

                {/* Improvement Plan */}
                {report.improvement_plan && (
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <HiOutlineArrowUp className="w-5 h-5 text-blue-400" />
                            <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Improvement Plan</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{report.improvement_plan}</p>
                    </div>
                )}

                {/* Motivational Message */}
                {report.motivational_message && (
                    <div className="glass-card p-5 border-purple-500/20">
                        <div className="flex items-center gap-2 mb-3">
                            <HiOutlineHeart className="w-5 h-5 text-purple-400" />
                            <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide">Motivation</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-line">{report.motivational_message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
