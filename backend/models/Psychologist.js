const mongoose = require("mongoose");

const PsychologistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "Psychologist"},
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

module.exports = mongoose.model("Psychologist", PsychologistSchema);