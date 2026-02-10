const mongoose = require("mongoose");

const careerSimulationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  careerPath: {
    type: String,
    required: true,
  },
  comparisonPath: {
    type: String,
    default: null,
  },
  simulationResults: {
    yearlyProjections: [
      {
        year: Number,
        salaryMin: Number,
        salaryMax: Number,
        salaryAvg: Number,
        jobStability: Number, // 0-100 score
        marketDemand: Number, // 0-100 score
      },
    ],
    totalSimulations: {
      type: Number,
      default: 1000, // Monte Carlo iterations
    },
    successRate: Number, // Percentage of successful outcomes
  },
  riskAnalysis: {
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    rewardScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    volatility: Number, // Salary/job market volatility
    recommendation: String,
  },
  metadata: {
    userProfile: {
      currentSkills: [String],
      experience: Number,
      education: String,
    },
    marketData: {
      industry: String,
      location: String,
      economicFactors: Object,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CareerSimulation = mongoose.model("CareerSimulation", careerSimulationSchema);

module.exports = CareerSimulation;
