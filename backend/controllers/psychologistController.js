const Psychologist = require("../models/Psychologist");

const register = async (req, res) => {
  const { name, email, password} = req.body;

  try {
    let psychologist = await Psychologist.findOne({ email });

    if (psychologist) {
      return res.status(400).json({ message: "Psychologist already exists" });
    }

    psychologist = new Psychologist({
      name,
      email,
      password
    });
    await psychologist.save();

    res.status(201).json({ message: "Psychologist registered successfully", psychologist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const loginPsychologist = async (req, res) => {
  const { email, password } = req.body;

  try {
    const psychologist = await Psychologist.findOne({ email });

    if (!psychologist || psychologist.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", user: psychologist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getAllPsychologist = async (req, res) => {
  try {
    const psychologists = await Psychologist.find()
    res.json(psychologists);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};



const addFeedbackToPsychologist = async (req, res) => {
  const { psychologistId, by, student, feedback } = req.body;

  try {
    // Validate input
    if (!by || !student || !feedback) {
      return res
        .status(400)
        .json({ message: "All feedback fields are required." });
    }

    // Find the psychologist
    const psychologist = await Psychologist.findById(psychologistId);
    if (!psychologist) {
      return res.status(404).json({ message: "Mentor not found." });
    }

    // Add feedback
    psychologist.feedBack.push({ by, student, feedback });

    // Save updated psychologist
    await psychologist.save();

    res.status(200).json({ message: "Feedback added successfully.", psychologist });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Server error. Could not add feedback." });
  }
};
module.exports = {
  register,
  getAllPsychologist,
  loginPsychologist,
  addFeedbackToPsychologist,
};
