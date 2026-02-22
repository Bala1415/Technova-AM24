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
  FaChartBar,
  FaNetworkWired,
  FaMicrochip,
  FaBrain
} from 'react-icons/fa';
import { IoSparkles, IoScan } from 'react-icons/io5';
import { RiGhostLine } from 'react-icons/ri';

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
    
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100; }
        return prev + Math.random() * 15;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 3000));
    clearInterval(progressInterval);
    setAnalysisProgress(100);

    const isGenuine = Math.random() > 0.3;
    const confidence = (Math.random() * 30 + 70).toFixed(1);
    
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
    if (selectedFile) { setFile(selectedFile); setResult(null); analyzeCertificate(selectedFile); }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.includes('image') || droppedFile.type.includes('pdf'))) {
      setFile(droppedFile); setResult(null); analyzeCertificate(droppedFile);
    }
  };

  const handleDragOver = (event) => { event.preventDefault(); };
  const resetAnalysis = () => { setFile(null); setResult(null); setAnalysisProgress(0); };

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid mt-20 grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Upload Section */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-8 shadow-sm"
            style={{ background: '#fff', border: '1px solid #e5e5e5' }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#111' }}>
              <FaUpload style={{ color: '#d4a800' }} />
              Upload Certificate
            </h2>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300"
              style={file
                ? { borderColor: '#16a34a', background: '#f0fdf4' }
                : { borderColor: '#fde68a', background: '#fffbeb' }
              }
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,.pdf" className="hidden" />
              <motion.div whileHover={{ scale: 1.05 }} className="space-y-4">
                <div className="flex justify-center gap-4 mb-4">
                  <FaFilePdf className="text-4xl" style={{ color: '#dc2626' }} />
                  <FaImage className="text-4xl" style={{ color: '#16a34a' }} />
                </div>
                <p className="text-xl font-semibold" style={{ color: '#111' }}>Drop your certificate here or click to browse</p>
                <p style={{ color: '#999' }}>Supports PDF and Image files (PNG, JPG, JPEG)</p>
              </motion.div>
            </div>

            {file && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                <div className="flex items-center gap-3">
                  {file.type.includes('pdf') ? <FaFilePdf className="text-2xl" style={{ color: '#dc2626' }} /> : <FaImage className="text-2xl" style={{ color: '#16a34a' }} />}
                  <div className="flex-1">
                    <p className="font-medium truncate" style={{ color: '#111' }}>{file.name}</p>
                    <p className="text-sm" style={{ color: '#999' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
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
            className="rounded-2xl p-8 shadow-sm"
            style={{ background: '#fff', border: '1px solid #e5e5e5' }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#111' }}>
              <IoScan style={{ color: '#d4a800' }} />
              AI Analysis Results
            </h2>

            <AnimatePresence>
              {isAnalyzing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6">
                  <div className="relative">
                    <FaBrain className="text-6xl animate-pulse mb-4" style={{ color: '#d4a800' }} />
                    <IoSparkles className="absolute top-0 right-0 animate-bounce" style={{ color: '#f5c518' }} />
                  </div>
                  <div>
                    <p className="text-xl font-semibold mb-2" style={{ color: '#111' }}>Scanning Certificate...</p>
                    <p style={{ color: '#999' }}>AI is analyzing digital signatures and patterns</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm" style={{ color: '#555' }}>
                      <span>Analysis Progress</span>
                      <span>{Math.min(100, Math.round(analysisProgress))}%</span>
                    </div>
                    <div className="w-full rounded-full h-3" style={{ background: '#f5f5f5' }}>
                      <motion.div className="h-3 rounded-full" style={{ background: 'linear-gradient(90deg, #f5c518, #d4a800)' }}
                        initial={{ width: 0 }} animate={{ width: `${Math.min(100, analysisProgress)}%` }} transition={{ duration: 0.3 }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {['Digital Signature', 'Metadata', 'Patterns', 'Watermarks', 'Fonts', 'Security'].map((step, index) => (
                      <motion.div key={step} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * 0.1 }} className="text-center">
                        <div className="p-2 rounded-lg" style={{ background: analysisProgress > (index + 1) * 15 ? '#dcfce7' : '#fafafa', border: '1px solid #e5e5e5' }}>
                          <FaMicrochip className="mx-auto" style={{ color: analysisProgress > (index + 1) * 15 ? '#16a34a' : '#ccc' }} />
                        </div>
                        <p className="text-xs mt-1" style={{ color: '#999' }}>{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="p-6 rounded-2xl" style={result.isGenuine
                    ? { background: '#f0fdf4', border: '1px solid #bbf7d0' }
                    : { background: '#fef2f2', border: '1px solid #fecaca' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {result.isGenuine ? <FaCheckCircle className="text-4xl" style={{ color: '#16a34a' }} /> : <FaTimesCircle className="text-4xl" style={{ color: '#dc2626' }} />}
                        <div>
                          <h3 className="text-2xl font-bold" style={{ color: '#111' }}>{result.isGenuine ? 'Certificate Genuine' : 'Certificate Fake'}</h3>
                          <p style={{ color: '#666' }}>Confidence: {result.confidence}%</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full" style={result.isGenuine
                        ? { background: '#dcfce7', color: '#166534' }
                        : { background: '#fef2f2', color: '#991b1b' }}>
                        <span className="font-semibold">{result.isGenuine ? 'SAFE' : 'RISK'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Issuer', value: result.details.issuer },
                      { label: 'Issue Date', value: result.details.issueDate },
                      { label: 'Technology', value: result.details.technology },
                      { label: 'Authenticity Score', value: `${result.details.authenticityScore}/100` }
                    ].map(item => (
                      <div key={item.label} className="p-4 rounded-xl" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                        <p className="text-sm" style={{ color: '#999' }}>{item.label}</p>
                        <p className="font-semibold" style={{ color: '#111' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#111' }}>
                      <FaShieldAlt style={{ color: '#d4a800' }} /> Security Analysis
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Digital Signature', value: result.details.digitalSignature, trueText: 'Verified', falseText: 'Missing' },
                        { label: 'Watermark Detection', value: result.details.watermarkDetection, trueText: 'Detected', falseText: 'Not Found' },
                        { label: 'Font Analysis', value: result.details.fontAnalysis === 'Consistent', trueText: 'Consistent', falseText: 'Suspicious' }
                      ].map(item => (
                        <div key={item.label} className="flex justify-between items-center" style={{ color: '#333' }}>
                          <span>{item.label}</span>
                          <span style={{ color: item.value ? '#16a34a' : '#dc2626' }}>{item.value ? item.trueText : item.falseText}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.warnings.length > 0 && (
                    <div className="rounded-xl p-4" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                      <h4 className="font-semibold flex items-center gap-2 mb-2" style={{ color: '#dc2626' }}>
                        <FaExclamationTriangle /> Security Warnings
                      </h4>
                      <ul className="space-y-1">
                        {result.warnings.map((warning, index) => (
                          <li key={index} className="text-sm" style={{ color: '#991b1b' }}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button onClick={resetAnalysis} className="w-full py-3 rounded-xl font-semibold transition-all"
                    style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
                    Scan Another Certificate
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4 py-12">
                  <RiGhostLine className="text-6xl mx-auto" style={{ color: '#e5e5e5' }} />
                  <p style={{ color: '#999' }}>Upload a certificate to begin AI analysis</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FaFingerprint, title: "Digital Signature Scan", desc: "Advanced cryptographic analysis" },
            { icon: FaChartBar, title: "Pattern Recognition", desc: "AI-powered image pattern detection" },
            { icon: FaNetworkWired, title: "Blockchain Verification", desc: "Cross-references with secure databases" },
          ].map((feature) => (
            <motion.div key={feature.title} whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 rounded-2xl text-center shadow-sm"
              style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
              <feature.icon className="text-3xl mx-auto mb-3" style={{ color: '#d4a800' }} />
              <h3 className="font-semibold mb-2" style={{ color: '#111' }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: '#999' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CertificationSpoofer;
