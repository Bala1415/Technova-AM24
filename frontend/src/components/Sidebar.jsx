import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [mentorsExpanded, setMentorsExpanded] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/career-simulator', icon: '🎯', label: 'Career Simulator' },
    { path: '/roadmap', icon: '🗺️', label: 'Roadmap Navigator' },
    { path: '/wellness', icon: '💚', label: 'Wellness' },
    { path: '/ai-assessment', icon: '🤖', label: 'AI Assessment' },
    { path: '/chatroom', icon: '💬', label: 'Student Chatroom' },
    { path: '/chatbot', icon: '🤖', label: 'AI Chatbot' },
    { path: '/career', icon: '🚀', label: 'Career Guidance' },
    { path: '/recommendSkills', icon: '⭐', label: 'Skills' },
    { path: '/resume-analyzer', icon: '📄', label: 'Resume Analyzer' },
    { path: '/resume-builder', icon: '📝', label: 'Resume Builder' },
    { path: '/Quiz', icon: '📝', label: 'Quiz' },
    { path: '/certification', icon: '🏆', label: 'Certification' },
  ];

  const mentorItems = [
    { path: '/allCollegeMentors', icon: '👨‍🏫', label: 'College Mentors' },
    { path: '/allIndustryMentors', icon: '👔', label: 'Industry Mentors' },
  ];

  const bottomItems = [
    { path: '/chat', icon: '💭', label: 'Mentor Chat' },
    { path: '/allTask', icon: '✅', label: 'Tasks' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;
  const isMentorActive = mentorItems.some(item => location.pathname === item.path);

  return (
    <>
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed left-0 top-0 h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white shadow-2xl z-50"
        style={{ width: '300px' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-2xl">
                🎓
              </div>
              {isOpen && (
                <div>
                  <h1 className="text-xl font-bold">PathNexus</h1>
                  <p className="text-xs text-purple-300">AI Career Guide</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-240px)]">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg scale-105'
                    : 'hover:bg-purple-700/50'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                {isOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            ))}

            {/* Mentors Dropdown */}
            <div>
              <button
                onClick={() => setMentorsExpanded(!mentorsExpanded)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  isMentorActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                    : 'hover:bg-purple-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">👥</span>
                  {isOpen && <span className="font-medium">Mentors</span>}
                </div>
                {isOpen && (
                  <span className={`transition-transform ${mentorsExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                )}
              </button>

              <AnimatePresence>
                {mentorsExpanded && isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-2 space-y-2">
                      {mentorItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                            isActive(item.path)
                              ? 'bg-purple-600 shadow-md'
                              : 'hover:bg-purple-700/50'
                          }`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Items */}
            {bottomItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg scale-105'
                    : 'hover:bg-purple-700/50'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                {isOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-4 top-20 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg transition-all"
        >
          {isOpen ? '◀' : '▶'}
        </button>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-700 bg-purple-900">
          <Link to="/profile" className="flex items-center space-x-3 px-4 hover:bg-purple-700/50 rounded-lg py-2 transition-all">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              👤
            </div>
            {isOpen && (
              <div>
                <p className="font-semibold text-sm">Student</p>
                <p className="text-xs text-purple-300">View Profile</p>
              </div>
            )}
          </Link>
        </div>
      </motion.div>

      {/* Dynamic Spacer - Adjusts based on sidebar state */}
      <div 
        className="transition-all duration-300" 
        style={{ marginLeft: isOpen ? '300px' : '20px' }}
      />
    </>
  );
};

export default Sidebar;
