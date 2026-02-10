const express = require("express");
const {
  register,
  getAllPsychologist,
  loginPsychologist,
  addFeedbackToPsychologist,
} = require("../controllers/psychologistController");
const router = express.Router();

router.post("/register", register);
router.post("/login", loginPsychologist);
router.get("/", getAllPsychologist);
router.post("/addFeedback", addFeedbackToPsychologist);

module.exports = router;
