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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.1:8b",  // Changed from "mistral" to correct model
          prompt: prompt,
          stream: false,
          format: "json",  // Request JSON format
          options: {
            temperature: 0.7,
            num_predict: 1024  // Enough tokens for 5 questions
          }
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

      // Parse the JSON response from Ollama
      try {
        // Try direct JSON parse first (since we requested JSON format)
        let parsedQuiz;
        try {
          parsedQuiz = JSON.parse(data.response);
        } catch {
          // Fallback: Extract JSON from the response text (removing any markdown)
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedQuiz = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("No valid JSON found in response");
          }
        }
        
        // Validate the response structure
        if (!parsedQuiz.questions || !Array.isArray(parsedQuiz.questions) || parsedQuiz.questions.length === 0) {
          throw new Error("Invalid quiz structure: missing or empty questions array");
        }
        
        if (!parsedQuiz.answer_key || typeof parsedQuiz.answer_key !== 'object') {
          throw new Error("Invalid quiz structure: missing or invalid answer_key");
        }
        
        // Transform the data to match frontend expectations
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
      
      // Provide specific error messages
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Cannot connect to Ollama. Please ensure:\n1. Ollama is installed\n2. Run 'ollama serve' in terminal\n3. Ollama is running at http://localhost:11434");
      } else {
        setError(err.message || "Error generating quiz. Check console for details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Transform backend data to frontend format
  const transformQuizData = (backendData) => {
    if (!backendData.questions || !backendData.answer_key) return backendData;
    
    const transformedQuestions = backendData.questions.map((question, index) => {
      // Extract just the answer letter (A, B, C, D) from answer_key
      const answerLetter = backendData.answer_key[question.id];
      
      // Find the full answer text that matches this letter
      const correctAnswer = question.answers.find(ans => 
        ans.startsWith(`${answerLetter})`)
      );
      
      return {
        ...question,
        options: question.answers, // Rename 'answers' to 'options'
        answer: correctAnswer || answerLetter // Store the full answer text or fallback to letter
      };
    });
    
    return {
      ...backendData,
      questions: transformedQuestions
    };
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const calculateScore = () => {
    if (!quizData || !quizData.questions) return 0;
    
    let score = 0;
    quizData.questions.forEach((question, index) => {
      // Compare the full answer text
      if (userAnswers[index] === question.answer) {
        score++;
      }
    });
    
    return score;
  };

  const resetQuiz = () => {
    setQuizData(null);
    setUserAnswers({});
    setShowResults(false);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowResults(false);
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const isAnswerCorrect = (questionIndex) => {
    return userAnswers[questionIndex] === quizData.questions[questionIndex].answer;
  };

  const getOptionStyle = (questionIndex, option, isResults) => {
    if (!isResults) {
      return userAnswers[questionIndex] === option 
        ? "bg-indigo-600 border-indigo-400 text-white"
        : "bg-gray-700 border-gray-600 hover:bg-gray-600";
    }

    // Results view
    const correctAnswer = quizData.questions[questionIndex].answer;
    
    if (option === correctAnswer) {
      return "bg-green-600 border-green-400 text-white";
    } else if (option === userAnswers[questionIndex] && option !== correctAnswer) {
      return "bg-red-600 border-red-400 text-white";
    } else {
      return "bg-gray-700 border-gray-600";
    }
  };

  // Extract just the letter (A, B, C, D) for display
  // const getAnswerLetter = (answerText) => {
  //   if (!answerText) return '';
  //   const match = answerText.match(/^([A-D])\)/);
  //   return match ? match[1] : answerText;
  // };

  return (
    <>
      
      <div
        className="min-h-screen bg-cover bg-center text-gray-100"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/12707786/pexels-photo-12707786.jpeg')" }}
      >
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2 text-center text-indigo-400 mt-[40px]">
            Quiz Generator
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Enter subject details to generate a customized quiz
          </p>

          {/* Input Form - unchanged */}
          <form
            onSubmit={handleSubmit}
            className="mb-12 bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Python, Mathematics, History"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Topic *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Strings, Algebra, World War II"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Difficulty Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="assessment">Assessment</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mt-4 flex items-center">
                <FiAlertCircle className="mr-2" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !subject.trim() || !topic.trim()}
              className={`w-full mt-6 py-3 px-6 rounded-lg font-medium flex items-center justify-center ${
                isLoading || !subject.trim() || !topic.trim()
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" /> Generating Quiz...
                </>
              ) : (
                <>
                  <FiSend className="mr-2" /> Generate Quiz
                </>
              )}
            </button>
          </form>

          {/* Example Inputs - unchanged */}
          {!quizData && (
            <div className="text-center mt-12">
              <p className="text-gray-500 mb-4">Try these examples:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setSubject("Python");
                    setTopic("Strings");
                    setLevel("easy");
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700"
                >
                  Python Strings
                </button>
                <button
                  onClick={() => {
                    setSubject("Mathematics");
                    setTopic("Algebra");
                    setLevel("medium");
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700"
                >
                  Math Algebra
                </button>
                <button
                  onClick={() => {
                    setSubject("History");
                    setTopic("World War II");
                    setLevel("hard");
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700"
                >
                  History WWII
                </button>
              </div>
            </div>
          )}

          {/* Quiz Modal */}
          {isModalOpen && quizData && (
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-700 shadow-2xl">
                {/* Modal Header */}
                <div className="border-b border-gray-700 p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-indigo-400">
                      {quizData.title || "Generated Quiz"}
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-white p-1 rounded-full"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <p className="text-gray-400 mt-1">
                    Subject: {subject} | Topic: {topic} | Level: {level}
                  </p>
                  {showResults && (
                    <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                      <p className="text-lg font-semibold">
                        Score: {calculateScore()} / {quizData.questions.length}
                      </p>
                      <p className="text-gray-300">
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
                      <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <h3 className="font-medium text-lg mb-3 text-gray-200">
                          Q{index + 1}: {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options && question.options.map((option, optIndex) => (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => !showResults && handleAnswerSelect(index, option)}
                              disabled={showResults}
                              className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                                getOptionStyle(index, option, showResults)
                              } ${!showResults ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                              <div className="flex items-center">
                                <span className="mr-3 font-medium">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span>{option}</span>
                                {showResults && option === quizData.questions[index].answer && (
                                  <FiCheck className="ml-auto text-green-300" size={20} />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        {showResults && (
                          <div className="mt-3 p-2 rounded-lg bg-gray-800">
                            <p className={`text-sm ${isAnswerCorrect(index) ? 'text-green-400' : 'text-red-400'}`}>
                              {isAnswerCorrect(index) ? '✓ Correct' : '✗ Incorrect'}
                            </p>
                            {!isAnswerCorrect(index) && (
                              <p className="text-gray-300 text-sm mt-1">
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
                <div className="border-t border-gray-700 p-4 bg-gray-800/50">
                  <div className="flex gap-3">
                    {!showResults ? (
                      <>
                        <button
                          onClick={submitQuiz}
                          disabled={Object.keys(userAnswers).length !== quizData.questions.length}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                            Object.keys(userAnswers).length === quizData.questions.length
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gray-700 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Submit Quiz ({Object.keys(userAnswers).length}/{quizData.questions.length})
                        </button>
                        <button
                          onClick={closeModal}
                          className="px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg font-medium"
                        >
                          Close
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={resetQuiz}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium"
                        >
                          Generate New Quiz
                        </button>
                        <button
                          onClick={closeModal}
                          className="px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg font-medium"
                        >
                          Close
                        </button>
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
