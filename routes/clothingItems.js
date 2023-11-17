const router = require("express").Router();
const { auth } = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CURD
// Create
router.post("/", auth, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", auth, deleteItem);

// PUT-like an item
router.put("/:itemId/likes", auth, likeItem);

// DELETE  — unlike an item
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
