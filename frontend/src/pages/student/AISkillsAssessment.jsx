import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AISkillsAssessment = () => {
  const [assessmentId, setAssessmentId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const userId = localStorage.getItem('userId') || '123';

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/skillAssessment/leaderboard');
      setLeaderboard(response.data.data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const startAssessment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/skillAssessment/start', {
        userId,
        assessmentType: 'prompt_engineering'
      });

      setAssessmentId(response.data.assessmentId);
      setQuestions(response.data.questions);
      setCurrentQuestion(0);
      setResults(null);
      toast.success('Assessment started!');
    } catch (error) {
      console.error('Error starting assessment:', error);
      toast.error('Failed to start assessment');
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!userPrompt.trim()) {
      toast.error('Please enter your prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/skillAssessment/submit', {
        assessmentId,
        questionId: questions[currentQuestion].id,
        userResponse: userPrompt
      });

      toast.success(`Score: ${response.data.data.score}/100`);
      
      if (response.data.data.completed) {
        setResults(response.data.data);
        fetchLeaderboard();
      } else {
        setCurrentQuestion(prev => prev + 1);
        setUserPrompt('');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (level) => {
    const colors = {
      platinum: 'from-gray-300 to-gray-500',
      gold: 'from-yellow-400 to-yellow-600',
      silver: 'from-gray-400 to-gray-600',
      bronze: 'from-orange-400 to-orange-600'
    };
    return colors[level] || 'from-gray-300 to-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Co-Pilot Skills Assessment
          </h1>
          <p className="text-gray-600">
            Test your prompt engineering and AI collaboration skills
          </p>
        </div>

        {/* Results View */}
        {results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white text-center">
              <h2 className="text-2xl font-semibold mb-4">Assessment Complete!</h2>
              <div className="text-7xl font-bold mb-4">{results.overallScore}</div>
              <p className="text-xl opacity-90">Overall Score</p>
            </div>

            {/* Badge */}
            {results.badge?.awarded && (
              <div className={`bg-gradient-to-r ${getBadgeColor(results.badge.level)} rounded-2xl shadow-xl p-8 text-white text-center`}>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold capitalize">{results.badge.level} Badge</h3>
                <p className="text-lg opacity-90 mt-2">Congratulations! You're certified!</p>
              </div>
            )}

            {/* Restart Button */}
            <button
              onClick={startAssessment}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Take Another Assessment
            </button>
          </motion.div>
        )}

        {/* Assessment View */}
        {!results && assessmentId && questions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">{questions[currentQuestion].text}</h3>
              <p className="text-gray-600 mb-4">
                Write the best prompt you can to accomplish this task. Your prompt will be evaluated on clarity, context, and effectiveness.
              </p>
            </div>

            {/* Prompt Input */}
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
            />

            {/* Submit Button */}
            <button
              onClick={submitResponse}
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Evaluating...' : 'Submit Prompt'}
            </button>
          </div>
        )}

        {/* Start Assessment */}
        {!assessmentId && !results && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">🤖</div>
            <h2 className="text-3xl font-bold mb-4">Ready to Test Your Skills?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              This assessment will test your ability to write effective prompts for AI systems. 
              You'll be evaluated on clarity, context awareness, and error detection.
            </p>
            <button
              onClick={startAssessment}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Assessment'}
            </button>
          </div>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">🏆 Leaderboard</h2>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-50' :
                    index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-50' :
                    index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-50' :
                    'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-400">#{entry.rank}</span>
                    <div>
                      <p className="font-semibold">{entry.user?.name || 'Anonymous'}</p>
                      {entry.badge?.awarded && (
                        <span className="text-xs text-gray-500 capitalize">
                          {entry.badge.level} Badge
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{entry.score}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AISkillsAssessment;
