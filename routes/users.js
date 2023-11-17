const router = require("express").Router();
const { auth } = require("../middlewares/auth");

const { getCurrentUsers, updateUser } = require("../controllers/users");

// CURD
// Read
router.get("/me", auth, getCurrentUsers);

// Update User
router.patch("/me", auth, updateUser);

module.exports = router;
