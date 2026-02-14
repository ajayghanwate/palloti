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
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-white">Performance Reports</h1>
                <p className="text-slate-400 text-sm mt-1">Generate AI-powered personalized feedback and improvement plans</p>
            </div>

            <div className="glass-card p-6 animate-fade-in animate-fade-in-delay-1">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <HiOutlineUser className="w-5 h-5 text-emerald-400" /> Student Information
                </h2>
                <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Student Name</label>
                            <input type="text" name="student_name" value={form.student_name} onChange={handleChange} placeholder="e.g. Rahul Sharma" className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Score (%)</label>
                            <input type="number" name="score" value={form.score} onChange={handleChange} placeholder="e.g. 72" min="0" max="100" className="input-field" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Weak Topics</label>
                        <div className="flex gap-2">
                            <input type="text" value={topicInput} onChange={(e) => setTopicInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())} placeholder="Type topic, press Enter" className="input-field flex-1" />
                            <button type="button" onClick={addTopic} className="btn-secondary px-4"><HiOutlinePlus className="w-4 h-4" /></button>
                        </div>
                        {form.weak_topics.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {form.weak_topics.map((t) => (
                                    <span key={t} className="badge badge-amber flex items-center gap-1.5">
                                        <HiOutlineTag className="w-3 h-3" />{t}
                                        <button onClick={() => removeTopic(t)} className="hover:text-rose-400"><HiOutlineX className="w-3 h-3" /></button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="submit" disabled={loading} className="btn-gradient w-full justify-center py-3 text-base">
                        {loading ? <><div className="spinner !w-5 !h-5 !border-2" /> Generating...</> : <><HiOutlineChartBar className="w-5 h-5" /> Generate AI Feedback</>}
                    </button>
                </form>
            </div>

            {report && <div className="animate-fade-in"><ReportViewer report={report} onDownload={handleDownload} /></div>}
        </div>
    );
}
