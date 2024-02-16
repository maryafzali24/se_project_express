const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

const { getCurrentUsers, updateUser } = require("../controllers/users");

// CURD
// Read
router.get("/me", auth, getCurrentUsers);

// Update User
router.patch("/me", auth, validateUserUpdate, updateUser);

module.exports = router;
