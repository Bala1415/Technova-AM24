import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineMessage,
  AiOutlineRobot,
  AiOutlineBulb,
  AiOutlineFileText,
  AiOutlineLogout,
  AiOutlineSolution,
  AiOutlineSchedule,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { FiBriefcase } from "react-icons/fi";
import { RiUserStarLine } from "react-icons/ri";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const linkStyle = { color: '#333' };
  const linkHoverClass = "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200";

  const renderStudentLinks = () => (
    <>
      <Link to="/exam-prep" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSolution className="mr-1" /> Exam Prep
      </Link>
      <Link to="/chatbot" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineRobot className="mr-1" /> AI Chatbot
      </Link>
      <Link to="/roadmap" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSolution className="mr-1" /> Roadmap Navigator
      </Link>
      <Link to="/career" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineBulb className="mr-1" /> Career Guidance
      </Link>
      <Link to="/career-simulator" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSolution className="mr-1" /> Career Simulator
      </Link>
      <Link to="/recommendSkills" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineFileText className="mr-1" /> Skill
      </Link>
      <Link to="/ai-interview" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSolution className="mr-1" /> AI Interview
      </Link>
      <Link to="/ats" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSolution className="mr-1" /> Resume Scoring
      </Link>
      <Link to="/certification" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSolution className="mr-1" /> Certificate Verification
      </Link>

      {/* Mentors - Flat in mobile menu for simplicity */}
      <Link to="/allCollegeMentors" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <RiUserStarLine className="mr-1" /> College Mentors
      </Link>
      <Link to="/allIndustryMentors" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <FiBriefcase className="mr-1" /> Industry Mentors
      </Link>

      <Link to="/chat" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineMessage className="mr-1" /> Mentor Chat
      </Link>
      <Link to="/chatroom" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineMessage className="mr-1" /> Student Room
      </Link>
      <Link to="/wellness" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSolution className="mr-1" /> Wellness
      </Link>
      <Link to="/Quiz" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSolution className="mr-1" /> Quiz
      </Link>
      <Link to="/ai-assessment" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSolution className="mr-1" /> AI Assessment
      </Link>
    </>
  );

  const renderIndustryMentorLinks = () => (
    <>
      <Link to="/chat" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineMessage className="mr-1" /> Chat
      </Link>
      <Link to="/indFeedback" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSchedule className="mr-1" /> Feedbacks
      </Link>
    </>
  );

  const renderCollegeMentorLinks = () => (
    <>
      <Link to="/addTask" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSchedule className="mr-1" /> Add Task
      </Link>
      <Link to="/chat" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineMessage className="mr-1" /> Chat
      </Link>
      <Link to="/collegeFeedback" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineSchedule className="mr-1" /> Feedbacks
      </Link>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <Link to="/students" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <AiOutlineUsergroupAdd className="mr-1" /> Students
      </Link>
      <Link to="/college-mentors" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <RiUserStarLine className="mr-1" /> College Mentors
      </Link>
      <Link to="/industry-mentors" className={linkHoverClass} style={linkStyle}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
        <FiBriefcase className="mr-1" /> Industry Mentors
      </Link>
    </>
  );

  const renderAuthLinks = () => {
    if (role) {
      return (
        <button onClick={handleLogout} className={linkHoverClass} style={linkStyle}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a800'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#333'; }}>
          <AiOutlineLogout className="mr-1" /> Logout
        </button>
      );
    }
    return (
      <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium flex items-center"
        style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
        <AiOutlineUser className="mr-1" /> Login
      </Link>
    );
  };

  const renderRoleLinks = () => {
    switch (role) {
      case "Student": return renderStudentLinks();
      case "Industry Mentor": return renderIndustryMentorLinks();
      case "College Mentor": return renderCollegeMentorLinks();
      case "Admin": return renderAdminLinks();
      default: return <></>;
    }
  };

  return (
    <header className="fixed w-full z-50" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e5e5e5' }}>
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold" style={{ color: '#d4a800' }}>
                Path Nexus AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {renderRoleLinks()}
              <div className="ml-4 relative">{renderAuthLinks()}</div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {renderAuthLinks()}
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none ml-4" style={{ color: '#333' }}>
              {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3" style={{ background: '#fff' }}>
          {renderRoleLinks()}
        </div>
      </div>
    </header>
  );
};

export default Header;
