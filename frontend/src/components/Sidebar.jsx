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
    { path: '/exam-prep', icon: '📋', label: 'Exam Prep' },
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
        className="fixed left-0 top-0 h-screen text-white shadow-2xl z-50"
        style={{ 
          width: '300px',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
          borderRight: '1px solid rgba(245, 197, 24, 0.1)'
        }}
      >
        {/* Header */}
        <div className="p-6" style={{ borderBottom: '1px solid rgba(245, 197, 24, 0.15)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)' }}>
                🎓
              </div>
              {isOpen && (
                <div>
                  <h1 className="text-xl font-bold" style={{ color: '#f5c518' }}>PathNexus</h1>
                  <p className="text-xs" style={{ color: '#888' }}>AI Career Guide</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-240px)]">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200"
                style={
                  isActive(item.path)
                    ? { background: 'linear-gradient(135deg, rgba(245, 197, 24, 0.15), rgba(245, 197, 24, 0.05))', borderLeft: '3px solid #f5c518', color: '#f5c518' }
                    : { color: '#ccc', borderLeft: '3px solid transparent' }
                }
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ccc';
                  }
                }}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </Link>
            ))}

            {/* Mentors Dropdown */}
            <div>
              <button
                onClick={() => setMentorsExpanded(!mentorsExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200"
                style={
                  isMentorActive
                    ? { background: 'rgba(245, 197, 24, 0.1)', color: '#f5c518', borderLeft: '3px solid #f5c518' }
                    : { color: '#ccc', borderLeft: '3px solid transparent' }
                }
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">👥</span>
                  {isOpen && <span className="font-medium text-sm">Mentors</span>}
                </div>
                {isOpen && (
                  <span className={`transition-transform text-xs ${mentorsExpanded ? 'rotate-180' : ''}`}
                    style={{ color: '#888' }}>
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
                    <div className="ml-4 mt-1 space-y-1">
                      {mentorItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200"
                          style={
                            isActive(item.path)
                              ? { background: 'rgba(245, 197, 24, 0.1)', color: '#f5c518' }
                              : { color: '#999' }
                          }
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="my-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}></div>

            {/* Bottom Items */}
            {bottomItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200"
                style={
                  isActive(item.path)
                    ? { background: 'linear-gradient(135deg, rgba(245, 197, 24, 0.15), rgba(245, 197, 24, 0.05))', borderLeft: '3px solid #f5c518', color: '#f5c518' }
                    : { color: '#ccc', borderLeft: '3px solid transparent' }
                }
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ccc';
                  }
                }}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-4 top-20 rounded-full p-2 shadow-lg transition-all"
          style={{ 
            background: '#1a1a1a', 
            border: '1px solid rgba(245, 197, 24, 0.3)',
            color: '#f5c518'
          }}
        >
          {isOpen ? '◀' : '▶'}
        </button>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4"
          style={{ borderTop: '1px solid rgba(245, 197, 24, 0.1)', background: '#0a0a0a' }}>
          <Link to="/profile" className="flex items-center space-x-3 px-4 rounded-lg py-2 transition-all"
            style={{ color: '#ccc' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)' }}>
              👤
            </div>
            {isOpen && (
              <div>
                <p className="font-semibold text-sm text-white">Student</p>
                <p className="text-xs" style={{ color: '#888' }}>View Profile</p>
              </div>
            )}
          </Link>
        </div>
      </motion.div>

      {/* Dynamic Spacer */}
      <div 
        className="transition-all duration-300" 
        style={{ marginLeft: isOpen ? '300px' : '20px' }}
      />
    </>
  );
};

export default Sidebar;
