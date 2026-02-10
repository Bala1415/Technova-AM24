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
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-cover bg-center text-gray-100 relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/brown-watercolor-leaf-background-aesthetic-autumn-season_53876-143134.jpg')",
      }}
    >
      {/* Top-left small logo (provided) */}
      <div className="absolute top-4 left-4 z-50">
        <a href="/" title="Home">
          <img
            src="https://th.bing.com/th/id/OIP.yQ_4XhNvic0kZnUGD0DT2wHaJf?w=128&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3"
            alt="Left Logo"
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg border border-gray-600/40 hover:scale-110 transition-transform duration-300 object-contain"
          />
        </a>
      </div>

      {/* Top-right SRM logo (existing) */}
      <div className="absolute top-4 right-4 z-50">
        <a href="/" title="SRM Valliammai">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOu02tpOgiqJuDTvYSYXKO1LR5C4cTg7xVb4rX3Cu7oLiiBQ4Kvi3tUCukT79hZPgy8sI&usqp=CAU"
            alt="SRM Logo"
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg border border-gray-600/40 hover:scale-110 transition-transform duration-300 object-contain"
          />
        </a>
      </div>

      {/* Left Side - Showcase (hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center space-y-6 p-10">
        <img
          src="https://thumbs.dreamstime.com/b/career-path-icon-outline-sign-corporate-development-collection-line-infographics-wed-design-more-element-linear-web-238499913.jpg"
          alt="Career Path Logo"
          className="w-48 h-48 rounded-3xl shadow-2xl border border-gray-700/30 hover:scale-105 transition-transform duration-300 object-contain"
        />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          PathNexus AI Portal
        </h1>
        <p className="text-black text-center max-w-md">
          Empowering students, mentors, and professionals through AI-driven guidance and collaboration.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 w-full flex justify-center items-center p-8">
        <div className="container mx-auto px-4 py-8 max-w-md bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 bg-gray-800/50 rounded-2xl px-6 py-4 border border-gray-700/50">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <FiLogIn className="text-2xl text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-gray-400 text-sm">Sign in to your account</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400 text-lg" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 backdrop-blur-sm placeholder-gray-400 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 text-lg" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 backdrop-blur-sm placeholder-gray-400 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400 text-lg" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/30 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 backdrop-blur-sm text-gray-100 appearance-none transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="" className="bg-gray-800">Select your role</option>
                  <option value="Admin" className="bg-gray-800">Admin</option>
                  <option value="Student" className="bg-gray-800">Student</option>
                  <option value="College Mentor" className="bg-gray-800">College Mentor</option>
                  <option value="Industry Mentor" className="bg-gray-800">Industry Mentor</option>
                  <option value="Psychologist" className="bg-gray-800">Psychologist</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiArrowRight className="text-gray-400 text-lg transform rotate-90" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-medium flex items-center justify-center transition-all duration-200 transform ${
                isLoading
                  ? "bg-gray-700/50 text-gray-500 cursor-not-allowed scale-95"
                  : "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
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
            <div className="text-center pt-4 border-t border-gray-700/30">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="absolute bottom-4 w-full text-center text-gray-400 text-sm opacity-80">
        © 2025 <span className="font-semibold text-indigo-400">AATHIVEL</span> ·{" "}
        <span className="font-semibold text-purple-400">JEYA PRAKASH</span> ·{" "}
        <span className="font-semibold text-pink-400">PAVITHRAN</span> — All Rights Reserved
      </footer>
    </div>
  );
};

export default Login;
