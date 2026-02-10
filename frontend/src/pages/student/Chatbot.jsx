import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiUser,
  FiMessageSquare,
  FiChevronDown,
  FiMic,
  FiUploadCloud,
  FiZap,
  FiClock,
} from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

/**
 * ChatbotWithVoiceControls + Ollama Local LLM
 * - Uses local Ollama API instead of Gemini
 * - Voice recognition with live transcription
 * - Text-to-speech output with pause/resume/stop
 * - File upload support
 * - Fully offline capable
 */

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "👋 Hello! I'm your intelligent AI assistant powered by local Ollama LLM. You can chat, speak, or upload files!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [voiceLevel, setVoiceLevel] = useState(0);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const audioStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    return () => {
      stopListening();
      stopAudioAnalyser();
      try {
        synthRef.current?.cancel();
      } catch (e) {}
    };
  }, [messages]);

  /** Audio analyser (microphone voice level) */
  const startAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        setVoiceLevel(Math.min(1, rms * 2));
        rafRef.current = requestAnimationFrame(update);
      };
      rafRef.current = requestAnimationFrame(update);
    } catch (err) {
      console.warn("Microphone access denied", err);
    }
  };

  const stopAudioAnalyser = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    try {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {}
    setVoiceLevel(0);
  };

  /** Speech Recognition */
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    startAudioAnalyser();
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      stopAudioAnalyser();
    };
    recognition.onerror = (err) => {
      console.error("Recognition error", err);
      setIsListening(false);
      stopAudioAnalyser();
    };

    recognition.onresult = (event) => {
      let interim = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (interim) setInputText(interim);
      if (finalTranscript) {
        setMessages((prev) => [...prev, { text: finalTranscript.trim(), sender: "user", timestamp: new Date() }]);
        setInputText("");
        handleAutoSend(finalTranscript.trim());
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
      setIsListening(false);
    } catch (e) {}
    stopAudioAnalyser();
  };

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  /** Send text to Ollama */
  const handleAutoSend = async (text) => {
    if (!text) return;
    setIsLoading(true);
    setIsTyping(true);
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.1:8b",
          prompt: text,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error("Ollama error");

      const data = await response.json();
      const botReply = data.response || "I couldn't understand that.";
      const reply = { text: botReply, sender: "bot", timestamp: new Date() };
      setMessages((prev) => [...prev, reply]);

      speakText(botReply);
    } catch (err) {
      console.error(err);
      const errorMsg = "❌ Ollama not running. Run 'ollama serve' first!";
      setMessages((prev) => [...prev, { text: errorMsg, sender: "bot", timestamp: new Date() }]);
      speakText(errorMsg);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  /** TTS Controls */
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    try {
      synthRef.current?.cancel();
    } catch (e) {}

    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1;
    utter.rate = 0.9;
    utter.volume = 1;
    utter.lang = "en-US";

    synthRef.current.speak(utter);
  };

  const ttsPause = () => {
    if (synthRef.current?.speaking && !synthRef.current?.paused) {
      synthRef.current.pause();
    }
  };

  const ttsResume = () => {
    if (synthRef.current?.paused) {
      synthRef.current.resume();
    }
  };

  const ttsStop = () => {
    synthRef.current?.cancel();
  };

  /** File Upload */
  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        const response = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama3.1:8b",
            prompt: `Analyze this file and summarize:\n\n${fileContent.substring(0, 2000)}`,
            stream: false,
          }),
        });

        if (!response.ok) throw new Error("Ollama error");

        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { text: `📂 ${file.name}:\n${data.response}`, sender: "bot", timestamp: new Date() },
        ]);
        speakText(`File ${file.name} uploaded and analyzed!`);
      };
      reader.readAsText(file);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ File upload failed. Ensure Ollama is running.", sender: "bot", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /** Chat Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.1:8b",
          prompt: userMessage.text,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error("Ollama error");

      const data = await response.json();
      const botReply = data.response || "I couldn't understand that.";
      const reply = { text: botReply, sender: "bot", timestamp: new Date() };
      setMessages((prev) => [...prev, reply]);

      speakText(botReply);
    } catch (err) {
      console.error(err);
      const errorMsg = "❌ Ollama not running. Run 'ollama serve' first!";
      setMessages((prev) => [...prev, { text: errorMsg, sender: "bot", timestamp: new Date() }]);
      speakText(errorMsg);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      

      {/* 🔥 NEW BACKGROUND IMAGE HERE */}
      <div
        className="min-h-screen bg-center bg-cover text-gray-100 relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://img.freepik.com/free-vector/abstract-banner-with-low-poly-plexus-network-communications-design_1048-12914.jpg?semt=ais_hybrid&w=740&q=80')",
        }}
      >
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8 mt-[50px]">
            <div className="inline-flex items-center space-x-3 bg-white-800/50 backdrop-blur-lg rounded-2xl px-6 py-4 border border-gray-700/50 shadow-xl">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <FiMessageSquare className="text-2xl text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Ollama Voice AI
                </h1>
                <p className="text-gray-300 text-sm">Local LLM • Talk, Type, Upload</p>
              </div>
            </div>
          </div>

          {/* CHAT CONTAINER */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 h-[70vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {isTyping && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>}
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <FiMessageSquare className="text-xl text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-white">Ollama Assistant</h2>
                  <p className="text-gray-400 text-sm">{isTyping ? "Typing..." : isListening ? "🎤 Listening" : "Ready"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={ttsPause} className="px-2 py-1 text-xs rounded bg-gray-700/50 hover:bg-gray-700 text-gray-300">Pause</button>
                <button onClick={ttsResume} className="px-2 py-1 text-xs rounded bg-gray-700/50 hover:bg-gray-700 text-gray-300">Resume</button>
                <button onClick={ttsStop} className="px-2 py-1 text-xs rounded bg-gray-700/50 hover:bg-gray-700 text-gray-300">Stop</button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div className={`max-w-3/4 rounded-3xl px-5 py-4 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-700 rounded-br-none"
                      : "bg-gray-700/80 rounded-bl-none border border-gray-600/30"
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${msg.sender === "user" ? "bg-indigo-500" : "bg-gray-600"}`}>
                        {msg.sender === "user" ? <FiUser className="text-white text-sm" /> : <FiMessageSquare className="text-white text-sm" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-100 whitespace-pre-wrap">{msg.text}</p>
                        <div className="text-xs text-gray-300 mt-1">
                          <FiClock className="inline text-xs mr-1" />
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-gray-700/80 rounded-3xl rounded-bl-none px-5 py-4 border border-gray-600/30">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-gray-700/50 bg-gray-800/40">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700/40 hover:bg-gray-700/60 rounded-2xl border border-gray-600/30 text-gray-300 cursor-pointer"
                >
                  <FiUploadCloud />
                  {uploadedFile ? uploadedFile.name : "Upload"}
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                  />
                </label>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type or speak..."
                    className="w-full bg-gray-700/50 border border-gray-600/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-8 bg-gray-600 rounded">
                    <div style={{ height: `${voiceLevel * 100}%` }} className="bg-indigo-400 w-full rounded-b"></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-4 rounded-2xl transition-all ${
                    isListening ? "bg-red-600 text-white scale-110 shadow-lg" : "bg-gray-700/50 hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  <FiMic />
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className={`p-4 rounded-2xl transition-all ${
                    isLoading || !inputText.trim()
                      ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-br from-indigo-600 to-purple-600 hover:scale-105 text-white shadow-lg"
                  }`}
                >
                  {isLoading ? <ImSpinner8 className="animate-spin" /> : <FiSend />}
                </button>
              </form>

              <div className="mt-2 text-xs text-gray-300">Voice: {voiceLevel.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.5);
            border-radius: 10px;
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Chatbot;

