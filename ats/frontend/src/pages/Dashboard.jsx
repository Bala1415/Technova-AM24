import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, FileText, PenTool, Search } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "Career Path",
            description: "Explore learning paths and practice skills.",
            icon: <BookOpen className="w-8 h-8 text-blue-500" />,
            action: () => navigate('/career-path'), 
            color: "bg-blue-50 hover:bg-blue-100"
        },
        {
            title: "Learn",
            description: "Explore new domains and learning paths.",
            icon: <BookOpen className="w-8 h-8 text-green-500" />,
            action: () => navigate('/learn'), // Assuming this route exists
            color: "bg-green-50 hover:bg-green-100"
        },
        {
            title: "Resume Analyzer",
            description: "AI-powered analysis of your resume.",
            icon: <Search className="w-8 h-8 text-purple-500" />,
            action: () => navigate('/resume-analyzer'),
            color: "bg-purple-50 hover:bg-purple-100"
        },
        {
            title: "Resume Builder",
            description: "Create a professional resume in minutes.",
            icon: <PenTool className="w-8 h-8 text-orange-500" />,
            action: () => navigate('/resume-builder'),
            color: "bg-orange-50 hover:bg-orange-100"
        }
    ];

    return (
        <div className="min-h-screen bg-custom p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome to Prodigy Pathways</h1>
                    <p className="text-gray-600 mt-2">Select a tool to get started with your career journey.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            onClick={feature.action}
                            className={`p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${feature.color}`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                                <div className="p-3 bg-white rounded-full shadow-sm">
                                    {feature.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
