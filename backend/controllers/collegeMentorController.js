const CollegeMentor = require("../models/collegeMentorModel");
const Task = require("../models/taskModel");

const registerMentor = async (req, res) => {
  const { name, email, password, course, year } = req.body;

  try {
    let mentor = await CollegeMentor.findOne({ email });

    if (mentor) {
      return res.status(400).json({ message: "Mentor already exists" });
    }

    mentor = new CollegeMentor({
      name,
      email,
      password,
      tasks: [],
      course,
      year,
    });
    await mentor.save();

    res.status(201).json({ message: "Mentor registered successfully", mentor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const loginMentor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mentor = await CollegeMentor.findOne({ email });

    if (!mentor || mentor.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", user: mentor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const assignTask = async (req, res) => {
  const { title, description, mentorId } = req.body;

  try {
    const mentor = await CollegeMentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const task = new Task({ title, description });
    await task.save();

    mentor.tasks.push(task._id);
    await mentor.save();

    res.json({ message: "Task assigned successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getSingleMentor = async (req, res) => {
  try {
    const mentor = await CollegeMentor.findById(req.params.id).populate(
      "tasks"
    );
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getAllMentors = async (req, res) => {
  try {
    const mentors = await CollegeMentor.find().populate("tasks");
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    console.log(tasks);
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const addFeedbackToMentor = async (req, res) => {
  const { mentorId, by, student, feedback } = req.body;

  try {
    // Validate input
    if (!by || !student || !feedback) {
      return res
        .status(400)
        .json({ message: "All feedback fields are required." });
    }

    // Find the mentor
    const mentor = await CollegeMentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found." });
    }

    // Add feedback
    mentor.feedBack.push({ by, student, feedback });

    // Save updated mentor
    await mentor.save();

    res.status(200).json({ message: "Feedback added successfully.", mentor });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Server error. Could not add feedback." });
  }
};
module.exports = {
  registerMentor,
  assignTask,
  getSingleMentor,
  getAllMentors,
  loginMentor,
  getAllTasks,
  addFeedbackToMentor,
};
