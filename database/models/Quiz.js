const mongoose = require("mongoose");

const quizeSchema = new mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	name: {
		type: String,
		required: [true, "Quize Name is required"],
		maxLength: [15, "Quize Name can't be too long"],
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	quizeType: {
		type: String,
		required: [true, "Quize Type is required"],
		enum: ["QnA", "poll"],
	},

	QnAQuestions: [
		{
			ques: String,
			optionType: {
				type: String,
				enum: ["text", "imageURL", "textAndImageURL"],
			},
			options: [
				{
					text: String,
					imageURL: String,
				},
			],
			correctOption: Number,
			totalAttempts: { type: Number, default: 0 },
			correctAttempts: {
				type: Number,
				default: 0,
			},
		},
	],

	pollQuestions: [
		{
			ques: String,
			optionType: {
				type: String,
				enum: ["text", "imageURL", "textAndImageURL"],
			},
			options: [
				{
					text: String,
					imageURL: String,
					totalChoosed: {
						type: Number,
						default: 0,
					},
				},
			],
		},
	],

	timePerQuestion: String,
	url: String,

	impressions: {
		type: Number,
		default: 0,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const quize = new mongoose.model("quize", quizeSchema);

module.exports = quize;
