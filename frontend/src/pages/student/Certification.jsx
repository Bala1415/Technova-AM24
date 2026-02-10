import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUpload, 
  FaFilePdf, 
  FaImage, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle,
  FaShieldAlt,
  FaFingerprint,
  FaClock,
  FaChartBar,
  FaMagic,
  FaRocket,
  FaGlobe,
  FaDatabase,
  FaNetworkWired,
  FaMicrochip,
  FaBrain
} from 'react-icons/fa';
import { IoSparkles, IoScan, IoAlertCircle } from 'react-icons/io5';
import { RiShieldCheckLine, RiGhostLine, RiSpyLine } from 'react-icons/ri';
const CertificationSpoofer = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef(null);

  const fakeUniversities = [
    "Stanford University", "MIT", "Harvard", "Cambridge", "ETH Zurich",
    "IIT Bombay", "University of Tokyo", "National University of Singapore"
  ];

  const fakeCompanies = [
    "Google", "Microsoft", "Amazon", "Meta", "Netflix",
    "Tesla", "SpaceX", "OpenAI", "NVIDIA", "IBM"
  ];

  const fakeTechnologies = [
    "AI/ML", "Blockchain", "Cybersecurity", "Cloud Computing", "Data Science",
    "Web3", "Quantum Computing", "IoT", "DevOps", "Full Stack Development"
  ];

  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
  const getRandomDate = () => {
    const start = new Date(2018, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  };

  const getRandomScore = () => (Math.random() * 100).toFixed(1);

  const analyzeCertificate = async (file) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    clearInterval(progressInterval);
    setAnalysisProgress(100);

    // Generate random results
    const isGenuine = Math.random() > 0.3; // 70% chance of genuine
    const confidence = (Math.random() * 30 + 70).toFixed(1); // 70-100% confidence
    
    const analysisResult = {
      isGenuine,
      confidence,
      details: {
        issuer: getRandomItem(isGenuine ? fakeUniversities : [...fakeUniversities, "Fake University Online"]),
        issueDate: getRandomDate(),
        technology: getRandomItem(fakeTechnologies),
        authenticityScore: getRandomScore(),
        digitalSignature: Math.random() > 0.2,
        watermarkDetection: Math.random() > 0.3,
        metadataAnalysis: Math.random() > 0.4,
        patternRecognition: getRandomScore(),
        fontAnalysis: Math.random() > 0.6 ? "Consistent" : "Suspicious",
        company: getRandomItem(fakeCompanies),
        riskLevel: isGenuine ? "Low" : "High"
      },
      warnings: isGenuine ? [] : [
        "Inconsistent font patterns detected",
        "Missing digital signature",
        "Suspicious metadata",
        "Watermark quality below standard"
      ]
    };

    setResult(analysisResult);
    setIsAnalyzing(false);
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      analyzeCertificate(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.includes('image') || droppedFile.type.includes('pdf'))) {
      setFile(droppedFile);
      setResult(null);
      analyzeCertificate(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const resetAnalysis = () => {
    setFile(null);
    setResult(null);
    setAnalysisProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Animated Background */}
      
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">


        <div className="grid mt-20 grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Upload Section */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FaUpload className="text-purple-400" />
              Upload Certificate
            </h2>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                file ? 'border-green-400 bg-green-400/10' : 'border-purple-400 hover:border-purple-300 hover:bg-purple-400/10'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf"
                className="hidden"
              />
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="space-y-4"
              >
                <div className="flex justify-center gap-4 mb-4">
                  <FaFilePdf className="text-4xl text-red-400" />
                  <FaImage className="text-4xl text-green-400" />
                </div>
                <p className="text-xl font-semibold">Drop your certificate here or click to browse</p>
                <p className="text-gray-400">Supports PDF and Image files (PNG, JPG, JPEG)</p>
              </motion.div>
            </div>

            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gray-700/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {file.type.includes('pdf') ? (
                    <FaFilePdf className="text-2xl text-red-400" />
                  ) : (
                    <FaImage className="text-2xl text-green-400" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Analysis Section */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <IoScan className="text-blue-400" />
              AI Analysis Results
            </h2>

            <AnimatePresence>
              {isAnalyzing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="relative">
                    <FaBrain className="text-6xl text-purple-400 animate-pulse mb-4" />
                    <IoSparkles className="absolute top-0 right-0 text-yellow-400 animate-bounce" />
                  </div>
                  
                  <div>
                    <p className="text-xl font-semibold mb-2">Scanning Certificate...</p>
                    <p className="text-gray-400">AI is analyzing digital signatures and patterns</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analysis Progress</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Scanning Steps */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {['Digital Signature', 'Metadata', 'Patterns', 'Watermarks', 'Fonts', 'Security'].map((step, index) => (
                      <motion.div
                        key={step}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <div className={`p-2 rounded-lg ${
                          analysisProgress > (index + 1) * 15 ? 'bg-green-400/20' : 'bg-gray-700/50'
                        }`}>
                          <FaMicrochip className={`mx-auto ${
                            analysisProgress > (index + 1) * 15 ? 'text-green-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <p className="text-xs mt-1 text-gray-400">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Result Header */}
                  <div className={`p-6 rounded-2xl ${
                    result.isGenuine 
                      ? 'bg-green-400/20 border border-green-400/30' 
                      : 'bg-red-400/20 border border-red-400/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {result.isGenuine ? (
                          <FaCheckCircle className="text-4xl text-green-400" />
                        ) : (
                          <FaTimesCircle className="text-4xl text-red-400" />
                        )}
                        <div>
                          <h3 className="text-2xl font-bold">
                            {result.isGenuine ? 'Certificate Genuine' : 'Certificate Fake'}
                          </h3>
                          <p className="text-gray-300">Confidence: {result.confidence}%</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full ${
                        result.isGenuine ? 'bg-green-400/30' : 'bg-red-400/30'
                      }`}>
                        <span className="font-semibold">
                          {result.isGenuine ? 'SAFE' : 'RISK'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Issuer</p>
                      <p className="font-semibold">{result.details.issuer}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Issue Date</p>
                      <p className="font-semibold">{result.details.issueDate}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Technology</p>
                      <p className="font-semibold">{result.details.technology}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">Authenticity Score</p>
                      <p className="font-semibold">{result.details.authenticityScore}/100</p>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FaShieldAlt className="text-blue-400" />
                      Security Analysis
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Digital Signature</span>
                        <span className={result.details.digitalSignature ? 'text-green-400' : 'text-red-400'}>
                          {result.details.digitalSignature ? 'Verified' : 'Missing'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Watermark Detection</span>
                        <span className={result.details.watermarkDetection ? 'text-green-400' : 'text-red-400'}>
                          {result.details.watermarkDetection ? 'Detected' : 'Not Found'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Font Analysis</span>
                        <span className={result.details.fontAnalysis === 'Consistent' ? 'text-green-400' : 'text-red-400'}>
                          {result.details.fontAnalysis}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {result.warnings.length > 0 && (
                    <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-4">
                      <h4 className="font-semibold text-red-400 flex items-center gap-2 mb-2">
                        <FaExclamationTriangle />
                        Security Warnings
                      </h4>
                      <ul className="space-y-1">
                        {result.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-red-300">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={resetAnalysis}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Scan Another Certificate
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4 py-12"
                >
                  <RiGhostLine className="text-6xl text-gray-600 mx-auto" />
                  <p className="text-gray-400">Upload a certificate to begin AI analysis</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: FaFingerprint, title: "Digital Signature Scan", desc: "Advanced cryptographic analysis" },
            { icon: FaChartBar, title: "Pattern Recognition", desc: "AI-powered image pattern detection" },
            { icon: FaNetworkWired, title: "Blockchain Verification", desc: "Cross-references with secure databases" },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-800/40 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 text-center"
            >
              <feature.icon className="text-3xl text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CertificationSpoofer;
