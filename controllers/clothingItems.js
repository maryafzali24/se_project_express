const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const clothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error from createItem",
        err,
      });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      res.status(500).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.param;
  const { imageURL } = req.body;
  clothingItem
    .findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: " Error from updateItem", e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
};
