import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError("Please fill in all required fields.");
      return;
    }
    if (role === "Admin") {
      setError("Admin registration is not allowed.");
      return;
    }
    if (
      (role === "Industry Mentor" && (!company || !location || !industry)) ||
      (role === "College Mentor" && (!course || !year))
    ) {
      setError("Please fill in all fields for the selected role.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let registerUrl = "";
      if (role === "Student") registerUrl = "http://localhost:5000/student/register";
      else if (role === "College Mentor") registerUrl = "http://localhost:5000/collegeMentor/register";
      else if (role === "Industry Mentor") registerUrl = "http://localhost:5000/industryMentor/register";
      else if (role === "Psychologist") registerUrl = "http://localhost:5000/psychologist/register";

      const data = { name, email, password };
      if (role === "Industry Mentor") { data.company = company; data.location = location; data.industry = industry; }
      if (role === "College Mentor") { data.course = course; data.year = year; }

      const registerResponse = await axios.post(registerUrl, data);
      if (registerResponse?.data) navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = { background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' };
  const handleFocus = (e) => { e.target.style.borderColor = '#f5c518'; e.target.style.boxShadow = '0 0 0 2px rgba(245, 197, 24, 0.15)'; };
  const handleBlur = (e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center relative" style={{ background: '#ffffff' }}>

      {/* Top-left Logo */}
      <div className="absolute top-4 left-4 z-50">
        <a href="/" title="Home">
          <img src="https://th.bing.com/th/id/OIP.yQ_4XhNvic0kZnUGD0DT2wHaJf?w=128&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3"
            alt="Left Logo" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300 object-contain"
            style={{ border: '1px solid #e5e5e5' }}
          />
        </a>
      </div>

      {/* Top-right SRM logo */}
      <div className="absolute top-4 right-4 z-50">
        <a href="/" title="SRM Valliammai">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOu02tpOgiqJuDTvYSYXKO1LR5C4cTg7xVb4rX3Cu7oLiiBQ4Kvi3tUCukT79hZPgy8sI&usqp=CAU"
            alt="SRM Logo" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300 object-contain"
            style={{ border: '1px solid #e5e5e5' }}
          />
        </a>
      </div>

      {/* Left Side - Showcase */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center space-y-6 p-10 relative z-10">
        <img src="https://thumbs.dreamstime.com/b/career-path-icon-outline-sign-corporate-development-collection-line-infographics-wed-design-more-element-linear-web-238499913.jpg"
          alt="Career Path Logo" className="w-48 h-48 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300 object-contain"
          style={{ border: '1px solid #e5e5e5' }}
        />
        <h1 className="text-3xl font-bold" style={{ color: '#d4a800' }}>PathNexus AI Portal</h1>
        <p className="text-center max-w-md" style={{ color: '#666' }}>
          Empowering students, mentors, and professionals through AI-driven guidance and collaboration.
        </p>
      </div>

      {/* Right Side - Register Form */}
      <div className="md:w-1/2 w-full flex justify-center items-center p-8 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-md rounded-3xl shadow-xl max-h-[80vh] overflow-y-auto"
          style={{ background: '#fff', border: '1px solid #e5e5e5' }}>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-3 rounded-2xl px-6 py-4"
              style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
              <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)' }}>
                <FiUser className="text-2xl" style={{ color: '#0a0a0a' }} />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold" style={{ color: '#111' }}>Create Account</h1>
                <p className="text-sm" style={{ color: '#999' }}>Join our platform today</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-3 rounded-2xl text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold pb-2" style={{ color: '#111', borderBottom: '1px solid #e5e5e5' }}>
                Basic Information
              </h3>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#333' }}>Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-lg" style={{ color: '#999' }} />
                  </div>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name"
                    className="w-full rounded-2xl pl-12 pr-4 py-4 focus:outline-none transition-all duration-200"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} disabled={isLoading} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#333' }}>Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-lg" style={{ color: '#999' }} />
                  </div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                    className="w-full rounded-2xl pl-12 pr-4 py-4 focus:outline-none transition-all duration-200"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} disabled={isLoading} />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#333' }}>Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-lg" style={{ color: '#999' }} />
                  </div>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password"
                    className="w-full rounded-2xl pl-12 pr-4 py-4 focus:outline-none transition-all duration-200"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} disabled={isLoading} />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: '#333' }}>Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-lg" style={{ color: '#999' }} />
                  </div>
                  <select value={role} onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-2xl pl-12 pr-4 py-4 focus:outline-none appearance-none transition-all duration-200"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} disabled={isLoading}>
                    <option value="" style={{ background: '#fff' }}>Select your role</option>
                    <option value="Student" style={{ background: '#fff' }}>Student</option>
                    <option value="College Mentor" style={{ background: '#fff' }}>College Mentor</option>
                    <option value="Industry Mentor" style={{ background: '#fff' }}>Industry Mentor</option>
                    <option value="Psychologist" style={{ background: '#fff' }}>Psychologist</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center transition-all duration-200"
              style={isLoading ? { background: '#f5f5f5', color: '#999', cursor: 'not-allowed' } : { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>
              {isLoading ? (<><ImSpinner8 className="animate-spin mr-2" />Creating Account...</>) : (<><FiUser className="mr-2" />Create Account</>)}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4" style={{ borderTop: '1px solid #e5e5e5' }}>
              <p className="text-sm" style={{ color: '#999' }}>
                Already have an account?{" "}
                <Link to="/login" className="font-medium transition-colors duration-200" style={{ color: '#d4a800' }}>Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-sm opacity-80" style={{ color: '#999' }}>
        © 2025{" "}
        <span className="font-semibold" style={{ color: '#d4a800' }}>PAVITHRAN</span> ·{" "}
        <span className="font-semibold" style={{ color: '#333' }}>JEYA PRAKASH</span> ·{" "}
        <span className="font-semibold" style={{ color: '#333' }}>AATHIVEL</span> — All Rights Reserved
      </footer>
    </div>
  );
};

export default Register;
