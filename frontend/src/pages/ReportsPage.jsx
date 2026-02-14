import { useState } from 'react';
import ReportViewer from '../components/ReportViewer';
import { feedbackService } from '../services/feedbackService';
import toast from 'react-hot-toast';
import { HiOutlineChartBar, HiOutlineUser, HiOutlineTag, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

export default function ReportsPage() {
    const [form, setForm] = useState({ student_name: '', score: '', weak_topics: [] });
    const [topicInput, setTopicInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const addTopic = () => {
        if (topicInput.trim() && !form.weak_topics.includes(topicInput.trim())) {
            setForm({ ...form, weak_topics: [...form.weak_topics, topicInput.trim()] });
            setTopicInput('');
        }
    };

    const removeTopic = (t) => setForm({ ...form, weak_topics: form.weak_topics.filter((x) => x !== t) });

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!form.student_name || !form.score) return toast.error('Fill all fields.');
        setLoading(true);
        try {
            const data = await feedbackService.generateFeedback(form);
            setReport({ ...data, student_name: form.student_name, score: form.score });
            toast.success('Feedback generated!');
        } catch {
            toast.error('Using demo data.');
            setReport({
                student_name: form.student_name, score: form.score,
                strengths: `${form.student_name} shows solid understanding of foundational concepts and consistent improvement. Strong analytical skills observed in labs.`,
                weak_areas: `Needs improvement in ${form.weak_topics.join(', ') || 'advanced topics'}. Struggles with complex multi-step reasoning.`,
                improvement_plan: `1. Daily 30-min practice on weak topics\n2. Work through 3-5 problems weekly\n3. Form study groups\n4. Review notes and past papers\n5. Attend office hours`,
                motivational_message: `${form.student_name}, your score of ${form.score}% is a stepping stone! Keep pushing — your consistency will pay off! 🌟`,
            });
        } finally { setLoading(false); }
    };

    const handleDownload = () => {
        let c = `STUDENT REPORT\n${'='.repeat(50)}\nStudent: ${report.student_name}\nScore: ${report.score}%\n\n`;
        c += `STRENGTHS\n${report.strengths}\n\nAREAS TO IMPROVE\n${report.weak_areas}\n\n`;
        c += `IMPROVEMENT PLAN\n${report.improvement_plan}\n\nMOTIVATION\n${report.motivational_message}\n`;
        const blob = new Blob([c], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `report_${report.student_name?.replace(/\s+/g, '_')}.txt`;
        a.click();
        toast.success('Downloaded!');
    };

    return (
        <div className="reports-page-container">
            {/* Header */}
            <div className="reports-page-header">
                <h1 className="reports-page-title">Performance Reports</h1>
                <p className="reports-page-subtitle">Generate AI-powered personalized feedback and improvement plans</p>
            </div>

            {/* Student Information Card */}
            <div className="student-info-card">
                <h2 className="student-info-title">
                    <HiOutlineUser className="w-5 h-5 text-emerald-400" />
                    Student Information
                </h2>
                <form onSubmit={handleGenerate} className="student-info-form">
                    {/* Name and Score Grid */}
                    <div className="student-info-grid">
                        <div className="form-field">
                            <label className="form-label">Student Name</label>
                            <input
                                type="text"
                                name="student_name"
                                value={form.student_name}
                                onChange={handleChange}
                                placeholder="e.g. Rahul Sharma"
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Score (%)</label>
                            <input
                                type="number"
                                name="score"
                                value={form.score}
                                onChange={handleChange}
                                placeholder="e.g. 72"
                                min="0"
                                max="100"
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    {/* Weak Topics Section */}
                    <div className="weak-topics-section">
                        <label className="form-label">Weak Topics</label>
                        <div className="topic-input-wrapper">
                            <input
                                type="text"
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                                placeholder="Type topic and press Enter"
                                className="topic-input"
                            />
                            <button
                                type="button"
                                onClick={addTopic}
                                className="add-topic-btn"
                            >
                                <HiOutlinePlus className="w-4 h-4" />
                                Add Topic
                            </button>
                        </div>
                        {form.weak_topics.length > 0 && (
                            <div className="topics-list">
                                {form.weak_topics.map((t) => (
                                    <span key={t} className="topic-tag">
                                        <HiOutlineTag className="w-3.5 h-3.5" />
                                        {t}
                                        <button
                                            type="button"
                                            onClick={() => removeTopic(t)}
                                            className="topic-remove-btn"
                                        >
                                            <HiOutlineX className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Generate Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="generate-feedback-btn"
                    >
                        {loading ? (
                            <>
                                <div className="spinner !w-5 !h-5 !border-2" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <HiOutlineChartBar className="w-5 h-5" />
                                Generate AI Feedback
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Report Viewer */}
            {report && (
                <div className="report-viewer-wrapper">
                    <ReportViewer report={report} onDownload={handleDownload} />
                </div>
            )}
        </div>
    );
}
