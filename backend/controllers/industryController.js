const Mentor = require("../models/industryMentorModel");

// @desc Register a new mentor
// @route POST /api/mentors/register
const registerMentor = async (req, res) => {
  const { name, email, password, role, industry, location, company } = req.body;

  try {
    let mentor = await Mentor.findOne({ email });

    if (mentor) {
      return res.status(400).json({ message: "Mentor already exists" });
    }

    mentor = new Mentor({
      name,
      email,
      password,
      role,
      industry,
      location,
      company,
    });
    await mentor.save();

    res.status(201).json({ message: "Mentor registered successfully", mentor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc Login mentor
// @route POST /api/mentors/login
const loginMentor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mentor = await Mentor.findOne({ email });

    if (!mentor || mentor.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", user: mentor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc Get a single mentor by ID
// @route GET /api/mentors/:id
const getSingleMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc Get all mentors
// @route GET /api/mentors
const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (error) {
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
    const mentor = await Mentor.findById(mentorId);
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
  loginMentor,
  getSingleMentor,
  getAllMentors,
  addFeedbackToMentor,
};
