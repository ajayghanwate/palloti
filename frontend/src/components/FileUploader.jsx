import { useState, useRef } from 'react';
import { HiOutlineUpload, HiOutlineDocument, HiOutlineX } from 'react-icons/hi';

export default function FileUploader({ accept, label, onFileSelect, file, onClear, description }) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div>
            {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}

            {!file ? (
                <div
                    className={`dropzone ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={handleChange}
                        className="hidden"
                    />
                    <HiOutlineUpload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                    <p className="text-sm text-slate-300 font-medium">
                        Drag & drop or <span className="text-blue-400 underline">browse files</span>
                    </p>
                    {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
                </div>
            ) : (
                <div className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <HiOutlineDocument className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-white font-medium">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                    <button
                        onClick={onClear}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                        <HiOutlineX className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
