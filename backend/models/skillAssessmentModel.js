const mongoose = require("mongoose");

const skillAssessmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  assessmentType: {
    type: String,
    enum: ["prompt_engineering", "ai_collaboration", "work_slop_detection"],
    required: true,
  },
  questions: [
    {
      questionId: String,
      question: String,
      userResponse: String,
      aiOutput: String, // The AI's response to user's prompt
      score: Number,
      feedback: String,
    },
  ],
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  metrics: {
    promptClarity: Number, // 0-100
    contextAwareness: Number, // 0-100
    errorDetection: Number, // 0-100 (work-slop detection)
    iterativeImprovement: Number, // 0-100
    productivity: Number, // 0-100
  },
  badge: {
    awarded: {
      type: Boolean,
      default: false,
    },
    level: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
    },
    awardedAt: Date,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const SkillAssessment = mongoose.model("SkillAssessment", skillAssessmentSchema);

module.exports = SkillAssessment;
