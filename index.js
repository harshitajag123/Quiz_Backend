//importing dependencies

const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT || 10000;

//mongoose connection
async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Connected to MongoDB");
	} catch (err) {
		console.error("Error connecting to MongoDB", err);
	}
}
connectDB();

//test route
app.get("/test", (req, res) => {
	res.json({ message: "Hello World!" });
});

//app listening on port 5000
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

