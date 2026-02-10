const express = require("express");
const {
  registerMentor,
  assignTask,
  getSingleMentor,
  getAllMentors,
  loginMentor,
  getAllTasks,
  addFeedbackToMentor,
} = require("../controllers/collegeMentorController");
const router = express.Router();

router.post("/register", registerMentor);
router.post("/login", loginMentor);
router.post("/tasks", assignTask);
router.get("/:id", getSingleMentor);
router.get("/", getAllMentors);
router.get("/task", getAllTasks);
router.post("/addFeedback", addFeedbackToMentor);

module.exports = router;
