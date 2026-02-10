const Wellness = require("../models/wellnessModel");
const axios = require("axios");

// Track user activity
const trackActivity = async (req, res) => {
  try {
    const { userId, action, duration } = req.body;

    const now = new Date();
    const hour = now.getHours();
    let timeOfDay;

    if (hour >= 5 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17 && hour < 21) timeOfDay = "evening";
    else if (hour >= 21 && hour < 23) timeOfDay = "night";
    else timeOfDay = "late-night";

    let wellness = await Wellness.findOne({ userId });

    if (!wellness) {
      wellness = new Wellness({ userId, activityLog: [] });
    }

    wellness.activityLog.push({
      timestamp: now,
      action,
      duration,
      timeOfDay,
    });

    await wellness.save();

    res.status(200).json({
      success: true,
      message: "Activity tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track activity",
      error: error.message,
    });
  }
};

// Analyze burnout risk
const analyzeBurnout = async (req, res) => {
  try {
    const { userId } = req.params;

    const wellness = await Wellness.findOne({ userId });

    if (!wellness || wellness.activityLog.length < 5) {
      return res.status(200).json({
        success: true,
        message: "Insufficient data for analysis",
        burnoutRisk: 0,
      });
    }

    // Call ML server for burnout detection
    const mlResponse = await axios.post("http://localhost:8000/detect_burnout", {
      activityLog: wellness.activityLog,
    });

    const { burnoutRisk, stressLevel, activityPattern } = mlResponse.data;

    // Update wellness metrics
    wellness.wellnessMetrics.burnoutRisk = burnoutRisk;
    wellness.wellnessMetrics.stressLevel = stressLevel;
    wellness.wellnessMetrics.activityPattern = activityPattern;
    wellness.wellnessMetrics.lastAssessment = new Date();

    // Auto-schedule intervention if high risk
    if (burnoutRisk > 70) {
      wellness.interventions.push({
        type: "psychologist_session",
        message: "Your burnout risk is high. We recommend scheduling a session with a psychologist.",
        scheduled: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      });
    } else if (burnoutRisk > 50) {
      wellness.interventions.push({
        type: "rest_day",
        message: "Consider taking a break. Your activity patterns suggest you need rest.",
        scheduled: new Date(),
      });
    }

    await wellness.save();

    res.status(200).json({
      success: true,
      data: {
        burnoutRisk,
        stressLevel,
        activityPattern,
        interventions: wellness.interventions.filter(i => !i.completed),
      },
    });
  } catch (error) {
    console.error("Error analyzing burnout:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze burnout",
      error: error.message,
    });
  }
};

// Get wellness report
const getWellnessReport = async (req, res) => {
  try {
    const { userId } = req.params;

    const wellness = await Wellness.findOne({ userId })
      .populate("psychologistSessions.psychologistId", "name email");

    if (!wellness) {
      return res.status(404).json({
        success: false,
        message: "No wellness data found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: wellness,
    });
  } catch (error) {
    console.error("Error fetching wellness report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wellness report",
      error: error.message,
    });
  }
};

// Schedule psychologist check-in
const scheduleCheckIn = async (req, res) => {
  try {
    const { userId, psychologistId, sessionDate, notes } = req.body;

    const wellness = await Wellness.findOne({ userId });

    if (!wellness) {
      return res.status(404).json({
        success: false,
        message: "Wellness record not found",
      });
    }

    wellness.psychologistSessions.push({
      sessionDate,
      psychologistId,
      notes,
    });

    await wellness.save();

    res.status(200).json({
      success: true,
      message: "Psychologist session scheduled successfully",
      data: wellness.psychologistSessions[wellness.psychologistSessions.length - 1],
    });
  } catch (error) {
    console.error("Error scheduling check-in:", error);
    res.status(500).json({
      success: false,
      message: "Failed to schedule check-in",
      error: error.message,
    });
  }
};

module.exports = {
  trackActivity,
  analyzeBurnout,
  getWellnessReport,
  scheduleCheckIn,
};
