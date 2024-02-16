const router = require("express").Router();
const NotFoundError = require("../errors/not-found-err");
const clothingItems = require("./clothingItems");
const users = require("./users");

router.use("/items", clothingItems);
router.use("/users", users);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});
module.exports = router;
