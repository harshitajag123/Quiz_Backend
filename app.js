//importing dependencies
const express = require("express");
const cors = require("cors");
const userRoutes = require("./Routes/UserRoutes");
const quizeRoutes = require("./Routes/QuizeRoutes");
const errHandler = require("./utils/errHandler");

const app = express();
// Use CORS
app.use(
	cors({
		origin: ["http://localhost:5173", "https://quizze-app-sand.vercel.app"], // Frontend URL
		methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
		credentials: true, // Enable this if you're dealing with cookies
	})
);

//using middlewares
app.use(express.json());

//using routes
app.use("/api/user", userRoutes);
app.use("/api/quiz", quizeRoutes);

// app.use(errHandler);

module.exports = app;
