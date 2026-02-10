import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [jobRole, setJobRole] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError("Please upload a file first.");
            return;
        }

        setAnalyzing(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_role', jobRole);

        try {
            // Assuming Python API is running on localhost:8000
            const response = await axios.post('http://localhost:8000/analyze-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResults(response.data);
        } catch (err) {
            console.error(err);
            setError("Analysis failed. Ensure the backend is running.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
                <header className="mb-8 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">AI Resume Analyzer</h1>
                    <p className="text-gray-600">Upload your resume to get instant feedback and ATS scoring.</p>
                </header>

                <div className="space-y-6">
                    {/* Input Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Target Job Role</label>
                            <input 
                                type="text"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Full Stack Developer"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF/DOCX)</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">PDF or DOCX (MAX. 5MB)</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                                </label>
                            </div>
                            {file && <p className="text-sm text-green-600 mt-2 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Selected: {file.name}</p>}
                        </div>
                    </div>

                    <button 
                        onClick={handleAnalyze} 
                        disabled={analyzing || !file}
                        className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${analyzing || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {analyzing ? <span className="flex items-center justify-center"><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Analyzing...</span> : 'Analyze Resume'}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {results && (
                    <div className="mt-10 space-y-8 animate-fade-in">
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <h2 className="text-xl font-bold text-blue-900 mb-4">Analysis Results</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                {/* ATS Score Card */}
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-500 text-sm mb-1">ATS Score</p>
                                    <div className="text-4xl font-bold text-blue-600">
                                        {results.ai_analysis?.ats_score || results.static_analysis?.ats_score || 0}%
                                    </div>
                                </div>
                                
                                {/* Resume Score Card */}
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-500 text-sm mb-1">Overall Quality</p>
                                    <div className="text-4xl font-bold text-green-600">
                                        {results.ai_analysis?.resume_score || results.static_analysis?.section_score || 0}/100
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-500 text-sm mb-1">Missing Skills</p>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {results.static_analysis?.keyword_match?.missing_skills?.length || 0} found
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Feedback */}
                        {results.ai_analysis?.analysis && (
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold text-gray-800">Detailed Feedback</h3>
                                <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-line text-gray-700">
                                    {results.ai_analysis.analysis}
                                </div>
                            </div>
                        )}
                        
                        {/* Static Suggestions */}
                        {results.static_analysis?.suggestions && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Improvement Suggestions</h3>
                                <ul className="space-y-2">
                                    {results.static_analysis.suggestions.map((suggestion, idx) => (
                                        <li key={idx} className="flex items-start bg-orange-50 p-3 rounded-lg">
                                            <AlertCircle className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{suggestion}</span>
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

export default ResumeAnalyzer;
