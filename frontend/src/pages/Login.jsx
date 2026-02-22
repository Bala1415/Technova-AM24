import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogIn, FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === "Admin") {
      if (email === "admin@gmail.com" && password === "admin123") {
        navigate("/adminStudents");
      } else {
        setErrorMessage("Invalid Admin Credentials");
        return;
      }
    }

    if (!email || !password || !role) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    let registerUrl = "";
    if (role === "Student") {
      registerUrl = "http://localhost:5000/student/login";
    } else if (role === "College Mentor") {
      registerUrl = "http://localhost:5000/collegeMentor/login";
    } else if (role === "Industry Mentor") {
      registerUrl = "http://localhost:5000/industryMentor/login";
    } else if (role === "Psychologist") {
      registerUrl = "http://localhost:5000/psychologist/login";
    }

    try {
      const response = await axios.post(registerUrl, { email, password });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", role);

      if (role === "Student") navigate("/ats");
      else if (role === "College Mentor") navigate("/college-chats");
      else if (role === "Industry Mentor") navigate("/ind-chats");
      else if (role === "Psychologist") navigate("/psycho-chats");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center relative"
      style={{ background: '#ffffff' }}
    >
      {/* Top-left small logo */}
      <div className="absolute top-4 left-4 z-50">
        <a href="/" title="Home">
          <img
            src="https://th.bing.com/th/id/OIP.yQ_4XhNvic0kZnUGD0DT2wHaJf?w=128&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3"
            alt="Left Logo"
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300 object-contain"
            style={{ border: '1px solid #e5e5e5' }}
          />
        </a>
      </div>

      {/* Top-right SRM logo */}
      <div className="absolute top-4 right-4 z-50">
        <a href="/" title="SRM Valliammai">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOu02tpOgiqJuDTvYSYXKO1LR5C4cTg7xVb4rX3Cu7oLiiBQ4Kvi3tUCukT79hZPgy8sI&usqp=CAU"
            alt="SRM Logo"
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300 object-contain"
            style={{ border: '1px solid #e5e5e5' }}
          />
        </a>
      </div>

      {/* Left Side - Showcase */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center space-y-6 p-10 relative z-10">
        <img
          src="https://thumbs.dreamstime.com/b/career-path-icon-outline-sign-corporate-development-collection-line-infographics-wed-design-more-element-linear-web-238499913.jpg"
          alt="Career Path Logo"
          className="w-48 h-48 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300 object-contain"
          style={{ border: '1px solid #e5e5e5' }}
        />
        <h1 className="text-3xl font-bold" style={{ color: '#d4a800' }}>
          PathNexus AI Portal
        </h1>
        <p className="text-center max-w-md" style={{ color: '#666' }}>
          Empowering students, mentors, and professionals through AI-driven guidance and collaboration.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 w-full flex justify-center items-center p-8 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-md rounded-3xl shadow-xl"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5'
          }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 rounded-2xl px-6 py-4"
              style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}
            >
              <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)' }}>
                <FiLogIn className="text-2xl" style={{ color: '#0a0a0a' }} />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold" style={{ color: '#111' }}>
                  Welcome Back
                </h1>
                <p className="text-sm" style={{ color: '#999' }}>Sign in to your account</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-lg" style={{ color: '#999' }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl pl-12 pr-4 py-4 focus:outline-none transition-all duration-200"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                  onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245, 197, 24, 0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-lg" style={{ color: '#999' }} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full rounded-2xl pl-12 pr-4 py-4 focus:outline-none transition-all duration-200"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                  onFocus={(e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245, 197, 24, 0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; }}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-lg" style={{ color: '#999' }} />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-2xl pl-12 pr-4 py-4 focus:outline-none appearance-none transition-all duration-200"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
                  onFocus={(e) => { e.target.style.borderColor = '#f5c518'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; }}
                  disabled={isLoading}
                >
                  <option value="" style={{ background: '#fff' }}>Select your role</option>
                  <option value="Admin" style={{ background: '#fff' }}>Admin</option>
                  <option value="Student" style={{ background: '#fff' }}>Student</option>
                  <option value="College Mentor" style={{ background: '#fff' }}>College Mentor</option>
                  <option value="Industry Mentor" style={{ background: '#fff' }}>Industry Mentor</option>
                  <option value="Psychologist" style={{ background: '#fff' }}>Psychologist</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiArrowRight className="text-lg transform rotate-90" style={{ color: '#999' }} />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="px-4 py-3 rounded-2xl text-sm" style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626'
              }}>
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center transition-all duration-200 transform"
              style={
                isLoading
                  ? { background: '#f5f5f5', color: '#999', cursor: 'not-allowed' }
                  : { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }
              }
            >
              {isLoading ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Sign In
                </>
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4" style={{ borderTop: '1px solid #e5e5e5' }}>
              <p className="text-sm" style={{ color: '#999' }}>
                Don't have an account?{" "}
                <Link to="/register" className="font-medium transition-colors duration-200" style={{ color: '#d4a800' }}>
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="absolute bottom-4 w-full text-center text-sm opacity-80" style={{ color: '#999' }}>
        © 2025 <span className="font-semibold" style={{ color: '#d4a800' }}>AATHIVEL</span> ·{" "}
        <span className="font-semibold" style={{ color: '#333' }}>JEYA PRAKASH</span> ·{" "}
        <span className="font-semibold" style={{ color: '#333' }}>PAVITHRAN</span> — All Rights Reserved
      </footer>
    </div>
  );
};

export default Login;
