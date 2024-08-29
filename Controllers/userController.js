const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../database/models/User");
const jwt = require("jsonwebtoken");

//signup route
exports.signUp = async (req, res, next) => {
	try {
		const { name, email, password, confirmPassword } = req.body;

		//checking if any field is missing
		if (!name || !email || !password || !confirmPassword) {
			return res.status(400).json({ error: "Please fill all the fields" });
		}

		//checking if user already exists
		const user = await User.findOne({ email });
		if (user) {
			return res.status(409).json({ error: "User already exists" });
		}

		//checking if password and confirm password matches
		if (password != confirmPassword) {
			return res
				.status(400)
				.json({ error: "Password and confirm password does not match" });
		}

		//encrypting password
		const hashedPassword = await bcrypt.hash(password, 12);

		//if no error is thrown, then user is created in db
		const newUser = await User.create({
			_id: new mongoose.Types.ObjectId(),
			name,
			email,
			password: hashedPassword,
		});

		res.status(201).json({
			success: true,
			message: "User signed up successfully",
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

//login route
exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	//check if the field is empty
	if (!email || !password) {
		return res.status(400).json({ error: "Please fill all the fields" });
	}

	//check if the user exists(check email)
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(404).json({ error: "user is not registered" });
	}

	//check if the password matches
	const isPasswordMatch = await bcrypt.compare(password, user.password);
	if (!isPasswordMatch) {
		return res.status(409).json({ error: "Invalid Credentials" });
	}

	//if no error is thrown, then user is created in db(token for a user using jwt)

	const jwtToken = jwt.sign(user.toJSON(), "harsh1998");

	res.status(200).json({
		success: true,
		jwtToken,
		message: "User logged in successfully",
	});
};
