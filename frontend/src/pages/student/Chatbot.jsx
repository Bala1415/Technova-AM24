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
      try { synthRef.current?.cancel(); } catch (e) {}
    };
  }, [messages]);

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
        for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / data.length);
        setVoiceLevel(Math.min(1, rms * 2));
        rafRef.current = requestAnimationFrame(update);
      };
      rafRef.current = requestAnimationFrame(update);
    } catch (err) { console.warn("Microphone access denied", err); }
  };

  const stopAudioAnalyser = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    try { if (audioStreamRef.current) audioStreamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {}
    setVoiceLevel(0);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition not supported"); return; }
    startAudioAnalyser();
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => { setIsListening(false); stopAudioAnalyser(); };
    recognition.onerror = (err) => { console.error("Recognition error", err); setIsListening(false); stopAudioAnalyser(); };
    recognition.onresult = (event) => {
      let interim = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
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
    try { recognitionRef.current?.stop(); setIsListening(false); } catch (e) {}
    stopAudioAnalyser();
  };

  const toggleListening = () => { if (isListening) stopListening(); else startListening(); };

  const handleAutoSend = async (text) => {
    if (!text) return;
    setIsLoading(true);
    setIsTyping(true);
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3.2:3b", prompt: text, stream: false }),
      });
      if (!response.ok) throw new Error("Ollama error");
      const data = await response.json();
      const botReply = data.response || "I couldn't understand that.";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot", timestamp: new Date() }]);
      speakText(botReply);
    } catch (err) {
      console.error(err);
      const errorMsg = "❌ Ollama not running. Run 'ollama serve' first!";
      setMessages((prev) => [...prev, { text: errorMsg, sender: "bot", timestamp: new Date() }]);
      speakText(errorMsg);
    } finally { setIsLoading(false); setIsTyping(false); }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    try { synthRef.current?.cancel(); } catch (e) {}
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1; utter.rate = 0.9; utter.volume = 1; utter.lang = "en-US";
    synthRef.current.speak(utter);
  };

  const ttsPause = () => { if (synthRef.current?.speaking && !synthRef.current?.paused) synthRef.current.pause(); };
  const ttsResume = () => { if (synthRef.current?.paused) synthRef.current.resume(); };
  const ttsStop = () => { synthRef.current?.cancel(); };

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
          body: JSON.stringify({ model: "llama3.2:3b", prompt: `Analyze this file and summarize:\n\n${fileContent.substring(0, 2000)}`, stream: false }),
        });
        if (!response.ok) throw new Error("Ollama error");
        const data = await response.json();
        setMessages((prev) => [...prev, { text: `📂 ${file.name}:\n${data.response}`, sender: "bot", timestamp: new Date() }]);
        speakText(`File ${file.name} uploaded and analyzed!`);
      };
      reader.readAsText(file);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "⚠️ File upload failed. Ensure Ollama is running.", sender: "bot", timestamp: new Date() }]);
    } finally { setIsLoading(false); }
  };

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
        body: JSON.stringify({ model: "llama3.2:3b", prompt: userMessage.text, stream: false }),
      });
      if (!response.ok) throw new Error("Ollama error");
      const data = await response.json();
      const botReply = data.response || "I couldn't understand that.";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot", timestamp: new Date() }]);
      speakText(botReply);
    } catch (err) {
      console.error(err);
      const errorMsg = "❌ Ollama not running. Run 'ollama serve' first!";
      setMessages((prev) => [...prev, { text: errorMsg, sender: "bot", timestamp: new Date() }]);
      speakText(errorMsg);
    } finally { setIsLoading(false); setIsTyping(false); }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <div className="min-h-screen relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8 mt-[50px]">
            <div className="inline-flex items-center space-x-3 rounded-2xl px-6 py-4"
              style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
              <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)' }}>
                <FiMessageSquare className="text-2xl" style={{ color: '#0a0a0a' }} />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold" style={{ color: '#111' }}>
                  Ollama Voice AI
                </h1>
                <p className="text-sm" style={{ color: '#999' }}>Local LLM • Talk, Type, Upload</p>
              </div>
            </div>
          </div>

          {/* CHAT CONTAINER */}
          <div className="rounded-3xl shadow-lg h-[70vh] flex flex-col"
            style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
            {/* Header */}
            <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid #e5e5e5' }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  {isTyping && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" style={{ background: '#f5c518' }}></span>}
                  <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)' }}>
                    <FiMessageSquare className="text-xl" style={{ color: '#0a0a0a' }} />
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold" style={{ color: '#111' }}>Ollama Assistant</h2>
                  <p className="text-sm" style={{ color: '#999' }}>{isTyping ? "Typing..." : isListening ? "🎤 Listening" : "Ready"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={ttsPause} className="px-2 py-1 text-xs rounded transition-colors"
                  style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5' }}>Pause</button>
                <button onClick={ttsResume} className="px-2 py-1 text-xs rounded transition-colors"
                  style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5' }}>Resume</button>
                <button onClick={ttsStop} className="px-2 py-1 text-xs rounded transition-colors"
                  style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5' }}>Stop</button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6" style={{ background: '#fafafa' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-3/4 rounded-3xl px-5 py-4"
                    style={msg.sender === "user"
                      ? { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a', borderBottomRightRadius: 0 }
                      : { background: '#fff', border: '1px solid #e5e5e5', borderBottomLeftRadius: 0 }
                    }>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full"
                        style={msg.sender === "user" ? { background: 'rgba(0,0,0,0.15)' } : { background: '#f5f5f5' }}>
                        {msg.sender === "user"
                          ? <FiUser className="text-sm" style={{ color: '#0a0a0a' }} />
                          : <FiMessageSquare className="text-sm" style={{ color: '#d4a800' }} />}
                      </div>
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap" style={{ color: msg.sender === "user" ? '#0a0a0a' : '#333' }}>{msg.text}</p>
                        <div className="text-xs mt-1" style={{ color: msg.sender === "user" ? 'rgba(0,0,0,0.5)' : '#999' }}>
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
                  <div className="rounded-3xl px-5 py-4" style={{ background: '#fff', border: '1px solid #e5e5e5', borderBottomLeftRadius: 0 }}>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#f5c518' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#f5c518', animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#f5c518', animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4" style={{ borderTop: '1px solid #e5e5e5', background: '#fff' }}>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <label htmlFor="file-upload"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl cursor-pointer transition-colors"
                  style={{ background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#555' }}>
                  <FiUploadCloud />
                  {uploadedFile ? uploadedFile.name : "Upload"}
                  <input id="file-upload" type="file" className="hidden"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])} />
                </label>

                <div className="flex-1 relative">
                  <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type or speak..."
                    className="w-full rounded-2xl px-6 py-4 focus:outline-none transition-all"
                    style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                    onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245,197,24,0.15)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
                    disabled={isLoading} />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-8 rounded" style={{ background: '#e5e5e5' }}>
                    <div style={{ height: `${voiceLevel * 100}%`, background: '#f5c518' }} className="w-full rounded-b"></div>
                  </div>
                </div>

                <button type="button" onClick={toggleListening}
                  className="p-4 rounded-2xl transition-all"
                  style={isListening
                    ? { background: '#dc2626', color: '#fff', transform: 'scale(1.1)', boxShadow: '0 4px 15px rgba(220,38,38,0.3)' }
                    : { background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5' }
                  }>
                  <FiMic />
                </button>

                <button type="submit" disabled={isLoading || !inputText.trim()}
                  className="p-4 rounded-2xl transition-all"
                  style={isLoading || !inputText.trim()
                    ? { background: '#f5f5f5', color: '#ccc', cursor: 'not-allowed' }
                    : { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a', boxShadow: '0 4px 15px rgba(245,197,24,0.3)' }
                  }>
                  {isLoading ? <ImSpinner8 className="animate-spin" /> : <FiSend />}
                </button>
              </form>

              <div className="mt-2 text-xs" style={{ color: '#999' }}>Voice: {voiceLevel.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
