import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTasks, FaSpinner, FaPlus, FaCheck } from "react-icons/fa";

const Tasks = () => {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?._id;

  const fetchMentorsWithTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/collegeMentor/");
      setMentors(data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      toast.error("Failed to fetch mentors");
    } finally { setIsLoading(false); }
  };

  const getSingleStudent = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/student/${studentId}`);
      setStudentData(data);
    } catch (error) { console.log(error); toast.error("Failed to load student data"); }
  };

  const assignTaskToStudent = async (taskId) => {
    try {
      await axios.post("http://localhost:5000/student/add-task", { taskId, studentId });
      toast.success("Task assigned successfully");
      getSingleStudent();
    } catch (error) { toast.error("Failed to assign task"); console.error(error); }
  };

  const isTaskAssigned = (taskId) => {
    if (!studentData || !studentData.tasks) return false;
    return studentData.tasks.some((task) => task.task._id === taskId);
  };

  useEffect(() => { fetchMentorsWithTasks(); getSingleStudent(); }, []);

  return (
    <div className="min-h-screen" style={{ background: '#ffffff', color: '#111' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 mt-[50px]">
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: '#111' }}>
            <FaTasks style={{ color: '#d4a800' }} />
            Mentor <span style={{ color: '#d4a800' }}>Tasks</span>
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl" style={{ color: '#d4a800' }} />
          </div>
        ) : mentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <motion.div
                key={mentor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ background: '#fff', border: '1px solid #e5e5e5', borderLeft: '4px solid #f5c518' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold" style={{ color: '#111' }}>{mentor.name}</h3>
                </div>

                {mentor.tasks && mentor.tasks.length > 0 ? (
                  <div className="space-y-4">
                    {mentor.tasks.map((task) => {
                      const isAssigned = isTaskAssigned(task._id);
                      return (
                        <div key={task._id} className="p-4 rounded-lg relative"
                          style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
                          {isAssigned && (
                            <div className="absolute top-2 right-2 flex items-center text-xs" style={{ color: '#16a34a' }}>
                              <FaCheck className="mr-1" /> Added
                            </div>
                          )}
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium" style={{ color: '#111' }}>{task.title}</h4>
                            <button
                              onClick={() => !isAssigned && assignTaskToStudent(task._id)}
                              className={`transition-colors ${isAssigned ? "cursor-not-allowed opacity-50" : ""}`}
                              style={{ color: isAssigned ? '#ccc' : '#d4a800' }}
                              title={isAssigned ? "Already added" : "Assign to Student"}
                              disabled={isAssigned}
                            >
                              {isAssigned ? null : <FaPlus />}
                            </button>
                          </div>
                          <p className="text-sm mt-2" style={{ color: '#666' }}>{task.description}</p>
                          <p className="text-xs mt-2" style={{ color: '#999' }}>
                            Created: {new Date(task.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center py-4" style={{ color: '#999' }}>No tasks available</p>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-lg" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
            <FaTasks className="mx-auto text-5xl mb-4" style={{ color: '#e5e5e5' }} />
            <h3 className="text-xl font-medium" style={{ color: '#999' }}>No mentors found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
