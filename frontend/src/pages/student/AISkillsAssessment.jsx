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

  useEffect(() => { fetchLeaderboard(); }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/skillAssessment/leaderboard');
      setLeaderboard(response.data.data || []);
    } catch (error) { console.error('Error fetching leaderboard:', error); }
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
    } catch (error) { console.error('Error starting assessment:', error); toast.error('Failed to start assessment'); }
    finally { setLoading(false); }
  };

  const submitResponse = async () => {
    if (!userPrompt.trim()) { toast.error('Please enter your prompt'); return; }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/skillAssessment/submit', {
        assessmentId,
        questionId: questions[currentQuestion].id,
        userResponse: userPrompt
      });
      toast.success(`Score: ${response.data.data.score}/100`);
      if (response.data.data.completed) { setResults(response.data.data); fetchLeaderboard(); }
      else { setCurrentQuestion(prev => prev + 1); setUserPrompt(''); }
    } catch (error) { console.error('Error submitting response:', error); toast.error('Failed to submit response'); }
    finally { setLoading(false); }
  };

  const getBadgeStyle = (level) => {
    const styles = {
      platinum: { background: 'linear-gradient(135deg, #c0c0c0, #e5e5e5)', color: '#333' },
      gold: { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' },
      silver: { background: 'linear-gradient(135deg, #a0a0a0, #c0c0c0)', color: '#111' },
      bronze: { background: 'linear-gradient(135deg, #cd7f32, #a0622e)', color: '#fff' }
    };
    return styles[level] || styles.gold;
  };

  return (
    <div className="min-h-screen p-8" style={{ background: '#ffffff' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-[50px]">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#111' }}>
            AI Co-Pilot <span style={{ color: '#d4a800' }}>Skills Assessment</span>
          </h1>
          <p style={{ color: '#666' }}>Test your prompt engineering and AI collaboration skills</p>
        </div>

        {/* Results View */}
        {results && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="rounded-2xl shadow-sm p-8 text-center"
              style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
              <h2 className="text-2xl font-semibold mb-4">Assessment Complete!</h2>
              <div className="text-7xl font-bold mb-4">{results.overallScore}</div>
              <p className="text-xl" style={{ opacity: 0.8 }}>Overall Score</p>
            </div>

            {results.badge?.awarded && (
              <div className="rounded-2xl shadow-sm p-8 text-center" style={getBadgeStyle(results.badge.level)}>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold capitalize">{results.badge.level} Badge</h3>
                <p className="text-lg mt-2" style={{ opacity: 0.9 }}>Congratulations! You're certified!</p>
              </div>
            )}

            <button onClick={startAssessment}
              className="w-full py-4 rounded-lg font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
              Take Another Assessment
            </button>
          </motion.div>
        )}

        {/* Assessment View */}
        {!results && assessmentId && questions.length > 0 && (
          <div className="rounded-2xl shadow-sm p-8" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2" style={{ color: '#666' }}>
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="rounded-full h-2" style={{ background: '#f5f5f5' }}>
                <div className="h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #f5c518, #d4a800)' }} />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#111' }}>{questions[currentQuestion].text}</h3>
              <p className="mb-4" style={{ color: '#666' }}>
                Write the best prompt you can to accomplish this task. Your prompt will be evaluated on clarity, context, and effectiveness.
              </p>
            </div>

            <textarea value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full h-48 p-4 rounded-lg transition-all resize-none focus:outline-none"
              style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
              onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
            />

            <button onClick={submitResponse} disabled={loading}
              className="mt-6 w-full py-4 rounded-lg font-semibold transition-all"
              style={loading
                ? { background: '#f5f5f5', color: '#999', cursor: 'not-allowed' }
                : { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
              {loading ? 'Evaluating...' : 'Submit Prompt'}
            </button>
          </div>
        )}

        {/* Start Assessment */}
        {!assessmentId && !results && (
          <div className="rounded-2xl shadow-sm p-8 text-center" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            <div className="text-6xl mb-6">🤖</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#111' }}>Ready to Test Your Skills?</h2>
            <p className="mb-8 max-w-2xl mx-auto" style={{ color: '#666' }}>
              This assessment will test your ability to write effective prompts for AI systems. 
              You'll be evaluated on clarity, context awareness, and error detection.
            </p>
            <button onClick={startAssessment} disabled={loading}
              className="px-12 py-4 rounded-lg font-semibold text-lg transition-all"
              style={loading
                ? { background: '#f5f5f5', color: '#999', cursor: 'not-allowed' }
                : { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
              {loading ? 'Starting...' : 'Start Assessment'}
            </button>
          </div>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="mt-8 rounded-2xl shadow-sm p-8" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#111' }}>🏆 Leaderboard</h2>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div key={entry.rank}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={
                    index === 0 ? { background: '#fffbeb', border: '1px solid #fde68a' } :
                    index === 1 ? { background: '#fafafa', border: '1px solid #e5e5e5' } :
                    index === 2 ? { background: '#fff7ed', border: '1px solid #fed7aa' } :
                    { background: '#fafafa', border: '1px solid #e5e5e5' }
                  }>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold" style={{ color: '#ccc' }}>#{entry.rank}</span>
                    <div>
                      <p className="font-semibold" style={{ color: '#111' }}>{entry.user?.name || 'Anonymous'}</p>
                      {entry.badge?.awarded && (
                        <span className="text-xs capitalize" style={{ color: '#999' }}>{entry.badge.level} Badge</span>
                      )}
                    </div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#d4a800' }}>{entry.score}</div>
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
