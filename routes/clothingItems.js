const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

//CURD
//Create
router.post("/", createItem);

// Read
router.get("/", getItems);

//Update
router.put("/:itemId", updateItem);

//Delete
router.delete("/:itemId", deleteItem);

// PUT-like an item
router.put("/:itemId/likes", likeItem);

// DELETE  — unlike an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
