const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  validateClothingItemBody,
  validateId,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CURD
// Create
router.post("/", auth, validateClothingItemBody, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", auth, validateId, deleteItem);

// PUT-like an item
router.put("/:itemId/likes", auth, validateId, likeItem);

// DELETE  — unlike an item
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
