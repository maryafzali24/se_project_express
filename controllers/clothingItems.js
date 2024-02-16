const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl, likes } = req.body;

  ClothingItem.create({ name, weather, imageUrl, likes, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((item) => res.send({ data: item }))
    .catch(next);
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

const deleteItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid Item ID"));
  }

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item Does Not Exist!"));
      }

      if (!item.owner.equals(userId)) {
        return next(
          new ForbiddenError(
            "You Do Not Have The Permission To Delete This Item! tsk. tsk.",
          ),
        );
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.send({ data: itemId }))
    .catch(next);
};

const likeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid Item ID for Liking an Item"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Requested info is not found likeItem"))
    .then((item) => res.send({ data: item }))
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid Item ID for Disliking an Item"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // remove _id from the array
    { new: true },
  )
    .orFail(() => new NotFoundError("Item NOT FOUND for Disliking an Item"))
    .then((item) => res.send({ data: item }))
    .catch(next);
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
