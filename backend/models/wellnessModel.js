const mongoose = require("mongoose");

const wellnessSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  activityLog: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      action: {
        type: String,
        enum: ["login", "task_start", "task_complete", "quiz", "chat", "study", "break"],
      },
      duration: Number, // in minutes
      timeOfDay: String, // "morning", "afternoon", "evening", "night", "late-night"
    },
  ],
  wellnessMetrics: {
    burnoutRisk: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    stressLevel: {
      type: Number,
      min: 0,
      max: 10,
      default: 5,
    },
    activityPattern: {
      lateNightSessions: Number, // Count of sessions after 11 PM
      consecutiveDays: Number, // Days without break
      averageSessionLength: Number, // in hours
      peakProductivityTime: String,
    },
    lastAssessment: {
      type: Date,
      default: Date.now,
    },
  },
  interventions: [
    {
      type: {
        type: String,
        enum: ["rest_day", "psychologist_session", "break_reminder", "wellness_tip"],
      },
      message: String,
      scheduled: Date,
      completed: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  psychologistSessions: [
    {
      sessionDate: Date,
      psychologistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Psychologist",
      },
      notes: String,
      outcome: String,
    },
  ],
});

const Wellness = mongoose.model("Wellness", wellnessSchema);

module.exports = Wellness;
