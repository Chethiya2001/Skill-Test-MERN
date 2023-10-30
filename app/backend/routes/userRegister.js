const express = require("express");
const bcrypt = require("bcryptjs"); 
const User = require("../model/Usermodel.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, registrationType, attendees } = req.body;

    // Validate registrationType
    if (
      registrationType === "group" &&
      (!attendees || attendees.length === 0)
    ) {
      return res.status(400).json({ error: "Attendees array is required for group registration." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or update user
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      registrationType,
      attendees,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
