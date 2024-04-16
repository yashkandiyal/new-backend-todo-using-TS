const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 4000;

// Importing routes
const registerRoute = require("./routes/Register.route.js");
const loginRoute = require("./routes/Login.route.js");
const todosRoute = require("./routes/TodoRoute.js");
const authenticate = require("./Authentication.js");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/Tstodoapp")
  .then((e) => console.log("mongodb connection successfull!"))
  .catch((e) => console.log("error in connection:", e));

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Routes
app.use("/", registerRoute);
app.use("/login",  loginRoute);

// Applying `authenticate` middleware to `/todos` routes
app.use("/todos", authenticate, todosRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
