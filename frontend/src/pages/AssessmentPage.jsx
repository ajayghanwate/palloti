import { useState } from 'react';
import QuizGeneratorForm from '../components/QuizGeneratorForm';
import { assessmentService } from '../services/assessmentService';
import toast from 'react-hot-toast';
import { HiOutlineDocumentText, HiOutlineClipboardCopy, HiOutlineDownload } from 'react-icons/hi';

export default function AssessmentPage() {
    const [loading, setLoading] = useState(false);
    const [assessment, setAssessment] = useState(null);

    const handleGenerate = async (formData) => {
        setLoading(true);
        try {
            const data = await assessmentService.generateAssessment(formData);
            setAssessment(data);
            toast.success('Assessment generated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Generation failed. Using demo data.');
            // Demo fallback
            setAssessment({
                subject: formData.subject,
                unit: formData.unit,
                difficulty: formData.difficulty,
                mcqs: [
                    { question: `What is the time complexity of inserting an element at the root of a Binary Search Tree?`, options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 'O(log n)', bloom_level: 'Understanding' },
                    { question: `Which traversal of a BST gives elements in sorted order?`, options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'], answer: 'In-order', bloom_level: 'Remembering' },
                    { question: `What is the worst-case height of an unbalanced BST with n nodes?`, options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 'O(n)', bloom_level: 'Analyzing' },
                    { question: `Which of the following is NOT a self-balancing BST?`, options: ['AVL Tree', 'Red-Black Tree', 'B-Tree', 'Binary Heap'], answer: 'Binary Heap', bloom_level: 'Analyzing' },
                    { question: `In a complete binary tree with 15 nodes, what is the height?`, options: ['3', '4', '5', '7'], answer: '3', bloom_level: 'Applying' },
                ],
                short_answer: [
                    { question: 'Explain the difference between a Binary Tree and a Binary Search Tree with examples.', bloom_level: 'Understanding', marks: 5 },
                    { question: 'Write the algorithm for deleting a node with two children from a BST.', bloom_level: 'Applying', marks: 5 },
                    { question: 'Compare AVL trees and Red-Black trees in terms of balancing strategy and performance.', bloom_level: 'Evaluating', marks: 10 },
                ],
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const text = JSON.stringify(assessment, null, 2);
        navigator.clipboard.writeText(text);
        toast.success('Assessment copied to clipboard!');
    };

    const downloadAssessment = () => {
        let content = `ASSESSMENT: ${assessment.subject} — ${assessment.unit}\n`;
        content += `Difficulty: ${assessment.difficulty?.toUpperCase()}\n`;
        content += `${'='.repeat(60)}\n\n`;

        content += `SECTION A: MULTIPLE CHOICE QUESTIONS\n${'─'.repeat(40)}\n\n`;
        assessment.mcqs?.forEach((q, i) => {
            content += `Q${i + 1}. ${q.question} [${q.bloom_level}]\n`;
            q.options?.forEach((opt, j) => {
                content += `   ${String.fromCharCode(65 + j)}) ${opt}\n`;
            });
            content += `   Answer: ${q.answer}\n\n`;
        });

        content += `\nSECTION B: SHORT ANSWER QUESTIONS\n${'─'.repeat(40)}\n\n`;
        assessment.short_answer?.forEach((q, i) => {
            content += `Q${i + 1}. ${q.question} [${q.bloom_level}] [${q.marks} marks]\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `assessment_${assessment.subject?.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Assessment downloaded!');
    };

    const bloomColors = {
        Remembering: 'badge-blue',
        Understanding: 'badge-green',
        Applying: 'badge-amber',
        Analyzing: 'badge-purple',
        Evaluating: 'badge-rose',
        Creating: 'badge-blue',
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-white">AI Assessment Generator</h1>
                <p className="text-slate-400 text-sm mt-1">Generate tailored assessments aligned with Bloom's Taxonomy</p>
            </div>

            {/* Form */}
            <div className="glass-card p-6 animate-fade-in animate-fade-in-delay-1">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <HiOutlineDocumentText className="w-5 h-5 text-purple-400" />
                    Assessment Configuration
                </h2>
                <QuizGeneratorForm onSubmit={handleGenerate} loading={loading} />
            </div>

            {/* Generated Assessment */}
            {assessment && (
                <div className="space-y-6 animate-fade-in">
                    {/* Assessment Header */}
                    <div className="glass-card p-5 flex items-center justify-between flex-wrap gap-4 border-purple-500/20">
                        <div>
                            <h2 className="text-lg font-bold text-white">{assessment.subject} — {assessment.unit}</h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Difficulty: <span className="badge badge-purple capitalize ml-1">{assessment.difficulty}</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={copyToClipboard} className="btn-secondary text-sm">
                                <HiOutlineClipboardCopy className="w-4 h-4" /> Copy
                            </button>
                            <button onClick={downloadAssessment} className="btn-gradient text-sm">
                                <HiOutlineDownload className="w-4 h-4" /> Download
                            </button>
                        </div>
                    </div>

                    {/* MCQs */}
                    {assessment.mcqs && assessment.mcqs.length > 0 && (
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-4">
                                Section A — Multiple Choice Questions ({assessment.mcqs.length})
                            </h3>
                            <div className="space-y-5">
                                {assessment.mcqs.map((q, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <p className="text-sm text-white font-medium">
                                                <span className="text-blue-400 mr-2">Q{idx + 1}.</span>
                                                {q.question}
                                            </p>
                                            <span className={`badge ${bloomColors[q.bloom_level] || 'badge-blue'} flex-shrink-0`}>{q.bloom_level}</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6">
                                            {q.options?.map((opt, oIdx) => (
                                                <div
                                                    key={oIdx}
                                                    className={`p-2.5 rounded-lg text-xs border transition-colors ${opt === q.answer
                                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                                            : 'bg-white/[0.02] border-white/5 text-slate-400'
                                                        }`}
                                                >
                                                    <span className="font-semibold mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Short Answer */}
                    {assessment.short_answer && assessment.short_answer.length > 0 && (
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-4">
                                Section B — Short Answer Questions ({assessment.short_answer.length})
                            </h3>
                            <div className="space-y-4">
                                {assessment.short_answer.map((q, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm text-white font-medium">
                                                <span className="text-amber-400 mr-2">Q{idx + 1}.</span>
                                                {q.question}
                                            </p>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className={`badge ${bloomColors[q.bloom_level] || 'badge-blue'}`}>{q.bloom_level}</span>
                                                <span className="badge badge-amber">{q.marks}m</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
