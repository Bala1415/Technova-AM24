import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Header";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaPaperPlane,
  FaComments,
  FaBriefcase,
  FaRegHeart,
  FaHeart,
  FaRocket,
  FaMagic,
  FaRegStar,
  FaStar,
  FaCrown,
  FaShieldAlt,
  FaBolt,
  FaGem,
} from "react-icons/fa";
import { FiHelpCircle, FiZap, FiAward, FiTrendingUp } from "react-icons/fi";
import { RiMindMap, RiFireFill, RiSparkling2Fill, RiUserStarFill } from "react-icons/ri";
import { IoSparkles } from "react-icons/io5";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [industryMentors, setIndustryMentors] = useState([]);
  const [collegeMentor, setCollegeMentors] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("industry");
  const [favoriteMentors, setFavoriteMentors] = useState(new Set());
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchIndustryMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/industryMentor", {
          headers: { Authorization: token },
        });
        setIndustryMentors(res.data);
      } catch (error) {
        toast.error("Error fetching industry mentors");
      }
    };

    const fetchCollegeMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/collegeMentor", {
          headers: { Authorization: token },
        });
        setCollegeMentors(res.data);
      } catch (error) {
        toast.error("Error fetching college mentors");
      }
    };

    const fetchPsychologists = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/psychologist", {
          headers: { Authorization: token },
        });
        setPsychologists(res.data);
      } catch (error) {
        toast.error("Error fetching psychologists");
      }
    };

    fetchPsychologists();
    fetchCollegeMentors();
    fetchIndustryMentors();

    socket.emit("joinUser", user?._id);

    socket.on("sendPrivateMessageStudenttoIndustry", (message) => {
      if (
        message.sender === user?._id ||
        message.receiverIndustry === selectedMentor?._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("sendPrivateMessageStudenttoIndustry");
    };
  }, [selectedMentor, user?._id]);

  const loadMessages = async (mentorId, mentorRole) => {
    const allMentors = [...industryMentors, ...collegeMentor, ...psychologists];
    const mentor = allMentors.find((m) => m._id === mentorId);
    if (!mentor) return;

    setSelectedMentor(mentor);

    try {
      const res = await axios.post(
        "http://localhost:5000/messages/get",
        {
          user1: user._id,
          model1: user.role,
          user2: mentor._id,
          model2: mentorRole,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setMessages(res.data);
    } catch (error) {
      toast.error("Failed to load chat history");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMentor) return;

    const messagePayload = {
      sender: user._id,
      senderModel: user.role,
      receiver: selectedMentor._id,
      receiverModel: selectedMentor.role,
      message: newMessage,
    };

    const tempMsg = {
      ...messagePayload,
      _id: Date.now(),
      createdAt: new Date(),
      read: false,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    socket.emit("sendMessage", messagePayload);

    try {
      await axios.post("http://localhost:5000/messages/send", messagePayload, {
        headers: { Authorization: localStorage.getItem("token") },
      });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const toggleFavorite = (mentorId) => {
    setFavoriteMentors(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(mentorId)) {
        newFavorites.delete(mentorId);
      } else {
        newFavorites.add(mentorId);
      }
      return newFavorites;
    });
  };

  const getMentorIcon = (category) => {
    switch (category) {
      case "industry": return <FaBriefcase className="text-purple-400" />;
      case "college": return <RiUserStarFill className="text-blue-400" />;
      case "psychologist": return <RiMindMap className="text-green-400" />;
      default: return <FaUserCircle />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "industry": return "from-purple-500 to-pink-500";
      case "college": return "from-blue-500 to-cyan-500";
      case "psychologist": return "from-green-500 to-emerald-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex overflow-hidden">
      <Navbar />
      <ToastContainer />

      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-96 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-6 border-r border-gray-700/50 shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="mb-8 mt-20">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
           
          </motion.div>

          {/* Category Selector */}
          <div className="flex bg-gray-700/50 rounded-xl p-1 mb-6 backdrop-blur-sm">
            {[
              { id: "industry", label: "Industry", icon: <FaBriefcase /> },
              { id: "college", label: "College", icon: <RiUserStarFill /> },
              { id: "psychologist", label: "Psychologist", icon: <RiMindMap /> }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${getCategoryColor(category.id)} shadow-lg`
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {category.icon}
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mentors List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {(() => {
              const mentors = activeCategory === "industry" ? industryMentors :
                            activeCategory === "college" ? collegeMentor : psychologists;
              
              return mentors.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <RiSparkling2Fill className="text-4xl text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No mentors available</p>
                </motion.div>
              ) : (
                mentors.map((mentor, index) => (
                  <motion.div
                    key={mentor._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 group backdrop-blur-sm ${
                      selectedMentor?._id === mentor._id
                        ? `bg-gradient-to-r ${getCategoryColor(activeCategory)} shadow-xl`
                        : "bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30"
                    }`}
                    onClick={() => loadMessages(mentor._id, mentor.role)}
                  >
                    {/* Favorite Star */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(mentor._id);
                      }}
                      className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-gray-800/50 hover:bg-yellow-500/20 transition-all"
                    >
                      {favoriteMentors.has(mentor._id) ? (
                        <FaStar className="text-yellow-400 text-sm animate-bounce" />
                      ) : (
                        <FaRegStar className="text-gray-400 text-sm hover:text-yellow-400" />
                      )}
                    </button>

                    <div className="flex items-center gap-3">
                      {/* Avatar with Gradient Border */}
                      <div className={`relative ${
                        selectedMentor?._id === mentor._id ? 
                        "ring-2 ring-white/20" : "ring-2 ring-gray-600/30"
                      } rounded-full p-0.5`}>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <FaUserCircle className="text-2xl text-white" />
                        </div>
                        {/* Online Indicator */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-gray-900"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-100 truncate">
                            {mentor.name}
                          </span>
                          {mentor.expertise && (
                            <span className="px-1.5 py-0.5 bg-gray-600/50 rounded-full text-xs text-gray-300">
                              Expert
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-300 bg-gray-600/30 px-2 py-1 rounded-full">
                            {mentor.industry || mentor.department || "Professional"}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <FiTrendingUp />
                            <span>4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                ))
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex-1 flex flex-col bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-6 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-500/5 rounded-full blur-2xl"></div>
        </div>

        {selectedMentor ? (
          <>
            {/* Chat Header */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between border-b border-gray-700/50 pb-4 mb-4 mt-[50px] relative z-10"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center ring-4 ring-purple-500/20">
                    <FaUserCircle className="text-3xl text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full ring-2 ring-gray-900"></div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-100">
                      {selectedMentor.name}
                    </h2>
                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full">
                      <FaCrown className="text-yellow-400 text-xs" />
                      <span className="text-xs text-gray-200">Pro Mentor</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <span>{selectedMentor.role.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <RiFireFill className="text-orange-400" />
                      Active now
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-xl bg-gray-700/50 hover:bg-gray-700/80 transition-all">
                  <FiZap className="text-gray-300" />
                </button>
                <button className="p-2 rounded-xl bg-gray-700/50 hover:bg-gray-700/80 transition-all">
                  <FaRegHeart className="text-gray-300" />
                </button>
              </div>
            </motion.div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 custom-scrollbar">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <IoSparkles className="text-6xl text-purple-400/50 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Start the Conversation!
                  </h3>
                  <p className="text-gray-500">
                    Send your first message to begin your journey
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${
                        msg.sender === user._id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`relative max-w-md rounded-3xl p-4 backdrop-blur-sm border ${
                          msg.sender === user._id
                            ? "bg-gradient-to-br from-blue-600 to-purple-600 rounded-br-none shadow-lg"
                            : "bg-gray-700/50 border-gray-600/30 rounded-bl-none shadow-lg"
                        }`}
                      >
                        <p className="text-gray-100">{msg.message}</p>
                        <div className={`flex items-center justify-between mt-2 text-xs ${
                          msg.sender === user._id ? "text-blue-100" : "text-gray-400"
                        }`}>
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {msg.sender === user._id && (
                            <span className="ml-2">{msg.read ? "✓✓" : "✓"}</span>
                          )}
                        </div>
                        
                        {/* Message tail */}
                        <div className={`absolute bottom-0 w-4 h-4 ${
                          msg.sender === user._id 
                            ? "bg-blue-600 -right-4 rounded-br-xl" 
                            : "bg-gray-700/50 -left-4 rounded-bl-xl"
                        }`}></div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Input Area */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="border-t border-gray-700/50 pt-4 flex items-center gap-3 relative z-10"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type your message... (Press Enter to send)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="w-full p-4 bg-gray-700/50 backdrop-blur-sm text-gray-100 border border-gray-600/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent pr-12 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <button className="p-2 rounded-xl bg-gray-600/50 hover:bg-gray-600/80 transition-all">
                    <FaMagic className="text-gray-300 text-sm" />
                  </button>
                </div>
              </div>
              <motion.button
                onClick={sendMessage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!newMessage.trim()}
                className={`p-4 rounded-2xl flex items-center gap-2 transition-all duration-300 ${
                  newMessage.trim()
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl"
                    : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FaPaperPlane />
                <span className="font-medium">Send</span>
              </motion.button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center relative z-10"
          >
            <div className="text-center max-w-md">
              <div className="relative inline-block mb-6">
                <RiSparkling2Fill className="text-8xl text-purple-400/50 animate-pulse" />
                <IoSparkles className="absolute top-2 right-2 text-2xl text-yellow-400 animate-bounce" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Welcome to Connect
              </h3>
              <p className="text-gray-400 text-lg mb-6">
                Select a mentor from the sidebar to start an inspiring conversation and unlock your potential!
              </p>
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaShieldAlt className="text-green-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaBolt className="text-yellow-400" />
                  <span>Fast</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaGem className="text-purple-400" />
                  <span>Premium</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Chat;