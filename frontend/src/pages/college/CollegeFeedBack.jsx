import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserGraduate, FaQuoteLeft, FaStar, FaRegStar } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiGraduationCapFill } from "react-icons/ri";

const CollegeFeedBack = () => {
  const mentor = JSON.parse(localStorage.getItem("user"));
  const mentorId = mentor?._id;
  const [mentorData, setMentorData] = useState(null);
  const [feedbacks, setAllFeedbacks] = useState([]);

  const getSingleMentor = async () => {
    const id = mentorId;
    try {
      const { data } = await axios.get(
        `http://localhost:5000/collegeMentor/${id}`
      );
      setMentorData(data);
      setAllFeedbacks(data?.feedBack || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleMentor();
  }, []);

  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 inline" />
        ) : (
          <FaRegStar key={i} className="text-gray-400 inline" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      

      <div className="container mx-auto px-4 py-8">
        {mentorData && (
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 mt-[40px]">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-4xl font-bold mb-4 md:mb-0 md:mr-6">
                {mentorData.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{mentorData.name}</h1>
                <div className="flex items-center mt-2 text-indigo-300">
                  <RiGraduationCapFill className="mr-2" />
                  <span>
                    {mentorData.course} - {mentorData.year}
                  </span>
                </div>
                <div className="flex items-center mt-1 text-indigo-300">
                  <MdEmail className="mr-2" />
                  <span>{mentorData.email}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-indigo-300 border-b border-indigo-600 pb-2">
          Student Feedbacks ({feedbacks.length})
        </h2>

        {feedbacks.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-xl text-gray-400">No feedbacks yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((feedback, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-indigo-500/20 hover:border-indigo-500 border border-gray-700 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
                    <FaUserGraduate className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{feedback.by}</h3>
                  </div>
                </div>
                <div className="relative">
                  <FaQuoteLeft className="text-indigo-400 opacity-20 text-4xl absolute -top-2 -left-2" />
                  <p className="text-gray-300 italic pl-6 relative z-10">
                    {feedback.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeFeedBack;

