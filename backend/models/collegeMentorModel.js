const mongoose = require("mongoose");

const CollegeMentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    course: { type: String },
    year: { type: String },
    role: { type: String, default: "CollegeMentor" },
    feedBack: [
      {
        by: {
          type: String,
        },
        student: {
          type: String,
        },
        feedback: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CollegeMentor", CollegeMentorSchema);
