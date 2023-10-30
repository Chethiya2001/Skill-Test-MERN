const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./model/Usermodel.js");
const bctypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mern";

//connect to express
const app = express();

//connect ot mongo
mongoose
  .connect("mongodb://localhost:27017/New")
  .then(() => {
    console.log("DB Connected..");
  })
  .catch((err) => {
    console.log(message.err);
  });

//middleware
app.use(bodyParser.json());
app.use(cors());

//schema

//routes
const router = require("./routes/userRegister.js");

//user register
app.use("/", router);

//Register user
app.get("/register", async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json(error, "Unable to get User");
  }
});

// User get by id
app.get("/user", async (req, res) => {
  try {
    // Check if the token is present in the request headers
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    const userId = decoded.userId;

    // Fetch the user details using the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
//Group get by Regtype
});
app.get("/group", async (req, res) => {
  try {
    const { registrationType, email } = req.query;

    if (!registrationType || !email) {
      return res.status(400).json({ error: "Both registrationType and email are required parameters." });
    }

 
    const user = await User.findOne({ registrationType, email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//GET Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Creadential" });
    }
    const ispasswordValid = await bctypt.compare(password, user.password);
    if (!ispasswordValid) {
      return res.status(401).json({ error: "Invalid Creadential" });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1hr",
    });
    res.status(200).json({ message: "Login Successfull.", token });
  } catch (error) {
    res.status(500).json(error, "Login Error");
  }
});

app.listen(3001, () => {
  console.log("Port is running on 3001..");
});
