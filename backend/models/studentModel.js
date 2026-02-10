const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Student" },
  tasks: [
    {
      task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
      status: {
        type: String,
        default: "Pending",
      },
    },
  ],
  attendance: [
    {
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true,
      },
    },
  ],

  feedBack: [
    {
      by: {
        type: String,
      },
      mentor: {
        type: String,
      },
      feedback: {
        type: String,
      },
    },
  ],
  uploaded: {
    type: Boolean,
    default: false,
  },
  badge: {
    type: String,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
