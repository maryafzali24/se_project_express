const router = require("express").Router();

const { getUsers, getUser, createUser } = require("../controllers/users");

//CURD
//GET all users
router.get("/", getUsers);

// Get User by _id
router.get("/:userId", getUser);

//Create a new User
router.post("/", createUser);

module.exports = router;
