import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaBookOpen,
  FaUserShield,
  FaUniversity,
  FaRegCalendarAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-12" style={{ background: '#111', color: '#e5e5e5', borderTop: '3px solid #f5c518' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <FaGraduationCap className="mr-3 text-xl" style={{ color: '#f5c518' }} />
              <h3 className="text-lg font-bold text-white">Aspiro AI</h3>
            </div>
            <p className="text-sm mb-4" style={{ color: '#888' }}>
              Bridging the gap between mentors and students through innovative
              education technology and personalized learning experiences.
            </p>
            <div className="flex items-center space-x-2 text-sm" style={{ color: '#888' }}>
              <FaUniversity style={{ color: '#f5c518' }} />
              <span>Established 2023</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center mb-4">
              <FaChalkboardTeacher className="mr-3 text-xl" style={{ color: '#f5c518' }} />
              <h3 className="text-lg font-bold text-white">For Students</h3>
            </div>
            <ul className="space-y-3">
              {[
                { href: "/find-mentors", label: "Find Mentors" },
                { href: "/courses", label: "Browse Courses" },
                { href: "/resources", label: "Learning Resources" },
                { href: "/events", label: "Upcoming Events" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm flex items-center group transition-colors"
                    style={{ color: '#888' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f5c518'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}>
                    <span className="w-1.5 h-1.5 rounded-full mr-3" style={{ background: '#f5c518' }}></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="flex items-center mb-4">
              <FaBookOpen className="mr-3 text-xl" style={{ color: '#f5c518' }} />
              <h3 className="text-lg font-bold text-white">Resources</h3>
            </div>
            <ul className="space-y-3">
              {[
                { href: "/blog", label: "Blog & Articles" },
                { href: "/research", label: "Research Papers" },
                { href: "/webinars", label: "Webinar Archive" },
                { href: "/career-guides", label: "Career Guides" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm flex items-center group transition-colors"
                    style={{ color: '#888' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f5c518'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}>
                    <span className="w-1.5 h-1.5 rounded-full mr-3" style={{ background: '#f5c518' }}></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <div className="flex items-center mb-4">
              <FaUserShield className="mr-3 text-xl" style={{ color: '#f5c518' }} />
              <h3 className="text-lg font-bold text-white">Support</h3>
            </div>
            <ul className="space-y-3">
              {[
                { href: "/contact", label: "Contact Support" },
                { href: "/faq", label: "Help Center" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm flex items-center group transition-colors"
                    style={{ color: '#888' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f5c518'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}>
                    <span className="w-1.5 h-1.5 rounded-full mr-3" style={{ background: '#f5c518' }}></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 mb-6" style={{ borderTop: '1px solid #2a2a2a' }}></div>

        {/* Copyright and Social */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            <p className="text-sm mb-2 md:mb-0 md:mr-4" style={{ color: '#666' }}>
              &copy; {new Date().getFullYear()} PathNexus AI Platform. All rights reserved.
            </p>
            <div className="flex items-center text-sm" style={{ color: '#666' }}>
              <FaRegCalendarAlt className="mr-1" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex space-x-5">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a key={i} href="#" className="transition-colors" style={{ color: '#666' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f5c518'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; }}
                aria-label={['Facebook', 'Twitter', 'Instagram', 'LinkedIn'][i]}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
