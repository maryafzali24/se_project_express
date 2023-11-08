const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
} = require("../controllers/clothingItems");

//CURD
//Create
router.post("/", createItem);

// Read
router.get("/", getItems);

//Update
router.put("/:itemId", updateItem);

module.exports = router;
