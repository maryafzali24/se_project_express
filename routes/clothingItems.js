const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CURD
// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", deleteItem);

// PUT-like an item
router.put("/:itemId/likes", likeItem);

// DELETE  — unlike an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
