
const errHandler = (err, res, req, next) => {
	return res.status(500).json({
		error: err.message,
	});
};

module.exports = errHandler;