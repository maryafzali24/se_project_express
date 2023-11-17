const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl, likes } = req.body;

  ClothingItem.create({ name, weather, imageUrl, likes, owner: req.user._id })
    .then((item) => {
      send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request for createItem" });
      return res.status(DEFAULT).send({
        message: "server error",
      });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.send(item))
    .catch((e) => {
      res.status(DEFAULT).send({ message: "Error from getItems", e });
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageURL } = req.body;
//   clothingItem
//     .findByIdAndUpdate(itemId, { $set: { imageURL } })
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((e) => {
//       res.status(500).send({ message: " Error from updateItem", e });
//     });
// };

const deleteItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return res
          .status(FORBIDDEN)
          .send({ message: "The item is owned by other user" });
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "The item deleted" }));
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (deleteItem)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (deleteItem)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (deleteItem)" });
    });
};

const likeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (likeItem)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (likeItem)" });
      }
      return res.status(DEFAULT).send({ message: "Server error (likeItem)" });
    });
};

const dislikeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (dislikeItem)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (dislikeItem)" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "Server error (dislikeItem)" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
