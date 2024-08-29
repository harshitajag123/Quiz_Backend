const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
	//getting token from frontend
	const token = req.headers.authorization;
	console.log(token);

	if (!token) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}

	//verifying token and access data

	const user = jwt.verify(token, "harsh1998");
	if (!user) {
		return res.status(401).json({
			error: "Invalid token",
		});
	}

	req.user = user;
	next();
};

module.exports = userAuth;
