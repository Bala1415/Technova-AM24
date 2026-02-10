const express = require("express");
const router = express.Router();
const {
  runSimulation,
  getSimulationHistory,
  compareCareerPaths,
} = require("../controllers/careerSimulationController");

// POST /careerSimulation/run - Run a new career simulation
router.post("/run", runSimulation);

// GET /careerSimulation/history/:userId - Get simulation history for a user
router.get("/history/:userId", getSimulationHistory);

// GET /careerSimulation/compare/:simulationId1/:simulationId2 - Compare two simulations
router.get("/compare/:simulationId1/:simulationId2", compareCareerPaths);

module.exports = router;
