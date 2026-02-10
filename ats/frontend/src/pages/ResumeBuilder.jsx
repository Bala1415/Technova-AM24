import React, { useState } from 'react';
import axios from 'axios';
import { Save, Plus, Trash2, Download } from 'lucide-react';

const ResumeBuilder = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        template: 'Modern',
        personal_info: { full_name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', title: '' },
        summary: '',
        experience: [],
        education: [],
        skills: { technical: [], soft: [], languages: [], tools: [] },
        projects: []
    });

    const handleInputChange = (section, field, value) => {
        if (section === 'personal_info') {
            setFormData({ ...formData, personal_info: { ...formData.personal_info, [field]: value } });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    };

    const addArrayItem = (section) => {
        const newItem = section === 'experience' 
            ? { company: '', position: '', start_date: '', end_date: '', description: '', responsibilities: [] }
            : section === 'education' 
            ? { school: '', degree: '', field: '', graduation_date: '', gpa: '' }
            : { name: '', technologies: '', description: '', link: '' }; // Project

        setFormData({ ...formData, [section]: [...formData[section], newItem] });
    };

    const updateArrayItem = (section, index, field, value) => {
        const newArray = [...formData[section]];
        newArray[index][field] = value;
        setFormData({ ...formData, [section]: newArray });
    };

    const removeArrayItem = (section, index) => {
        const newArray = formData[section].filter((_, i) => i !== index);
        setFormData({ ...formData, [section]: newArray });
    };
    
    // Skills Helper
    const handleSkillChange = (category, value) => {
        // Split by comma
        const skillsArray = value.split(',').map(s => s.trim());
        setFormData({
            ...formData,
            skills: { ...formData.skills, [category]: skillsArray }
        });
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/generate-resume', formData, {
                responseType: 'blob', // Important for file download
            });
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${formData.personal_info.full_name.replace(' ', '_')}_Resume.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error generating resume:", error);
            alert("Failed to generate resume.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Stepper Header */}
                <div className="flex border-b bg-gray-50">
                    {['Personal Results', 'Experience', 'Education & Skills', 'Download'].map((label, idx) => (
                        <div 
                            key={idx}
                            className={`flex-1 py-4 text-center text-sm font-semibold cursor-pointer ${step === idx + 1 ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500'}`}
                            onClick={() => setStep(idx + 1)}
                        >
                            {idx + 1}. {label}
                        </div>
                    ))}
                </div>

                <div className="p-8">
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Personal Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input className="p-2 border rounded" placeholder="Full Name" value={formData.personal_info.full_name} onChange={e => handleInputChange('personal_info', 'full_name', e.target.value)} />
                                <input className="p-2 border rounded" placeholder="Job Title" value={formData.personal_info.title} onChange={e => handleInputChange('personal_info', 'title', e.target.value)} />
                                <input className="p-2 border rounded" placeholder="Email" value={formData.personal_info.email} onChange={e => handleInputChange('personal_info', 'email', e.target.value)} />
                                <input className="p-2 border rounded" placeholder="Phone" value={formData.personal_info.phone} onChange={e => handleInputChange('personal_info', 'phone', e.target.value)} />
                                <input className="p-2 border rounded" placeholder="Location" value={formData.personal_info.location} onChange={e => handleInputChange('personal_info', 'location', e.target.value)} />
                                <input className="p-2 border rounded" placeholder="LinkedIn URL" value={formData.personal_info.linkedin} onChange={e => handleInputChange('personal_info', 'linkedin', e.target.value)} />
                                <input className="p-2 border rounded" placeholder="Portfolio URL" value={formData.personal_info.portfolio} onChange={e => handleInputChange('personal_info', 'portfolio', e.target.value)} />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Professional Summary</h3>
                                <textarea className="w-full p-2 border rounded h-32" placeholder="Write a brief professional summary..." value={formData.summary} onChange={e => handleInputChange('root', 'summary', e.target.value)} />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Experience */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Work Experience</h2>
                                <button onClick={() => addArrayItem('experience')} className="flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                                    <Plus className="w-4 h-4 mr-1" /> Add Job
                                </button>
                            </div>
                            
                            {formData.experience.map((exp, idx) => (
                                <div key={idx} className="p-4 border rounded-lg bg-gray-50 relative">
                                    <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <input className="p-2 border rounded" placeholder="Company" value={exp.company} onChange={e => updateArrayItem('experience', idx, 'company', e.target.value)} />
                                        <input className="p-2 border rounded" placeholder="Position" value={exp.position} onChange={e => updateArrayItem('experience', idx, 'position', e.target.value)} />
                                        <input className="p-2 border rounded" placeholder="Start Date" value={exp.start_date} onChange={e => updateArrayItem('experience', idx, 'start_date', e.target.value)} />
                                        <input className="p-2 border rounded" placeholder="End Date" value={exp.end_date} onChange={e => updateArrayItem('experience', idx, 'end_date', e.target.value)} />
                                    </div>
                                    <textarea className="w-full p-2 border rounded mb-2" placeholder="Description" value={exp.description} onChange={e => updateArrayItem('experience', idx, 'description', e.target.value)} />
                                    <textarea 
                                        className="w-full p-2 border rounded" 
                                        placeholder="Responsibilities (one per line)" 
                                        value={Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : exp.responsibilities} 
                                        onChange={e => updateArrayItem('experience', idx, 'responsibilities', e.target.value.split('\n'))} 
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Education & Skills */}
                    {step === 3 && (
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Education</h2>
                                    <button onClick={() => addArrayItem('education')} className="flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                                        <Plus className="w-4 h-4 mr-1" /> Add Education
                                    </button>
                                </div>
                                {formData.education.map((edu, idx) => (
                                    <div key={idx} className="p-4 border rounded-lg bg-gray-50 mb-4 relative">
                                        <button onClick={() => removeArrayItem('education', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input className="p-2 border rounded" placeholder="School/University" value={edu.school} onChange={e => updateArrayItem('education', idx, 'school', e.target.value)} />
                                            <input className="p-2 border rounded" placeholder="Degree" value={edu.degree} onChange={e => updateArrayItem('education', idx, 'degree', e.target.value)} />
                                            <input className="p-2 border rounded" placeholder="Field of Study" value={edu.field} onChange={e => updateArrayItem('education', idx, 'field', e.target.value)} />
                                            <input className="p-2 border rounded" placeholder="Graduation Year" value={edu.graduation_date} onChange={e => updateArrayItem('education', idx, 'graduation_date', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-4">Skills (Comma Separated)</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Technical Skills</label>
                                        <input className="w-full p-2 border rounded" placeholder="React, Python, SQL..." onChange={e => handleSkillChange('technical', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Soft Skills</label>
                                        <input className="w-full p-2 border rounded" placeholder="Leadership, Communication..." onChange={e => handleSkillChange('soft', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tools</label>
                                        <input className="w-full p-2 border rounded" placeholder="VS Code, Jira, Git..." onChange={e => handleSkillChange('tools', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Download */}
                    {step === 4 && (
                        <div className="text-center py-10">
                            <h2 className="text-2xl font-bold mb-6">Select a Template</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {['Modern', 'Professional', 'Minimal', 'Creative'].map(t => (
                                    <div 
                                        key={t}
                                        onClick={() => handleInputChange('root', 'template', t)}
                                        className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.template === t ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="h-20 bg-gray-200 rounded mb-2"></div>
                                        <p className="font-semibold">{t}</p>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={loading}
                                className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center mx-auto"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />}
                                Generate Resume
                            </button>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-4 border-t">
                        <button 
                            onClick={() => setStep(Math.max(1, step - 1))}
                            disabled={step === 1}
                            className={`px-6 py-2 rounded-lg font-medium ${step === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            Back
                        </button>
                        {step < 4 && (
                            <button 
                                onClick={() => setStep(Math.min(4, step + 1))}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
                            >
                                Next Step
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
