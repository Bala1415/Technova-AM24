import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ResumeScore = () => {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [jobRole, setJobRole] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files) { setFile(e.target.files[0]); setError(null); }
    };

    const handleAnalyze = async () => {
        if (!file) { setError("Please upload a file first."); return; }
        setAnalyzing(true); setError(null);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_role', jobRole);
        try {
            const response = await axios.post('http://localhost:8000/analyze-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResults(response.data);
        } catch (err) {
            console.error(err);
            setError("Analysis failed. Ensure the backend is running.");
        } finally { setAnalyzing(false); }
    };

    return (
        <div className="min-h-screen p-8" style={{ background: '#ffffff' }}>
            <div className="max-w-4xl mx-auto rounded-xl shadow-lg p-8 mt-[80px]"
                style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                <header className="mb-8 pb-4" style={{ borderBottom: '1px solid #e5e5e5' }}>
                    <h1 className="text-2xl font-bold" style={{ color: '#111' }}>AI Resume <span style={{ color: '#d4a800' }}>Analyzer</span></h1>
                    <p style={{ color: '#666' }}>Upload your resume to get instant feedback and ATS scoring.</p>
                </header>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>Target Job Role</label>
                            <input type="text" className="w-full p-2 rounded-lg focus:outline-none transition-all"
                                style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                                onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
                                placeholder="e.g. Full Stack Developer"
                                value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>Upload Resume (PDF/DOCX)</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors"
                                    style={{ borderColor: '#e5e5e5', background: '#fafafa' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f5c518'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; }}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3" style={{ color: '#d4a800' }} />
                                        <p className="text-sm" style={{ color: '#666' }}><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs" style={{ color: '#999' }}>PDF or DOCX (MAX. 5MB)</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                                </label>
                            </div>
                            {file && <p className="text-sm mt-2 flex items-center" style={{ color: '#16a34a' }}><CheckCircle className="w-4 h-4 mr-1"/>Selected: {file.name}</p>}
                        </div>
                    </div>

                    <button onClick={handleAnalyze} disabled={analyzing || !file}
                        className="w-full py-3 rounded-lg font-bold transition-all"
                        style={analyzing || !file
                            ? { background: '#f5f5f5', color: '#999', cursor: 'not-allowed' }
                            : { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }
                        }>
                        {analyzing ? <span className="flex items-center justify-center"><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Analyzing...</span> : 'Analyze Resume'}
                    </button>

                    {error && (
                        <div className="p-4 rounded-lg flex items-center" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                            <AlertCircle className="w-5 h-5 mr-2" /> {error}
                        </div>
                    )}

                    {results && (results.error || results.ai_analysis?.error) && (
                        <div className="p-4 rounded-lg flex items-center mt-4" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                            <AlertCircle className="w-5 h-5 mr-2" /> Backend Error: {results.error || results.ai_analysis?.error}
                        </div>
                    )}
                </div>

                {results && (
                    <div className="mt-10 space-y-8">
                        <div className="p-6 rounded-lg" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                            <h2 className="text-xl font-bold mb-4" style={{ color: '#92400e' }}>Analysis Results</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="p-4 rounded-lg shadow-sm" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                                    <p className="text-sm mb-1" style={{ color: '#999' }}>ATS Score</p>
                                    <div className="text-4xl font-bold" style={{ color: '#d4a800' }}>
                                        {results.ai_analysis?.ats_score || results.static_analysis?.ats_score || 0}%
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg shadow-sm" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                                    <p className="text-sm mb-1" style={{ color: '#999' }}>Overall Quality</p>
                                    <div className="text-4xl font-bold" style={{ color: '#16a34a' }}>
                                        {results.ai_analysis?.resume_score || results.static_analysis?.section_score || 0}/100
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg shadow-sm" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                                    <p className="text-sm mb-1" style={{ color: '#999' }}>Missing Skills</p>
                                    <div className="text-2xl font-bold" style={{ color: '#ea580c' }}>
                                        {results.static_analysis?.keyword_match?.missing_skills?.length || 0} found
                                    </div>
                                </div>
                            </div>
                        </div>

                        {results.ai_analysis?.analysis && (
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold" style={{ color: '#111' }}>Detailed Feedback</h3>
                                <div className="p-6 rounded-lg whitespace-pre-line" style={{ background: '#fafafa', color: '#555', border: '1px solid #e5e5e5' }}>
                                    {results.ai_analysis.analysis}
                                </div>
                            </div>
                        )}

                        {results.static_analysis?.suggestions && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3" style={{ color: '#111' }}>Improvement Suggestions</h3>
                                <ul className="space-y-2">
                                    {results.static_analysis.suggestions.map((suggestion, idx) => (
                                        <li key={idx} className="flex items-start p-3 rounded-lg"
                                            style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" style={{ color: '#d4a800' }} />
                                            <span style={{ color: '#555' }}>{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeScore;
