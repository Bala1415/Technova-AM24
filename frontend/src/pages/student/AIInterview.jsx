import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiMic, FiSend, FiLoader, FiCheckCircle } from 'react-icons/fi';

const AIInterview = () => {
    const [jobRole, setJobRole] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userResponse, setUserResponse] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [interviewFinished, setInterviewFinished] = useState(false);

    const startInterview = async () => {
        if (!jobRole.trim()) return;
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/generate_interview_questions', {
                jobRole,
                difficulty: 'medium' // Hardcoded for now
            });
            if (response.data.questions && response.data.questions.length > 0) {
                setQuestions(response.data.questions);
                setInterviewStarted(true);
            } else {
                alert("Failed to generate questions. Please try another role.");
            }
        } catch (error) {
            console.error("Error starting interview:", error);
            alert("Error starting interview. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const submitResponse = async () => {
        if (!userResponse.trim()) return;
        setLoading(true);
        try {
            const currentQ = questions[currentQuestionIndex].question;
            const res = await axios.post('http://localhost:8000/evaluate_interview_response', {
                question: currentQ,
                response: userResponse
            });

            setFeedback(res.data);
        } catch (error) {
            console.error("Error evaluating response:", error);
            alert("Error evaluating response.");
        } finally {
            setLoading(false);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setUserResponse('');
            setFeedback(null);
        } else {
            setInterviewFinished(true);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 text-gray-900">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-[#d4a800] tracking-tight sm:text-5xl">
                        AI Interview Practice
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Hone your interview skills with real-time AI feedback.
                    </p>
                </div>

                {!interviewStarted && !interviewFinished && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden p-8"
                    >
                        <h2 className="text-2xl font-bold mb-6">Setup Your Mock Interview</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Job Role</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Frontend Developer, Data Scientist"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-[#f5c518] focus:border-[#f5c518]"
                                />
                            </div>
                            <button
                                onClick={startInterview}
                                disabled={loading || !jobRole}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#f5c518] hover:bg-[#d4a800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f5c518] transition-colors disabled:opacity-50"
                            >
                                {loading ? <FiLoader className="animate-spin text-xl" /> : 'Start Interview'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {interviewStarted && !interviewFinished && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden p-8"
                    >
                        <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
                            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                            <span className="capitalize px-3 py-1 bg-gray-100 rounded-full">{questions[currentQuestionIndex].type} Question</span>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800">
                                "{questions[currentQuestionIndex].question}"
                            </h3>
                        </div>

                        {!feedback ? (
                            <div className="space-y-4">
                                <textarea
                                    rows="6"
                                    placeholder="Type your answer here..."
                                    value={userResponse}
                                    onChange={(e) => setUserResponse(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:ring-[#f5c518] focus:border-[#f5c518]"
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={submitResponse}
                                        disabled={loading || !userResponse}
                                        className="flex items-center space-x-2 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#f5c518] hover:bg-[#d4a800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f5c518] transition-colors disabled:opacity-50"
                                    >
                                        {loading ? <FiLoader className="animate-spin text-lg" /> : <><FiSend /> <span>Submit Answer</span></>}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-700 mb-2">Your Answer:</h4>
                                    <p className="text-gray-600 italic whitespace-pre-wrap">{userResponse}</p>
                                </div>

                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <FiCheckCircle className="text-green-600 text-xl" />
                                        <h4 className="font-semibold text-green-800 text-lg">AI Feedback</h4>
                                        <span className="ml-auto bg-green-200 text-green-800 py-1 px-3 rounded-full text-sm font-bold">
                                            Score: {feedback.score}/100
                                        </span>
                                    </div>
                                    <div className="prose prose-green max-w-none text-green-900 leading-relaxed">
                                        {feedback.feedback}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={nextQuestion}
                                        className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                                    >
                                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {interviewFinished && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden p-12 text-center"
                    >
                        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <FiCheckCircle className="text-green-600 text-5xl" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Interview Complete!</h2>
                        <p className="text-gray-600 mb-8 text-lg">Great job. Reviewing your feedback and practicing regularly is the key to success.</p>
                        <button
                            onClick={() => {
                                setInterviewStarted(false);
                                setInterviewFinished(false);
                                setJobRole('');
                                setQuestions([]);
                                setCurrentQuestionIndex(0);
                                setUserResponse('');
                                setFeedback(null);
                            }}
                            className="py-3 px-8 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-[#f5c518] hover:bg-[#d4a800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f5c518] transition-colors"
                        >
                            Start New Interview
                        </button>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default AIInterview;
