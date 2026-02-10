const CareerSimulation = require("../models/careerSimulationModel");
const axios = require("axios");

// Run Monte Carlo career simulation
const runSimulation = async (req, res) => {
  try {
    const { userId, careerPath, comparisonPath, userProfile } = req.body;

    // Call ML server for Monte Carlo simulation
    const mlResponse = await axios.post("http://localhost:8000/simulate_career", {
      careerPath,
      comparisonPath,
      userProfile,
    });

    const simulationData = mlResponse.data;

    // Save simulation to database
    const newSimulation = new CareerSimulation({
      userId,
      careerPath,
      comparisonPath,
      simulationResults: simulationData.results,
      riskAnalysis: simulationData.riskAnalysis,
      metadata: {
        userProfile,
        marketData: simulationData.marketData,
      },
    });

    await newSimulation.save();

    res.status(200).json({
      success: true,
      message: "Career simulation completed successfully",
      data: newSimulation,
    });
  } catch (error) {
    console.error("Error running career simulation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to run career simulation",
      error: error.message,
    });
  }
};

// Get simulation history for a user
const getSimulationHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const simulations = await CareerSimulation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: simulations.length,
      data: simulations,
    });
  } catch (error) {
    console.error("Error fetching simulation history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch simulation history",
      error: error.message,
    });
  }
};

// Compare two career paths side-by-side
const compareCareerPaths = async (req, res) => {
  try {
    const { simulationId1, simulationId2 } = req.params;

    const sim1 = await CareerSimulation.findById(simulationId1);
    const sim2 = await CareerSimulation.findById(simulationId2);

    if (!sim1 || !sim2) {
      return res.status(404).json({
        success: false,
        message: "One or both simulations not found",
      });
    }

    const comparison = {
      path1: {
        name: sim1.careerPath,
        riskScore: sim1.riskAnalysis.riskScore,
        rewardScore: sim1.riskAnalysis.rewardScore,
        avgSalary: calculateAverageSalary(sim1.simulationResults.yearlyProjections),
        stability: calculateAverageStability(sim1.simulationResults.yearlyProjections),
      },
      path2: {
        name: sim2.careerPath,
        riskScore: sim2.riskAnalysis.riskScore,
        rewardScore: sim2.riskAnalysis.rewardScore,
        avgSalary: calculateAverageSalary(sim2.simulationResults.yearlyProjections),
        stability: calculateAverageStability(sim2.simulationResults.yearlyProjections),
      },
      recommendation: generateRecommendation(sim1, sim2),
    };

    res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error("Error comparing career paths:", error);
    res.status(500).json({
      success: false,
      message: "Failed to compare career paths",
      error: error.message,
    });
  }
};

// Helper functions
const calculateAverageSalary = (projections) => {
  const total = projections.reduce((sum, p) => sum + p.salaryAvg, 0);
  return total / projections.length;
};

const calculateAverageStability = (projections) => {
  const total = projections.reduce((sum, p) => sum + p.jobStability, 0);
  return total / projections.length;
};

const generateRecommendation = (sim1, sim2) => {
  const score1 = (sim1.riskAnalysis.rewardScore - sim1.riskAnalysis.riskScore);
  const score2 = (sim2.riskAnalysis.rewardScore - sim2.riskAnalysis.riskScore);
  
  if (score1 > score2) {
    return `${sim1.careerPath} offers better risk-adjusted returns`;
  } else if (score2 > score1) {
    return `${sim2.careerPath} offers better risk-adjusted returns`;
  } else {
    return "Both paths have similar risk-reward profiles";
  }
};

module.exports = {
  runSimulation,
  getSimulationHistory,
  compareCareerPaths,
};
