const Quize = require("../database/models/Quiz");
const mongoose = require("mongoose");

//function to create quiz
exports.createQuiz = async (req, res) => {
	try {
		const { name, quizeType, timePerQuestion, QnAQuestions, pollQuestions } =
			req.body;

		//check if name and quiz is present
		if (!name || !quizeType) {
			return res
				.status(400)
				.json({ error: "Quiz name and quiz type are required" });
		}

		// Check if questions are provided and limit them
		if (quizeType === "QnA") {
			if (!QnAQuestions || QnAQuestions.length === 0) {
				return res.status(400).json({ error: "QnA Questions are required" });
			}
			if (QnAQuestions.length > 5) {
				return res.status(400).json({
					error: "You can only create up to 5 QnA questions per quiz",
				});
			}
		} else if (quizeType === "poll") {
			if (!pollQuestions || pollQuestions.length === 0) {
				return res.status(400).json({ error: "Poll Questions are required" });
			}
			if (pollQuestions.length > 5) {
				return res.status(400).json({
					error: "You can only create up to 5 poll questions per quiz",
				});
			}
		}

		//check if questions in array is present or not empty
		if (
			(quizeType == "QnA" && !QnAQuestions) ||
			(quizeType == "poll" && !pollQuestions)
		) {
			return res.status(400).json({ error: "Questions are required" });
		}

		//check if time per question is present
		if (quizeType == "QnA" && !timePerQuestion) {
			return res.status(400).json({ error: "Time per question is required" });
		}

		//generate unique id for quiz
		const _id = new mongoose.Types.ObjectId();

		//genarting url

		//const URL = `https://quiz-backend-nxpv.onrender.com/anonymous/${_id}`;
		//const URL = `https://cuvette-quizzie.vercel.app/anonymous/${_id}`;
		//const URL = `http://localhost:5000/api/quiz/take-quiz/${_id}`;

		const URL = `https://quiz-backend-nxpv.onrender.com/api/quiz/take-quiz/${_id}`;

		//cretaing new quiz
		const quize = await Quize.create({
			_id,
			creator: req.user._id,
			url: URL,
			...req.body,
		});

		res.status(201).json({
			success: true,
			url: URL,
			message: "Quiz created successfully",
			quize,
		});

		//debugging
		console.log("User ID:", req.user._id);
		console.log("Quiz created successfully");
		console.log("quiz-id: ", quize._id);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//function  to get one quiz -- for anonymous
exports.getQuizAnonymous = async (req, res) => {
	console.log("Anonymous quiz access route hit");
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ error: "ID is required" });
		}

		let quize = await Quize.findById(id);
		if (!quize) {
			return res.status(404).json({ error: "Quiz not found, invalid ID" });
		}

		console.log("Current impressions:", quize.impressions);

		quize.impressions += 1;
		await quize.save();

		res.status(200).json({
			success: true,
			message: "Quiz fetched successfully",
			time: quize.timePerQuestion,
			quizeType: quize.quizeType,
			questions:
				quize.quizeType === "QnA" ? quize.QnAQuestions : quize.pollQuestions,
		});

		console.log("Updated impressions:", quize.impressions);
		console.log("Quiz ID:", quize._id);
		console.log("Quiz fetched successfully");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//function  to get all quizes
exports.getAllQuizes = async (req, res) => {
	try {
		//getting all quizes
		const quizes = await Quize.find();
		if (!quizes) {
			return res.status(404).json({ error: " No Quiz not found, invalid id" });
		}

		const totalQuizes = quizes.length;
		let totalQuestions = 0;
		let totalImpressions = 0;
		let ques = [];

		for (let i = 0; i < totalQuizes; i++) {
			ques =
				quizes[i].quizeType == "QnA"
					? quizes[i].QnAQuestions
					: quizes[i].pollQuestions;
			totalQuestions += ques.length;
			totalImpressions += quizes[i].impressions;
		}

		const filteredQuizes = quizes.filter((q, i) => q.impressions > 1);
		const sortedQuizes = filteredQuizes.sort(
			(a, b) => b.impressions - a.impressions
		);

		res.status(200).json({
			success: true,
			message: "Quizes found successfully",
			quizes: sortedQuizes,
			totalQuizes,
			totalQuestions,
			totalImpressions,
		});

		//debugging
		console.log("User ID:", req.user._id);
		console.log("Quizes found successfully");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//function to get all quizzes of a specific user
exports.getAllQuizesOfUser = async (req, res) => {
	try {
		// Fetching all quizzes created by the logged-in user
		const quizes = await Quize.find({ creator: req.user._id });

		if (!quizes || quizes.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No quizzes found for this user",
			});
		}

		const totalQuizes = quizes.length;
		let totalQuestions = 0;
		let totalImpressions = 0;

		quizes.forEach((quiz) => {
			totalQuestions +=
				quiz.quizeType === "QnA"
					? quiz.QnAQuestions.length
					: quiz.pollQuestions.length;
			totalImpressions += quiz.impressions;
		});

		res.status(200).json({
			success: true,
			message: "Quizzes found successfully",
			totalQuizes,
			totalQuestions,
			totalImpressions,
			quizes,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
//function to get quizes of user --to get one quiz
exports.getQuize = async (req, res) => {
	try {
		//checking if id is not present
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ error: "id is required" });
		}

		//getting quiz with id
		const quize = await Quize.findOne({ _id: id, creator: req.user._id });
		if (!quize) {
			return res.status(400).json({ error: "quiz not found" });
		}

		res.status(200).json({
			success: true,
			message: "quiz found successfully",
			quize,
		});

		//debugging
		console.log("quiz ID:", quize._id);
		console.log(
			"quiz found successfully with quiz id for user id:",
			req.user._id
		);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//function to update quiz
exports.editQuize = async (req, res) => {
	try {
		//checking if id is not present
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ error: "id is required" });
		}

		//getting quiz with id and update
		const quize = await Quize.findOneAndUpdate(
			{ _id: id, creator: req.user._id },
			req.body
		);
		if (!quize) {
			return res.status(400).json({ error: "quiz not found" });
		}

		res.status(200).json({
			success: true,
			message: "quiz updated successfully",
		});
		//debugging
		console.log("User ID:", req.user._id);
		console.log("Quiz updated successfully");
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};
//function to delete quiz
exports.deleteQuize = async (req, res) => {
	try {
		//checking if id is not present
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({
				error: "id is required",
			});
		}

		//deleting quiz
		const quize = await Quize.deleteOne({ _id: id, creator: req.user._id });
		if (!quize) {
			return res.status(400).json({ error: "quiz not found" });
		}

		res.status(200).json({
			success: true,
			message: "quiz deleted successfully",
		});

		//debugging
		console.log("User ID:", req.user._id);
		console.log("Quiz deleted successfully");
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

//save quize result -- given by different users
exports.saveQuizeResult = async (req, res) => {
	try {
		const { quizeId, choosedOptions } = req.body;

		if (!quizeId) {
			return res.status(400).json({ error: "Quiz ID is required" });
		}

		if (!choosedOptions || !Array.isArray(choosedOptions)) {
			return res.status(400).json({ error: "choosedOptions must be an array" });
		}

		let quize = await Quize.findById(quizeId);
		if (!quize) {
			return res.status(404).json({ error: "Quiz not found, invalid ID" });
		}

		let correctAttempts = 0;

		if (quize.quizeType === "QnA") {
			for (let i = 0; i < choosedOptions.length; i++) {
				if (i < quize.QnAQuestions.length) {
					if (choosedOptions[i] == quize.QnAQuestions[i].correctOption) {
						quize.QnAQuestions[i].correctAttempts += 1;
						correctAttempts += 1;
					}
					quize.QnAQuestions[i].totalAttempts += 1;
				}
			}
		} else {
			for (let i = 0; i < choosedOptions.length; i++) {
				if (i < quize.pollQuestions.length && choosedOptions[i]) {
					quize.pollQuestions[i].options[
						Number(choosedOptions[i]) - 1
					].totalChoosed += 1;
				}
			}
		}

		await quize.save();

		res.status(200).json({
			success: true,
			message: "Quiz updated successfully",
			correctAttempts: quize.quizeType == "QnA" ? correctAttempts : null,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
