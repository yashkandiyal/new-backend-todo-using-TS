const express = require("express");
const User = require("../models/user.model");
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if the password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate access token for the user
    const token = user.generateAccessToken();

    console.log("User logged in successfully!");
    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
