const express = require("express");
const User = require("../models/user.model");
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user
    const newUser = await User.create({ username, password });

    // Generate access token for the new user
    const token = newUser.generateAccessToken();

    console.log("Registered successfully!");
    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
