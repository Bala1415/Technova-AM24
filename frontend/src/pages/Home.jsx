import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import {
  AiOutlineUser,
  AiOutlineSolution,
  AiOutlineSchedule,
  AiOutlineCheckCircle,
  AiOutlineNotification,
  AiOutlineTrophy,
  AiOutlineRobot,
  AiOutlineCamera,
  AiOutlineDashboard,
  AiOutlineFileText,
  AiOutlineTeam,
  AiOutlineRocket,
  AiOutlineStar,
  AiOutlineCloud,
} from "react-icons/ai";
import { 
  FaGraduationCap, 
  FaUserTie, 
  FaChalkboardTeacher, 
  FaBrain,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaLightbulb,
  FaNetworkWired,
  FaMicrochip,
  FaGlobe
} from "react-icons/fa";
import { 
  IoSparkles, 
  IoRocket, 
  IoStatsChart, 
  IoPeople,
  IoFlash,
  IoPlanet,
  IoInfinite
} from "react-icons/io5";
import { RiUserVoiceFill, RiMindMap, RiGlobalLine } from "react-icons/ri";

const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: AiOutlineTeam, title: "Four Role System", color: "from-purple-500 to-pink-500" },
    { icon: AiOutlineRobot, title: "AI Chatbot Support", color: "from-blue-500 to-cyan-500" },
    { icon: AiOutlineCheckCircle, title: "Skills Tracking", color: "from-yellow-500 to-orange-500" },
    { icon: AiOutlineSolution, title: "Career Guidance", color: "from-indigo-500 to-purple-500" }
  ];

  const stats = [
    { number: "5,000+", label: "Active Students", icon: FaGraduationCap },
    { number: "200+", label: "Industry Mentors", icon: FaUserTie },
    { number: "10,000+", label: "Completed Sessions", icon: IoStatsChart },
    { number: "50+", label: "Universities", icon: FaChalkboardTeacher }
  ];

  return (
    <>
      

      <div className="overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
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
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="https://png.pngtree.com/background/20250111/original/pngtree-abstract-watercolor-texture-in-shades-of-blue-picture-image_15273936.jpg"
            alt="Mentorship program hero"
          />
          
          <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/30 to-blue-600/30 p-4 rounded-2xl border border-purple-500/30 backdrop-blur-lg mb-6"
              >
                <IoSparkles className="text-2xl text-yellow-400 animate-pulse" />
                <span className="text-purple-300 font-semibold">Next-Gen Mentorship Platform</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  PathNexusAI
                </span>
                <br />
                <span className="text-white text-4xl md:text-5xl">AI-Powered Learning Ecosystem</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                Revolutionizing education through intelligent mentorship, cutting-edge AI, 
                and immersive learning experiences that transform careers and lives.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="/register"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-2xl flex items-center gap-2"
              >
                <IoRocket className="text-xl" />
                Launch Your Journey
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#features"
                className="bg-gray-800/50 backdrop-blur-lg hover:bg-gray-700/50 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 border border-gray-600/50 flex items-center gap-2"
              >
                <FaBrain className="text-xl" />
                Explore Features
              </motion.a>
            </motion.div>

            {/* Animated Feature Showcase */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30 max-w-2xl mx-auto"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-4"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${features[currentFeature].color}`}>
                    {/* <features[currentFeature].icon className="text-2xl text-white" /> */}
                  </div>
                  <span className="text-white font-semibold text-lg">
                    {features[currentFeature].title}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-10 left-10 text-purple-400 text-2xl"
          >
            <FaGraduationCap />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute top-20 right-20 text-blue-400 text-2xl"
          >
            <FaUserTie />
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Revolutionary Features
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the future of mentorship with our cutting-edge platform 
                powered by artificial intelligence and immersive technologies.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} w-fit mb-6`}>
                      <feature.icon className="text-3xl text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Advanced AI-powered mentorship with real-time analytics and personalized learning paths.
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-gray-900/50 to-purple-900/50 relative">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-800/30 backdrop-blur-lg p-8 rounded-3xl border border-gray-700/50 text-center group hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                      <stat.icon className="text-3xl text-purple-400" />
                    </div>
                  </div>
                  <motion.h3 
                    className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2"
                    whileInView={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-gray-300 text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Advanced Capabilities
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: FaNetworkWired, title: "Smart Matching Algorithm", desc: "AI-powered mentor-student matching based on skills, goals, and personality compatibility." },
                { icon: FaShieldAlt, title: "Blockchain Verification", desc: "Secure certificate verification and achievement tracking using blockchain technology." },
                { icon: RiMindMap, title: "Cognitive Learning Paths", desc: "Personalized learning journeys adapted to individual learning styles and pace." },
                { icon: FaGlobe, title: "Global Mentor Network", desc: "Connect with industry experts and academic mentors from around the world." }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 mr-4">
                      <feature.icon className="text-2xl text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20"></div>
          <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <IoPlanet className="text-6xl text-purple-400" />
              </motion.div>
              
              <h2 className="text-5xl font-bold mb-6 text-white">
                Join the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Future</span> of Education
              </h2>
              
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Be part of a revolutionary platform that's transforming how students learn 
                and mentors teach through cutting-edge technology and AI.
              </p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
              >
                {[
                  { role: "Student", icon: FaGraduationCap, color: "from-purple-500 to-pink-500" },
                  { role: "College Mentor", icon: FaChalkboardTeacher, color: "from-blue-500 to-cyan-500" },
                  { role: "Industry Mentor", icon: FaUserTie, color: "from-green-500 to-emerald-500" }
                ].map((item, index) => (
                  <motion.a
                    key={item.role}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="/register"
                    className={`bg-gradient-to-r ${item.color} hover:shadow-2xl text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    <item.icon />
                    {item.role}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;
