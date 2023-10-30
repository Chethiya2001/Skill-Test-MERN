const mongoose= require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  registrationType: {
    type: String,
    enum: ["single", "group"],
    required: true,
  },
  attendees: [
    {
      name: String,
      email: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
