const router = require("express").Router();

const { getCurrentUsers, updateUser } = require("../controllers/users");

// CURD
// Read
router.get("/me", getCurrentUsers);

// Update User
router.patch("/me", updateUser);

module.exports = router;
