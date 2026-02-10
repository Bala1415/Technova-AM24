const express = require("express");
const router = express.Router();
const {
  startAssessment,
  submitResponse,
  getAssessmentResults,
  getLeaderboard,
} = require("../controllers/skillAssessmentController");

// POST /skillAssessment/start - Start a new assessment
router.post("/start", startAssessment);

// POST /skillAssessment/submit - Submit a response
router.post("/submit", submitResponse);

// GET /skillAssessment/results/:assessmentId - Get assessment results
router.get("/results/:assessmentId", getAssessmentResults);

// GET /skillAssessment/leaderboard - Get leaderboard
router.get("/leaderboard", getLeaderboard);

module.exports = router;
