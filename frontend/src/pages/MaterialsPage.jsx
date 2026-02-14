import { useState } from 'react';
import { uploadTextMaterial } from '../services/textMaterialService';
import toast from 'react-hot-toast';
import { HiOutlineDocumentText, HiOutlineUpload, HiOutlineCheckCircle } from 'react-icons/hi';

export default function MaterialsPage() {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (validTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                toast.success('File selected');
            } else {
                toast.error('Please select a valid text, PDF, or DOCX file');
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a file first');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const data = await uploadTextMaterial(formData);
            setResponse(data);
            toast.success('Material uploaded successfully!');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-white">Upload Study Materials</h1>
                <p className="text-slate-400 text-sm mt-1">Upload text materials for AI-powered analysis and content extraction</p>
            </div>

            {/* Upload Form */}
            <div className="glass-card p-6 animate-fade-in animate-fade-in-delay-1">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <HiOutlineUpload className="w-5 h-5 text-blue-400" />
                    Upload Document
                </h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Select File (TXT, PDF, DOCX)
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".txt,.pdf,.docx"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 file:cursor-pointer cursor-pointer border border-white/10 rounded-lg bg-white/5 p-2"
                            />
                        </div>
                        {file && (
                            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="btn-gradient w-full justify-center py-3"
                    >
                        {loading ? (
                            <div className="spinner !w-5 !h-5 !border-2" />
                        ) : (
                            <>
                                <HiOutlineUpload className="w-4 h-4" />
                                Upload Material
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Upload Response */}
            {response && (
                <div className="glass-card p-6 animate-fade-in border-emerald-500/20">
                    <div className="flex items-start gap-3 mb-4">
                        <HiOutlineCheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-base font-semibold text-white mb-1">Upload Successful</h3>
                            <p className="text-sm text-slate-400">Your material has been processed</p>
                        </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            {/* Info Card */}
            <div className="glass-card p-5 border-blue-500/20">
                <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <HiOutlineDocumentText className="w-4 h-4" />
                    Supported Features
                </h3>
                <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>Extract text content from study materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>AI-powered content analysis and summarization</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>Supports TXT, PDF, and DOCX formats</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>Automatic topic and keyword extraction</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
