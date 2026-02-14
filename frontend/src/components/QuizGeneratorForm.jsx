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
        <form onSubmit={handleSubmit} className="assessment-form">
            <div className="assessment-form-grid">
                {/* Subject */}
                <div className="form-field">
                    <label className="form-label">Subject</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Data Structures"
                        className="form-input"
                        required
                    />
                </div>

                {/* Unit / Chapter */}
                <div className="form-field">
                    <label className="form-label">Unit / Chapter</label>
                    <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        placeholder="e.g. Trees and Graphs"
                        className="form-input"
                        required
                    />
                </div>

                {/* Difficulty */}
                <div className="form-field">
                    <label className="form-label">Difficulty Level</label>
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                {/* Number of Questions */}
                <div className="form-field">
                    <label className="form-label">Number of Questions</label>
                    <input
                        type="number"
                        name="num_questions"
                        value={formData.num_questions}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        className="form-input"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !formData.subject || !formData.unit}
                className="generate-assessment-btn"
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
