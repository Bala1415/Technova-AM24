import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import {
  AiOutlineTeam,
  AiOutlineRobot,
  AiOutlineCheckCircle,
  AiOutlineSolution,
} from "react-icons/ai";
import { 
  FaGraduationCap, 
  FaUserTie, 
  FaChalkboardTeacher, 
  FaBrain,
  FaShieldAlt,
  FaNetworkWired,
  FaGlobe
} from "react-icons/fa";
import { 
  IoSparkles, 
  IoRocket, 
  IoStatsChart, 
  IoPlanet,
} from "react-icons/io5";
import { RiMindMap } from "react-icons/ri";

const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: AiOutlineTeam, title: "Four Role System" },
    { icon: AiOutlineRobot, title: "AI Chatbot Support" },
    { icon: AiOutlineCheckCircle, title: "Skills Tracking" },
    { icon: AiOutlineSolution, title: "Career Guidance" }
  ];

  const stats = [
    { number: "5,000+", label: "Active Students", icon: FaGraduationCap },
    { number: "200+", label: "Industry Mentors", icon: FaUserTie },
    { number: "10,000+", label: "Completed Sessions", icon: IoStatsChart },
    { number: "50+", label: "Universities", icon: FaChalkboardTeacher }
  ];

  return (
    <>
      <div className="overflow-hidden" style={{ background: '#ffffff' }}>

        {/* Hero Section — Dark hero banner for contrast */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{ background: '#0a0a0a' }}>
          <div className="absolute inset-0 z-10" style={{ background: 'rgba(0,0,0,0.65)' }}></div>
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
            alt="Professional career guidance"
            style={{ filter: 'grayscale(60%) brightness(0.4)' }}
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
                className="inline-flex items-center gap-3 p-4 rounded-2xl backdrop-blur-lg mb-6"
                style={{ background: 'rgba(245, 197, 24, 0.1)', border: '1px solid rgba(245, 197, 24, 0.25)' }}
              >
                <IoSparkles className="text-2xl animate-pulse" style={{ color: '#f5c518' }} />
                <span className="font-semibold" style={{ color: '#f5c518' }}>Next-Gen Career Platform</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span style={{ 
                  background: 'linear-gradient(135deg, #f5c518, #ffd84d, #d4a800)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  PathNexusAI
                </span>
                <br />
                <span className="text-white text-4xl md:text-5xl">AI-Powered Career Ecosystem</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: '#ccc' }}>
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
                className="font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-2xl flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}
              >
                <IoRocket className="text-xl" />
                Launch Your Journey
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#features"
                className="backdrop-blur-lg font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
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
              className="backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245, 197, 24, 0.15)' }}
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
                  <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)' }}>
                    {React.createElement(features[currentFeature].icon, { className: "text-2xl", style: { color: '#0a0a0a' } })}
                  </div>
                  <span className="text-white font-semibold text-lg">
                    {features[currentFeature].title}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-10 left-10 text-2xl" style={{ color: '#f5c518' }}>
            <FaGraduationCap />
          </motion.div>
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute top-20 right-20 text-2xl" style={{ color: 'rgba(245, 197, 24, 0.5)' }}>
            <FaUserTie />
          </motion.div>
        </section>

        {/* ===== WHITE BACKGROUND SECTIONS BELOW ===== */}

        {/* Features Section */}
        <section id="features" className="py-20 relative" style={{ background: '#ffffff' }}>
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4" style={{ color: '#111' }}>
                Revolutionary <span style={{ color: '#f5c518' }}>Features</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: '#666' }}>
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
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="p-8 rounded-3xl transition-all duration-300 group"
                  style={{ background: '#fff', border: '1px solid #e5e5e5' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f5c518'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,197,24,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div className="p-4 rounded-2xl w-fit mb-6" style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)' }}>
                    <feature.icon className="text-3xl" style={{ color: '#0a0a0a' }} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4" style={{ color: '#111' }}>{feature.title}</h3>
                  <p style={{ color: '#666' }} className="leading-relaxed">
                    Advanced AI-powered mentorship with real-time analytics and personalized learning paths.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20" style={{ background: '#fafafa' }}>
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
                  className="p-8 rounded-3xl text-center transition-all duration-300"
                  style={{ background: '#fff', border: '1px solid #e5e5e5' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f5c518'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,197,24,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(245, 197, 24, 0.1)' }}>
                      <stat.icon className="text-3xl" style={{ color: '#d4a800' }} />
                    </div>
                  </div>
                  <motion.h3 className="text-5xl font-bold mb-2" style={{ color: '#f5c518' }}
                    whileInView={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-lg" style={{ color: '#666' }}>{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="py-20" style={{ background: '#ffffff' }}>
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4" style={{ color: '#111' }}>
                Advanced <span style={{ color: '#f5c518' }}>Capabilities</span>
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
                  className="p-8 rounded-3xl transition-all duration-300"
                  style={{ background: '#fff', border: '1px solid #e5e5e5' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f5c518'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(245,197,24,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl mr-4" style={{ background: 'rgba(245, 197, 24, 0.1)' }}>
                      <feature.icon className="text-2xl" style={{ color: '#d4a800' }} />
                    </div>
                    <h3 className="text-2xl font-semibold" style={{ color: '#111' }}>{feature.title}</h3>
                  </div>
                  <p style={{ color: '#666' }} className="leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden" style={{ background: '#fafafa' }}>
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
                <IoPlanet className="text-6xl" style={{ color: '#f5c518' }} />
              </motion.div>
              
              <h2 className="text-5xl font-bold mb-6" style={{ color: '#111' }}>
                Join the <span style={{ color: '#f5c518' }}>Future</span> of Education
              </h2>
              
              <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#666' }}>
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
                  { role: "Student", icon: FaGraduationCap },
                  { role: "College Mentor", icon: FaChalkboardTeacher },
                  { role: "Industry Mentor", icon: FaUserTie }
                ].map((item, index) => (
                  <motion.a
                    key={item.role}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="/register"
                    className="font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                    style={
                      index === 0
                        ? { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }
                        : { background: '#fff', color: '#111', border: '1px solid #e5e5e5' }
                    }
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
