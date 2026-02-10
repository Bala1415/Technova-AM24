const express = require("express");
const router = express.Router();
const {
  trackActivity,
  analyzeBurnout,
  getWellnessReport,
  scheduleCheckIn,
} = require("../controllers/wellnessController");

// POST /wellness/track - Track user activity
router.post("/track", trackActivity);

// GET /wellness/analyze/:userId - Analyze burnout risk
router.get("/analyze/:userId", analyzeBurnout);

// GET /wellness/report/:userId - Get wellness report
router.get("/report/:userId", getWellnessReport);

// POST /wellness/schedule - Schedule psychologist check-in
router.post("/schedule", scheduleCheckIn);

module.exports = router;
