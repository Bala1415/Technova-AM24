const mongoose = require("mongoose");

const IndustryMentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    industry: { type: String },
    role: { type: String, default: "IndustryMentor" },
    location: { type: String },
    company: { type: String },
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

module.exports = mongoose.model("IndustryMentor", IndustryMentorSchema);
