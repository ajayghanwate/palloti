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
        <div className="materials-page-container">
            {/* Header */}
            <div className="materials-page-header">
                <h1 className="materials-page-title">Upload Study Materials</h1>
                <p className="materials-page-subtitle">Upload text materials for AI-powered analysis and content extraction</p>
            </div>

            {/* Upload Form */}
            <div className="upload-card">
                <h2 className="upload-card-title">
                    <HiOutlineUpload className="w-5 h-5 text-blue-400" />
                    Upload Document
                </h2>
                <form onSubmit={handleUpload} className="upload-form">
                    <div className="file-input-container">
                        <label className="file-input-label">
                            Select File (TXT, PDF, DOCX)
                        </label>
                        <div className="custom-file-input">
                            <input
                                type="file"
                                accept=".txt,.pdf,.docx"
                                onChange={handleFileChange}
                                className="file-input-hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="file-input-button">
                                <HiOutlineDocumentText className="w-5 h-5" />
                                Choose File
                            </label>
                            <span className="file-input-name">
                                {file ? file.name : 'No file chosen'}
                            </span>
                        </div>
                        {file && (
                            <p className="file-selected-info">
                                ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="upload-material-btn"
                    >
                        {loading ? (
                            <div className="spinner !w-5 !h-5 !border-2" />
                        ) : (
                            <>
                                <HiOutlineUpload className="w-5 h-5" />
                                Upload Material
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Upload Response */}
            {response && (
                <div className="upload-response-card">
                    <div className="upload-response-header">
                        <HiOutlineCheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                        <div>
                            <h3 className="upload-response-title">Upload Successful</h3>
                            <p className="upload-response-subtitle">Your material has been processed</p>
                        </div>
                    </div>
                    <div className="upload-response-content">
                        <pre className="upload-response-data">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            {/* Features Card */}
            <div className="features-card">
                <h3 className="features-card-title">
                    <HiOutlineDocumentText className="w-5 h-5" />
                    Supported Features
                </h3>
                <ul className="features-list">
                    <li className="feature-item">
                        <span className="feature-bullet">•</span>
                        <span>Extract text content from study materials</span>
                    </li>
                    <li className="feature-item">
                        <span className="feature-bullet">•</span>
                        <span>AI-powered content analysis and summarization</span>
                    </li>
                    <li className="feature-item">
                        <span className="feature-bullet">•</span>
                        <span>Supports TXT, PDF, and DOCX formats</span>
                    </li>
                    <li className="feature-item">
                        <span className="feature-bullet">•</span>
                        <span>Automatic topic and keyword extraction</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
