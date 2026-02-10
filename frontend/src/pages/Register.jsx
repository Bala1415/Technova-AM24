import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiLock,
} from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Extra fields
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
      if (role === "Student") {
        registerUrl = "http://localhost:5000/student/register";
      } else if (role === "College Mentor") {
        registerUrl = "http://localhost:5000/collegeMentor/register";
      } else if (role === "Industry Mentor") {
        registerUrl = "http://localhost:5000/industryMentor/register";
      } else if (role === "Psychologist") {
        registerUrl = "http://localhost:5000/psychologist/register";
      }

      const data = { name, email, password };
      if (role === "Industry Mentor") {
        data.company = company;
        data.location = location;
        data.industry = industry;
      }
      if (role === "College Mentor") {
        data.course = course;
        data.year = year;
      }

      const registerResponse = await axios.post(registerUrl, data);

      if (registerResponse?.data) {
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "An error occurred. Please try again."
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
      {/* Top-left Logo (unchanged) */}
      <div className="absolute top-4 left-4 z-50">
        <a href="/" title="Home">
          <img
            src="https://th.bing.com/th/id/OIP.yQ_4XhNvic0kZnUGD0DT2wHaJf?w=128&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3"
            alt="Left Logo"
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg border border-gray-600/40 hover:scale-110 transition-transform duration-300 object-contain"
          />
        </a>
      </div>

      {/* Top-right SRM logo (unchanged) */}
      <div className="absolute top-4 right-4 z-50">
        <a href="/" title="SRM Valliammai">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOu02tpOgiqJuDTvYSYXKO1LR5C4cTg7xVb4rX3Cu7oLiiBQ4Kvi3tUCukT79hZPgy8sI&usqp=CAU"
            alt="SRM Logo"
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg border border-gray-600/40 hover:scale-110 transition-transform duration-300 object-contain"
          />
        </a>
      </div>

      {/* Left Side - Showcase (hidden on small screens)
          -> CENTER LOGO: replaced per your request */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center space-y-6 p-10">
        <img
          src="https://thumbs.dreamstime.com/b/career-path-icon-outline-sign-corporate-development-collection-line-infographics-wed-design-more-element-linear-web-238499913.jpg"
          alt="Career Path Logo"
          className="w-48 h-48 rounded-3xl shadow-2xl border border-gray-700/30 hover:scale-105 transition-transform duration-300 object-contain"
        />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          PathNexus AI Portal
        </h1>
        <p className="text-black text-center max-w-md">
          Empowering students, mentors, and professionals through AI-driven
          guidance and collaboration.
        </p>
      </div>

      {/* Right Side - Register Form */}
      <div className="md:w-1/2 w-full flex justify-center items-center p-8">
        <div className="container mx-auto px-4 py-8 max-w-md bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 transform transition-all duration-300 hover:shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-3 bg-gray-800/50 backdrop-blur-lg rounded-2xl px-6 py-4 border border-gray-700/50">
              <div className="p-2 bg-green-600 rounded-xl">
                <FiUser className="text-2xl text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Create Account
                </h1>
                <p className="text-gray-400 text-sm">Join our platform today</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700/50 text-red-200 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700/30 pb-2">
                Basic Information
              </h3>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-gray-700/50 border border-gray-600/30 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 backdrop-blur-sm placeholder-gray-400 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
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
                    className="w-full bg-gray-700/50 border border-gray-600/30 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 backdrop-blur-sm placeholder-gray-400 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
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
                    placeholder="Create a password"
                    className="w-full bg-gray-700/50 border border-gray-600/30 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 backdrop-blur-sm placeholder-gray-400 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400 text-lg" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600/30 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 backdrop-blur-sm text-gray-100 appearance-none transition-all duration-200"
                    disabled={isLoading}
                  >
                    <option value="" className="bg-gray-800">
                      Select your role
                    </option>
                    <option value="Student" className="bg-gray-800">
                      Student
                    </option>
                    <option value="College Mentor" className="bg-gray-800">
                      College Mentor
                    </option>
                    <option value="Industry Mentor" className="bg-gray-800">
                      Industry Mentor
                    </option>
                    <option value="Psychologist" className="bg-gray-800">
                      Psychologist
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-medium flex items-center justify-center transition-all duration-200 transform ${
                isLoading
                  ? "bg-gray-700/50 text-gray-500 cursor-not-allowed scale-95"
                  : "bg-gradient-to-br from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              {isLoading ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  <FiUser className="mr-2" />
                  Create Account
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-700/30">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-gray-400 text-sm opacity-80">
        © 2025{" "}
        <span className="font-semibold text-indigo-400">Balavignesh</span> ·{" "}
        <span className="font-semibold text-purple-400">Kavirajan</span> ·{" "}
        <span className="font-semibold text-purple-400">Mukesh N</span> ·{" "}
        <span className="font-semibold text-pink-400">Iniya</span> — All
        Rights Reserved
      </footer>
    </div>
  );
};

export default Register;
