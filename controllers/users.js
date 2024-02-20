const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized-err");

require("dotenv").config;

// Get all Users

// Get user by _id
const getCurrentUsers = (req, res, next) => {
  const userId = req.user._id;
  users
    .findById(userId)
    .orFail(() => new NotFoundError("User Not Found"))
    .then((userData) => res.send({ data: userData }))
    .catch(next);
};

// Create a new user
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required!"));
  }
  return users
    .findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError("User already exists"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => users.create({ name, avatar, email, password: hash }))
    .then((newUser) =>
      res.send({
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      }),
    )

    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid request for (Creating user)"));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  return users
    .findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return users
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })

    .catch(() => next(new UnauthorizedError("Incorrect email or password")));
};

module.exports = { getCurrentUsers, createUser, updateUser, login };
