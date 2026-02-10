const Student = require("../models/studentModel");

// Register a student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newStudent = new Student({ name, email, password });
    await newStudent.save();

    res.status(201).json({ message: "Student registered", user: newStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login a student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Basic password check (Consider using bcrypt in real apps)
    if (student.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", user: student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate({
      path: "tasks.task",
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addAttendance = async (req, res) => {
  try {
    const { studentId, status } = req.body;

    if (!studentId || !status) {
      return res
        .status(400)
        .json({ message: "Student ID and status are required." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for date comparison

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Check if attendance for today already exists
    const alreadyMarked = student.attendance.find((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    if (alreadyMarked) {
      return res.status(200).json({
        message: "Attendance already marked for today.",
        success: false,
      });
    }

    // Add new attendance
    student.attendance.push({ date: new Date(), status });
    await student.save();

    res.status(200).json({
      message: "Attendance marked successfully",
      attendance: student.attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addFeedbackToStudent = async (req, res) => {
  try {
    const { studentId, by, mentor, feedback } = req.body;

    if (!by || !mentor || !feedback) {
      return res
        .status(400)
        .json({ message: "All feedback fields are required." });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    student.feedBack.push({ by, mentor, feedback });

    await student.save();

    res.status(200).json({ message: "Feedback added successfully.", student });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.addImage = async (req, res) => {
  try {
    const { id, uploaded } = req.body;
    const student = await Student.findById(id);
    student.uploaded = uploaded;
    await student.save();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addBadge = async (req, res) => {
  try {
    const { badge, id } = req.body;
    const student = await Student.findById(id);
    student.badge = badge;
    await student.save();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
