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

  const getSingleStudent = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/student/${id}`);
      setStudentData(data);
      const updates = {};
      data.tasks.forEach((task) => { updates[task.task._id] = task.status; });
      setStatusUpdates(updates);
      checkAndAwardBadge(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile data");
    } finally { setLoading(false); }
  };

  const checkAndAwardBadge = async (studentData) => {
    if (!studentData.tasks || studentData.tasks.length === 0) return;
    const totalTasks = studentData.tasks.length;
    const completedTasks = studentData.tasks.filter((task) => task.status === "Completed").length;
    let badgeToAward = null;
    if (completedTasks === totalTasks && totalTasks > 0) badgeToAward = "Golden";
    else if (completedTasks >= totalTasks / 2) badgeToAward = "Silver";
    else if (completedTasks > 0) badgeToAward = "Bronze";
    if (badgeToAward && (!studentData.badge || studentData.badge !== badgeToAward)) {
      try {
        await axios.post(`http://localhost:5000/student/addBadge`, { id: id, badge: badgeToAward });
        setBadgeEarned(true);
        setTimeout(() => setBadgeEarned(false), 3000);
        toast.success(`Congratulations! You earned a ${badgeToAward} badge!`);
        getSingleStudent();
      } catch (error) { console.error("Error awarding badge:", error); }
    }
  };

  const updateTaskStatus = async (taskId) => {
    try {
      const newStatus = statusUpdates[taskId];
      await axios.post(`http://localhost:5000/student/update-task-status`, { taskId, status: newStatus, studentId: id });
      toast.success("Task status updated successfully");
      getSingleStudent();
    } catch (error) { console.log(error); toast.error("Failed to update task status"); }
  };

  const handleStatusChange = (taskId, value) => {
    setStatusUpdates((prev) => ({ ...prev, [taskId]: value }));
  };

  const submitAttendance = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/student/addAttendance", { studentId: id, status: attendanceStatus });
      if (!data?.success) { toast.error("Attendance for this date already marked"); return; }
      toast.success("Attendance marked successfully");
      setShowAttendanceModal(false);
      getSingleStudent();
    } catch (error) { console.error("Error submitting attendance:", error); toast.error("Failed to mark attendance"); }
  };

  const calculateAttendanceStats = () => {
    if (!studentData?.attendance) return {};
    const stats = { total: studentData.attendance.length, present: 0, late: 0, halfDay: 0 };
    studentData.attendance.forEach((record) => {
      if (record.status === "Present") stats.present++;
      else if (record.status === "Late") stats.late++;
      else if (record.status === "Half Day") stats.halfDay++;
    });
    return stats;
  };

  const getBadgeImage = () => {
    if (!studentData?.badge) return null;
    switch (studentData.badge.toLowerCase()) {
      case "golden": return GoldenBadge;
      case "silver": return SilverBadge;
      case "bronze": return BronzeBadge;
      default: return null;
    }
  };

  const getBadgeColor = () => {
    if (!studentData?.badge) return { background: '#e5e5e5', color: '#555' };
    switch (studentData.badge.toLowerCase()) {
      case "golden": return { background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' };
      case "silver": return { background: 'linear-gradient(135deg, #c0c0c0, #a0a0a0)', color: '#0a0a0a' };
      case "bronze": return { background: 'linear-gradient(135deg, #cd7f32, #a0622e)', color: '#fff' };
      default: return { background: '#e5e5e5', color: '#555' };
    }
  };

  useEffect(() => { getSingleStudent(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ background: '#fff' }}>
        <FaSpinner className="animate-spin text-4xl" style={{ color: '#d4a800' }} />
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen" style={{ background: '#fff' }}>
        <div className="text-center py-12" style={{ color: '#555' }}>
          <h2 className="text-2xl font-semibold">Profile not found</h2>
        </div>
      </div>
    );
  }

  const attendanceStats = calculateAttendanceStats();
  const badgeImage = getBadgeImage();
  const badgeStyle = getBadgeColor();

  return (
    <>
      <div className="min-h-screen" style={{ background: '#ffffff' }}>
        <div className="container mx-auto px-4 py-8">
          {/* Badge Earned Notification */}
          {badgeEarned && studentData?.badge && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3"
              style={{ ...badgeStyle }}
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
            className="rounded-xl shadow-sm overflow-hidden p-6 mb-8"
            style={{ background: '#fff', border: '1px solid #e5e5e5' }}
          >
            <div className="flex flex-col md:flex-row items-center mt-[50px]">
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6"
                  style={{ background: '#fafafa', border: '2px solid #f5c518' }}>
                  <FaUser className="text-4xl" style={{ color: '#d4a800' }} />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold" style={{ color: '#111' }}>{studentData.name}</h1>
                <p className="mb-2" style={{ color: '#666' }}>{studentData.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-block text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide"
                    style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}>
                    {studentData.role}
                  </span>
                  {studentData.badge && (
                    <span className="inline-flex items-center text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide"
                      style={badgeStyle}>
                      <FaMedal className="mr-1" /> {studentData.badge} Badge
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Attendance Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl shadow-sm overflow-hidden p-6 mb-8"
            style={{ background: '#fff', border: '1px solid #e5e5e5' }}
          >
            <div className="flex items-center mb-6">
              <FaChartLine className="text-xl mr-2" style={{ color: '#d4a800' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#111' }}>Attendance Summary</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm" style={{ color: '#999' }}>Total Days</h3>
                  <FaRegCalendarCheck style={{ color: '#d4a800' }} />
                </div>
                <p className="text-2xl font-bold mt-2" style={{ color: '#111' }}>{attendanceStats.total || 0}</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm" style={{ color: '#999' }}>Present</h3>
                  <div className="w-4 h-4 rounded-full" style={{ background: '#16a34a' }}></div>
                </div>
                <p className="text-2xl font-bold mt-2" style={{ color: '#111' }}>{attendanceStats.present || 0}</p>
                {attendanceStats.total > 0 && (
                  <p className="text-xs mt-1" style={{ color: '#999' }}>
                    {Math.round((attendanceStats.present / attendanceStats.total) * 100)}% of total
                  </p>
                )}
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm" style={{ color: '#999' }}>Late Arrivals</h3>
                  <div className="w-4 h-4 rounded-full" style={{ background: '#f5c518' }}></div>
                </div>
                <p className="text-2xl font-bold mt-2" style={{ color: '#111' }}>{attendanceStats.late || 0}</p>
                {attendanceStats.total > 0 && (
                  <p className="text-xs mt-1" style={{ color: '#999' }}>
                    {Math.round((attendanceStats.late / attendanceStats.total) * 100)}% of total
                  </p>
                )}
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm" style={{ color: '#999' }}>Half Days</h3>
                  <div className="w-4 h-4 rounded-full" style={{ background: '#3b82f6' }}></div>
                </div>
                <p className="text-2xl font-bold mt-2" style={{ color: '#111' }}>{attendanceStats.halfDay || 0}</p>
                {attendanceStats.total > 0 && (
                  <p className="text-xs mt-1" style={{ color: '#999' }}>
                    {Math.round((attendanceStats.halfDay / attendanceStats.total) * 100)}% of total
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
            className="rounded-xl shadow-sm overflow-hidden p-6 mb-8"
            style={{ background: '#fff', border: '1px solid #e5e5e5' }}
          >
            <div className="flex items-center mb-6">
              <FaCalendarAlt className="text-xl mr-2" style={{ color: '#d4a800' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#111' }}>Attendance Records</h2>
            </div>

            {studentData.attendance?.length > 0 ? (
              <div className="space-y-3">
                {studentData.attendance
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-lg p-4 hover:shadow-md transition-shadow"
                      style={{
                        background: '#fafafa',
                        border: `1px solid ${record.status === "Present" ? '#bbf7d0' : record.status === "Late" ? '#fde68a' : '#bfdbfe'}`
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-3"
                            style={{ background: record.status === "Present" ? '#16a34a' : record.status === "Late" ? '#f5c518' : '#3b82f6' }}></div>
                          <div>
                            <h3 className="font-medium capitalize" style={{ color: '#111' }}>{record.status}</h3>
                            <p className="text-sm flex items-center" style={{ color: '#999' }}>
                              <FaClock className="mr-1" />
                              {new Date(record.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium" style={{ color: '#555' }}>
                            {new Date(record.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCalendarAlt className="mx-auto text-4xl mb-3" style={{ color: '#e5e5e5' }} />
                <h3 className="text-lg font-medium" style={{ color: '#999' }}>No attendance records yet</h3>
                <p style={{ color: '#ccc' }}>Mark your attendance to see records here</p>
              </div>
            )}
          </motion.div>

          {/* Tasks Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl shadow-sm overflow-hidden p-6"
            style={{ background: '#fff', border: '1px solid #e5e5e5' }}
          >
            <div className="flex items-center mb-6">
              <FaTasks className="text-xl mr-2" style={{ color: '#d4a800' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#111' }}>Your Tasks</h2>
            </div>

            {studentData.tasks.length > 0 ? (
              <div className="space-y-4">
                {studentData.tasks.map((taskItem) => (
                  <motion.div
                    key={taskItem._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-lg p-4 hover:shadow-md transition-shadow"
                    style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium" style={{ color: '#111' }}>{taskItem.task.title}</h3>
                      <span className="px-2 py-1 rounded-full text-sm font-medium"
                        style={
                          taskItem.status === "Completed"
                            ? { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }
                            : taskItem.status === "In Progress"
                            ? { background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }
                            : { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }
                        }>
                        {taskItem.status}
                      </span>
                    </div>
                    <p style={{ color: '#666' }} className="mb-4">{taskItem.task.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <p className="text-sm mb-2 sm:mb-0" style={{ color: '#999' }}>
                        Assigned: {new Date(taskItem.task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaTasks className="mx-auto text-4xl mb-3" style={{ color: '#e5e5e5' }} />
                <h3 className="text-lg font-medium" style={{ color: '#999' }}>No tasks assigned yet</h3>
                <p style={{ color: '#ccc' }}>Your mentor will assign tasks here</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Attendance Modal */}
        {showAttendanceModal && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="rounded-lg p-6 w-full max-w-md" style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#111' }}>Mark Attendance</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>Attendance Status</label>
                <select value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="rounded-md px-3 py-2 w-full focus:outline-none"
                  style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}>
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowAttendanceModal(false)}
                  className="px-4 py-2 rounded-md transition-colors"
                  style={{ background: '#f5f5f5', color: '#555', border: '1px solid #e5e5e5' }}>Cancel</button>
                <button onClick={submitAttendance}
                  className="px-4 py-2 rounded-md font-medium transition-all"
                  style={{ background: 'linear-gradient(135deg, #f5c518, #d4a800)', color: '#0a0a0a' }}>Submit Attendance</button>
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
