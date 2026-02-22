import React, { useState } from "react";
import { FiSend, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const QuizPage = () => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("easy");
  const [contentType, setContentType] = useState("quiz");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      setError("Please enter both subject and topic");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuizData(null);
    setUserAnswers({});
    setShowResults(false);

    try {
      const prompt = `Generate a ${level} difficulty ${contentType} with 5 multiple choice questions about "${topic}" in the subject of "${subject}". 
      
      Return ONLY valid JSON (no markdown, no code blocks, no explanations) with this exact format:
      {
        "title": "Quiz Title",
        "questions": [
          {
            "id": "q1",
            "question": "Question text?",
            "answers": ["A) Answer 1", "B) Answer 2", "C) Answer 3", "D) Answer 4"]
          }
        ],
        "answer_key": {
          "q1": "A"
        }
      }`;

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.1:8b",
          prompt: prompt,
          stream: false,
          format: "json",
          options: { temperature: 0.7, num_predict: 1024 }
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Ollama model 'llama3.1:8b' not found. Please run: ollama pull llama3.1:8b");
        }
        throw new Error(`Ollama error (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error("Empty response from Ollama");
      }

      try {
        let parsedQuiz;
        try {
          parsedQuiz = JSON.parse(data.response);
        } catch {
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedQuiz = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("No valid JSON found in response");
          }
        }
        
        if (!parsedQuiz.questions || !Array.isArray(parsedQuiz.questions) || parsedQuiz.questions.length === 0) {
          throw new Error("Invalid quiz structure: missing or empty questions array");
        }
        
        if (!parsedQuiz.answer_key || typeof parsedQuiz.answer_key !== 'object') {
          throw new Error("Invalid quiz structure: missing or invalid answer_key");
        }
        
        const transformedQuiz = transformQuizData(parsedQuiz);
        setQuizData(transformedQuiz);
        setIsModalOpen(true);
      } catch (parseError) {
        console.error("Error parsing quiz data:", parseError);
        console.error("Raw response:", data.response);
        throw new Error(`Failed to parse quiz: ${parseError.message}`);
      }
    } catch (err) {
      console.error("Quiz generation error:", err);
      
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Cannot connect to Ollama. Please ensure:\n1. Ollama is installed\n2. Run 'ollama serve' in terminal\n3. Ollama is running at http://localhost:11434");
      } else {
        setError(err.message || "Error generating quiz. Check console for details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const transformQuizData = (backendData) => {
    if (!backendData.questions || !backendData.answer_key) return backendData;
    
    const transformedQuestions = backendData.questions.map((question) => {
      const answerLetter = backendData.answer_key[question.id];
      const correctAnswer = question.answers.find(ans => ans.startsWith(`${answerLetter})`));
      
      return {
        ...question,
        options: question.answers,
        answer: correctAnswer || answerLetter
      };
    });
    
    return { ...backendData, questions: transformedQuestions };
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: selectedOption }));
  };

  const calculateScore = () => {
    if (!quizData || !quizData.questions) return 0;
    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) score++;
    });
    return score;
  };

  const resetQuiz = () => { setQuizData(null); setUserAnswers({}); setShowResults(false); setIsModalOpen(false); };
  const closeModal = () => { setIsModalOpen(false); setShowResults(false); };
  const submitQuiz = () => { setShowResults(true); };
  const isAnswerCorrect = (questionIndex) => userAnswers[questionIndex] === quizData.questions[questionIndex].answer;

  const getOptionStyle = (questionIndex, option, isResults) => {
    if (!isResults) {
      return userAnswers[questionIndex] === option
        ? { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a', borderColor: '#d4a800' }
        : { background: '#fafafa', borderColor: '#e5e5e5', color: '#333' };
    }
    const correctAnswer = quizData.questions[questionIndex].answer;
    if (option === correctAnswer) {
      return { background: '#dcfce7', borderColor: '#16a34a', color: '#166534' };
    } else if (option === userAnswers[questionIndex] && option !== correctAnswer) {
      return { background: '#fef2f2', borderColor: '#dc2626', color: '#991b1b' };
    } else {
      return { background: '#fafafa', borderColor: '#e5e5e5', color: '#555' };
    }
  };

  return (
    <>
      <div className="min-h-screen" style={{ background: '#ffffff' }}>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2 text-center mt-[40px]" style={{ color: '#111' }}>
            Quiz <span style={{ color: '#d4a800' }}>Generator</span>
          </h1>
          <p className="text-center mb-8" style={{ color: '#666' }}>
            Enter subject details to generate a customized quiz
          </p>

          <form onSubmit={handleSubmit} className="mb-12 rounded-xl p-6" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium" style={{ color: '#333' }}>Subject *</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Python, Mathematics, History"
                  className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                  onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
                  disabled={isLoading} />
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: '#333' }}>Topic *</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Strings, Algebra, World War II"
                  className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                  onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
                  disabled={isLoading} />
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: '#333' }}>Difficulty Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                  onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
                  disabled={isLoading}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium" style={{ color: '#333' }}>Content Type</label>
                <select value={contentType} onChange={(e) => setContentType(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 focus:outline-none transition-all"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                  onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
                  disabled={isLoading}>
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="assessment">Assessment</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg mt-4 flex items-center" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                <FiAlertCircle className="mr-2" /> {error}
              </div>
            )}

            <button type="submit" disabled={isLoading || !subject.trim() || !topic.trim()}
              className="w-full mt-6 py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all"
              style={isLoading || !subject.trim() || !topic.trim()
                ? { background: '#f5f5f5', color: '#999', cursor: 'not-allowed' }
                : { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a', fontWeight: 'bold' }
              }>
              {isLoading ? (<><ImSpinner8 className="animate-spin mr-2" /> Generating Quiz...</>) : (<><FiSend className="mr-2" /> Generate Quiz</>)}
            </button>
          </form>

          {!quizData && (
            <div className="text-center mt-12">
              <p className="mb-4" style={{ color: '#999' }}>Try these examples:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => { setSubject("Python"); setTopic("Strings"); setLevel("easy"); }}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: '#fff', border: '1px solid #e5e5e5', color: '#333' }}>Python Strings</button>
                <button onClick={() => { setSubject("Mathematics"); setTopic("Algebra"); setLevel("medium"); }}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: '#fff', border: '1px solid #e5e5e5', color: '#333' }}>Math Algebra</button>
                <button onClick={() => { setSubject("History"); setTopic("World War II"); setLevel("hard"); }}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: '#fff', border: '1px solid #e5e5e5', color: '#333' }}>History WWII</button>
              </div>
            </div>
          )}

          {/* Quiz Modal */}
          {isModalOpen && quizData && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
              <div className="rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
                style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                {/* Modal Header */}
                <div className="p-6" style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold" style={{ color: '#d4a800' }}>
                      {quizData.title || "Generated Quiz"}
                    </h2>
                    <button onClick={closeModal} className="p-1 rounded-full" style={{ color: '#999' }}>
                      <FiX size={24} />
                    </button>
                  </div>
                  <p className="mt-1" style={{ color: '#666' }}>
                    Subject: {subject} | Topic: {topic} | Level: {level}
                  </p>
                  {showResults && (
                    <div className="mt-2 p-3 rounded-lg" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                      <p className="text-lg font-semibold" style={{ color: '#111' }}>
                        Score: {calculateScore()} / {quizData.questions.length}
                      </p>
                      <p style={{ color: '#555' }}>
                        {calculateScore() >= quizData.questions.length * 0.7
                          ? "🎉 Excellent work!"
                          : "💪 Keep practicing!"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="space-y-6">
                    {quizData.questions.map((question, index) => (
                      <div key={index} className="rounded-lg p-4" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                        <h3 className="font-medium text-lg mb-3" style={{ color: '#111' }}>
                          Q{index + 1}: {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options && question.options.map((option, optIndex) => (
                            <button key={optIndex} type="button"
                              onClick={() => !showResults && handleAnswerSelect(index, option)}
                              disabled={showResults}
                              className="w-full text-left p-3 rounded-lg border-2 transition-all duration-200"
                              style={getOptionStyle(index, option, showResults)}>
                              <div className="flex items-center">
                                <span className="mr-3 font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                                <span>{option}</span>
                                {showResults && option === quizData.questions[index].answer && (
                                  <FiCheck className="ml-auto" size={20} style={{ color: '#16a34a' }} />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        {showResults && (
                          <div className="mt-3 p-2 rounded-lg" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
                            <p className="text-sm" style={{ color: isAnswerCorrect(index) ? '#16a34a' : '#dc2626' }}>
                              {isAnswerCorrect(index) ? '✓ Correct' : '✗ Incorrect'}
                            </p>
                            {!isAnswerCorrect(index) && (
                              <p className="text-sm mt-1" style={{ color: '#555' }}>
                                Correct answer: {question.answer}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4" style={{ borderTop: '1px solid #e5e5e5', background: '#fafafa' }}>
                  <div className="flex gap-3">
                    {!showResults ? (
                      <>
                        <button onClick={submitQuiz}
                          disabled={Object.keys(userAnswers).length !== quizData.questions.length}
                          className="flex-1 py-3 px-4 rounded-lg font-medium transition-all"
                          style={Object.keys(userAnswers).length === quizData.questions.length
                            ? { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }
                            : { background: '#f5f5f5', color: '#999', cursor: 'not-allowed' }
                          }>
                          Submit Quiz ({Object.keys(userAnswers).length}/{quizData.questions.length})
                        </button>
                        <button onClick={closeModal} className="px-6 py-3 rounded-lg font-medium transition-colors"
                          style={{ border: '1px solid #e5e5e5', color: '#555' }}>Close</button>
                      </>
                    ) : (
                      <>
                        <button onClick={resetQuiz} className="flex-1 py-3 px-4 rounded-lg font-medium transition-all"
                          style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
                          Generate New Quiz
                        </button>
                        <button onClick={closeModal} className="px-6 py-3 rounded-lg font-medium transition-colors"
                          style={{ border: '1px solid #e5e5e5', color: '#555' }}>Close</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizPage;
