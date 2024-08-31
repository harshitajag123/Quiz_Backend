const userAuth = require("../Middlewares/userAuth");
const express = require("express");
//const Quize = require("../database/models/Quiz");
//const mongoose = require("mongoose");
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
//router.route("/take-quiz/:id").get(getQuizAnonymous);
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

// Get a quiz by ID
router.get("/take-quiz/:id", async (req, res) => {
	const quizId = req.params.id;

	// Log the ID received
	console.log("Received quiz ID:", quizId);

	// Check if the ID is a valid MongoDB ObjectId
	if (!mongoose.Types.ObjectId.isValid(quizId)) {
		return res.status(400).json({ message: "Invalid Quiz ID" });
	}

	try {
		const quiz = await Quize.findById(quizId);

		if (!quiz) {
			// Log if the quiz is not found
			console.log("Quiz not found");
			return res.status(404).json({ message: "Quiz not found" });
		}

		res.json(quiz);
	} catch (err) {
		// Log the error if something goes wrong
		console.error("Error retrieving quiz:", err);
		res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
