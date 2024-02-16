const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  // weather — a required string that describes the weather type.
  // Make sure it matches the weather type you defined in your React app ('hot', 'warm', and'cold'). Use the enum validator to implement the field.
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter a valid URL",
    },
  },
  // owner — a link to the item author's model of the ObjectId type
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: "Url  cannot be empty",
  },

  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    default: [],
  },
  // createdAt — the item creation date, a field with the Date type and the default value Date.now
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
