import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaGraduationCap,
  FaUniversity,
  FaBook,
  FaStar,
  FaCommentAlt,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdClose } from "react-icons/md";
import axios from "axios";

const AllCollegeMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [viewFeedbackModalOpen, setViewFeedbackModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/collegeMentor/"
        );

        setMentors(data);
        setFilteredMentors(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  useEffect(() => {
    const results = mentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.subjects.some((subject) =>
          subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredMentors(results);
  }, [searchTerm, mentors]);

  const openFeedbackModal = (mentor) => {
    setSelectedMentor(mentor);
    setFeedbackModalOpen(true);
    setFeedbackText("");
    setFeedbackError("");
    setFeedbackSuccess("");
  };

  const openViewFeedbackModal = (mentor) => {
    setSelectedMentor(mentor);
    setViewFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setSelectedMentor(null);
  };

  const closeViewFeedbackModal = () => {
    setViewFeedbackModalOpen(false);
    setSelectedMentor(null);
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) {
      setFeedbackError("Feedback cannot be empty");
      return;
    }

    const student = JSON.parse(localStorage.getItem("user"));
    if (!student) {
      setFeedbackError("Student information not found");
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError("");
    setFeedbackSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/collegeMentor/addFeedback",
        {
          mentorId: selectedMentor._id,
          by: student.name,
          student: student._id,
          feedback: feedbackText,
        }
      );

      if (response.data.message === "Feedback added successfully.") {
        setFeedbackSuccess("Feedback submitted successfully!");
        setFeedbackText("");
        // Update the local mentors data with the new feedback
        const updatedMentors = mentors.map((mentor) => {
          if (mentor._id === selectedMentor._id) {
            return {
              ...mentor,
              feedBack: [
                ...(mentor.feedBack || []),
                {
                  by: student.name,
                  student: student._id,
                  feedback: feedbackText,
                },
              ],
            };
          }
          return mentor;
        });
        setMentors(updatedMentors);
        setFilteredMentors(updatedMentors);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackError(
        error.response?.data?.message ||
          "Failed to submit feedback. Please try again."
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <>
      
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="flex justify-end mb-8 mt-[50px]">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Search by name, college, course or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-300">
                No mentors found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors?.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 hover:border-purple-500"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-16 w-16 rounded-full object-cover border-2 border-purple-500"
                          src={
                            mentor.image ||
                            "https://randomuser.me/api/portraits/lego/1.jpg"
                          }
                          alt={mentor.name}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {mentor.name}
                        </h3>
                        <p className="text-purple-400 flex items-center">
                          <FaGraduationCap className="mr-1" />
                          {mentor.degree}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="flex items-center text-gray-300">
                        <FaUniversity className="mr-2 text-purple-400" />
                        <span className="font-medium">College:</span>{" "}
                        <span className="ml-1 text-white">
                          Sri Vidya college of engineering and technology
                        </span>
                      </p>

                      <p className="flex items-center text-gray-300">
                        <MdLocationOn className="mr-2 text-purple-400" />
                        <span className="font-medium">Year:</span>{" "}
                        <span className="ml-1 text-white">{mentor.year}</span>
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between">
                      <div className="flex space-x-4">
                        <a
                          href={`mailto:${mentor.email}`}
                          className="text-gray-400 hover:text-purple-400 transition-colors"
                          title="Email"
                        >
                          <MdEmail className="text-xl" />
                        </a>
                        {mentor?.linkedin && (
                          <a
                            href={mentor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            title="LinkedIn"
                          >
                            <FaLinkedin className="text-xl" />
                          </a>
                        )}
                        {mentor?.twitter && (
                          <a
                            href={mentor.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            title="Twitter"
                          >
                            <FaTwitter className="text-xl" />
                          </a>
                        )}
                        {mentor?.website && (
                          <a
                            href={mentor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-purple-400 transition-colors"
                            title="Website"
                          >
                            <FaGlobe className="text-xl" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {mentor.feedBack?.length > 0 && (
                          <button
                            onClick={() => openViewFeedbackModal(mentor)}
                            className="text-gray-400 hover:text-purple-400 transition-colors flex items-center"
                            title="View Feedback"
                          >
                            <span className="text-xs bg-purple-500 text-white rounded-full px-2 py-1">
                              {mentor.feedBack.length} feedback
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => openFeedbackModal(mentor)}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Give Feedback"
                        >
                          <FaCommentAlt className="text-xl" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {feedbackModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={closeFeedbackModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <MdClose className="text-xl" />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center text-white">
              <FaCommentAlt className="mr-2 text-yellow-400" />
              Feedback for {selectedMentor?.name}
            </h3>

            {feedbackSuccess && (
              <div className="mb-4 p-3 bg-green-800 text-green-100 rounded-lg">
                {feedbackSuccess}
              </div>
            )}

            {feedbackError && (
              <div className="mb-4 p-3 bg-red-800 text-red-100 rounded-lg">
                {feedbackError}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Your Feedback</label>
              <textarea
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-100"
                rows="5"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your experience with this mentor..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeFeedbackModal}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                disabled={feedbackLoading}
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg flex items-center transition-colors"
                disabled={feedbackLoading}
              >
                {feedbackLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Feedback Modal */}
      {viewFeedbackModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={closeViewFeedbackModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <MdClose className="text-xl" />
            </button>
            <div className="flex items-center mb-6">
              <img
                className="h-16 w-16 rounded-full object-cover border-2 border-purple-500 mr-4"
                src={
                  selectedMentor?.image ||
                  "https://randomuser.me/api/portraits/lego/1.jpg"
                }
                alt={selectedMentor?.name}
              />
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedMentor?.name}
                </h3>
                <p className="text-purple-400">{selectedMentor?.title}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedMentor?.feedBack?.length || 0} feedback comments
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {selectedMentor?.feedBack?.length > 0 ? (
                selectedMentor.feedBack.map((feedback, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded-lg p-4 shadow-md"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-3">
                          {feedback.by.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="font-medium text-white">
                          {feedback.by}
                        </h4>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < 3 ? "text-yellow-400" : "text-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 pl-11">{feedback.feedback}</p>
                    <div className="text-xs text-gray-500 text-right mt-2">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FaCommentAlt className="mx-auto text-4xl mb-3" />
                  <p>No feedback yet for this mentor</p>
                  <p className="text-sm mt-1">
                    Be the first to share your experience
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={closeViewFeedbackModal}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllCollegeMentors;

