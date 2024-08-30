const userAuth = require("../Middlewares/userAuth");
const express = require("express");
const router = express.Router();
const {
	createQuiz,
	getQuizAnonymous,
	getAllQuizes,
	getAllQuizesOfUser,
	getQuize,
	deleteQuize,
	editQuize,
	saveQuizeResult,
} = require("../Controllers/quizeController");

// Route to create a quiz
router.route("/create-quiz").post(userAuth, createQuiz);
// Route to take a quiz anonymously
router.route("/take-quiz/:_id").get(getQuizAnonymous);
// Route to save quiz result
router.route("/save-quiz-result").post(saveQuizeResult);
// Route to get all quizzes (authenticated)
router.route("/get-user-quizes").get(userAuth, getAllQuizes);
// Route to get all quizzes of a specific user (authenticated)
router.route("/user-quizes").get(userAuth, getAllQuizesOfUser);
// Routes for getting, deleting, and editing a specific quiz (authenticated)
router
	.route("/:id")
	.get(userAuth, getQuize)
	.delete(userAuth, deleteQuize)
	.put(userAuth, editQuize);

module.exports = router;
