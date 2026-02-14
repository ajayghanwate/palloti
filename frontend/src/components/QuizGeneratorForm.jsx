import { useState } from 'react';
import { HiOutlineLightningBolt } from 'react-icons/hi';

export default function QuizGeneratorForm({ onSubmit, loading }) {
    const [formData, setFormData] = useState({
        subject: '',
        unit: '',
        difficulty: 'medium',
        num_questions: 10,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Subject */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Data Structures"
                        className="input-field"
                        required
                    />
                </div>

                {/* Unit / Chapter */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Unit / Chapter</label>
                    <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        placeholder="e.g. Trees and Graphs"
                        className="input-field"
                        required
                    />
                </div>

                {/* Difficulty */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty Level</label>
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        className="select-field"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                {/* Number of Questions */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Number of Questions</label>
                    <input
                        type="number"
                        name="num_questions"
                        value={formData.num_questions}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        className="input-field"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !formData.subject || !formData.unit}
                className="btn-gradient w-full justify-center py-3 text-base"
            >
                {loading ? (
                    <>
                        <div className="spinner !w-5 !h-5 !border-2" />
                        Generating with AI...
                    </>
                ) : (
                    <>
                        <HiOutlineLightningBolt className="w-5 h-5" />
                        Generate Assessment
                    </>
                )}
            </button>
        </form>
    );
}
