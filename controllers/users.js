const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  UNAUTHORIZED,
} = require("../utils/errors");

// Get all Users

// Get user by _id
const getCurrentUsers = (req, res) => {
  const { userId } = req.params;
  user
    .findById(userId)
    .orFail()
    // return the found data to the user
    .then((userData) => {
      res.send({ data: userData });
    })
    // if the record was not found, display an error message
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Not a valid Id" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" }); // Change the status to 404 if the user is not found
      }
      return res.status(DEFAULT).send({ message: "Server error (getUserId)" });
    });
};

// Create a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required." });
  }
  return user
    .findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error("User already exists");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => user.create({ name, avatar, email, password: hash }))
    .then((newUser) =>
      res.send({
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      }),
    )

    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (createUser)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (createUser)" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { userId } = req.params;

  return user
    .findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send({ data: user });
    })
    .catch(() => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request for (Updating user)" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server errors for (updating user)" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return (
    user
      .findUserByCredentials(email, password)
      // authentication successful! user is in the user variable
      .then((user) => {
        // creating a token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      })

      .catch(() => {
        // authentication error
        res
          .status(UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      })
  );
};

module.exports = { getCurrentUsers, createUser, updateUser, login };
