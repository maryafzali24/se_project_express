const mongoose = require("mongoose");
const validator = require("validator");

const userItem = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You should enter a valid URL",
    },
  },
});

module.exports = mongoose.model("user", userItem);
