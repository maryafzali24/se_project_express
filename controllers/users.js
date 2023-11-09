const mongoose = require("mongoose");
const user = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

//Get all Users

const getUsers = (req, res) => {
  user
    .find()
    .then((users) => {
      res.send({ data: users }); // The Status code always would be 200
    })
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT).send({ message: "Server error (getUsers)" });
    });
};

// Get user by _id
const getUser = (req, res) => {
  const { userId } = req.params;
  user
    .findById(userId)
    .orFail()
    // return the found data to the user
    .then((userData) => {
      res.status(200).send({ data: userData });
    })
    // if the record was not found, display an error message
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Not a valid Id" });
      }
      if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" }); // Change the status to 404 if the user is not found
      }
      return res.status(DEFAULT).send({ message: "Server error (getUserId)" });
    });
};

// Create a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  user
    .create({ name, avatar })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (createUser)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (createUser)" });
    });
};
module.exports = { getUsers, getUser, createUser };
