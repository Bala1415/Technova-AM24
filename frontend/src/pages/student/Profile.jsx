import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaUser,
  FaTasks,
  FaSpinner,
  FaCheck,
  FaEdit,
  FaCalendarAlt,
  FaClock,
  FaRegCalendarCheck,
  FaChartLine,
  FaMedal,
} from "react-icons/fa";

// Import badge images (make sure these paths are correct)
import GoldenBadge from "../../assets/golden.jpg";
import SilverBadge from "../../assets/silver.jpg";
import BronzeBadge from "../../assets/bronze.jpg";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id;
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("Present");
  const [badgeEarned, setBadgeEarned] = useState(false);

  // Get student data
  const getSingleStudent = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/student/${id}`);
      setStudentData(data);

      // Initialize status updates
      const updates = {};
      data.tasks.forEach((task) => {
        updates[task.task._id] = task.status;
      });
      setStatusUpdates(updates);

      // Check if badge needs to be awarded
      checkAndAwardBadge(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Check and award badge based on task completion
  const checkAndAwardBadge = async (studentData) => {
    if (!studentData.tasks || studentData.tasks.length === 0) return;

    const totalTasks = studentData.tasks.length;
    const completedTasks = studentData.tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    let badgeToAward = null;

    if (completedTasks === totalTasks && totalTasks > 0) {
      badgeToAward = "Golden";
    } else if (completedTasks >= totalTasks / 2) {
      badgeToAward = "Silver";
    } else if (completedTasks > 0) {
      badgeToAward = "Bronze";
    }

    // Only proceed if there's a badge to award and it's different from current badge
    if (
      badgeToAward &&
      (!studentData.badge || studentData.badge !== badgeToAward)
    ) {
      try {
        await axios.post(`http://localhost:5000/student/addBadge`, {
          id: id,
          badge: badgeToAward,
        });
        setBadgeEarned(true);
        setTimeout(() => setBadgeEarned(false), 3000); // Hide notification after 3 seconds
        toast.success(`Congratulations! You earned a ${badgeToAward} badge!`);
        getSingleStudent();
      } catch (error) {
        console.error("Error awarding badge:", error);
      }
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId) => {
    try {
      const newStatus = statusUpdates[taskId];
      await axios.post(`http://localhost:5000/student/update-task-status`, {
        taskId,
        status: newStatus,
        studentId: id,
      });
      toast.success("Task status updated successfully");
      getSingleStudent(); // Refresh data to check for badge eligibility
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task status");
    }
  };

  // Handle status change
  const handleStatusChange = (taskId, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  // Submit attendance
  const submitAttendance = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/student/addAttendance",
        {
          studentId: id,
          status: attendanceStatus,
        }
      );

      if (!data?.success) {
        console.log("Marked");
        toast.error("Attendance for this date already marked");
        return;
      }

      toast.success("Attendance marked successfully");
      setShowAttendanceModal(false);
      getSingleStudent(); // Refresh data
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Failed to mark attendance");
    }
  };

  // Calculate attendance stats
  const calculateAttendanceStats = () => {
    if (!studentData?.attendance) return {};

    const stats = {
      total: studentData.attendance.length,
      present: 0,
      late: 0,
      halfDay: 0,
    };

    studentData.attendance.forEach((record) => {
      if (record.status === "Present") stats.present++;
      else if (record.status === "Late") stats.late++;
      else if (record.status === "Half Day") stats.halfDay++;
    });

    return stats;
  };

  // Get badge image based on badge name
  const getBadgeImage = () => {
    if (!studentData?.badge) return null;

    switch (studentData.badge.toLowerCase()) {
      case "golden":
        return GoldenBadge;
      case "silver":
        return SilverBadge;
      case "bronze":
        return BronzeBadge;
      default:
        return null;
    }
  };

  // Get badge color classes
  const getBadgeColor = () => {
    if (!studentData?.badge) return "bg-gray-600";

    switch (studentData.badge.toLowerCase()) {
      case "golden":
        return "bg-yellow-600";
      case "silver":
        return "bg-gray-400";
      case "bronze":
        return "bg-amber-700";
      default:
        return "bg-gray-600";
    }
  };

  useEffect(() => {
    getSingleStudent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-indigo-400" />
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-900">
        
        <div className="text-center py-12 text-gray-300">
          <h2 className="text-2xl font-semibold">Profile not found</h2>
        </div>
      </div>
    );
  }

  const attendanceStats = calculateAttendanceStats();
  const badgeImage = getBadgeImage();

  return (
    <>
      
      <div
  className="min-h-screen bg-cover bg-center text-gray-100"
  style={{ backgroundImage: "url('https://images.pexels.com/photos/12707786/pexels-photo-12707786.jpeg')" }}
>
        <div className="container mx-auto px-4 py-8">
          {/* Badge Earned Notification */}
          {badgeEarned && studentData?.badge && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg ${getBadgeColor()} text-white flex items-center space-x-3`}
            >
              <FaMedal className="text-2xl" />
              <div>
                <h3 className="font-bold">New Achievement!</h3>
                <p>You've earned the {studentData.badge} badge!</p>
              </div>
            </motion.div>
          )}

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 mb-8 border border-gray-700"
          >
            <div className="flex flex-col md:flex-row items-center mt-[50px]">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4 md:mb-0 md:mr-6 border border-indigo-500">
                  <FaUser className="text-indigo-400 text-4xl" />
                </div>
                {badgeImage && (
                  <div className="absolute -bottom-2 -right-2">
                    {/* <img
                      src={badgeImage}
                      alt={`${studentData.badge} Badge`}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                    /> */}
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white">
                  {studentData.name}
                </h1>
                <p className="text-gray-400 mb-2">{studentData.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-block bg-indigo-900 text-indigo-300 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                    {studentData.role}
                  </span>
                  {studentData.badge && (
                    <span
                      className={`inline-flex items-center ${getBadgeColor()} text-white text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide`}
                    >
                      <FaMedal className="mr-1" /> {studentData.badge} Badge
                    </span>
                  )}
                </div>

                {/* Attendance Button */}
                <div className="mt-4">
                  {/* <button
                    onClick={() => setShowAttendanceModal(true)}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <FaCalendarAlt className="mr-2" /> Mark Attendance
                  </button> */}
                </div>
              </div>
            </div>
          </motion.div>

          
          {/* Attendance Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 mb-8 border border-gray-700"
          >
            <div className="flex items-center mb-6">
              <FaChartLine className="text-indigo-400 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-white">
                Attendance Summary
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400 text-sm">Total Days</h3>
                  <FaRegCalendarCheck className="text-indigo-400" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  {attendanceStats.total || 0}
                </p>
              </div>

              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400 text-sm">Present</h3>
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {attendanceStats.present || 0}
                </p>
                {attendanceStats.total > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round(
                      (attendanceStats.present / attendanceStats.total) * 100
                    )}
                    % of total
                  </p>
                )}
              </div>

              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400 text-sm">Late Arrivals</h3>
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {attendanceStats.late || 0}
                </p>
                {attendanceStats.total > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round(
                      (attendanceStats.late / attendanceStats.total) * 100
                    )}
                    % of total
                  </p>
                )}
              </div>

              <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-400 text-sm">Half Days</h3>
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {attendanceStats.halfDay || 0}
                </p>
                {attendanceStats.total > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round(
                      (attendanceStats.halfDay / attendanceStats.total) * 100
                    )}
                    % of total
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Attendance Records */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 mb-8 border border-gray-700"
          >
            <div className="flex items-center mb-6">
              <FaCalendarAlt className="text-indigo-400 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-white">
                Attendance Records
              </h2>
            </div>

            {studentData.attendance?.length > 0 ? (
              <div className="space-y-3">
                {studentData.attendance
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((record, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        record.status === "Present"
                          ? "border-green-900 bg-gray-750"
                          : record.status === "Late"
                          ? "border-yellow-900 bg-gray-750"
                          : "border-blue-900 bg-gray-750"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 ${
                              record.status === "Present"
                                ? "bg-green-500"
                                : record.status === "Late"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                            }`}
                          ></div>
                          <div>
                            <h3 className="font-medium capitalize">
                              {record.status}
                            </h3>
                            <p className="text-sm text-gray-400 flex items-center">
                              <FaClock className="mr-1" />
                              {new Date(record.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCalendarAlt className="mx-auto text-4xl text-gray-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-400">
                  No attendance records yet
                </h3>
                <p className="text-gray-500">
                  Mark your attendance to see records here
                </p>
              </div>
            )}
          </motion.div>

          {/* Tasks Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 border border-gray-700"
          >
            <div className="flex items-center mb-6">
              <FaTasks className="text-indigo-400 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-white">Your Tasks</h2>
            </div>

            {studentData.tasks.length > 0 ? (
              <div className="space-y-4">
                {studentData.tasks.map((taskItem) => (
                  <motion.div
                    key={taskItem._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-750"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-white">
                        {taskItem.task.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-lg font-medium ${
                          taskItem.status === "Completed"
                            ? "bg-green-900 text-green-300"
                            : taskItem.status === "In Progress"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {taskItem.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">
                      {taskItem.task.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                        Assigned:{" "}
                        {new Date(taskItem.task.createdAt).toLocaleDateString()}
                      </p>

                      {/* <div className="flex items-center space-x-2">
                        <select
                          value={
                            statusUpdates[taskItem.task._id] || taskItem.status
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              taskItem.task._id,
                              e.target.value
                            )
                          }
                          className="border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
                        >
                          <option value="Pending" className="bg-gray-800">
                            Pending
                          </option>
                          <option value="In Progress" className="bg-gray-800">
                            In Progress
                          </option>
                          <option value="Completed" className="bg-gray-800">
                            Completed
                          </option>
                        </select>

                        <button
                          onClick={() => updateTaskStatus(taskItem.task._id)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md text-sm flex items-center transition-colors"
                        >
                          <FaEdit className="mr-1" /> Update
                        </button>
                      </div> */}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaTasks className="mx-auto text-4xl text-gray-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-400">
                  No tasks assigned yet
                </h3>
                <p className="text-gray-500">
                  Your mentor will assign tasks here
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Attendance Modal */}
        {showAttendanceModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Attendance Status
                </label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="border border-gray-600 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAttendance}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Submit Attendance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Profile;

