const SkillAssessment = require("../models/skillAssessmentModel");
const axios = require("axios");

// Start AI Co-Pilot assessment
const startAssessment = async (req, res) => {
  try {
    const { userId, assessmentType } = req.body;

    // Generate assessment questions via ML server
    const mlResponse = await axios.post("http://localhost:8000/generate_assessment", {
      assessmentType,
    });

    const questions = mlResponse.data.questions;

    const newAssessment = new SkillAssessment({
      userId,
      assessmentType,
      questions: questions.map(q => ({
        questionId: q.id,
        question: q.text,
        userResponse: "",
        aiOutput: "",
        score: 0,
        feedback: "",
      })),
      overallScore: 0,
    });

    await newAssessment.save();

    res.status(200).json({
      success: true,
      message: "Assessment started successfully",
      assessmentId: newAssessment._id,
      questions: questions.map(q => ({ id: q.id, text: q.text })),
    });
  } catch (error) {
    console.error("Error starting assessment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start assessment",
      error: error.message,
    });
  }
};

// Submit and evaluate response
const submitResponse = async (req, res) => {
  try {
    const { assessmentId, questionId, userResponse } = req.body;

    const assessment = await SkillAssessment.findById(assessmentId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    // Find the question
    const questionIndex = assessment.questions.findIndex(
      q => q.questionId === questionId
    );

    if (questionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Evaluate the response via ML server
    const mlResponse = await axios.post("http://localhost:8000/assess_prompt_engineering", {
      question: assessment.questions[questionIndex].question,
      userPrompt: userResponse,
      assessmentType: assessment.assessmentType,
    });

    const { aiOutput, score, feedback, metrics } = mlResponse.data;

    // Update the question
    assessment.questions[questionIndex].userResponse = userResponse;
    assessment.questions[questionIndex].aiOutput = aiOutput;
    assessment.questions[questionIndex].score = score;
    assessment.questions[questionIndex].feedback = feedback;

    // Check if all questions are answered
    const allAnswered = assessment.questions.every(q => q.userResponse !== "");

    if (allAnswered) {
      // Calculate overall score
      const totalScore = assessment.questions.reduce((sum, q) => sum + q.score, 0);
      assessment.overallScore = totalScore / assessment.questions.length;
      assessment.metrics = metrics;
      assessment.completedAt = new Date();

      // Award badge if score is high enough
      if (assessment.overallScore >= 90) {
        assessment.badge = { awarded: true, level: "platinum", awardedAt: new Date() };
      } else if (assessment.overallScore >= 80) {
        assessment.badge = { awarded: true, level: "gold", awardedAt: new Date() };
      } else if (assessment.overallScore >= 70) {
        assessment.badge = { awarded: true, level: "silver", awardedAt: new Date() };
      } else if (assessment.overallScore >= 60) {
        assessment.badge = { awarded: true, level: "bronze", awardedAt: new Date() };
      }
    }

    await assessment.save();

    res.status(200).json({
      success: true,
      message: "Response submitted successfully",
      data: {
        score,
        feedback,
        aiOutput,
        completed: allAnswered,
        overallScore: allAnswered ? assessment.overallScore : null,
        badge: allAnswered ? assessment.badge : null,
      },
    });
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit response",
      error: error.message,
    });
  }
};

// Get assessment results
const getAssessmentResults = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await SkillAssessment.findById(assessmentId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    console.error("Error fetching assessment results:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assessment results",
      error: error.message,
    });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { assessmentType } = req.query;

    const query = assessmentType ? { assessmentType } : {};

    const topScorers = await SkillAssessment.find(query)
      .populate("userId", "name email")
      .sort({ overallScore: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: topScorers.length,
      data: topScorers.map((a, index) => ({
        rank: index + 1,
        user: a.userId,
        score: a.overallScore,
        badge: a.badge,
        completedAt: a.completedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
};

module.exports = {
  startAssessment,
  submitResponse,
  getAssessmentResults,
  getLeaderboard,
};
